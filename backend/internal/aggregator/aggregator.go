package aggregator

import (
	"context"
	"fmt"
	"log"
	"sort"
	"sync"
	"time"

	"github.com/spidey/dailytechprophet/internal/cache"
	"github.com/spidey/dailytechprophet/internal/models"
	"github.com/spidey/dailytechprophet/internal/providers"
)

// Aggregator fetches articles from multiple providers, deduplicates,
// and sorts them by publication date.
type Aggregator struct {
	registry  *providers.Registry
	cache     *cache.Cache
	providers []string // active provider names in priority order

	indexMu   sync.RWMutex
	index     map[string]models.Article
	indexCats []string
}

func New(reg *providers.Registry, c *cache.Cache, activeProviders []string) *Aggregator {
	if len(activeProviders) == 0 {
		for _, p := range reg.Enabled() {
			activeProviders = append(activeProviders, p.Name())
		}
	}
	return &Aggregator{
		registry:   reg,
		cache:      c,
		providers:  activeProviders,
		index:      make(map[string]models.Article),
		indexCats:  defaultIndexCategories,
	}
}

// defaultIndexCategories is the list of categories to pre-populate the in-memory
// article index from. Keep this small; we only need enough to make FindArticle
// fast and the homepage meaningful.
var defaultIndexCategories = []string{
	"",
	"general",
	"artificial-intelligence",
	"programming",
	"open-source",
	"startups",
	"engineering",
	"cybersecurity",
	"cloud",
	"devops",
	"apple",
	"google",
	"microsoft",
	"openai",
	"robotics",
	"space",
	"quantum-computing",
	"linux",
	"science",
	"gaming",
	"design",
	"career",
}

// WarmIndex pre-populates the in-memory article index from the configured
// providers so the first user request doesn't pay the cold-cache tax.
// Safe to call on a goroutine; runs once and then refreshes every ttl.
func (a *Aggregator) WarmIndex(ctx context.Context, ttl time.Duration) {
	if ttl <= 0 {
		ttl = 5 * time.Minute
	}
	a.rebuildIndex(ctx)

	go func() {
		ticker := time.NewTicker(ttl)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				a.rebuildIndex(ctx)
			}
		}
	}()
}

func (a *Aggregator) rebuildIndex(ctx context.Context) {
	articles, err := a.Fetch(ctx, "", 1, 500)
	if err != nil || len(articles) == 0 {
		// Fall back to per-category fetches so the index still gets populated
		// when the unfiltered fetch fails or returns nothing.
		var combined []models.Article
		for _, cat := range a.indexCats {
			catArticles, catErr := a.Fetch(ctx, cat, 1, 100)
			if catErr != nil {
				continue
			}
			combined = append(combined, catArticles...)
		}
		articles = combined
	}

	index := make(map[string]models.Article, len(articles))
	for _, art := range articles {
		if art.ID == "" {
			continue
		}
		// Prefer the freshest copy if duplicates exist
		if existing, ok := index[art.ID]; ok {
			if art.PublishedAt.Before(existing.PublishedAt) {
				continue
			}
		}
		index[art.ID] = art
	}

	a.indexMu.Lock()
	a.index = index
	a.indexMu.Unlock()
}

// FindArticleInIndex returns an article from the pre-built index in O(1).
// Returns false if the index is empty (e.g., still warming) so callers can
// fall back to the slower path.
func (a *Aggregator) FindArticleInIndex(id string) (models.Article, bool) {
	a.indexMu.RLock()
	defer a.indexMu.RUnlock()
	if a.index == nil {
		return models.Article{}, false
	}
	art, ok := a.index[id]
	return art, ok
}

// IndexSize returns the number of articles currently in the in-memory index.
func (a *Aggregator) IndexSize() int {
	a.indexMu.RLock()
	defer a.indexMu.RUnlock()
	return len(a.index)
}

