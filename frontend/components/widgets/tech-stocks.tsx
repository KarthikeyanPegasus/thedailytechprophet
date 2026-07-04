"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { StockTicker } from "@/types";

export function TechStocksWidget({ stocks }: { stocks: StockTicker[] }) {
  return (
    <div className="vintage-card">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2">
        Tech Stocks
      </h3>
      <div className="space-y-3">
        {stocks.map((stock, i) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-2 hover:bg-gold/5 transition-colors -mx-2"
          >
            <div>
              <div className="font-sans text-sm font-bold text-ink">{stock.symbol}</div>
              <div className="font-sans text-xs text-ink-faded">{stock.name}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm text-ink">${stock.price.toFixed(2)}</div>
              <div className={`font-sans text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}`}>
                {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.change_pct >= 0 ? "+" : ""}{stock.change_pct.toFixed(2)}%)
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
