"use client";

import { motion } from "framer-motion";

export function CyberLock({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Outer glow */}
        <motion.circle
          cx="100" cy="110" r="60"
          fill="#d4a847"
          opacity="0.05"
          animate={{ r: [55, 70, 55], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Shackle */}
        <path d="M75 100 L75 80 Q75 55 100 55 Q125 55 125 80 L125 100"
          fill="none" stroke="#4a2c1a" strokeWidth="4" strokeLinecap="round" />

        {/* Body */}
        <rect x="60" y="100" width="80" height="70" rx="6" fill="#1a1208" opacity="0.08" stroke="#4a2c1a" strokeWidth="2.5" />

        {/* Keyhole */}
        <circle cx="100" cy="130" r="6" fill="#1a1208" />
        <rect x="97" y="132" width="6" height="18" fill="#1a1208" />

        {/* Glowing aura */}
        <motion.circle
          cx="100" cy="130" r="12"
          fill="none"
          stroke="#d4a847"
          strokeWidth="1"
          animate={{ r: [10, 25], opacity: [0.6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle
          cx="100" cy="130" r="12"
          fill="none"
          stroke="#c97a2e"
          strokeWidth="1"
          animate={{ r: [10, 25], opacity: [0.4, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1, ease: "easeOut" }}
        />

        {/* Binary particles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.text
            key={i}
            x={50 + i * 20}
            y={20 + Math.random() * 10}
            fill="#b8923a"
            fontSize="8"
            fontFamily="monospace"
            opacity="0.3"
            animate={{ y: [15, 180], opacity: [0, 0.3, 0] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.7 }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </motion.text>
        ))}
      </svg>
    </div>
  );
}