// Fetch retrieves articles for a category from all active providers.
// All providers are queried in parallel with a per-provider timeout so a
// single slow upstream does not block the entire response.
//
// If the active real providers return fewer than minArticleDensity
// articles, the offline Mock provider is also queried so the newspaper
// sections always feel full and substantial rather than sparse.
func (a *Aggregator) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	// Cache key is category-only so all page/pageSize requests hit the
	// same entry — the full deduped set is stored and pagination is
	// applied on read.
	cacheKey := fmt.Sprintf("articles:%s", category)
	if cached, ok := a.cache.Get(cacheKey); ok {
		if articles, ok := cached.([]models.Article); ok {
			return paginate(articles, page, pageSize), nil
		}
	}

	type providerResult struct {
		articles []models.Article
		err      error
		name     string
	}

	activeProviders := make([]providers.Provider, 0, len(a.providers))
	for _, name := range a.providers {
		p := a.registry.Get(name)
		if p == nil || !p.Enabled() {
			continue
		}
		activeProviders = append(activeProviders, p)
	}

	results := make([]providerResult, len(activeProviders))
	var wg sync.WaitGroup

	for i, p := range activeProviders {
		wg.Add(1)
		go func(idx int, provider providers.Provider) {
			defer wg.Done()
			// Per-provider timeout — 8s so a single slow upstream
			// doesn't block the response indefinitely.
			pctx, cancel := context.WithTimeout(ctx, 8*time.Second)
			defer cancel()
			articles, err := provider.Fetch(pctx, category, 1, 80)
			results[idx] = providerResult{articles: articles, err: err, name: provider.Name()}
		}(i, p)
	}
	wg.Wait()

	var allArticles []models.Article
	for _, r := range results {
		if r.err != nil {
			log.Printf("provider %s error: %v", r.name, r.err)
			continue
		}
		allArticles = append(allArticles, r.articles...)
	}

	deduped := deduplicate(allArticles)

	// The frontend home page renders ~60 articles across multiple dense
	// sections. Always backfill with curated mock content when real
	// providers don't return enough so the newspaper feels full.
	const minArticleDensity = 60
	if len(deduped) < minArticleDensity {
		// Not enough real-time content — backfill with the curated
		// mock dataset so the newspaper pages look full.
		if mock := a.registry.Get("mock"); mock != nil && mock.Enabled() {
			if mockArticles, err := mock.Fetch(ctx, category, 1, 80); err == nil {
				allArticles = append(allArticles, mockArticles...)
				deduped = deduplicate(allArticles)
			}
		}
	}

	sort.Slice(deduped, func(i, j int) bool {
		return deduped[i].PublishedAt.After(deduped[j].PublishedAt)
	})

	// Safety-net filter: when the caller asked for a specific
	// category, drop any article whose Categories slice does not
	// contain the requested slug.  This is the last line of defence
	// against a provider that mis-tags an article (e.g. a general
	// feed leaking into a specialised section).  The home page
	// (empty category) is exempt so the front page still gets the
	// full mixed feed.
	if category != "" {
		deduped = filterByCategory(deduped, category)
	}

	a.cache.Set(cacheKey, deduped)
	return paginate(deduped, page, pageSize), nil
}

// filterByCategory returns the subset of articles whose Categories
// slice contains the requested slug.  Articles with an empty
// Categories slice are dropped — they have no signal that they
// belong in this section.
func filterByCategory(articles []models.Article, category string) []models.Article {
	out := make([]models.Article, 0, len(articles))
	for _, a := range articles {
		matched := false
		for _, c := range a.Categories {
			if c == category {
				matched = true
				break
			}
		}
		if matched {
			out = append(out, a)
		}
	}
	return out
}

// FetchCurated retrieves articles with region/timezone awareness.
// It reuses the category-level cache from Fetch() so the underlying
// provider calls only happen once per category per TTL window.
func (a *Aggregator) FetchCurated(ctx context.Context, category, region, timezone string, page, pageSize int) ([]models.Article, error) {
	// The curated cache key is keyed on category+region+timezone so that
	// region-reordered / timezone-adjusted result sets are cached
	// independently.  But the expensive part — fetching from providers —
	// is served from the category-only cache inside Fetch().
	regionKey := region
	if regionKey == "" {
		regionKey = "global"
	}
	cacheKey := fmt.Sprintf("curated:%s:%s:%s", category, regionKey, timezone)
	if cached, ok := a.cache.Get(cacheKey); ok {
		if articles, ok := cached.([]models.Article); ok {
			return paginate(articles, page, pageSize), nil
		}
	}

	// Fetch the full article set (served from category cache when warm).
	articles, err := a.Fetch(ctx, category, 1, 200)
	if err != nil {
		return nil, err
	}

	// Work on a copy so we don't mutate the cached slice.
	articles = append([]models.Article(nil), articles...)

	if region != "" {
		sort.SliceStable(articles, func(i, j int) bool {
			iMatch := articles[i].Region == region
			jMatch := articles[j].Region == region
			if iMatch != jMatch {
				return iMatch // matching region first
			}
			return articles[i].PublishedAt.After(articles[j].PublishedAt)
		})
	}

	// Adjust PublishedAt to user's timezone if requested.
	if timezone != "" {
		loc, err := time.LoadLocation(timezone)
		if err == nil {
			for i := range articles {
				articles[i].PublishedAt = articles[i].PublishedAt.In(loc)
			}
		}
	}

	a.cache.Set(cacheKey, articles)
	return paginate(articles, page, pageSize), nil
}

// FetchFromProvider retrieves articles from a single provider.
func (a *Aggregator) FetchFromProvider(ctx context.Context, providerName, category string, page, pageSize int) ([]models.Article, error) {
	p := a.registry.Get(providerName)
	if p == nil {
		return nil, &UnknownProviderError{Name: providerName}
	}
	return p.Fetch(ctx, category, page, pageSize)
}

