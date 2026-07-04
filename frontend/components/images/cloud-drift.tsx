"use client";

import { motion } from "framer-motion";

export function CloudDrift({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Far clouds */}
        <motion.g
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="40" cy="50" rx="35" ry="12" fill="#b8923a" opacity="0.08" />
          <ellipse cx="45" cy="45" rx="25" ry="10" fill="#b8923a" opacity="0.06" />
        </motion.g>

        <motion.g
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="160" cy="70" rx="30" ry="10" fill="#b8923a" opacity="0.08" />
          <ellipse cx="155" cy="65" rx="22" ry="8" fill="#b8923a" opacity="0.06" />
        </motion.g>

        {/* Main cloud */}
        <motion.g
          animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="100" cy="80" rx="40" ry="15" fill="#4a2c1a" opacity="0.12" />
          <ellipse cx="90" cy="72" rx="25" ry="12" fill="#4a2c1a" opacity="0.1" />
          <ellipse cx="115" cy="72" rx="20" ry="10" fill="#4a2c1a" opacity="0.1" />
        </motion.g>

        {/* Rain/data drops */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.line
            key={i}
            x1={70 + i * 10} y1="90" x2={70 + i * 10} y2="95"
            stroke="#d4a847" strokeWidth="1" opacity="0.3"
            animate={{
              y1: [90, 120, 90],
              y2: [95, 125, 95],
              opacity: [0, 0.4, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Servers below */}
        <rect x="70" y="120" width="60" height="25" rx="2" fill="#1a1208" opacity="0.1" stroke="#4a2c1a" strokeWidth="1" />
        <motion.circle cx="80" cy="132" r="1.5" fill="#b8923a" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.circle cx="87" cy="132" r="1.5" fill="#d4a847" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 0.3 }} />
        <motion.circle cx="94" cy="132" r="1.5" fill="#b8923a" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 0.6 }} />
      </svg>
    </div>
  );
}
