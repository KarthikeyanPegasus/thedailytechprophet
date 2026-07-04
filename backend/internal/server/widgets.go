package server

import (
	"math/rand/v2"
	"time"
)

// generateWidgets builds all widget data. In production these would come from
// live APIs (Alpha Vantage, CoinGecko, HuggingFace, etc.) but we provide
// realistic mock data that updates with each request.
type widgetsBuilder struct{}

func newWidgetsBuilder() *widgetsBuilder { return &widgetsBuilder{} }

func (w *widgetsBuilder) trendingRepos() []any {
	return []any{
		map[string]any{"name": "ollama", "full_name": "ollama/ollama", "description": "Run LLMs locally with one command", "language": "Go", "stars": 95200 + rand.IntN(500), "stars_today": 342 + rand.IntN(100), "forks": 7600, "url": "https://github.com/ollama/ollama"},
		map[string]any{"name": "langchain", "full_name": "langchain-ai/langchain", "description": "Build context-aware reasoning applications", "language": "Python", "stars": 92100 + rand.IntN(500), "stars_today": 289 + rand.IntN(100), "forks": 14800, "url": "https://github.com/langchain-ai/langchain"},
		map[string]any{"name": "bun", "full_name": "oven-sh/bun", "description": "Incredibly fast JS runtime & bundler", "language": "Zig", "stars": 73100 + rand.IntN(500), "stars_today": 178 + rand.IntN(80), "forks": 2600, "url": "https://github.com/oven-sh/bun"},
		map[string]any{"name": "svelte", "full_name": "sveltejs/svelte", "description": "Web development for the rest of us", "language": "TypeScript", "stars": 80500 + rand.IntN(500), "stars_today": 156 + rand.IntN(60), "forks": 4300, "url": "https://github.com/sveltejs/svelte"},
		map[string]any{"name": "tauri", "full_name": "tauri-apps/tauri", "description": "Build smaller, faster desktop apps", "language": "Rust", "stars": 83100 + rand.IntN(500), "stars_today": 76 + rand.IntN(40), "forks": 2500, "url": "https://github.com/tauri-apps/tauri"},
	}
}

func (w *widgetsBuilder) aiModels() []any {
	return []any{
		map[string]any{"rank": 1, "model": "GPT-5", "org": "OpenAI", "score": 91.7, "category": "General", "license": "Proprietary", "trend": "up"},
		map[string]any{"rank": 2, "model": "Claude 4 Opus", "org": "Anthropic", "score": 94.2, "category": "Coding", "license": "Proprietary", "trend": "up"},
		map[string]any{"rank": 3, "model": "Gemini 2 Ultra", "org": "Google", "score": 89.3, "category": "General", "license": "Proprietary", "trend": "up"},
		map[string]any{"rank": 4, "model": "Llama 4 70B", "org": "Meta", "score": 82.1, "category": "General", "license": "Open", "trend": "up"},
		map[string]any{"rank": 5, "model": "Mistral Large 3", "org": "Mistral", "score": 80.5, "category": "General", "license": "Open", "trend": "steady"},
		map[string]any{"rank": 6, "model": "DeepSeek V3", "org": "DeepSeek", "score": 78.9, "category": "Coding", "license": "Open", "trend": "up"},
		map[string]any{"rank": 7, "model": "Grok 3", "org": "xAI", "score": 76.4, "category": "General", "license": "Proprietary", "trend": "up"},
		map[string]any{"rank": 8, "model": "Qwen 2.5 72B", "org": "Alibaba", "score": 74.2, "category": "General", "license": "Open", "trend": "steady"},
	}
}

func (w *widgetsBuilder) stocks() []any {
	base := rand.Float64()*5 - 2.5
	return []any{
		map[string]any{"symbol": "AAPL", "name": "Apple Inc.", "price": 234.50 + base, "change": base, "change_pct": base / 234.5 * 100},
		map[string]any{"symbol": "MSFT", "name": "Microsoft", "price": 448.20 + base, "change": base * 1.2, "change_pct": base * 1.2 / 448.2 * 100},
		map[string]any{"symbol": "GOOGL", "name": "Alphabet", "price": 178.90 + base, "change": base * 0.8, "change_pct": base * 0.8 / 178.9 * 100},
		map[string]any{"symbol": "NVDA", "name": "NVIDIA", "price": 142.30 + base, "change": base * 2.1, "change_pct": base * 2.1 / 142.3 * 100},
		map[string]any{"symbol": "META", "name": "Meta Platforms", "price": 567.40 + base, "change": base * 1.5, "change_pct": base * 1.5 / 567.4 * 100},
		map[string]any{"symbol": "AMZN", "name": "Amazon", "price": 201.70 + base, "change": base * 0.9, "change_pct": base * 0.9 / 201.7 * 100},
	}
}

