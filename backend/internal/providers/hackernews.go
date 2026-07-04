package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/spidey/dailytechprophet/internal/models"
)

// HackerNewsProvider fetches top stories from the Hacker News API.
type HackerNewsProvider struct {
	enabled bool
	client  *http.Client
	baseURL  string
}

func NewHackerNewsProvider() *HackerNewsProvider {
	return &HackerNewsProvider{
		enabled: true,
		client:  &http.Client{Timeout: 15 * time.Second},
		baseURL: "https://hacker-news.firebaseio.com/v0",
	}
}

func (h *HackerNewsProvider) Name() string    { return "hackernews" }
func (h *HackerNewsProvider) Display() string { return "Hacker News" }
func (h *HackerNewsProvider) Enabled() bool   { return h.enabled }

type hnItem struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	URL         string `json:"url"`
	By          string `json:"by"`
	Score       int    `json:"score"`
	Time        int64  `json:"time"`
	Type        string `json:"type"`
	Text        string `json:"text"`
	Descendants int    `json:"descendants"`
	Kids        []int  `json:"kids"`
}

// maxConcurrentItemFetches limits how many individual HN item requests
// are in flight at the same time.  The Firebase API is fast but we want
// to be respectful and avoid overwhelming it with 50 simultaneous calls.
const maxConcurrentItemFetches = 15

