package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/spidey/dailytechprophet/internal/models"
)

// RedditProvider fetches top posts from r/technology and related subreddits.
type RedditProvider struct {
	enabled  bool
	client   *http.Client
	subreddits map[string][]string
}

func NewRedditProvider() *RedditProvider {
	return &RedditProvider{
		enabled: true,
		client:  &http.Client{Timeout: 15 * time.Second},
		subreddits: map[string][]string{
			"general":             {"technology", "technews"},
			"artificial-intelligence": {"MachineLearning", "artificial"},
			"programming":         {"programming", "coding"},
			"cybersecurity":       {"cybersecurity", "netsec"},
			"space":               {"space", "spacex"},
			"startups":            {"startups", "Entrepreneur"},
			"gaming":              {"gaming", "Games"},
			"science":             {"science", "technology"},
			"linux":               {"linux", "commandline"},
			"devops":              {"devops", "docker"},
		},
	}
}

func (r *RedditProvider) Name() string    { return "reddit" }
func (r *RedditProvider) Display() string { return "Reddit Technology" }
func (r *RedditProvider) Enabled() bool   { return r.enabled }

type redditResponse struct {
	Data struct {
		Children []struct {
			Data struct {
				ID          string  `json:"id"`
				Title       string  `json:"title"`
				URL         string  `json:"url"`
				Author      string  `json:"author"`
				Score       int     `json:"score"`
				NumComments int     `json:"num_comments"`
				CreatedUTC  float64 `json:"created_utc"`
				Selftext    string  `json:"selftext"`
				Subreddit   string  `json:"subreddit"`
				Permalink   string  `json:"permalink"`
			} `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

func (r *RedditProvider) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	subs, ok := r.subreddits[category]
	if !ok {
		subs = r.subreddits["general"]
	}

	// Fetch all subreddits in parallel.
	type subResult struct {
		articles []models.Article
	}

	subResults := make([]subResult, len(subs))
	var wg sync.WaitGroup

	for i, sub := range subs {
		wg.Add(1)
		go func(idx int, subreddit string) {
			defer wg.Done()
			url := fmt.Sprintf("https://www.reddit.com/r/%s/top.json?limit=10&t=day", subreddit)
			req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
			if err != nil {
				return
			}
			req.Header.Set("User-Agent", "DailyTechProphet/1.0")
			resp, err := r.client.Do(req)
			if err != nil {
				return
			}
			var result redditResponse
			if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
				resp.Body.Close()
				return
			}
			resp.Body.Close()
			var subArticles []models.Article
			for _, child := range result.Data.Children {
				d := child.Data
				articleURL := d.URL
				if len(articleURL) > 0 && articleURL[0] == '/' {
					articleURL = "https://reddit.com" + articleURL
				}
				summary := d.Selftext
				if len(summary) > 200 {
					summary = summary[:200] + "..."
				}
				subArticles = append(subArticles, models.Article{
					ID:          fmt.Sprintf("reddit-%s", d.ID),
					Title:       d.Title,
					Summary:     summary,
					URL:         articleURL,
					Author:      d.Author,
					Source:      fmt.Sprintf("r/%s", d.Subreddit),
					Categories:  []string{category},
					PublishedAt: time.Unix(int64(d.CreatedUTC), 0),
					ReadTime:    3,
					Featured:    d.Score > 5000,
					Tags:        []string{fmt.Sprintf("upvotes:%d", d.Score)},
				})
			}
			subResults[idx] = subResult{articles: subArticles}
		}(i, sub)
	}
	wg.Wait()

	var articles []models.Article
	for _, sr := range subResults {
		articles = append(articles, sr.articles...)
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
