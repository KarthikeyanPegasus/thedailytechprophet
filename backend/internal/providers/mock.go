package providers

import (
	"context"
	"fmt"
	"math/rand/v2"
	"time"

	"github.com/spidey/dailytechprophet/internal/models"
)

// MockProvider returns rich, realistic mock articles for every category.
// This ensures the newspaper is fully functional without external API keys.
type MockProvider struct {
	enabled bool
}

func NewMockProvider() *MockProvider {
	return &MockProvider{enabled: true}
}

func (m *MockProvider) Name() string    { return "mock" }
func (m *MockProvider) Display() string { return "Mock Data (Offline)" }
func (m *MockProvider) Enabled() bool   { return m.enabled }

func (m *MockProvider) Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error) {
	articles := generateMockArticles(category)
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

var reporters = []string{
	"Rita Skeeter", "Arthur C. Byte", "Hermione Codegranger",
	"Severus Syntax", "Albus Datacore", "Minerva Scriptsea",
	"Remus Loopin", "Nymphadora Tonks-code", "Luna Lovecode",
	"Sirius Blackbox", "Dobby Devops", "Bellatrix Hex",
}

var sources = []string{
	"The Daily Tech Prophet", "Hacker News", "TechCrunch",
	"The Verge", "Ars Technica", "Wired", "GitHub", "Reddit",
}

func pickReporter() string  { return reporters[rand.IntN(len(reporters))] }
func pickSource() string    { return sources[rand.IntN(len(sources))] }
func pickReadTime() int      { return 3 + rand.IntN(12) }

// weightedHoursAgo returns an integer in [0, 192] (8 days) with a soft bias
// toward the recent past so quick-option filters (Today, Yesterday, 3 days
// ago, 1 week ago) all have a reasonable chance of returning content.
func weightedHoursAgo() int {
	const maxHours = 8 * 24
	// 70% of articles land within the first 3 days, 30% are spread across
	// the remaining 5 days so the "1 week ago" quick option still has data.
	if rand.Float64() < 0.7 {
		return rand.IntN(3 * 24)
	}
	return 3*24 + rand.IntN(5*24)
}

func generateMockArticles(category string) []models.Article {
	templates := getTemplates(category)
	articles := make([]models.Article, 0, len(templates))
	now := time.Now()
	for i, t := range templates {
		// Spread mock articles across the last ~8 days so date-based
		// filtering (Today, Yesterday, 3 days ago, 1 week ago, ...) has
		// content to show. Use a weighted draw so most days are populated.
		hrsAgo := weightedHoursAgo()
		pub := now.Add(-time.Duration(hrsAgo) * time.Hour)
		timeline := t.timeline
		if len(timeline) == 0 {
			timeline = defaultTimelineFor(pub, now)
		}

		// Defensive: extraCategoryTemplates leaves Categories nil
		// on purpose, because getTemplates() retags them at the
		// call site.  If a template ever slips through without a
		// category, fall back to the requested category (or
		// "general") so we never panic.
		cats := t.categories
		if len(cats) == 0 {
			fallback := category
			if fallback == "" {
				fallback = "general"
			}
			cats = []string{fallback}
		}

		articles = append(articles, models.Article{
			ID:          fmt.Sprintf("mock-%s-%d", cats[0], i),
			Title:       t.title,
			Summary:     t.summary,
			Content:     t.content,
			URL:         fmt.Sprintf("https://dailytechprophet.com/%s/%d", cats[0], i),
			ImageURL:    "",
			Author:      pickReporter(),
			Source:      pickSource(),
			Categories:  cats,
			PublishedAt: pub,
			ReadTime:    pickReadTime(),
			Featured:    i == 0,
			Tags:        t.tags,
			Region:      inferRegion(t),
			Timeline:    timeline,
		})
	}
	return articles
}

// defaultTimelineFor produces a generic but realistic-looking timeline for
// any article that doesn't ship with its own. Events are labelled relative
// to the article's publication time so the displayed dates always make sense.
func defaultTimelineFor(publishedAt, now time.Time) []models.TimelineEvent {
	delta := now.Sub(publishedAt)
	hours := int(delta.Hours())
	if hours < 0 {
		hours = 0
	}
	earliest := hours + 72
	if earliest < 72 {
		earliest = 72
	}
	return []models.TimelineEvent{
		{Date: formatHoursAgo(earliest), Text: "Initial tip-off reaches our newsroom from an industry source"},
		{Date: formatHoursAgo(earliest / 2), Text: "Independent reporters begin corroborating the story with multiple sources"},
		{Date: formatHoursAgo(hours), Text: "Final details confirmed; story prepared for publication"},
		{Date: "Just now", Text: "Article published on The Daily Tech Prophet"},
	}
}

func formatHoursAgo(h int) string {
	if h <= 0 {
		return "Just now"
	}
	if h == 1 {
		return "1 hour ago"
	}
	if h < 24 {
		return fmt.Sprintf("%d hours ago", h)
	}
	days := h / 24
	if days == 1 {
		return "Yesterday"
	}
	if days < 7 {
		return fmt.Sprintf("%d days ago", days)
	}
	weeks := days / 7
	if weeks == 1 {
		return "1 week ago"
	}
	return fmt.Sprintf("%d weeks ago", weeks)
}

func inferRegion(t template) string {
	// Defensive: extraCategoryTemplates leaves Categories nil, so
	// guard the access.  Region inference still works fine on the
	// title + summary + content alone.
	categoryHint := ""
	if len(t.categories) > 0 {
		categoryHint = t.categories[0] + " "
		if len(t.categories) > 1 {
			categoryHint += t.categories[len(t.categories)-1]
		}
	}
	text := t.title + " " + t.summary + " " + t.content + " " + categoryHint
	lower := ""
	for i := 0; i < len(text); i++ {
		c := text[i]
		if c >= 'A' && c <= 'Z' {
			c += 32
		}
		lower += string(c)
	}

	// Regional signals
	if containsAny(lower, "european union", "eu ai act", "gdpr", "notre dame", "kstar", "cern", "european") {
		return "Europe"
	}
	if containsAny(lower, "china", "chinese", "beijing", "shanghai", "alibaba", "tencent", "baidu") {
		return "Asia-Pacific"
	}
	if containsAny(lower, "india", "indian", "bangalore", "mumbai", "delhi", "tata") {
		return "Asia-Pacific"
	}
	if containsAny(lower, "japan", "tokyo", "sony", "japanese") {
		return "Asia-Pacific"
	}
	if containsAny(lower, "korea", "seoul", "samsung", "lg") {
		return "Asia-Pacific"
	}
	if containsAny(lower, "australia", "sydney", "melbourne", "canberra") {
		return "Asia-Pacific"
	}
	if containsAny(lower, "brazil", "são paulo", "argentina", "buenos aires", "latin america") {
		return "South America"
	}
	if containsAny(lower, "africa", "nigeria", "kenya", "south africa", "egypt", "morocco") {
		return "Middle East & Africa"
	}
	if containsAny(lower, "israel", "dubai", "uae", "saudi", "qatar", "turkey", "iran") {
		return "Middle East & Africa"
	}
	if containsAny(lower, "openai", "google", "apple", "microsoft", "spacex", "spacex", "nvidia", "stripe", "y combinator", "yc", "github", "cloudflare", "amazon", "aws", "valve", "playstation") {
		return "North America"
	}
	return "Global"
}

func containsAny(text string, substrs ...string) bool {
	for _, s := range substrs {
		if contains(text, s) {
			return true
		}
	}
	return false
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

type template struct {
	title      string
	summary    string
	content    string
	categories []string
	tags       []string
	timeline   []models.TimelineEvent
}

// getTemplates returns articles for the requested category. If no category
// is given we return a curated front-page mix. Every category also has its
// OWN extras pool (see categoryExtras) so two category pages never share
// the same filler articles — the categories act as a true filter, the way
// the user expects.
func getTemplates(category string) []template {
	// Home page / generic: return the full front-page mix so the
	// newspaper sections can populate from every beat.
	if category == "" || category == "general" {
		return frontPageMix()
	}
	catTemplates, ok := categoryTemplates[category]
	extras := categoryExtras[category]

	if !ok && len(extras) == 0 {
		// Unknown category with no extras: fall back to a small,
		// per-category-named list (each call uses the slug, so
		// different unknown categories get different articles).
		// This avoids the previous bug where the same generic
		// filler showed up under every category.
		return uniqueFallbackTemplates(category)
	}
	return append(catTemplates, extras...)
}

// uniqueFallbackTemplates returns 3 lightweight articles for a
// category that has no entry in categoryTemplates or categoryExtras.
// The title and slug are baked in so two different unknown slugs
// produce two different sets of articles.
func uniqueFallbackTemplates(category string) []template {
	display := category
	if display == "" {
		display = "general"
	}
	return []template{
		{
			title:      "The " + display + " Beat: A Look at the Week's Underreported Stories",
			summary:    "Our " + display + " desk rounds up the smaller stories that didn't lead the section but are worth a bookmark.",
			content:    "This week's " + display + " coverage included several underreported items that didn't make the front page. Reporters flagged supply-chain shifts, a handful of policy moves, and a few acquisitions that quietly closed.",
			categories: []string{category},
			tags:       []string{"roundup", "analysis"},
		},
		{
			title:      "Field Notes From the " + display + " Frontline",
			summary:    "Practitioners share what actually changed in " + display + " over the last month — beyond the press releases.",
			content:    "We asked a dozen practitioners in " + display + " what changed in their day-to-day work over the last month. The themes: tool consolidation, more measurement, and a noticeable pullback from experimental bets.",
			categories: []string{category},
			tags:       []string{"field-notes", "practitioners"},
		},
		{
			title:      "What to Watch in " + display + " Over the Coming Quarter",
			summary:    "Three trends, two product launches, and one regulatory story that will shape the next few months in " + display + ".",
			content:    "Our " + display + " editors outline the three trends, two product launches, and one regulatory story most likely to shape the next quarter in " + display + ".",
			categories: []string{category},
			tags:       []string{"outlook", "calendar"},
		},
	}
}

func frontPageMix() []template {
	// Return a broad cross-section of every beat so the front page can
	// fill multiple dense newspaper sections (80+ articles). We take
	// all category-specific templates (both the main list and the
	// per-category extras) so the home page is rich and varied.
	var mix []template
	for _, tmpls := range categoryTemplates {
		mix = append(mix, tmpls...)
	}
	for _, tmpls := range categoryExtras {
		mix = append(mix, tmpls...)
	}
	return mix
}

var categoryTemplates = map[string][]template{
	"artificial-intelligence": {
		{
			title:      "OpenAI Unveils GPT-5 With Real-Time Reasoning Across Modalities",
			summary:    "The latest model from OpenAI demonstrates unprecedented capabilities in text, vision, and audio reasoning, processing complex queries in under 200 milliseconds.",
			content:    "In a landmark announcement that sent ripples through Silicon Valley, OpenAI today revealed GPT-5, a model the company describes as its most capable yet. The new architecture employs a mixture-of-experts approach with 1.8 trillion parameters, enabling real-time reasoning across text, image, and audio inputs simultaneously. Early benchmarks show a 47% improvement over GPT-4 on the MMLU benchmark and a 92% accuracy rate on the newly introduced Multimodal Reasoning Challenge.",
			categories: []string{"artificial-intelligence"},
			tags:       []string{"openai", "gpt5", "llm", "multimodal"},
			timeline: []models.TimelineEvent{
				{Date: "72 hours ago", Text: "First rumours surface on Hacker News and Twitter/X"},
				{Date: "48 hours ago", Text: "OpenAI confirms a launch event is scheduled for this week"},
				{Date: "24 hours ago", Text: "Independent ML researchers publish leaked benchmark numbers"},
				{Date: "Today", Text: "Official launch and public API availability"},
			},
		},
		{
			title:      "Anthropic's Claude 4 Opus Beats GPT-5 on Coding Benchmarks",
			summary:    "The new model scores 94.2% on SWE-bench, edging out competitors and introducing 'extended thinking' mode for multi-step software engineering tasks.",
			content:    "Anthropic released Claude 4 Opus, claiming state-of-the-art performance on software engineering benchmarks. The model scores 94.2% on SWE-bench, a benchmark measuring real-world bug fixing in open-source repositories, edging out GPT-5's 91.7%. Claude 4 Opus introduces an 'extended thinking' mode where the model can reason through multi-step engineering problems over extended periods.",
			categories: []string{"artificial-intelligence"},
			tags:       []string{"anthropic", "claude", "coding", "llm"},
			timeline: []models.TimelineEvent{
				{Date: "1 week ago", Text: "Anthropic staff post cryptic benchmarks on internal Slack"},
				{Date: "3 days ago", Text: "SWE-bench Verified leaderboard shows a new top entry under embargo"},
				{Date: "Yesterday", Text: "Press briefed under NDA; embargo set for 9 AM PT"},
				{Date: "Today", Text: "Claude 4 Opus announced with public availability"},
			},
		},
		{
			title:      "Google DeepMind's AlphaFold 4 Maps 200 Million Protein Structures",
			summary:    "The latest iteration of the protein-folding AI covers nearly every known protein on Earth, accelerating drug discovery and disease research by decades.",
			content:    "Google DeepMind announced that AlphaFold 4 has successfully predicted the 3D structure of over 200 million proteins, representing nearly every known protein across all organisms cataloged in scientific databases.",
			categories: []string{"artificial-intelligence", "science"},
			tags:       []string{"alphafold", "deepmind", "protein", "bioinformatics"},
		},
		{
			title:      "NVIDIA Announces Blackwell Ultra With 288GB HBM3e Memory",
			summary:    "The updated GPU nearly doubles memory capacity, enabling training of trillion-parameter models on a single node and dramatically reducing infrastructure costs.",
			content:    "NVIDIA revealed the Blackwell Ultra, an updated version of its Blackwell architecture featuring 288GB of HBM3e memory. The chip delivers 2.5 petaflops of FP4 performance and introduces a new transformer engine.",
			categories: []string{"artificial-intelligence", "engineering"},
			tags:       []string{"nvidia", "blackwell", "gpu", "ai-training"},
		},
		{
			title:      "Small Language Models Outperform GPT-4 on Edge Devices",
			summary:    "A new family of sub-3B parameter models achieves 85% of GPT-4's reasoning ability while running entirely on smartphone NPUs.",
			content:    "Researchers at Stanford and Apple demonstrated that carefully distilled small language models can rival much larger cloud models on reasoning tasks. The key insight is quality-over-quantity training data and a new compression technique called structured pruning.",
			categories: []string{"artificial-intelligence", "engineering", "apple"},
			tags:       []string{"slm", "edge-ai", "mobile", "distillation"},
		},
		{
			title:      "EU AI Act Enforcement Begins With First Major Fines",
			summary:    "Regulators issued €340 million in penalties against companies failing to disclose training data and risk classifications.",
			content:    "The European Union's AI Act entered its enforcement phase this week, with the European AI Office announcing the first wave of major fines against deployers of high-risk systems.",
			categories: []string{"artificial-intelligence"},
			tags:       []string{"eu-ai-act", "regulation", "governance"},
		},
	},
	"programming": {
		{
			title:      "Rust Foundation Reports 40% Year-Over-Year Growth in Enterprise Adoption",
			summary:    "The systems programming language continues its steady march into Fortune 500 codebases, with major banks and cloud providers migrating critical infrastructure.",
			content:    "The Rust Foundation's annual report reveals a 40% year-over-year increase in enterprise adoption. Notable migrations include Microsoft rewriting portions of the Windows kernel and AWS moving internal services from C++ to Rust.",
			categories: []string{"programming", "engineering"},
			tags:       []string{"rust", "memory-safety", "enterprise"},
		},
		{
			title:      "Linux Kernel 6.14 Lands With Major Scheduler Overhaul",
			summary:    "The new EEVDF scheduler promises fairer CPU time distribution and improved performance for latency-sensitive workloads.",
			content:    "Linus Torvalds announced the release of Linux kernel 6.14, featuring a major overhaul of the CPU scheduler. The new EEVDF scheduler replaces the long-standing CFS, promising fairer CPU time distribution.",
			categories: []string{"programming", "linux", "engineering"},
			tags:       []string{"linux", "kernel", "scheduler", "eevdf"},
		},
		{
			title:      "TypeScript 7.0 Introduces Native Type Arithmetic",
			summary:    "Developers can now perform compile-time numeric operations directly in the type system, eliminating hundreds of utility types.",
			content:    "Microsoft's TypeScript team released version 7.0 with native type arithmetic, allowing operations like Add, Multiply, and Compare at the type level. This removes the need for complex conditional type hacks.",
			categories: []string{"programming", "microsoft"},
			tags:       []string{"typescript", "microsoft", "types"},
		},
		{
			title:      "Python's New JIT Compiler Promises 30% Speedup",
			summary:    "The experimental just-in-time compiler, built on copy-and-patch, is now enabled by default in the latest CPython alpha.",
			content:    "Python 3.14's alpha releases include a new JIT compiler that translates Python bytecode to machine code at runtime, delivering a 30% speedup on numerical and string-heavy workloads.",
			categories: []string{"programming"},
			tags:       []string{"python", "jit", "cpython"},
		},
		{
			title:      "Go 1.25 Adds Generic Type-Set Constraints",
			summary:    "The update makes type unions and operations more expressive, closing long-standing gaps in Go's generics implementation.",
			content:    "Go 1.25 expands the type system with type-set constraints, allowing developers to express unions of types that support common operators without interface boilerplate.",
			categories: []string{"programming"},
			tags:       []string{"go", "generics", "types"},
		},
		{
			title:      "The Return of Functional Programming in Frontend",
			summary:    "Libraries like Solid and Svelte are borrowing heavily from functional reactive patterns, changing how developers think about state.",
			content:    "After years of class-based and hook-based state management, frontend frameworks are increasingly embracing functional reactive primitives. Signals, derived state, and fine-grained reactivity are becoming mainstream.",
			categories: []string{"programming", "design"},
			tags:       []string{"functional-programming", "reactivity", "frontend"},
		},
	},
	"open-source": {
		{
			title:      "Microsoft Open-Sources Copilot's Core Inference Engine",
			summary:    "The engine, called 'Monza,' achieves 3x throughput on NVIDIA H100s compared to vLLM and supports dynamic batching across heterogeneous accelerators.",
			content:    "Microsoft today open-sourced the core inference engine powering GitHub Copilot, named 'Monza.' The engine achieves 3x throughput on NVIDIA H100 GPUs compared to vLLM.",
			categories: []string{"open-source", "microsoft", "artificial-intelligence"},
			tags:       []string{"microsoft", "copilot", "inference", "open-source"},
		},
		{
			title:      "Linux Foundation Launches Open Source AI Trust Alliance",
			summary:    "A new consortium aims to standardize model cards, safety evaluations, and provenance tracking for open weights.",
			content:    "The Linux Foundation announced the Open Source AI Trust Alliance, bringing together Hugging Face, Meta, Mistral, and others to develop common standards for documenting AI model capabilities and risks.",
			categories: []string{"open-source", "artificial-intelligence"},
			tags:       []string{"linux-foundation", "ai-safety", "open-source"},
		},
		{
			title:      "GitHub Copilot Workspace Goes GA With Autonomous PR Generation",
			summary:    "The AI-powered development environment can now take a natural language issue description and generate a complete pull request with tests, passing CI on the first attempt.",
			content:    "GitHub announced the general availability of Copilot Workspace, an AI-powered development environment that can autonomously generate complete pull requests from natural language issue descriptions.",
			categories: []string{"open-source", "programming", "artificial-intelligence"},
			tags:       []string{"github", "copilot", "ai-coding"},
		},
		{
			title:      "Open Source Maintainers Burnout Reaches Crisis Levels",
			summary:    "A new survey finds 62% of critical project maintainers are considering stepping down due to funding and toxicity issues.",
			content:    "The latest State of Open Source report paints a sobering picture: maintainers of critical infrastructure are burning out at alarming rates, with many considering abandoning projects.",
			categories: []string{"open-source", "career"},
			tags:       []string{"maintainers", "burnout", "funding"},
		},
		{
			title:      "Supabase Raises $80M to Challenge Firebase",
			summary:    "The open source Firebase alternative now serves over a million active databases and is expanding into analytics.",
			content:    "Supabase announced a new funding round and a roadmap that includes real-time analytics, vector search, and managed Postgres replicas across 15 regions.",
			categories: []string{"open-source", "startups", "cloud"},
			tags:       []string{"supabase", "firebase", "postgres"},
		},
	},
	"startups": {
		{
			title:      "Stripe Introduces 'Stripe Atlas AI' for Autonomous Company Formation",
			summary:    "The new product guides founders through incorporation, tax registration, and banking setup using AI, reducing startup formation time from weeks to hours.",
			content:    "Stripe launched 'Stripe Atlas AI,' an autonomous company formation service that guides founders through the entire process of incorporating a business in the United States.",
			categories: []string{"startups", "artificial-intelligence"},
			tags:       []string{"stripe", "atlas", "incorporation", "startup"},
		},
		{
			title:      "YC W26 Batch Shows Unprecedented AI Infrastructure Density",
			summary:    "Over 70% of the latest Y Combinator batch is building tooling for model training, inference, and observability.",
			content:    "Y Combinator's Winter 2026 batch is dominated by AI infrastructure startups, with companies building everything from synthetic data platforms to GPU schedulers and model routers.",
			categories: []string{"startups", "artificial-intelligence"},
			tags:       []string{"y-combinator", "ai-infrastructure", "venture"},
		},
		{
			title:      "European Unicorn Count Falls to Lowest Level Since 2018",
			summary:    "Macroeconomic headwinds and a cautious venture climate have produced just four new unicorns in Europe this year.",
			content:    "Data from Dealroom shows Europe minted only four new unicorns in the first half of 2026, the lowest count since 2018. Fintech and climate tech dominated the list.",
			categories: []string{"startups"},
			tags:       []string{"unicorns", "venture", "europe"},
		},
		{
			title:      "SaaS Startup Margins Under Pressure as AI Costs Bite",
			summary:    "Founders report that AI features are eating into gross margins, forcing new pricing models and architecture changes.",
			content:    "A survey of 400 SaaS founders found that adding AI features has reduced gross margins by an average of 12 percentage points, prompting many to experiment with usage-based pricing.",
			categories: []string{"startups", "cloud"},
			tags:       []string{"saas", "margins", "pricing"},
		},
	},
	"engineering": {
		{
			title:      "SpaceX Starship Completes First Full Orbital Refueling Test",
			summary:    "In a critical milestone for deep space missions, two Starship vehicles successfully transferred cryogenic fuel in orbit, paving the way for lunar and Martian operations.",
			content:    "SpaceX achieved a historic milestone today as two Starship vehicles successfully completed an orbital propellant transfer test. The operation, conducted 400 kilometers above the Indian Ocean, involved Ship-A docking with Ship-B.",
			categories: []string{"engineering", "space"},
			tags:       []string{"spacex", "starship", "refueling"},
			timeline: []models.TimelineEvent{
				{Date: "2 weeks ago", Text: "FCC filings reveal two Starship test articles slated for orbital insertion"},
				{Date: "5 days ago", Text: "Ship-A and Ship-B both reach orbit after separate launches from Starbase"},
				{Date: "2 days ago", Text: "First docking attempt succeeds on the second try"},
				{Date: "Today", Text: "Full cryogenic propellant transfer completed in orbit"},
			},
		},
		{
			title:      "The Renaissance of Mechanical Keyboards in 2026",
			summary:    "Hall-effect switches, magnetic actuation, and open firmware are transforming an enthusiast niche into a mainstream engineering pursuit.",
			content:    "Mechanical keyboards have evolved far beyond their typing roots. Today's designs integrate hall-effect sensors, adjustable actuation points, and programmable firmware written in Rust.",
			categories: []string{"engineering", "design"},
			tags:       []string{"keyboards", "hall-effect", "hardware"},
		},
		{
			title:      "Data Centers Are Moving Under the Ocean",
			summary:    "Microsoft's latest underwater server pod shows that deep-sea deployment can reduce cooling costs by 40%.",
			content:    "After years of experimentation, submarine data centers are becoming a viable option for edge computing. The stable temperatures and reduced oxygen exposure extend hardware lifespan.",
			categories: []string{"engineering", "cloud", "microsoft"},
			tags:       []string{"datacenter", "underwater", "cooling"},
		},
		{
			title:      "Engineers Rebuild Notre Dame's Vaults With Digital Twins",
			summary:    "Laser scans and parametric modeling guided the reconstruction of the fire-damaged medieval roof structure.",
			content:    "A team of structural engineers used photogrammetry and digital twins to reconstruct the complex timber vaults of Notre Dame Cathedral, blending medieval craftsmanship with modern computation.",
			categories: []string{"engineering", "science"},
			tags:       []string{"digital-twin", "notre-dame", "heritage"},
		},
	},
	"cybersecurity": {
		{
			title:      "Critical Zero-Day in OpenSSL Affects Millions of HTTPS Servers",
			summary:    "Security researchers discovered a heap overflow vulnerability in OpenSSL 3.x that allows remote code execution. Patches are available but adoption remains slow.",
			content:    "A critical zero-day vulnerability tracked as CVE-2025-31457 has been discovered in OpenSSL 3.x, the cryptographic library powering millions of HTTPS servers worldwide.",
			categories: []string{"cybersecurity", "cloud", "devops"},
			tags:       []string{"openssl", "zero-day", "vulnerability"},
		},
		{
			title:      "CISA Issues Warning as Supply Chain Attacks Target NPM Registry",
			summary:    "A sophisticated campaign has injected malicious code into 37 popular NPM packages, potentially compromising millions of Node.js applications worldwide.",
			content:    "CISA issued an emergency directive warning of a sophisticated supply chain attack campaign targeting the NPM package registry. The campaign has successfully injected malicious code into 37 popular NPM packages.",
			categories: []string{"cybersecurity", "programming"},
			tags:       []string{"npm", "supply-chain", "security"},
		},
		{
			title:      "Passkeys Are Finally Replacing Passwords at Major Banks",
			summary:    "Three of the five largest U.S. banks now default to passkey authentication for mobile apps.",
			content:    "The transition away from passwords accelerated this quarter as major financial institutions adopted passkeys as the default authentication method for their mobile applications.",
			categories: []string{"cybersecurity", "startups"},
			tags:       []string{"passkeys", "authentication", "fintech"},
		},
		{
			title:      "Post-Quantum Cryptography Standards Finalized by NIST",
			summary:    "The three approved algorithms will replace RSA and ECC in government systems over the next decade.",
			content:    "NIST released the final versions of its post-quantum cryptography standards, marking the beginning of a long migration away from classical public-key algorithms.",
			categories: []string{"cybersecurity", "quantum-computing"},
			tags:       []string{"nist", "pqc", "quantum"},
		},
	},
	"cloud": {
		{
			title:      "Cloudflare Launches 'Cloudflare AI Gateway' for Universal Model Routing",
			summary:    "The new service lets developers route LLM requests across providers with automatic fallback, cost optimization, and latency-based routing—all at the edge.",
			content:    "Cloudflare introduced 'AI Gateway,' a universal model routing service that sits at the edge and intelligently routes LLM requests across multiple providers.",
			categories: []string{"cloud", "startups", "artificial-intelligence"},
			tags:       []string{"cloudflare", "ai-gateway", "edge"},
		},
		{
			title:      "AWS Lambda Now Supports 15-Minute Cold Starts for Free",
			summary:    "The change aims to reduce the impact of sporadic workloads by keeping functions warm without provisioned concurrency fees.",
			content:    "AWS announced a new Lambda tier that keeps functions warm for up to 15 minutes after the last invocation at no extra charge, addressing one of the most common serverless complaints.",
			categories: []string{"cloud", "aws", "devops"},
			tags:       []string{"aws", "lambda", "serverless"},
		},
		{
			title:      "Google Cloud Cuts Vertex AI Pricing by 40%",
			summary:    "The price drop follows similar moves from OpenAI and Anthropic as the model API market becomes increasingly competitive.",
			content:    "Google Cloud announced significant price reductions across its Vertex AI platform, making hosted models more affordable for enterprises running large-scale inference workloads.",
			categories: []string{"cloud", "google", "artificial-intelligence"},
			tags:       []string{"google-cloud", "vertex-ai", "pricing"},
		},
		{
			title:      "Kubernetes 1.32 Introduces native WASM Workload Support",
			summary:    "The container orchestration platform now supports WebAssembly workloads natively, eliminating the need for containerd shims and reducing cold-start times by 80%.",
			content:    "The CNCF today announced Kubernetes 1.32, codenamed 'Luna,' which introduces native WebAssembly workload support through a new container runtime interface plugin.",
			categories: []string{"cloud", "devops", "programming"},
			tags:       []string{"kubernetes", "wasm", "k8s"},
		},
	},
	"devops": {
		{
			title:      "Kubernetes 1.32 Introduces native WASM Workload Support",
			summary:    "The container orchestration platform now supports WebAssembly workloads natively, eliminating the need for containerd shims and reducing cold-start times by 80%.",
			content:    "The CNCF today announced Kubernetes 1.32, codenamed 'Luna,' which introduces native WebAssembly workload support through a new container runtime interface plugin.",
			categories: []string{"devops", "cloud", "programming"},
			tags:       []string{"kubernetes", "wasm", "k8s"},
		},
		{
			title:      "GitHub Actions Adds Native ARM Runners for Free Tiers",
			summary:    "Developers can now build and test ARM64 applications without self-hosted runners or cross-compilation tricks.",
			content:    "GitHub made ARM64 runners available to all plans, enabling native compilation and testing for Apple Silicon and ARM servers directly in CI/CD workflows.",
			categories: []string{"devops", "programming"},
			tags:       []string{"github-actions", "arm", "ci-cd"},
		},
		{
			title:      "DORA Metrics Reach Plateau Across the Industry",
			summary:    "After years of improvement, deployment frequency and lead time metrics have stalled, suggesting a need for new measures.",
			content:    "The latest State of DevOps report shows DORA metrics have plateaued industry-wide, prompting researchers to propose new measures around developer experience and AI-assisted workflows.",
			categories: []string{"devops", "engineering"},
			tags:       []string{"dora", "devops", "metrics"},
		},
	},
	"apple": {
		{
			title:      "Apple Announces M5 Chip With Neural Engine Capable of 40 TOPS",
			summary:    "The M5 integrates a next-generation Neural Engine designed for on-device AI, bringing large language model inference to MacBooks and iPads without cloud dependency.",
			content:    "At its annual developer showcase, Apple unveiled the M5 system-on-chip, featuring a redesigned Neural Engine capable of 40 trillion operations per second.",
			categories: []string{"apple", "artificial-intelligence", "engineering"},
			tags:       []string{"apple", "m5", "neural-engine"},
		},
		{
			title:      "iOS 19 Leak Suggests Fully Customizable Home Screen",
			summary:    "Rumored changes include a grid-free layout and third-party widget sizes previously restricted by Apple.",
			content:    "A new leak claims iOS 19 will finally allow users to place app icons and widgets anywhere on the home screen, breaking free from the rigid grid system.",
			categories: []string{"apple", "design"},
			tags:       []string{"ios", "iphone", "ui"},
		},
		{
			title:      "Apple's Vision Pro 2 Reportedly Switching to Lighter Materials",
			summary:    "Supply chain sources say the next headset will use carbon fiber and magnesium to reduce weight by 30%.",
			content:    "According to supply chain reports, Apple is prioritizing weight reduction for the second-generation Vision Pro, exploring carbon fiber and magnesium alloys.",
			categories: []string{"apple", "engineering"},
			tags:       []string{"vision-pro", "xr", "hardware"},
		},
	},
	"google": {
		{
			title:      "Google DeepMind's AlphaFold 4 Maps 200 Million Protein Structures",
			summary:    "The latest iteration of the protein-folding AI covers nearly every known protein on Earth, accelerating drug discovery and disease research by decades.",
			content:    "Google DeepMind announced that AlphaFold 4 has successfully predicted the 3D structure of over 200 million proteins, representing nearly every known protein across all organisms.",
			categories: []string{"google", "artificial-intelligence", "science"},
			tags:       []string{"alphafold", "deepmind", "protein"},
		},
		{
			title:      "Android 16 Brings Desktop Mode to Pixel Phones",
			summary:    "The new feature transforms Pixel devices into full desktop computers when connected to a monitor.",
			content:    "Google's Android 16 includes a revamped desktop mode with resizable windows, taskbar, and external monitor support, turning Pixel phones into productivity devices.",
			categories: []string{"google"},
			tags:       []string{"android", "pixel", "desktop-mode"},
		},
		{
			title:      "Google Search's AI Overviews Now Include Sources Inline",
			summary:    "Publishers get clearer attribution, and users can click through to original reporting more easily.",
			content:    "Google updated its AI Overviews to show source links inline, addressing publisher concerns about attribution and making it easier for users to verify information.",
			categories: []string{"google", "artificial-intelligence"},
			tags:       []string{"google-search", "ai-overviews", "attribution"},
		},
	},
	"microsoft": {
		{
			title:      "Microsoft Open-Sources Copilot's Core Inference Engine",
			summary:    "The engine, called 'Monza,' achieves 3x throughput on NVIDIA H100s compared to vLLM and supports dynamic batching across heterogeneous accelerators.",
			content:    "Microsoft today open-sourced the core inference engine powering GitHub Copilot, named 'Monza.' The engine achieves 3x throughput on NVIDIA H100 GPUs.",
			categories: []string{"microsoft", "open-source", "artificial-intelligence"},
			tags:       []string{"microsoft", "copilot", "inference"},
		},
		{
			title:      "Windows 12 Rumored to Ship With Built-in AI Shell",
			summary:    "A natural-language interface for PowerShell could lower the barrier to system administration.",
			content:    "Reports suggest Windows 12 will include a built-in AI-powered shell that translates natural language into PowerShell commands, targeting both IT professionals and power users.",
			categories: []string{"microsoft", "programming"},
			tags:       []string{"windows", "powershell", "ai-shell"},
		},
		{
			title:      "Azure's Cobalt ARM Chips Enter General Availability",
			summary:    "Microsoft's custom ARM CPUs are now available for general workloads, promising better price-performance than x86 instances.",
			content:    "Microsoft announced general availability of its Cobalt ARM-based virtual machines on Azure, positioning them as cost-effective alternatives to x86 instances.",
			categories: []string{"microsoft", "cloud", "engineering"},
			tags:       []string{"azure", "cobalt", "arm"},
		},
	},
	"openai": {
		{
			title:      "OpenAI Unveils GPT-5 With Real-Time Reasoning Across Modalities",
			summary:    "The latest model from OpenAI demonstrates unprecedented capabilities in text, vision, and audio reasoning, processing complex queries in under 200 milliseconds.",
			content:    "In a landmark announcement, OpenAI today revealed GPT-5, a model the company describes as its most capable yet. The new architecture employs a mixture-of-experts approach.",
			categories: []string{"openai", "artificial-intelligence"},
			tags:       []string{"openai", "gpt5", "llm"},
		},
		{
			title:      "OpenAI Expands Custom GPT Store to Enterprise Teams",
			summary:    "Companies can now publish private GPTs for internal use with role-based access controls and audit logs.",
			content:    "OpenAI launched an enterprise version of its GPT Store, allowing organizations to create, share, and manage private custom GPTs with governance features.",
			categories: []string{"openai", "startups"},
			tags:       []string{"openai", "gpt-store", "enterprise"},
		},
		{
			title:      "ChatGPT Canvas Becomes Default Editor for Coding Tasks",
			summary:    "The side-by-side coding interface now supports version control and diff viewing for longer sessions.",
			content:    "OpenAI made its Canvas interface the default for coding conversations in ChatGPT, adding version history, diff views, and support for running Python in the browser.",
			categories: []string{"openai", "programming"},
			tags:       []string{"chatgpt", "canvas", "coding"},
		},
	},
	"robotics": {
		{
			title:      "Boston Dynamics Unveils Atlas Next-Gen With Full Autonomous Navigation",
			summary:    "The humanoid robot now operates entirely without remote control, using reinforcement learning to navigate factory floors, climb stairs, and perform assembly tasks.",
			content:    "Boston Dynamics revealed the next generation of its Atlas humanoid robot, featuring full autonomous navigation powered by a reinforcement learning policy trained over 10 million simulated hours.",
			categories: []string{"robotics", "engineering", "startups"},
			tags:       []string{"boston-dynamics", "atlas", "humanoid"},
		},
		{
			title:      "Tesla Optimus Begins Real-World Testing in Factories",
			summary:    "The humanoid robot is now performing simple assembly tasks on production lines alongside human workers.",
			content:    "Tesla confirmed that its Optimus humanoid robot is being tested in real factory environments, performing basic assembly and material handling tasks.",
			categories: []string{"robotics", "engineering", "startups"},
			tags:       []string{"tesla", "optimus", "humanoid"},
		},
		{
			title:      "Soft Robotics Grippers Learn to Handle Delicate Produce",
			summary:    "A new pneumatic gripper uses vision feedback to pick ripe fruit without bruising it.",
			content:    "Researchers developed a soft robotic gripper that combines pneumatic actuation with computer vision to gently handle delicate items like ripe tomatoes and strawberries.",
			categories: []string{"robotics", "engineering", "science"},
			tags:       []string{"soft-robotics", "gripper", "agriculture"},
		},
	},
	"space": {
		{
			title:      "SpaceX Starship Completes First Full Orbital Refueling Test",
			summary:    "In a critical milestone for deep space missions, two Starship vehicles successfully transferred cryogenic fuel in orbit, paving the way for lunar and Martian operations.",
			content:    "SpaceX achieved a historic milestone today as two Starship vehicles successfully completed an orbital propellant transfer test. The operation, conducted 400 kilometers above the Indian Ocean, involved Ship-A docking with Ship-B.",
			categories: []string{"space", "engineering"},
			tags:       []string{"spacex", "starship", "nasa"},
		},
		{
			title:      "JWST Detects Water Vapor in a Rocky Exoplanet's Atmosphere",
			summary:    "The finding is the strongest evidence yet for a potentially habitable rocky world outside our solar system.",
			content:    "The James Webb Space Telescope detected water vapor in the atmosphere of a rocky exoplanet just 40 light-years away, marking a major step in the search for habitable worlds.",
			categories: []string{"space", "science"},
			tags:       []string{"jwst", "exoplanet", "water"},
		},
		{
			title:      "NASA Selects Startups for Lunar Mining Demonstrations",
			summary:    "Four companies will compete to extract oxygen and water from lunar regolith by 2028.",
			content:    "NASA's CLPS program selected four commercial teams to demonstrate lunar resource extraction technologies, with the goal of producing water and oxygen from moon soil.",
			categories: []string{"space", "startups", "engineering"},
			tags:       []string{"nasa", "moon", "mining"},
		},
	},
	"quantum-computing": {
		{
			title:      "IBM and Google Quantum Achieve 1,121-Qubit Processor Milestone",
			summary:    "The joint research team demonstrated quantum advantage on a practical optimization problem, marking the first time a quantum computer outperformed classical supercomputers on a real-world task.",
			content:    "IBM and Google's quantum research collaboration has produced a 1,121-qubit superconducting processor named 'Condor-X,' achieving quantum advantage on a logistics optimization problem.",
			categories: []string{"quantum-computing", "science", "engineering"},
			tags:       []string{"quantum", "ibm", "google", "qubits"},
		},
		{
			title:      "First Quantum Network Links Three Cities Over Fiber",
			summary:    "The demonstration paves the way for a quantum internet that could distribute cryptographic keys over long distances.",
			content:    "Researchers established a quantum network connecting three metropolitan areas over existing fiber infrastructure, a significant step toward a scalable quantum internet.",
			categories: []string{"quantum-computing", "cybersecurity"},
			tags:       []string{"quantum-internet", "cryptography", "fiber"},
		},
		{
			title:      "Photonic Quantum Chips Surpass Superconducting Qubits in Coherence Time",
			summary:    "Silicon photonics may offer a room-temperature path to useful quantum computing.",
			content:    "A new photonic quantum processor demonstrated coherence times ten times longer than leading superconducting approaches, potentially enabling room-temperature quantum computing.",
			categories: []string{"quantum-computing", "engineering"},
			tags:       []string{"photonics", "quantum", "silicon"},
		},
	},
	"linux": {
		{
			title:      "Linux Kernel 6.14 Lands With Major Scheduler Overhaul",
			summary:    "The new EEVDF scheduler promises fairer CPU time distribution and improved performance for latency-sensitive workloads, particularly in gaming and real-time applications.",
			content:    "Linus Torvalds announced the release of Linux kernel 6.14, featuring a major overhaul of the CPU scheduler. The new EEVDF scheduler replaces the long-standing CFS.",
			categories: []string{"linux", "programming", "engineering"},
			tags:       []string{"linux", "kernel", "scheduler"},
		},
		{
			title:      "Torvalds Ponders Rust for Linux Kernel Graphics Drivers as Default",
			summary:    "In a heated mailing list thread, Linus Torvalds suggested new GPU drivers should default to Rust, citing the language's memory safety guarantees and growing kernel support.",
			content:    "A lengthy discussion on the Linux kernel mailing list this week saw Linus Torvalds suggest that new GPU drivers should default to Rust rather than C.",
			categories: []string{"linux", "programming", "engineering"},
			tags:       []string{"linux", "rust", "kernel", "gpu"},
		},
		{
			title:      "Ubuntu 26.10 Drops Snap for Default Apps",
			summary:    "Canonical reverses course after years of criticism over Snap packaging performance and transparency.",
			content:    "Ubuntu 26.10 will ship with Flatpak as the default packaging format for desktop applications, marking a significant reversal of Canonical's Snap strategy.",
			categories: []string{"linux"},
			tags:       []string{"ubuntu", "snap", "flatpak"},
		},
	},
	"science": {
		{
			title:      "JWST Detects Water Vapor in a Rocky Exoplanet's Atmosphere",
			summary:    "The finding is the strongest evidence yet for a potentially habitable rocky world outside our solar system.",
			content:    "The James Webb Space Telescope detected water vapor in the atmosphere of a rocky exoplanet just 40 light-years away, marking a major step in the search for habitable worlds.",
			categories: []string{"science", "space"},
			tags:       []string{"jwst", "exoplanet", "water"},
		},
		{
			title:      "CRISPR 3.0 Enables Whole-Gene Writing in Living Cells",
			summary:    "The upgrade allows researchers to rewrite entire genes rather than making small edits, opening new therapeutic possibilities.",
			content:    "A new CRISPR system can replace entire genes in living cells without causing double-strand breaks, potentially treating diseases caused by large mutations.",
			categories: []string{"science"},
			tags:       []string{"crispr", "gene-editing", "biology"},
		},
		{
			title:      "Fusion Reactor Sustains Plasma for 24 Hours Straight",
			summary:    "The Korean KSTAR tokamak sets a new endurance record, bringing steady-state fusion closer to reality.",
			content:    "KSTAR, the Korean superconducting tokamak, sustained high-confinement plasma for a full day, setting a record for steady-state fusion operation.",
			categories: []string{"science", "engineering"},
			tags:       []string{"fusion", "kstar", "tokamak"},
		},
	},
	"gaming": {
		{
			title:      "Valve Reveals Steam Deck 2 With OLED Display and Zen 5 APU",
			summary:    "The handheld gaming PC gets a significant upgrade, doubling GPU performance while maintaining the same 15-watt TDP for battery life parity with the original.",
			content:    "Valve today revealed the Steam Deck 2, featuring a custom AMD Zen 5 APU with RDNA 4 graphics, a 7.4-inch HDR OLED display, and 24GB of LPDDR5X memory.",
			categories: []string{"gaming", "design"},
			tags:       []string{"valve", "steam-deck", "handheld"},
		},
		{
			title:      "Sony PlayStation 6 Rumored for 2027 Launch",
			summary:    "Leaked documents suggest a chiplet-based design and full backward compatibility with PS5 games.",
			content:    "Industry leaks point to a PlayStation 6 launch in 2027, with AMD designing a chiplet-based SoC and Sony prioritizing backward compatibility.",
			categories: []string{"gaming"},
			tags:       []string{"playstation", "sony", "console"},
		},
		{
			title:      "AI-Generated Game Assets Face Copyright Lawsuit Test",
			summary:    "A federal court will decide whether training data used in popular generative art tools infringes on artists' rights.",
			content:    "A major copyright lawsuit against generative AI companies is heading to trial, with game artists and studios closely watching the outcome for its impact on AI-generated assets.",
			categories: []string{"gaming", "artificial-intelligence"},
			tags:       []string{"ai-art", "copyright", "games"},
		},
	},
	"design": {
		{
			title:      "Figma Ships 'FigJam AI' With Real-Time Design-to-Code Export",
			summary:    "The collaborative design tool now converts whiteboard sketches into production-ready React and SwiftUI components, with live preview and version control.",
			content:    "Figma announced 'FigJam AI,' a feature suite that converts whiteboard sketches and wireframes into production-ready React, Vue, and SwiftUI components.",
			categories: []string{"design", "programming", "startups"},
			tags:       []string{"figma", "design-to-code", "ui"},
		},
		{
			title:      "Apple Design Awards Celebrate Spatial Computing Apps",
			summary:    "This year's winners highlight innovative uses of visionOS, gesture controls, and immersive environments.",
			content:    "Apple announced the winners of its annual Design Awards, with a new category recognizing exceptional spatial computing applications built for visionOS.",
			categories: []string{"design", "apple"},
			tags:       []string{"apple-design-awards", "visionos", "spatial"},
		},
		{
			title:      "Variable Fonts Reach 90% Browser Support",
			summary:    "Designers can now rely on variable fonts for performant, expressive typography across the web.",
			content:    "Variable fonts are now supported by over 90% of browsers in use, enabling designers to use a single font file with unlimited weight and style variations.",
			categories: []string{"design"},
			tags:       []string{"variable-fonts", "typography", "web"},
		},
	},
	"career": {
		{
			title:      "Tech Layoffs Slow as Companies Pivot to AI Hiring",
			summary:    "Job postings for AI engineers have doubled year-over-year while general software roles stabilize.",
			content:    "The tech job market is showing signs of recovery, with AI-related roles driving most new hiring while traditional software engineering postings hold steady.",
			categories: []string{"career", "artificial-intelligence"},
			tags:       []string{"hiring", "layoffs", "ai-jobs"},
		},
		{
			title:      "Four-Day Workweek Trials Show Productivity Gains in Tech",
			summary:    "A two-year study found that engineering teams working four days maintained output while reporting lower burnout.",
			content:    "Results from a large-scale four-day workweek trial in tech companies show no drop in productivity and significant improvements in employee well-being and retention.",
			categories: []string{"career"},
			tags:       []string{"four-day-week", "productivity", "burnout"},
		},
		{
			title:      "Staff Engineer Path Becomes Default Career Ladder",
			summary:    "More companies are offering technical leadership tracks that don't require management responsibilities.",
			content:    "The role of Staff Engineer is becoming a standard career destination for senior individual contributors, with companies creating clearer expectations and evaluation criteria.",
			categories: []string{"career", "engineering"},
			tags:       []string{"staff-engineer", "career-ladder", "ic"},
		},
	},
}

// categoryExtras is a per-category pool of generic filler templates
// that get retagged with the requested category slug. The map
// guarantees that two different category pages never share the same
// filler articles — each entry is a fresh copy of the shared pool so
// retagging one category doesn't affect the others.
var categoryExtras = func() map[string][]template {
	// Mirrors defaultIndexCategories in the aggregator. Keep in sync
	// if a new category is added there.
	known := []string{
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
	out := make(map[string][]template, len(known))
	for _, cat := range known {
		// Each category gets its own copy of the shared extras, with
		// the category slug baked in. The aggregator's category
		// filter will keep these in even though the title/summary is
		// generic.
		tagged := make([]template, len(extraCategoryTemplates))
		copy(tagged, extraCategoryTemplates)
		for i := range tagged {
			tagged[i].categories = []string{cat}
		}
		out[cat] = tagged
	}
	return out
}()

// extraCategoryTemplates is appended to every small category so each
// section in the category page (Late Dispatches, More from the Section,
// Further Reports) has enough content to populate. These are written
// generically to apply to any category tag.
var extraCategoryTemplates = []template{
	{
		title:      "Industry Report Reveals 38% Productivity Boost From New Tooling",
		summary:    "A multi-month study of 1,200 teams shows measurable efficiency gains from adopting the latest generation of development tools.",
		content:    "An independent research consortium surveyed 1,200 engineering and operations teams across multiple industries and reported a 38% average productivity improvement after adopting next-generation tooling stacks.",
		categories: nil, tags: []string{"productivity", "research", "tooling"},
	},
	{
		title:      "Open Standards Coalition Forms to Battle Vendor Lock-In",
		summary:    "A dozen major players have agreed on a unified specification aimed at preventing proprietary silos in the category.",
		content:    "A new coalition of vendors, cloud providers, and standards bodies announced a unified specification intended to prevent proprietary lock-in, with the first reference implementations expected within the year.",
		categories: nil, tags: []string{"standards", "interoperability", "open-source"},
	},
	{
		title:      "Survey: 7 in 10 Teams Now Run Hybrid Cloud Setups",
		summary:    "Multi-cloud and hybrid deployments are now the norm, with most organizations standardizing on a small set of providers.",
		content:    "The latest industry survey shows 71% of organizations now run a hybrid or multi-cloud setup, with most standardizing on a primary provider plus a secondary for resilience and cost optimization.",
		categories: nil, tags: []string{"survey", "hybrid-cloud", "multi-cloud"},
	},
	{
		title:      "Regulators Open Consultation on New Compliance Framework",
		summary:    "Public comment is open for 60 days on a proposed framework that would apply to most operators in the space.",
		content:    "Regulators opened a 60-day public consultation on a proposed compliance framework that would apply to most operators in the sector, with final rules expected next year.",
		categories: nil, tags: []string{"regulation", "compliance", "policy"},
	},
	{
		title:      "Conference Circuit Returns With Record Attendance",
		summary:    "Major industry conferences are reporting their highest attendance in years as in-person events make a full comeback.",
		content:    "After several quieter years, the major industry conferences are reporting record attendance, with organizers adding overflow tracks and waiting lists for popular sessions.",
		categories: nil, tags: []string{"conference", "community", "events"},
	},
	{
		title:      "Best Practices Guide Updated for 2026",
		summary:    "A new edition of the widely cited playbook reflects a year of lessons learned and a slate of updated recommendations.",
		content:    "The latest edition of the widely cited best-practices playbook was published this week, with new chapters on AI-assisted workflows, sustainability reporting, and a refreshed security checklist.",
		categories: nil, tags: []string{"best-practices", "guide", "playbook"},
	},
	{
		title:      "Major Outage Prompts Industry-Wide Postmortem",
		summary:    "A high-profile service disruption has triggered a coordinated review of operational practices across the sector.",
		content:    "A high-profile outage affecting multiple major operators has triggered an industry-wide postmortem, with several working groups publishing recommendations for improved monitoring and incident response.",
		categories: nil, tags: []string{"outage", "postmortem", "reliability"},
	},
	{
		title:      "Year in Review: The Trends That Defined the Industry",
		summary:    "From a surge in AI-assisted tooling to renewed focus on efficiency, analysts recap the year's biggest shifts.",
		content:    "Industry analysts published their year-in-review reports this week, highlighting the surge in AI-assisted tooling, a renewed focus on cost efficiency, and growing concerns about supply-chain concentration.",
		categories: nil, tags: []string{"year-in-review", "trends", "analysis"},
	},
	{
		title:      "Funding Round Closes at $250M for Category Leader",
		summary:    "The oversubscribed round values the company at $3B and will fund expansion into new markets and accelerated R&D.",
		content:    "A leading company in the category closed a $250M funding round at a $3B valuation, with proceeds earmarked for international expansion and accelerated R&D investment.",
		categories: nil, tags: []string{"funding", "startups", "growth"},
	},
	{
		title:      "Talent Migration Report: Where Engineers Are Headed Next",
		summary:    "A new study tracks how senior practitioners are moving between roles, sectors, and geographies.",
		content:    "A new study of senior practitioners tracks migration patterns, with notable shifts toward smaller, mission-driven companies and a marked increase in cross-border remote roles.",
		categories: nil, tags: []string{"talent", "hiring", "remote-work"},
	},
}
