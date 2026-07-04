export interface TimelineEvent {
  date: string;
  text: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  image_url?: string;
  author: string;
  source: string;
  categories: string[];
  published_at: string;
  read_time: number;
  featured: boolean;
  tags?: string[];
  timeline?: TimelineEvent[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  page_size: number;
  provider: string;
  categories?: string[];
}

export interface TrendingRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  stars_today: number;
  forks: number;
  url: string;
  avatar_url?: string;
}

export interface StockTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
}

export interface AIModelEntry {
  rank: number;
  model: string;
  org: string;
  score: number;
  category: string;
  license: string;
  trend: string;
}

export interface ProgrammingLang {
  rank: number;
  name: string;
  rating: number;
  change: number;
  trend: string;
}

export interface DevQuote {
  quote: string;
  author: string;
}

export interface Trivia {
  question: string;
  answer: string;
  category: string;
}

export interface TerminalTip {
  command: string;
  description: string;
  platform: string;
}

export interface SearchResult {
  article: Article;
  score: number;
}

export interface WidgetsResponse {
  trending_repos: TrendingRepo[];
  ai_models: AIModelEntry[];
  stocks: StockTicker[];
  crypto: StockTicker[];
  programming_langs: ProgrammingLang[];
  dev_quote: DevQuote;
  trivia: Trivia;
  terminal_tip: TerminalTip;
  generated_at: string;
}

export interface ProviderInfo {
  name: string;
  display: string;
  enabled: boolean;
}
