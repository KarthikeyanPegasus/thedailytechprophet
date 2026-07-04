"use client";

import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";
import type { StockTicker } from "@/types";

export function CryptoWidget({ crypto }: { crypto: StockTicker[] }) {
  return (
    <div className="vintage-card">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
        <Bitcoin className="w-5 h-5 text-gold" /> Crypto
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {crypto.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-3 border border-[var(--border-color)] hover:bg-gold/5 transition-colors"
          >
            <div className="font-sans text-sm font-bold text-ink">{coin.symbol}</div>
            <div className="font-mono text-sm text-gold">${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className={`font-sans text-xs ${coin.change_pct >= 0 ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}`}>
              {coin.change_pct >= 0 ? "+" : ""}{coin.change_pct.toFixed(2)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
