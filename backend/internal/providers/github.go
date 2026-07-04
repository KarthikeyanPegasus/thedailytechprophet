package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/spidey/dailytechprophet/internal/models"
)

// GitHubProvider fetches trending repositories from GitHub's API
// and provides mock trending data when unauthenticated (rate-limited).
type GitHubProvider struct {
	enabled bool
	client  *http.Client
	token   string
}

func NewGitHubProvider(token string) *GitHubProvider {
	return &GitHubProvider{
		enabled: true,
		client:  &http.Client{Timeout: 15 * time.Second},
		token:   token,
	}
}

func (g *GitHubProvider) Name() string    { return "github" }
func (g *GitHubProvider) Display() string { return "GitHub Trending" }
func (g *GitHubProvider) Enabled() bool   { return g.enabled }

// githubValidCategories is the set of categories GitHub trending
// repositories are actually relevant to.  Trending repos should not
// pollute category pages like "cybersecurity", "space", or "gaming".
// When the caller asks for a category outside this set, the provider
// returns an empty result rather than dumping the same list everywhere.
var githubValidCategories = map[string]bool{
	"":              true, // home page
	"open-source":   true,
	"engineering":   true,
	"programming":   true,
	"artificial-intelligence": true,
	"cloud":         true,
	"devops":        true,
	"linux":         true,
	"startups":      true,
}

// githubCategoryFor assigns the most likely category for a repo based
// on its language and description.  Used so the Categories slice
// reflects what the repo is actually about — e.g. an ML library ends
// up in "artificial-intelligence" rather than a generic bucket.
func githubCategoryFor(language, description string) string {
	lower := strings.ToLower(language + " " + description)
	switch {
	case containsAnyWord(lower, "ai", "ml", "machine learning", "neural", "llm", "gpt", "transformer", "diffusion", "embeddings"):
		return "artificial-intelligence"
	case containsAnyWord(lower, "kubernetes", "docker", "k8s", "helm", "terraform", "ansible", "ci/cd", "pipeline"):
		return "devops"
	case containsAnyWord(lower, "aws", "azure", "gcp", "cloudflare", "lambda", "serverless", "cdn"):
		return "cloud"
	case containsAnyWord(lower, "linux", "kernel", "ubuntu", "debian", "fedora", "arch", "nixos"):
		return "linux"
	case containsAnyWord(lower, "rust", "go", "python", "javascript", "typescript", "java", "kotlin", "swift", "c++", "ruby", "elixir", "scala", "haskell", "zig"):
		return "programming"
	case containsAnyWord(lower, "framework", "library", "sdk", "compiler", "runtime", "linter"):
		return "engineering"
	}
	return "open-source"
}

// containsAnyWord returns true if any of the needles is contained in
// the haystack as a separate word (bounded by non-letter characters or
// string boundaries).  Avoids "go" matching inside "google".
func containsAnyWord(haystack string, needles ...string) bool {
	for _, n := range needles {
		if n == "" {
			continue
		}
		idx := 0
		for idx < len(haystack) {
			pos := indexOf(haystack, n, idx)
			if pos < 0 {
				break
			}
			leftOK := pos == 0 || !isLetter(haystack[pos-1])
			rightOK := pos+len(n) == len(haystack) || !isLetter(haystack[pos+len(n)])
			if leftOK && rightOK {
				return true
			}
			idx = pos + 1
		}
	}
	return false
}

func indexOf(s, sub string, start int) int {
	if start >= len(s) {
		return -1
	}
	for i := start; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}

