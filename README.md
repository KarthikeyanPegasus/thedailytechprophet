# The Daily Tech Prophet

An immersive, cinematic technology newspaper styled like the Daily Prophet from Harry Potter — but for AI, programming, cybersecurity, space, startups, and engineering.

> “All the Tech That's Fit to Print”

## Architecture

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP, Lucide Icons
- **Backend:** Go 1.24+ — news aggregation, caching, REST API
- **Rendering:** Client-side rendered (no SSR)
- **Data sources:** Mock data (offline-first) + RSS, Hacker News, GitHub, Reddit providers

## Project Structure

```
personal-portfolio/
├── frontend/       # Next.js app
│   ├── app/        # App Router pages (all use "use client")
│   ├── components/ # Layout, masthead, articles, widgets, effects, images
│   ├── hooks/      # Bookmarks & reading history
│   ├── lib/        # API client, utilities
│   └── types/      # Shared TypeScript types
├── backend/        # Go news API server
│   ├── cmd/server/ # Entry point
│   └── internal/   # providers, aggregator, cache, server, models
```

## Quick Start

### 1. Start the Go backend

```bash
cd backend
go run ./cmd/server
```

The server runs on `http://localhost:8080`.

Optional environment variables:

```bash
PORT=8080
GITHUB_TOKEN=your_github_token
ACTIVE_PROVIDERS=mock,rss,hackernews,github,reddit
```

### 2. Start the Next.js frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### Production Build

```bash
# Backend
cd backend
go build -o prophet ./cmd/server
./prophet

# Frontend
cd frontend
npm run build
npm start
```

## API Endpoints

- `GET /api/news?category=&page=&page_size=&provider=` — fetch articles
- `GET /api/widgets` — trending repos, AI leaderboard, stocks, crypto, languages, quote, trivia, terminal tip
- `GET /api/search?q=` — full-text search
- `GET /api/categories` — list all sections
- `GET /api/providers` — list active providers
- `PUT /api/providers` — switch active providers
- `GET /api/health` — health check

## Features

- Victorian newspaper design with parchment textures, drop caps, ornate borders
- Magical effects: floating dust particles, candle-glow cursor, ink trail, scroll reveals
- Living illustrations: animated rockets, CPUs, AI brains, stock graphs, server LEDs, circuits, locks, clouds
- Home page with hero article, multi-column layout, editorial, opinion, widgets
- 20 section/category pages with infinite scroll
- Article pages with unfold animation, pull quotes, timelines, code snippets, related stories
- Search the Archives with typewriter placeholder and ink effect
- Bookmarks & reading history (localStorage)
- Voice narration, reading progress bar, keyboard shortcuts, share, print styles
- Dark/candlelight mode
- PWA manifest and offline-first mock data

## Keyboard Shortcuts

- `/` — Search the Archives
- `j` / `k` — Scroll down / up
- `t` — Toggle candlelight mode
- `b` — Bookmark current article
- `h` — Go home
- `Esc` — Close overlays

## License

MIT — crafted with ink, parchment, and silicon.
