import type { Article, Category, NewsResponse, WidgetsResponse, SearchResult, ProviderInfo } from "@/types";

// NEXT_PUBLIC_API_URL is inlined at build time for client-side fetches.
// API_URL is a runtime fallback for server-side fetches (standalone server).
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8080";

// Short-lived in-memory response cache. Avoids re-fetching the same article
// (or related lists) within a short window during normal navigation.
type CacheEntry = { value: unknown; expiresAt: number };
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30_000; // 30 seconds

async function fetchAPI<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE}/api/${endpoint}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const cacheKey = url.toString();
  const now = Date.now();
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const response = await fetch(cacheKey, {
    headers: { "Content-Type": "application/json" },
    // Allow browser HTTP cache to back us up; the in-memory cache above
    // handles in-session dedupe.
    cache: "default",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = (await response.json()) as T;
  responseCache.set(cacheKey, { value: data, expiresAt: now + CACHE_TTL_MS });
  return data;
}

export async function fetchNews(opts?: {
  category?: string;
  page?: number;
  pageSize?: number;
  provider?: string;
  region?: string;
  timezone?: string;
  date?: string;
}) {
  return fetchAPI<NewsResponse>("news", {
    category: opts?.category,
    page: opts?.page,
    page_size: opts?.pageSize,
    provider: opts?.provider,
    region: opts?.region,
    timezone: opts?.timezone,
    date: opts?.date,
  });
}

export async function fetchWidgets() {
  return fetchAPI<WidgetsResponse>("widgets");
}

export async function searchArchives(query: string) {
  return fetchAPI<{ results: SearchResult[]; query: string }>("search", { q: query });
}

export async function fetchCategories() {
  return fetchAPI<{ categories: Category[] }>("categories");
}

export async function fetchArticle(id: string) {
  return fetchAPI<{ article: Article }>(`article/${id}`);
}

export async function fetchProviders() {
  return fetchAPI<{ providers: ProviderInfo[]; active: string[] }>("providers");
}

export async function setActiveProviders(providers: string[]) {
  const response = await fetch(`${API_BASE}/api/providers`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providers }),
  });
  return response.json();
}

export type { Article, Category, NewsResponse, WidgetsResponse, SearchResult, ProviderInfo };
