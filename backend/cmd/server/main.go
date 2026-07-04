package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/spidey/dailytechprophet/internal/aggregator"
	"github.com/spidey/dailytechprophet/internal/cache"
	"github.com/spidey/dailytechprophet/internal/providers"
	"github.com/spidey/dailytechprophet/internal/server"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize cache with 5 minute TTL
	c := cache.New(5 * time.Minute)

	// Register providers
	reg := providers.NewRegistry()
	reg.Register(providers.NewMockProvider())
	reg.Register(providers.NewRSSProvider())
	reg.Register(providers.NewHackerNewsProvider())
	githubToken := os.Getenv("GITHUB_TOKEN")
	reg.Register(providers.NewGitHubProvider(githubToken))
	reg.Register(providers.NewRedditProvider())

	// Default to real news APIs. Set ACTIVE_PROVIDERS=mock to opt back into
	// the offline curated dataset, or pass a comma-separated list of
	// provider names to mix-and-match (e.g. "rss,reddit").
	activeProviders := []string{"rss", "hackernews", "reddit"}
	if envProviders := os.Getenv("ACTIVE_PROVIDERS"); envProviders != "" {
		activeProviders = splitAndTrim(envProviders)
	}

	// Create aggregator
	agg := aggregator.New(reg, c, activeProviders)

	// Warm the in-memory article index in the background so the first
	// user request doesn't pay the cold-cache tax. The server starts
	// serving immediately and handles requests with the slow path until
	// the index is ready.
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go func() {
		// Short warm-up timeout so a slow upstream doesn't block startup forever
		warmCtx, warmCancel := context.WithTimeout(ctx, 10*time.Second)
		defer warmCancel()
		agg.WarmIndex(warmCtx, 5*time.Minute)
		log.Printf("📚 Article index warmed: %d articles", agg.IndexSize())
	}()

	// Create server
	srv := server.New(agg)

	log.Printf("🏛️  The Daily Tech Prophet — Backend")
	log.Printf("📡 Listening on :%s", port)
	log.Printf("🔌 Active providers: %v", activeProviders)

	// Graceful shutdown: stop the index refresher
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		log.Printf("shutting down…")
		cancel()
	}()

	if err := http.ListenAndServe(":"+port, srv); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func splitAndTrim(s string) []string {
	var out []string
	for _, part := range splitChar(s, ',') {
		if trimmed := trimSpace(part); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

func splitChar(s string, sep byte) []string {
	var out []string
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == sep {
			out = append(out, s[start:i])
			start = i + 1
		}
	}
	out = append(out, s[start:])
	return out
}

func trimSpace(s string) string {
	start := 0
	end := len(s)
	for start < end && (s[start] == ' ' || s[start] == '\t' || s[start] == '\n') {
		start++
	}
	for end > start && (s[end-1] == ' ' || s[end-1] == '\t' || s[end-1] == '\n') {
		end--
	}
	return s[start:end]
}