// hnCategoryKeywords maps category slugs to keywords we look for in
// an HN story's title (and, when present, its self-text/url).  An
// article matches a category when ANY of its keywords is found.
//
// The keywords are deliberately broad enough that real HN submissions
// get classified correctly, but specific enough that the cybersecurity
// section doesn't get spammed with generic "Show HN: my SaaS" posts.
//
// Used only when the caller passes a non-empty category.  An empty
// category means the home page and we return the unfiltered top list.
var hnCategoryKeywords = map[string][]string{
	"artificial-intelligence": {
		"ai", "gpt", "llm", "openai", "anthropic", "claude", "gemini",
		"machine learning", "neural", "deep learning", "transformer",
		"diffusion", "embedding", "rag", "inference", "hugging face",
		"mistral", "llama", "stable diffusion", "chatgpt",
	},
	"programming": {
		"rust", "go", "python", "javascript", "typescript", "java",
		"kotlin", "swift", "c++", "ruby", "php", "elixir", "scala",
		"haskell", "zig", "framework", "library", "compiler",
		"interpreter", "runtime", "show hn", "launch hn", "github",
		"open source", "open-source", "api", "sdk", "linter", "orm",
		"debugger", "ide", "vim", "emacs", "neovim", "vscode",
		"refactor", "regex", "concurrency", "async", "rustlang",
	},
	"cybersecurity": {
		"security", "vulnerability", "cve", "exploit", "malware",
		"ransomware", "phishing", "breach", "zero-day", "0day",
		"hack", "hacker", "cryptography", "encryption", "tls", "ssl",
		"oauth", "csrf", "xss", "rce", "privilege escalation",
		"reverse engineering", "pentest", "red team", "blue team",
		"siem", "soc", "csp", "csp-bypass",
	},
	"space": {
		"spacex", "nasa", "rocket", "satellite", "mars", "moon", "lunar",
		"orbital", "orbit", "starship", "falcon", "starlink", "esa",
		"jaxa", "isro", "blue origin", "ula", "kuiper", "jwst",
		"telescope", "asteroid", "comet", "space station", "iss",
		"artemis",
	},
	"science": {
		"science", "research", "study", "paper", "biology", "physics",
		"chemistry", "astronomy", "climate", "genome", "genetic",
		"crispr", "fusion", "fission", "nuclear", "particle", "lab",
		"experiment", "discovery", "scientific", "researcher",
		"preprint", "arxiv",
	},
	"startups": {
		"startup", "y combinator", "yc", "series a", "series b",
		"series c", "seed round", "funding", "raised", "valuation",
		"venture", "vc ", "founder", "incubator", "accelerator",
		"acquisition", "acquired", "ipo ", "layoff", "pivot",
		"saas", "b2b", "b2c",
	},
	"gaming": {
		"game", "games", "gaming", "gamer", "steam", "steam deck",
		"playstation", "xbox", "nintendo", "switch", "indie game",
		"rpg", "fps", "mmo", "esports", "unity", "unreal engine",
		"godot", "retro", "emulator", "rom hack", "speedrun",
	},
	"linux": {
		"linux", "kernel", "ubuntu", "debian", "fedora", "arch",
		"nixos", "gentoo", "systemd", "wayland", "x11", "gnu",
		"gnu/linux", "distro", "lts", "gnuplot", "i3", "sway",
		"hyprland", "pipewire", "selinux", "apparmor",
	},
	"devops": {
		"kubernetes", "k8s", "docker", "container", "podman",
		"terraform", "pulumi", "ansible", "helm", "argo", "flux",
		"jenkins", "github actions", "ci/cd", "pipeline",
		"observability", "prometheus", "grafana", "opentelemetry",
		"elasticsearch", "loki", "sre", "devops", "infrastructure",
		"infrastructure as code", "iac",
	},
	"open-source": {
		"open source", "open-source", "foss", "oss ", "self-hosted",
		"self hosted", "license", "mit license", "apache", "gpl",
		"maintainer", "contributor", "kde", "gnome", "freedesktop",
		"creative commons",
	},
	"engineering": {
		"hardware", "schematic", "pcb", "fpga", "asic", "cpu", "gpu",
		"chip", "silicon", "lithography", "manufacturing",
		"3d printing", "cnc", "cad", "robotics", "robot", "actuator",
		"sensor", "mechanical", "civil engineering", "structural",
		"aerospace", "automotive", "ev", "battery", "thermodynamics",
	},
	"cloud": {
		"aws", "azure", "gcp", "google cloud", "lambda", "s3", "ec2",
		"cloudflare", "vercel", "netlify", "fly.io", "digitalocean",
		"heroku", "cloud", "serverless", "edge computing", "cdn",
		"object storage", "managed kubernetes", "aurora", "bigquery",
		"snowflake", "databricks",
	},
	"apple":     {"apple", "macos", "ios", "iphone", "ipad", "macbook", "swift", "xcode", "apple silicon", "m1", "m2", "m3", "m4", "m5", "wwdc", "siri", "aapl"},
	"google":    {"google", "android", "pixel", "chrome", "chromium", "youtube", "deepmind", "gemini", "bard", "waymo", "fitbit", "nest", "alphabet"},
	"microsoft": {"microsoft", "windows", "azure", "xbox", "github", "vscode", "visual studio", "typescript", "powershell", "msft", "bing", "outlook", "office 365", "teams"},
	"openai":    {"openai", "chatgpt", "gpt-3", "gpt-4", "gpt-5", "dall-e", "dalle", "sora", "sam altman"},
	"design":    {"design", "ui", "ux", "figma", "sketch", "css", "html", "typography", "icon", "logo", "branding", "illustration", "animation"},
	"career":    {"hiring", "laid off", "layoffs", "interview", "resume", "career", "salary", "remote work", "four-day", "four day", "burnout", "mentor"},
	"quantum-computing": {
		"quantum", "qubit", "superposition", "entanglement", "ibm quantum",
		"rigetti", "ionq", "d-wave", "dwave", "post-quantum", "pqc",
	},
	"robotics": {"robot", "humanoid", "atlas", "optimus", "automation", "actuator", "ros ", "ros2"},
}

// hnCategoryFor returns the category slug that best matches the given
// text, or "" if no category matches.  When the caller requests a
// specific category we use hnCategoryKeywords directly; this helper is
// used to assign the *default* category for the home-page list.
func hnCategoryFor(text string) string {
	lower := strings.ToLower(text)
	for cat, kws := range hnCategoryKeywords {
		for _, kw := range kws {
			if strings.Contains(lower, kw) {
				return cat
			}
		}
	}
	return "programming" // sensible default for HN, which is dev-focused
}

