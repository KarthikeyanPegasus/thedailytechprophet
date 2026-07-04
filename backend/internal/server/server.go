package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/spidey/dailytechprophet/internal/aggregator"
	"github.com/spidey/dailytechprophet/internal/models"
)

type Server struct {
	agg     *aggregator.Aggregator
	mux     *http.ServeMux
	widgets *widgetsBuilder
}

func New(agg *aggregator.Aggregator) *Server {
	s := &Server{
		agg:     agg,
		widgets: newWidgetsBuilder(),
	}
	s.routes()
	return s
}

func (s *Server) routes() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/", s.corsMiddleware(s.apiHandler))
	mux.HandleFunc("/api/health", s.corsMiddleware(s.health))
	s.mux = mux
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.mux.ServeHTTP(w, r)
}

func (s *Server) corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func (s *Server) apiHandler(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/")
	parts := strings.SplitN(path, "/", 3)
	resource := parts[0]

	switch resource {
	case "news":
		s.handleNews(w, r)
	case "article":
		s.handleArticle(w, r)
	case "widgets":
		s.handleWidgets(w, r)
	case "search":
		s.handleSearch(w, r)
	case "providers":
		s.handleProviders(w, r)
	case "categories":
		s.handleCategories(w, r)
	case "health":
		s.health(w, r)
	default:
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)
	}
}

func (s *Server) handleNews(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	if category == "" {
		category = ""
	}
	page := getIntParam(r, "page", 1)
	pageSize := getIntParam(r, "page_size", 20)
	provider := r.URL.Query().Get("provider")
	region := r.URL.Query().Get("region")
	timezone := r.URL.Query().Get("timezone")
	date := r.URL.Query().Get("date")

	var articles []models.Article
	var err error
	if provider != "" {
		articles, err = s.agg.FetchFromProvider(r.Context(), provider, category, page, pageSize)
	} else if region != "" || timezone != "" || date != "" {
		articles, err = s.agg.FetchCurated(r.Context(), category, region, timezone, page, pageSize)
	} else {
		articles, err = s.agg.Fetch(r.Context(), category, page, pageSize)
	}
	if err != nil {
		log.Printf("news fetch error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to fetch news"})
		return
	}

	// Filter by publication date (YYYY-MM-DD) in the requested timezone if
	// available, otherwise UTC. Empty / unset means "all dates".
	if date != "" {
		loc := time.UTC
		if timezone != "" {
			if l, err := time.LoadLocation(timezone); err == nil {
				loc = l
			}
		}
		filtered := make([]models.Article, 0, len(articles))
		for _, a := range articles {
			local := a.PublishedAt.In(loc)
			y, m, d := local.Date()
			key := fmt.Sprintf("%04d-%02d-%02d", y, int(m), d)
			if key == date {
				filtered = append(filtered, a)
			}
		}
		articles = filtered
	}

	resp := models.NewsResponse{
		Articles:   articles,
		Total:      len(articles),
		Page:       page,
		PageSize:   pageSize,
		Provider:   provider,
		Categories: []string{category},
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) handleArticle(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/article/")
	parts := strings.SplitN(path, "/", 2)
	id := parts[0]
	if id == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "missing article id"})
		return
	}

	article, found, err := s.agg.FindArticle(r.Context(), id)
	if err != nil {
		log.Printf("article fetch error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "failed to fetch article"})
		return
	}
	if !found {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "article not found"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"article": article})
}

func (s *Server) handleWidgets(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.widgets.build())
}

func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		writeJSON(w, http.StatusOK, map[string]any{"results": []any{}, "query": ""})
		return
	}
	results, err := s.agg.Search(r.Context(), query)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "search failed"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"results": results, "query": query})
}

func (s *Server) handleProviders(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		writeJSON(w, http.StatusOK, map[string]any{
			"providers":     s.agg.Providers(),
			"active":        s.agg.ActiveProviders(),
		})
	case "PUT":
		var body struct {
			Providers []string `json:"providers"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid body"})
			return
		}
		s.agg.SetProviders(body.Providers)
		writeJSON(w, http.StatusOK, map[string]any{"active": body.Providers})
	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func (s *Server) handleCategories(w http.ResponseWriter, r *http.Request) {
	categories := []models.Category{
		{Slug: "artificial-intelligence", Name: "Artificial Intelligence", Description: "AI breakthroughs, LLMs, and machine learning", Icon: "brain"},
		{Slug: "programming", Name: "Programming", Description: "Languages, frameworks, and developer tools", Icon: "code"},
		{Slug: "open-source", Name: "Open Source", Description: "Community projects and open source initiatives", Icon: "github"},
		{Slug: "startups", Name: "Startups", Description: "Funding, launches, and startup culture", Icon: "rocket"},
		{Slug: "engineering", Name: "Engineering", Description: "Systems, infrastructure, and deep technical work", Icon: "cog"},
		{Slug: "cybersecurity", Name: "Cybersecurity", Description: "Security research, vulnerabilities, and defense", Icon: "shield"},
		{Slug: "cloud", Name: "Cloud", Description: "AWS, Azure, GCP, and cloud-native tech", Icon: "cloud"},
		{Slug: "devops", Name: "DevOps", Description: "CI/CD, containers, and infrastructure as code", Icon: "git-branch"},
		{Slug: "apple", Name: "Apple", Description: "All things Apple: hardware, software, and services", Icon: "apple"},
		{Slug: "google", Name: "Google", Description: "Google, DeepMind, and Alphabet ecosystem", Icon: "search"},
		{Slug: "microsoft", Name: "Microsoft", Description: "Microsoft, Azure, GitHub, and AI", Icon: "microwave"},
		{Slug: "openai", Name: "OpenAI", Description: "GPT models, research, and OpenAI's latest", Icon: "sparkles"},
		{Slug: "robotics", Name: "Robotics", Description: "Humanoids, automation, and robotics research", Icon: "bot"},
		{Slug: "space", Name: "Space", Description: "SpaceX, NASA, rockets, and space exploration", Icon: "rocket"},
		{Slug: "quantum-computing", Name: "Quantum Computing", Description: "Qubits, quantum advantage, and quantum hardware", Icon: "atom"},
		{Slug: "linux", Name: "Linux", Description: "Kernel, distributions, and the open source OS", Icon: "terminal"},
		{Slug: "science", Name: "Science", Description: "Scientific breakthroughs and research", Icon: "flask-conical"},
		{Slug: "gaming", Name: "Gaming", Description: "Games, hardware, and the gaming industry", Icon: "gamepad-2"},
		{Slug: "design", Name: "Design", Description: "UI/UX, tools, and design engineering", Icon: "palette"},
		{Slug: "career", Name: "Career", Description: "Jobs, salaries, and developer career advice", Icon: "briefcase"},
	}
	writeJSON(w, http.StatusOK, map[string]any{"categories": categories})
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":     "ok",
		"providers":  s.agg.ActiveProviders(),
	})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("json encode error: %v", err)
	}
}

func getIntParam(r *http.Request, key string, def int) int {
	val := r.URL.Query().Get(key)
	if val == "" {
		return def
	}
	n, err := strconv.Atoi(val)
	if err != nil {
		return def
	}
	return n
}
