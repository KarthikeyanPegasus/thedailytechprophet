"use client";

import { useEffect, useState, useCallback } from "react";

// A simple event-based store so multiple components can read & update the
// currently selected article date without adding a state-management library.

const STORAGE_KEY = "dtp:article-date";

type Listener = (date: string | null) => void;

let current: string | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(current);
}

function readInitial(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persist(value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function getSelectedDate(): string | null {
  return current;
}

export function setSelectedDate(value: string | null) {
  current = value;
  persist(value);
  emit();
}

export function useArticleDate() {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(readInitial());
    const listener: Listener = (next) => setDate(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((value: string | null) => {
    setSelectedDate(value);
  }, []);

  return { date, setDate: update };
}

// Helpers ---------------------------------------------------------------

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateLabel(iso: string | null): string {
  if (!iso) return "All Editions";
  // iso is YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
