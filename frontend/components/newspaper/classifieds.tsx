"use client";

import { motion } from "framer-motion";

const classifieds = [
  { title: "WANTED", text: "Senior Rust engineer to tame memory-unsafe dragons. Galleons negotiable." },
  { title: "FOR SALE", text: "Slightly used NVIDIA H100 cluster. Reasonable offers considered by owl post." },
  { title: "LOST", text: "One production SSH key, last seen in ~/.ssh. Reward: eternal gratitude." },
  { title: "SERVICES", text: "AI model exorcism and prompt injection removal. Discretion guaranteed." },
  { title: "APPRENTICE", text: "Seeking junior dev to learn the arcane arts of kernel debugging." },
  { title: "ROOMS", text: "Server rack space available in undervalued London data cellar." },
];

export function Classifieds() {
  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title" style={{ fontSize: "0.75rem" }}>Classified Advertisements</div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {classifieds.map((ad, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.03, 0.1) }}
            className="border-b border-dotted border-[var(--border-color)]/40 pb-1 last:border-b-0"
          >
            <span className="font-sans text-[9px] font-black uppercase tracking-wider text-gold">{ad.title}</span>
            <p className="font-body text-[10px] leading-tight text-ink-soft">{ad.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}