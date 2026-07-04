"use client";

import { motion } from "framer-motion";

const markets = [
  { name: "AI Index", value: "1,248.33", change: "+2.4%" },
  { name: "S&P Tech", value: "4,802.11", change: "+1.1%" },
  { name: "Nasdaq", value: "18,450.20", change: "+0.8%" },
  { name: "BTC", value: "$68,420", change: "+1.8%" },
  { name: "ETH", value: "$3,850", change: "-0.4%" },
  { name: "SOL", value: "$178", change: "+3.2%" },
];

export function MarketPrices() {
  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title" style={{ fontSize: "0.75rem" }}>Market Prices</div>
      <div className="space-y-0">
        {markets.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.02, 0.1) }}
            className="flex items-center justify-between text-[10px] font-sans border-b border-dotted border-[var(--border-color)]/40 py-0.5 last:border-b-0"
          >
            <span className="font-bold text-ink uppercase tracking-wider">{m.name}</span>
            <div className="text-right">
              <span className="font-mono text-ink mr-1.5">{m.value}</span>
              <span className={`font-bold ${m.change.startsWith("+") ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}`}>
                {m.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}