func (h *HackerNewsProvider) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	ids, err := h.fetchTopIDs(ctx)
	if err != nil {
		return nil, err
	}

	// Fetch the first 50 item details in parallel with a concurrency
	// limiter.  Previously this was a sequential loop that could take
	// 50 × ~200ms ≈ 10s; now it completes in ~3 batches ≈ 600ms.
	fetchCount := 50
	if fetchCount > len(ids) {
		fetchCount = len(ids)
	}
	fetchIDs := ids[:fetchCount]

	type itemResult struct {
		item *hnItem
		err  error
	}

	itemResults := make([]itemResult, len(fetchIDs))
	sem := make(chan struct{}, maxConcurrentItemFetches)
	var wg sync.WaitGroup

	for i, id := range fetchIDs {
		wg.Add(1)
		go func(idx int, itemID int) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			item, err := h.fetchItem(ctx, itemID)
			itemResults[idx] = itemResult{item: item, err: err}
		}(i, id)
	}
	wg.Wait()

	// Build articles from successful fetches, preserving original order.
	// We always classify each story into a category based on its title
	// (and self-text when present) so a single item never mis-tags
	// itself.  When the caller asks for a specific category we also
	// drop stories that don't match — this is what stops HN's general
	// top list from polluting the cybersecurity, AI, or space sections.
	articles := make([]models.Article, 0, len(itemResults))
	for _, r := range itemResults {
		if r.err != nil || r.item == nil || r.item.Type != "story" || r.item.Title == "" {
			continue
		}
		item := r.item
		url := item.URL
		if url == "" {
			url = fmt.Sprintf("https://news.ycombinator.com/item?id=%d", item.ID)
		}
		summary := item.Text
		if len(summary) > 200 {
			summary = summary[:200] + "..."
		}

		// Classify: title is the primary signal, self-text is secondary.
		// This ensures the article's Categories reflect what the story
		// is actually about, not a hardcoded "programming" string.
		haystack := item.Title
		if item.Text != "" {
			haystack = haystack + " " + item.Text
		}
		articleCategory := hnCategoryFor(haystack)
		if articleCategory == "" {
			articleCategory = "programming"
		}

		// If the caller asked for a specific category, drop stories
		// that don't match.  An empty category (home page) returns
		// the full classified list so every section gets fed.
		if category != "" && articleCategory != category {
			continue
		}

		articles = append(articles, models.Article{
			ID:          fmt.Sprintf("hn-%d", item.ID),
			Title:       item.Title,
			Summary:     summary,
			URL:         url,
			Author:      item.By,
			Source:      "Hacker News",
			Categories:  []string{articleCategory},
			PublishedAt: time.Unix(item.Time, 0),
			ReadTime:    3,
			Featured:    item.Score > 500,
			Tags:        []string{fmt.Sprintf("score:%d", item.Score), fmt.Sprintf("comments:%d", item.Descendants)},
		})
	}

	// Apply pagination on the collected results.
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

func (h *HackerNewsProvider) fetchTopIDs(ctx context.Context) ([]int, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("%s/topstories.json", h.baseURL), nil)
	if err != nil {
		return nil, err
	}
	resp, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var ids []int
	if err := json.NewDecoder(resp.Body).Decode(&ids); err != nil {
		return nil, err
	}
	if len(ids) > 100 {
		ids = ids[:100]
	}
	return ids, nil
}

func (h *HackerNewsProvider) fetchItem(ctx context.Context, id int) (*hnItem, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("%s/item/%d.json", h.baseURL, id), nil)
	if err != nil {
		return nil, err
	}
	resp, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var item hnItem
	if err := json.NewDecoder(resp.Body).Decode(&item); err != nil {
		return nil, err
	}
	return &item, nil
}
