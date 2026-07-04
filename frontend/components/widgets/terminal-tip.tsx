"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import type { TerminalTip } from "@/types";

export function TerminalTipWidget({ tip }: { tip: TerminalTip }) {
  return (
    <div className="vintage-card bg-ink/5 dark:bg-[var(--color-dark-paper-light)]">
      <h3 className="font-display text-xl font-bold text-ink mb-4 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-gold" /> Terminal Tip
      </h3>
      <div className="p-3 bg-ink dark:bg-black font-mono text-xs sm:text-sm text-gold rounded-sm mb-3 overflow-x-auto">
        $ {tip.command}
      </div>
      <p className="font-body text-sm text-ink-soft leading-relaxed">{tip.description}</p>
      <div className="mt-2 font-sans text-[10px] uppercase tracking-widest text-ink-faded">{tip.platform}</div>
    </div>
  );
}
