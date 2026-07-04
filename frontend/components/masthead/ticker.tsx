"use client";

import { Newspaper } from "lucide-react";

export function BreakingTicker({ items }: { items?: string[] }) {
  const defaultItems = [
    "OPENAI UNVEILS GPT-5",
    "SPACEX COMPLETES ORBITAL REFUELING TEST",
    "APPLE M5 CHIP LEAKS REVEAL 40 TOPS NEURAL ENGINE",
    "RUST FOUNDATION REPORTS 40% ENTERPRISE GROWTH",
    "QUANTUM COMPUTER ACHIEVES ADVANTAGE ON LOGISTICS PROBLEM",
    "LINUX KERNEL 6.14 SHIPS EEVDF SCHEDULER",
    "NVIDIA BLACKWELL ULTRA DOUBLES HBM MEMORY",
    "GITHUB COPILOT WORKSPACE GOES GENERAL AVAILABILITY",
  ];
  const tickerItems = items || defaultItems;

  return (
    <div className="bg-ink text-parchment overflow-hidden py-2 border-b-2 border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-gold text-ink font-black uppercase text-xs tracking-wider z-10 shrink-0 border-r-2 border-ink">
          <Newspaper className="w-4 h-4" />
          <span>Breaking</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="ticker-track flex items-center gap-6 px-4 text-xs sm:text-sm uppercase tracking-[0.12em] font-sans font-bold">
            {tickerItems.map((item, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2.5" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