func deduplicate(articles []models.Article) []models.Article {
	seen := make(map[string]bool, len(articles))
	out := make([]models.Article, 0, len(articles))
	for _, a := range articles {
		if seen[a.ID] {
			continue
		}
		seen[a.ID] = true
		out = append(out, a)
	}
	return out
}

func paginate(articles []models.Article, page, pageSize int) []models.Article {
	start := (page - 1) * pageSize
	end := start + pageSize
	if start >= len(articles) {
		return []models.Article{}
	}
	if end > len(articles) {
		end = len(articles)
	}
	return articles[start:end]
}

type UnknownProviderError struct{ Name string }

func (e *UnknownProviderError) Error() string {
	return "unknown provider: " + e.Name
}

// Providers returns info about all registered providers.
func (a *Aggregator) Providers() []models.ProviderInfo {
	return a.registry.Info()
}

// SetProviders updates the active provider list at runtime.
func (a *Aggregator) SetProviders(names []string) {
	a.providers = names
}

// ActiveProviders returns the current active provider names.
func (a *Aggregator) ActiveProviders() []string {
	return a.providers
}

// FindArticle searches for an article by ID. Uses the in-memory index for O(1)
// lookups when available; falls back to a category scan if the index is
// still warming or the article was added after the last index refresh.
func (a *Aggregator) FindArticle(ctx context.Context, id string) (models.Article, bool, error) {
	if id == "" {
		return models.Article{}, false, nil
	}
	// Fast path: O(1) lookup in the pre-built index
	if art, ok := a.FindArticleInIndex(id); ok {
		return art, true, nil
	}
	// Slow path 1: scan the unfiltered front-page mix. This is the
	// densest single call we can make (it includes backfill from the
	// mock provider when results are sparse) and is cached, so
	// repeated misses are cheap. It also catches articles whose
	// category isn't in indexCats (e.g. "general" RSS stories that
	// were never categorised into a named beat).
	if articles, err := a.Fetch(ctx, "", 1, 500); err == nil {
		for _, article := range articles {
			if article.ID == id {
				return article, true, nil
			}
		}
	}
	// Slow path 2: scan each known category as a last resort. This
	// handles the rare case where the article exists only in a
	// category-scoped cache (e.g. a niche beat whose entries didn't
	// make it into the unfiltered mix).
	for _, cat := range a.indexCats {
		if cat == "" {
			continue // already covered by slow path 1
		}
		articles, err := a.Fetch(ctx, cat, 1, 200)
		if err != nil {
			continue
		}
		for _, article := range articles {
			if article.ID == id {
				return article, true, nil
			}
		}
	}
	return models.Article{}, false, nil
}

// Search performs a simple full-text search across cached articles.
func (a *Aggregator) Search(ctx context.Context, query string) ([]models.SearchResult, error) {
	cacheKey := "search:" + query
	if cached, ok := a.cache.Get(cacheKey); ok {
		if results, ok := cached.([]models.SearchResult); ok {
			return results, nil
		}
	}

	// Fetch all categories and search
	categories := []string{"", "artificial-intelligence", "programming", "cybersecurity", "space", "startups"}
	var all []models.Article
	for _, cat := range categories {
		articles, _ := a.Fetch(ctx, cat, 1, 100)
		all = append(all, articles...)
	}

	var results []models.SearchResult
	queryLower := toLower(query)
	for _, a := range all {
		score := 0.0
		titleLower := toLower(a.Title)
		summaryLower := toLower(a.Summary)
		if contains(titleLower, queryLower) {
			score += 10.0
		}
		if contains(summaryLower, queryLower) {
			score += 5.0
		}
		for _, tag := range a.Tags {
			if contains(toLower(tag), queryLower) {
				score += 2.0
			}
		}
		if score > 0 {
			results = append(results, models.SearchResult{
				Article: a,
				Score:   score,
			})
		}
	}

	// Sort by score descending
	sort.Slice(results, func(i, j int) bool {
		return results[i].Score > results[j].Score
	})

	a.cache.Set(cacheKey, results)
	return results, nil
}

func toLower(s string) string {
	out := make([]byte, len(s))
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c >= 'A' && c <= 'Z' {
			c += 32
		}
		out[i] = c
	}
	return string(out)
}

func contains(s, substr string) bool {
	if len(substr) == 0 {
		return false
	}
	for i := 0; i <= len(s)-len(substr); i++ {
		match := true
		for j := 0; j < len(substr); j++ {
			if s[i+j] != substr[j] {
				match = false
				break
			}
		}
		if match {
			return true
		}
	}
	return false
}

var _ = time.Second // keep import
