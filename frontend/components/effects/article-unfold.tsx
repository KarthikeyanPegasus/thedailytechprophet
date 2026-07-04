"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * ArticleUnfold — wraps article content in a Marauder's Map-style
 * ink-seep reveal. Content fades in from a warm sepia blur, as if
 * ink is spreading across parchment. No 3D distortion, no popups.
 * Respects prefers-reduced-motion.
 */
export function ArticleUnfold({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    el.classList.add("article-unfold");

    return () => {
      el.classList.remove("article-unfold");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}