import { useState, useEffect, useCallback } from "react";
import type { Article } from "@/types";

const HISTORY_KEY = "prophet:history";
const BOOKMARK_KEY = "prophet:bookmarks";
const MAX_HISTORY = 100;

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARK_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleBookmark = useCallback((article: Article) => {
    setBookmarks((prev) => {
      const exists = prev.find((a) => a.id === article.id);
      const next = exists
        ? prev.filter((a) => a.id !== article.id)
        : [article, ...prev];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((a) => a.id === id),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}

export function useReadingHistory() {
  const [history, setHistory] = useState<Article[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addToHistory = useCallback((article: Article) => {
    setHistory((prev) => {
      const filtered = prev.filter((a) => a.id !== article.id);
      const next = [article, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