func isLetter(b byte) bool {
	return (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z') || (b >= '0' && b <= '9')
}

func (g *GitHubProvider) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	// Trending repositories are only relevant to a small set of
	// categories.  For anything else (cybersecurity, space, gaming,
	// design, etc.) returning the same trending list would pollute
	// the section.  Skip cleanly instead.
	if !githubValidCategories[category] {
		return []models.Article{}, nil
	}

	repos, err := g.FetchTrending(ctx, category)
	if err != nil {
		repos = mockTrendingRepos()
	}
	articles := make([]models.Article, 0, len(repos))
	for _, repo := range repos {
		// Per-repo categorization: the first category is the most
		// specific match, the second is the request context (or the
		// specific category if asked).  An empty category (home
		// page) drops the second tag to avoid forcing every repo
		// into the same bucket.
		repoCat := githubCategoryFor(repo.Language, repo.Description)
		cats := []string{repoCat}
		if category != "" && category != repoCat {
			cats = append(cats, category)
		}
		articles = append(articles, models.Article{
			ID:          fmt.Sprintf("gh-%s", repo.FullName),
			Title:       fmt.Sprintf("Trending: %s", repo.FullName),
			Summary:     repo.Description,
			URL:         repo.URL,
			Author:      strings.Split(repo.FullName, "/")[0],
			Source:      "GitHub",
			Categories:  cats,
			PublishedAt: time.Now(),
			ReadTime:    2,
			Tags:        []string{repo.Language, fmt.Sprintf("stars:%d", repo.Stars)},
		})
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

// FetchTrending returns trending GitHub repositories.
func (g *GitHubProvider) FetchTrending(ctx context.Context, _ string) ([]models.TrendingRepo, error) {
	// Try the search API for recently created repos sorted by stars
	url := "https://api.github.com/search/repositories?q=created:>2026-06-01&sort=stars&order=desc&per_page=15"
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	if g.token != "" {
		req.Header.Set("Authorization", "Bearer "+g.token)
	}
	resp, err := g.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("github API returned %d", resp.StatusCode)
	}
	var result struct {
		Items []struct {
			FullName     string `json:"full_name"`
			Description  string `json:"description"`
			Language     string `json:"language"`
			StargazersCount int `json:"stargazers_count"`
			ForksCount   int    `json:"forks_count"`
			HTMLURL      string `json:"html_url"`
			Owner        struct {
				AvatarURL string `json:"avatar_url"`
			} `json:"owner"`
		} `json:"items"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	repos := make([]models.TrendingRepo, 0, len(result.Items))
	for _, item := range result.Items {
		repos = append(repos, models.TrendingRepo{
			Name:        strings.Split(item.FullName, "/")[1],
			FullName:    item.FullName,
			Description: item.Description,
			Language:    item.Language,
			Stars:       item.StargazersCount,
			Forks:       item.ForksCount,
			URL:         item.HTMLURL,
			AvatarURL:   item.Owner.AvatarURL,
		})
	}
	return repos, nil
}

func mockTrendingRepos() []models.TrendingRepo {
	return []models.TrendingRepo{
		{Name: "ollama", FullName: "ollama/ollama", Description: "Get up and running with Llama 3, Mistral, and other large language models locally", Language: "Go", Stars: 95200, StarsToday: 342, Forks: 7600, URL: "https://github.com/ollama/ollama"},
		{Name: "langchain", FullName: "langchain-ai/langchain", Description: "Build context-aware reasoning applications", Language: "Python", Stars: 92100, StarsToday: 289, Forks: 14800, URL: "https://github.com/langchain-ai/langchain"},
		{Name: "bun", FullName: "oven-sh/bun", Description: "Incredibly fast JavaScript runtime, bundler, test runner", Language: "Zig", Stars: 73100, StarsToday: 178, Forks: 2600, URL: "https://github.com/oven-sh/bun"},
		{Name: "svelte", FullName: "sveltejs/svelte", Description: "Web development for the rest of us", Language: "TypeScript", Stars: 80500, StarsToday: 156, Forks: 4300, URL: "https://github.com/sveltejs/svelte"},
		{Name: "tldraw", FullName: "tldraw/tldraw", Description: "A very good whiteboard SDK", Language: "TypeScript", Stars: 34200, StarsToday: 134, Forks: 2100, URL: "https://github.com/tldraw/tldraw"},
		{Name: "deno", FullName: "denoland/deno", Description: "A modern runtime for JavaScript and TypeScript", Language: "Rust", Stars: 94800, StarsToday: 98, Forks: 5200, URL: "https://github.com/denoland/deno"},
		{Name: "astro", FullName: "withastro/astro", Description: "The web framework for content-driven websites", Language: "TypeScript", Stars: 47100, StarsToday: 87, Forks: 2800, URL: "https://github.com/withastro/astro"},
		{Name: "tauri", FullName: "tauri-apps/tauri", Description: "Build smaller, faster, and more secure desktop apps", Language: "Rust", Stars: 83100, StarsToday: 76, Forks: 2500, URL: "https://github.com/tauri-apps/tauri"},
		{Name: "supabase", FullName: "supabase/supabase", Description: "The open source Firebase alternative", Language: "TypeScript", Stars: 73100, StarsToday: 65, Forks: 6900, URL: "https://github.com/supabase/supabase"},
		{Name: "billion-row-challenge", FullName: "gunnarmorling/1brc", Description: "Processing 1B rows from a text file as fast as possible", Language: "Java", Stars: 6200, StarsToday: 54, Forks: 1900, URL: "https://github.com/gunnarmorling/1brc"},
	}
}
