"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ProgrammingLang } from "@/types";

export function LangRankingWidget({ langs }: { langs: ProgrammingLang[] }) {
  const Trend = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-ink-faded" />;
  };

  return (
    <div className="vintage-card">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2">
        Language Rankings
      </h3>
      <div className="space-y-2">
        {langs.slice(0, 8).map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-1.5 hover:bg-gold/5 transition-colors -mx-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs font-bold text-gold w-4">{lang.rank}</span>
              <span className="font-sans text-sm text-ink font-medium">{lang.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-ink-faded">
              <span className="font-mono">{lang.rating.toFixed(2)}%</span>
              <Trend trend={lang.trend} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
