"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AIModelEntry } from "@/types";

export function AILeaderboardWidget({ models }: { models: AIModelEntry[] }) {
  const Trend = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-ink-faded" />;
  };

  return (
    <div className="vintage-card">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-gold" /> AI Leaderboard
      </h3>
      <div className="space-y-2">
        {models.slice(0, 5).map((model, i) => (
          <motion.div
            key={model.model}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2 hover:bg-gold/5 transition-colors -mx-2"
          >
            <span className="font-sans text-sm font-bold text-gold w-5">{model.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-semibold text-ink truncate">{model.model}</div>
              <div className="font-sans text-xs text-ink-faded">{model.org}</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-ink-faded">
              <span className="font-mono text-gold font-bold">{model.score.toFixed(1)}</span>
              <Trend trend={model.trend} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
