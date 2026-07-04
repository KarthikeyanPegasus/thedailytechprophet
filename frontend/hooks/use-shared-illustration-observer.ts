"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared Illustration Observer
 *
 * A single IntersectionObserver instance for the entire page (or for a
 * shared root margin scope). Components subscribe to it instead of each
 * creating their own observer, which previously cost ~30 observers on
 * the home page.
 *
 * Returns:
 *   - ref: attach to the host element
 *   - shouldRender: becomes true the first time the host enters the viewport
 *   - isVisible: toggles on/off as the host crosses the threshold
 *
 * The shared observer is module-scoped and lazily created on first call.
 */

type Listener = (isIntersecting: boolean) => void;

interface Entry {
  el: Element;
  listener: Listener;
}

// Module-scoped registry so every component on the page shares the same observer.
const ENTRIES: Entry[] = [];
let SHARED_OBSERVER: IntersectionObserver | null = null;
let ROOT_MARGIN = "200px";

function ensureSharedObserver(rootMargin: string): IntersectionObserver {
  ROOT_MARGIN = rootMargin;

  if (SHARED_OBSERVER) {
    SHARED_OBSERVER.disconnect();
  }

  SHARED_OBSERVER = new IntersectionObserver(
    (observerEntries) => {
      for (const e of observerEntries) {
        const target = e.target as Element;
        const entry = ENTRIES.find((x) => x.el === target);
        if (entry) {
          entry.listener(e.isIntersecting);
        }
      }
    },
    { rootMargin },
  );

  for (const entry of ENTRIES) {
    SHARED_OBSERVER.observe(entry.el);
  }

  return SHARED_OBSERVER;
}

function subscribe(el: Element, listener: Listener, rootMargin: string): () => void {
  // Find existing entry to update its listener, or create a new one.
  const existingIndex = ENTRIES.findIndex((x) => x.el === el);
  if (existingIndex >= 0) {
    ENTRIES[existingIndex].listener = listener;
  } else {
    ENTRIES.push({ el, listener });
  }

  // Lazily create the shared observer on first subscription.
  ensureSharedObserver(rootMargin);

  return () => {
    const idx = ENTRIES.findIndex((x) => x.el === el);
    if (idx >= 0) ENTRIES.splice(idx, 1);
    if (SHARED_OBSERVER) {
      SHARED_OBSERVER.unobserve(el);
    }
  };
}

export function useSharedIllustration<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "200px",
) {
  const ref = useRef<T>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    let hasRendered = false;
    const unsubscribe = subscribe(
      el,
      (intersecting) => {
        if (intersecting && !hasRendered) {
          hasRendered = true;
          setShouldRender(true);
        }
        setIsVisible(intersecting);
      },
      rootMargin,
    );

    return unsubscribe;
  }, [rootMargin]);

  return { ref, shouldRender, isVisible };
}
