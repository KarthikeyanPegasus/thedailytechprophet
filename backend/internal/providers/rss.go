package providers

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"html"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/mmcdole/gofeed"
	"github.com/spidey/dailytechprophet/internal/models"
)

// RSSProvider fetches articles from RSS/Atom feeds.
type RSSProvider struct {
	enabled bool
	feeds   map[string][]string // category -> []feedURL
	client  *http.Client
	parser  *gofeed.Parser
}

func NewRSSProvider() *RSSProvider {
	return &RSSProvider{
		enabled: true,
		// Each feed URL must appear in at most ONE category bucket so
		// an article isn't returned under two different sections.
		// Earlier this file shared techcrunch.com/feed/ between
		// "general" and "startups", which caused TechCrunch stories
		// to double-list across category pages.
		feeds: map[string][]string{
			"general": {
				"https://www.theverge.com/rss/index.xml",
				"https://feeds.arstechnica.com/arstechnica/index",
			},
			"artificial-intelligence": {
				"https://openai.com/blog/rss.xml",
				"https://blog.google/technology/ai/rss/",
			},
			"programming": {
				"https://news.ycombinator.com/rss",
			},
			"cybersecurity": {
				"https://www.wired.com/feed/tag/security/latest/rss",
			},
			"space": {
				"https://www.space.com/feeds/all",
			},
			"science": {
				"https://www.wired.com/feed/tag/science/latest/rss",
			},
			"gaming": {
				"https://www.polygon.com/rss/index.xml",
			},
			"startups": {
				// Dedicated startup-focused feed only.  The general
				// TechCrunch feed is intentionally NOT included here
				// to avoid cross-contamination with "general".
				"https://techcrunch.com/category/startups/feed/",
			},
		},
		client: &http.Client{Timeout: 15 * time.Second},
		parser: gofeed.NewParser(),
	}
}

func (r *RSSProvider) Name() string    { return "rss" }
func (r *RSSProvider) Display() string { return "RSS Feeds" }
func (r *RSSProvider) Enabled() bool   { return r.enabled }

func (r *RSSProvider) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	feedURLs, ok := r.feeds[category]
	if !ok {
		feedURLs = r.feeds["general"]
	}

	// Parse all feeds in parallel.
	type feedResult struct {
		feed *gofeed.Feed
		err  error
	}

	feedResults := make([]feedResult, len(feedURLs))
	var wg sync.WaitGroup

	for i, feedURL := range feedURLs {
		wg.Add(1)
		go func(idx int, u string) {
			defer wg.Done()
			feed, err := r.parser.ParseURLWithContext(u, ctx)
			feedResults[idx] = feedResult{feed: feed, err: err}
		}(i, feedURL)
	}
	wg.Wait()

	var articles []models.Article
	for _, fr := range feedResults {
		if fr.err != nil || fr.feed == nil {
			continue
		}
		for _, item := range fr.feed.Items {
			article := r.itemToArticle(item, fr.feed)
			articles = append(articles, article)
		}
	}

	start := (page - 1) * pageSize
	end := start + pageSize
	if start >= len(articles) {
		return []models.Article{}, nil
	}
	if end > len(articles) {
		end = len(articles)
	}
	return articles[start:end], nil
}

func (r *RSSProvider) itemToArticle(item *gofeed.Item, feed *gofeed.Feed) models.Article {
	imgURL := extractImageURL(item)
	author := "Unknown"
	if item.Author != nil {
		author = item.Author.Name
	} else if feed.Title != "" {
		author = feed.Title
	}
	pub := time.Now()
	if item.PublishedParsed != nil {
		pub = *item.PublishedParsed
	}
	summary := ""
	if item.Description != "" {
		summary = stripHTML(item.Description)
	}
	if len(summary) > 200 {
		summary = summary[:200] + "..."
	}

	return models.Article{
		// Use a stable, URL-safe hash of the article link as the ID.
		// Previously we used url.PathEscape, which produced IDs
		// containing colons and percent-encoded slashes (e.g.
		// "rss-https:%2F%2Fexample.com%2F..."). When such an ID was
		// embedded in a frontend link and routed through Next.js, the
		// dynamic [id] param came back decoded, so the lookup ID no
		// longer matched the stored ID and the article page returned
		// "Edition Not Found". A short hex hash sidesteps the whole
		// encode/decode round-trip and stays stable across rebuilds.
		ID:          fmt.Sprintf("rss-%s", hashID(item.Link)),
		Title:       stripHTML(item.Title),
		Summary:     summary,
		Content:     stripHTML(item.Content),
		URL:         item.Link,
		ImageURL:    imgURL,
		Author:      author,
		Source:      feed.Title,
		Categories:  []string{r.guessCategory(feed.Title, item.Title)},
		PublishedAt: pub,
		ReadTime:    estimateReadTime(item.Content),
		Featured:    false,
	}
}

