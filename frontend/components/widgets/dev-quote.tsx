"use client";

import type { DevQuote } from "@/types";

export function DevQuoteWidget({ quote }: { quote: DevQuote }) {
  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title" style={{ fontSize: "0.75rem" }}>The Prophet's Quill</div>
      <blockquote className="font-display text-sm italic text-ink leading-snug mb-1">
        “{quote.quote}”
      </blockquote>
      <footer className="font-sans text-[10px] uppercase tracking-widest text-ink-faded">— {quote.author}</footer>
    </div>
  );
}