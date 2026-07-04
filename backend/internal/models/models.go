package models

import "time"

// TimelineEvent represents a single event in a story's history.
type TimelineEvent struct {
	Date string `json:"date"` // e.g. "72 hours ago", "Yesterday", "Today"
	Text string `json:"text"`
}

// Article represents a single news article from any provider.
type Article struct {
	ID          string          `json:"id"`
	Title       string          `json:"title"`
	Summary     string          `json:"summary"`
	Content     string          `json:"content,omitempty"`
	URL         string          `json:"url"`
	ImageURL    string          `json:"image_url,omitempty"`
	Author      string          `json:"author"`
	Source      string          `json:"source"`
	Categories  []string        `json:"categories"`
	PublishedAt time.Time       `json:"published_at"`
	ReadTime    int             `json:"read_time"`        // in minutes
	Featured    bool            `json:"featured"`
	Tags        []string        `json:"tags,omitempty"`
	Region      string          `json:"region,omitempty"`
	Timeline    []TimelineEvent `json:"timeline,omitempty"`
}

// Category represents a news section.
type Category struct {
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

// TrendingRepo represents a trending GitHub repository.
type TrendingRepo struct {
	Name         string `json:"name"`
	FullName     string `json:"full_name"`
	Description  string `json:"description"`
	Language     string `json:"language"`
	Stars        int    `json:"stars"`
	StarsToday   int    `json:"stars_today"`
	Forks        int    `json:"forks"`
	URL          string `json:"url"`
	AvatarURL    string `json:"avatar_url,omitempty"`
}

// StockTicker represents a single stock or crypto price.
type StockTicker struct {
	Symbol   string  `json:"symbol"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Change   float64 `json:"change"`
	ChangePct float64 `json:"change_pct"`
}

// AIModelEntry represents an entry in the AI model leaderboard.
type AIModelEntry struct {
	Rank       int     `json:"rank"`
	Model      string  `json:"model"`
	Org        string  `json:"org"`
	Score      float64 `json:"score"`
	Category   string  `json:"category"`
	License    string  `json:"license"`
	Trend      string  `json:"trend"` // "up", "down", "steady"
}

// ProgrammingLang represents a language in the ranking.
type ProgrammingLang struct {
	Rank     int     `json:"rank"`
	Name     string  `json:"name"`
	Rating   float64 `json:"rating"`
	Change   float64 `json:"change"`
	Trend    string  `json:"trend"`
}

// DevQuote represents the developer quote of the day.
type DevQuote struct {
	Quote  string `json:"quote"`
	Author string `json:"author"`
}

// Trivia represents a byte-size trivia entry.
type Trivia struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Category string `json:"category"`
}

// TerminalTip represents a terminal tip.
type TerminalTip struct {
	Command     string `json:"command"`
	Description string `json:"description"`
	Platform    string `json:"platform"`
}

// SearchResult represents a search hit.
type SearchResult struct {
	Article Article `json:"article"`
	Score   float64 `json:"score"`
}

// NewsResponse is the standard API response for article lists.
type NewsResponse struct {
	Articles   []Article `json:"articles"`
	Total      int       `json:"total"`
	Page       int       `json:"page"`
	PageSize   int       `json:"page_size"`
	Provider   string    `json:"provider"`
	Categories []string  `json:"categories,omitempty"`
}

// WidgetsResponse bundles all widget data in one call.
type WidgetsResponse struct {
	TrendingRepos    []TrendingRepo    `json:"trending_repos"`
	AIModels         []AIModelEntry    `json:"ai_models"`
	Stocks           []StockTicker    `json:"stocks"`
	Crypto           []StockTicker     `json:"crypto"`
	ProgrammingLangs []ProgrammingLang `json:"programming_langs"`
	DevQuote         DevQuote          `json:"dev_quote"`
	Trivia           Trivia            `json:"trivia"`
	TerminalTip      TerminalTip       `json:"terminal_tip"`
}

// ProviderInfo describes a registered news provider.
type ProviderInfo struct {
	Name    string `json:"name"`
	Display string `json:"display"`
	Enabled bool   `json:"enabled"`
}
