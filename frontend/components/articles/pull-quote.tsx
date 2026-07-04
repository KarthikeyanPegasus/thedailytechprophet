"use client";

import { motion } from "framer-motion";

export function PullQuote({ quote, author }: { quote: string; author?: string }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="my-8 p-6 border-y-2 border-gold paper-texture"
    >
      <p className="font-display text-2xl italic text-ink leading-snug">“{quote}”</p>
      {author && <footer className="mt-3 font-sans text-sm uppercase tracking-widest text-ink-faded">— {author}</footer>}
    </motion.blockquote>
  );
}
