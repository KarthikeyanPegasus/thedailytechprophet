"use client";

import { motion } from "framer-motion";
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
  const doubled = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="bg-ink text-parchment overflow-hidden py-2 border-b-2 border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto flex items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-1.5 bg-gold text-ink font-black uppercase text-xs tracking-wider z-10 shrink-0 border-r-2 border-ink"
        >
          <Newspaper className="w-4 h-4" />
          <span>Breaking</span>
        </motion.div>
        <div className="overflow-hidden relative flex-1">
          <motion.div
            className="ticker-track text-xs sm:text-sm uppercase tracking-[0.12em] font-sans font-bold"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          >
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center mx-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2.5" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