func (r *RSSProvider) guessCategory(source, title string) string {
	lower := strings.ToLower(title + " " + source)
	categoryMap := map[string][]string{
		"artificial-intelligence": {"ai", "machine learning", "llm", "gpt", "neural", "openai", "anthropic", "claude", "gemini"},
		"programming":             {"code", "programming", "developer", "api", "framework", "rust", "python", "javascript", "typescript"},
		"cybersecurity":           {"security", "vulnerability", "hack", "malware", "ransomware", "zero-day", "exploit"},
		"space":                   {"space", "spacex", "nasa", "rocket", "mars", "moon", "satellite", "orbital"},
		"cloud":                   {"cloud", "aws", "azure", "gcp", "kubernetes", "docker", "serverless"},
		"robotics":                {"robot", "robotics", "humanoid", "automation", "actuator"},
		"quantum-computing":       {"quantum", "qubit", "superposition", "entanglement"},
		"startups":                {"startup", "funding", "series", "seed", "venture", "unicorn"},
		"gaming":                  {"game", "gaming", "steam", "playstation", "xbox", "nintendo"},
		"science":                 {"science", "research", "study", "discovery", "physics", "biology"},
	}
	for cat, keywords := range categoryMap {
		for _, kw := range keywords {
			if strings.Contains(lower, kw) {
				return cat
			}
		}
	}
	return "general"
}

// stripHTML removes all HTML tags, decodes HTML entities, and normalizes
// <br> variants to newlines. The order matters: unescape entities first so
// encoded tags like &lt;p&gt; become real tags that can be stripped, then
// convert <br> to newlines before stripping remaining tags.
var brRe = regexp.MustCompile(`(?i)<br\s*/?>`)
var tagRe = regexp.MustCompile(`<[^>]*>`)
var imgSrcRe = regexp.MustCompile(`(?i)<img[^>]*src\s*=\s*["']([^"']+)["']`)

func stripHTML(s string) string {
	// 1. Decode HTML entities (&amp; → &, &apos; → ', &lt; → <, etc.)
	s = html.UnescapeString(s)
	// 2. Convert <br> variants to newlines (before stripping tags)
	s = brRe.ReplaceAllString(s, "\n")
	// 3. Strip all remaining HTML tags
	s = tagRe.ReplaceAllString(s, "")
	// 4. Clean up extra whitespace from tag removal
	s = strings.Join(strings.Fields(s), " ")
	return s
}

// hashID returns the first 16 hex characters of the SHA-256 digest of s.
// 64 bits of entropy is more than enough to make collisions practically
// impossible for a news feed and keeps IDs short and URL-safe.
func hashID(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:8])
}

func extractImageURL(item *gofeed.Item) string {
	// 1. Dedicated image field on the item.
	if item.Image != nil && item.Image.URL != "" {
		return item.Image.URL
	}

	// 2. RSS enclosures (podcast/feed images, thumbnails).
	for _, enc := range item.Enclosures {
		if enc.URL != "" && strings.HasPrefix(enc.Type, "image/") {
			return enc.URL
		}
	}

	// 3. Media RSS extensions: media:content and media:thumbnail.
	if media, ok := item.Extensions["media"]; ok {
		for _, ext := range media["content"] {
			if url := ext.Attrs["url"]; url != "" {
				if t := ext.Attrs["type"]; t == "" || strings.HasPrefix(t, "image/") {
					return url
				}
			}
		}
		for _, ext := range media["thumbnail"] {
			if url := ext.Attrs["url"]; url != "" {
				return url
			}
		}
	}

	// 4. Extract the first <img src="..."> from the HTML content or description.
	htmlContent := item.Content
	if htmlContent == "" {
		htmlContent = item.Description
	}
	if htmlContent != "" {
		if matches := imgSrcRe.FindStringSubmatch(htmlContent); len(matches) > 1 {
			return html.UnescapeString(matches[1])
		}
	}

	return ""
}

func estimateReadTime(content string) int {
	words := len(strings.Fields(content))
	minutes := words / 200
	if minutes < 1 {
		minutes = 1
	}
	return minutes
}