func (w *widgetsBuilder) crypto() []any {
	return []any{
		map[string]any{"symbol": "BTC", "name": "Bitcoin", "price": 68400 + rand.Float64()*2000, "change": rand.Float64()*2000 - 1000, "change_pct": rand.Float64()*4 - 2},
		map[string]any{"symbol": "ETH", "name": "Ethereum", "price": 3850 + rand.Float64()*200, "change": rand.Float64()*200 - 100, "change_pct": rand.Float64()*4 - 2},
		map[string]any{"symbol": "SOL", "name": "Solana", "price": 178 + rand.Float64()*20, "change": rand.Float64()*10 - 5, "change_pct": rand.Float64()*5 - 2.5},
		map[string]any{"symbol": "USDT", "name": "Tether", "price": 1.0 + rand.Float64()*0.01, "change": rand.Float64()*0.01 - 0.005, "change_pct": rand.Float64()*0.5 - 0.25},
	}
}

func (w *widgetsBuilder) programmingLangs() []any {
	return []any{
		map[string]any{"rank": 1, "name": "Python", "rating": 28.11 + rand.Float64(), "change": rand.Float64()*0.5, "trend": "up"},
		map[string]any{"rank": 2, "name": "C++", "rating": 11.42 + rand.Float64()*0.5, "change": rand.Float64()*0.3, "trend": "up"},
		map[string]any{"rank": 3, "name": "Java", "rating": 8.69 + rand.Float64()*0.5, "change": -rand.Float64()*0.3, "trend": "down"},
		map[string]any{"rank": 4, "name": "C", "rating": 7.43 + rand.Float64()*0.5, "change": -rand.Float64()*0.2, "trend": "down"},
		map[string]any{"rank": 5, "name": "Rust", "rating": 2.41 + rand.Float64()*0.8, "change": rand.Float64()*0.5, "trend": "up"},
		map[string]any{"rank": 6, "name": "TypeScript", "rating": 1.92 + rand.Float64()*0.6, "change": rand.Float64()*0.4, "trend": "up"},
		map[string]any{"rank": 7, "name": "Go", "rating": 1.47 + rand.Float64()*0.4, "change": rand.Float64()*0.3, "trend": "up"},
		map[string]any{"rank": 8, "name": "JavaScript", "rating": 1.41 + rand.Float64()*0.3, "change": -rand.Float64()*0.2, "trend": "down"},
	}
}

func (w *widgetsBuilder) devQuote() any {
	quotes := []any{
		map[string]any{"quote": "Programs must be written for people to read, and only incidentally for machines to execute.", "author": "Harold Abelson"},
		map[string]any{"quote": "The best code is no code at all.", "author": "Jeff Atwood"},
		map[string]any{"quote": "Premature optimization is the root of all evil.", "author": "Donald Knuth"},
		map[string]any{"quote": "Any sufficiently advanced technology is indistinguishable from magic.", "author": "Arthur C. Clarke"},
		map[string]any{"quote": "Talk is cheap. Show me the code.", "author": "Linus Torvalds"},
	}
	return quotes[rand.IntN(len(quotes))]
}

func (w *widgetsBuilder) trivia() any {
	trivias := []any{
		map[string]any{"question": "What was the first computer bug?", "answer": "A moth found trapped in a Harvard Mark II relay in 1947, taped into the logbook by Grace Hopper.", "category": "History"},
		map[string]any{"question": "Which programming language was named after a British comedy troupe?", "answer": "Python — named after Monty Python's Flying Circus.", "category": "Languages"},
		map[string]any{"question": "What does 'HTTP' stand for?", "answer": "HyperText Transfer Protocol.", "category": "Web"},
		map[string]any{"question": "How many bits are in a byte?", "answer": "8 bits in a standard byte.", "category": "Basics"},
	}
	return trivias[rand.IntN(len(trivias))]
}

func (w *widgetsBuilder) terminalTip() any {
	tips := []any{
		map[string]any{"command": "Ctrl+R", "description": "Reverse search through your command history", "platform": "Bash/Zsh"},
		map[string]any{"command": "!!", "description": "Repeat the last command (sudo !!)", "platform": "Bash/Zsh"},
		map[string]any{"command": "cd -", "description": "Go back to the previous directory", "platform": "Bash/Zsh"},
		map[string]any{"command": "alt+.", "description": "Insert the last argument of the previous command", "platform": "Bash/Zsh"},
		map[string]any{"command": "Ctrl+A / Ctrl+E", "description": "Jump to beginning / end of line", "platform": "Bash/Zsh"},
	}
	return tips[rand.IntN(len(tips))]
}

func (w *widgetsBuilder) build() map[string]any {
	return map[string]any{
		"trending_repos":     w.trendingRepos(),
		"ai_models":          w.aiModels(),
		"stocks":             w.stocks(),
		"crypto":             w.crypto(),
		"programming_langs":  w.programmingLangs(),
		"dev_quote":          w.devQuote(),
		"trivia":             w.trivia(),
		"terminal_tip":       w.terminalTip(),
		"generated_at":       time.Now().UTC().Format(time.RFC3339),
	}
}
