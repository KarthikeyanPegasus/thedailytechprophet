"use client";

import { motion } from "framer-motion";
import { Star, GitFork } from "lucide-react";
import type { TrendingRepo } from "@/types";

export function TrendingReposWidget({ repos }: { repos: TrendingRepo[] }) {
  return (
    <div className="vintage-card">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2">
        Trending Repositories
      </h3>
      <div className="space-y-3">
        {repos.slice(0, 5).map((repo, i) => (
          <motion.a
            key={repo.full_name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-start justify-between gap-2 p-2 hover:bg-gold/5 transition-colors -mx-2"
          >
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-semibold text-ink truncate group-hover:text-gold transition-colors">
                {repo.full_name}
              </div>
              <div className="font-sans text-xs text-ink-faded truncate">{repo.description}</div>
            </div>
            <div className="flex flex-col items-end text-xs font-sans text-ink-faded">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold" /> {(repo.stars / 1000).toFixed(1)}k</span>
              <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-ink-faded" /> {repo.language || "—"}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
