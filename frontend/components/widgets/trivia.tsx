"use client";

import { useState } from "react";
import type { Trivia } from "@/types";

export function TriviaWidget({ trivia }: { trivia: Trivia }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title" style={{ fontSize: "0.75rem" }}>Byte Size Trivia</div>
      <div className="font-sans text-[10px] uppercase tracking-widest text-gold mb-1">{trivia.category}</div>
      <p className="font-body text-xs text-ink-soft leading-snug mb-1.5">{trivia.question}</p>
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="text-[10px] font-sans uppercase tracking-widest text-gold hover:underline"
      >
        {showAnswer ? "Hide Answer" : "Reveal Answer"}
      </button>
      {showAnswer && (
        <div className="mt-1.5 p-1.5 bg-parchment-dark/40 dark:bg-[var(--color-dark-paper-light)] font-body text-xs text-ink-soft border border-[var(--border-color)]">
          {trivia.answer}
        </div>
      )}
    </div>
  );
}