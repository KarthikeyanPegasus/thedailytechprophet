"use client";

import { motion } from "framer-motion";

export function Shield({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="shieldGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#d4a847" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        {/* Background glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#shieldGlow)"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Outer shield outline */}
        <motion.g
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <path
            d="M 100 30 L 160 50 L 160 110 Q 160 150 100 170 Q 40 150 40 110 L 40 50 Z"
            fill="#4a2c1a"
            stroke="#b8923a"
            strokeWidth="3"
          />
        </motion.g>

        {/* Inner shield */}
        <path
          d="M 100 45 L 148 60 L 148 110 Q 148 142 100 158 Q 52 142 52 110 L 52 60 Z"
          fill="#1a1208"
          stroke="#d4a847"
          strokeWidth="2"
        />

        {/* Checkmark with draw animation */}
        <motion.path
          d="M 75 100 L 92 118 L 128 82"
          fill="none"
          stroke="#c97a2e"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
        />

        {/* Sparkles */}
        {[
          { x: 60, y: 50, d: 0 },
          { x: 140, y: 55, d: 0.3 },
          { x: 145, y: 130, d: 0.6 },
          { x: 55, y: 135, d: 0.9 },
        ].map((s, i) => (
          <motion.g
            key={i}
            transform={`translate(${s.x},${s.y})`}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: s.d }}
          >
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#d4a847" strokeWidth="2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#d4a847" strokeWidth="2" />
            <circle cx="0" cy="0" r="1.5" fill="#c97a2e" />
          </motion.g>
        ))}

        {/* Decorative laurel on top */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <path
            d="M 85 38 Q 100 28 115 38"
            fill="none"
            stroke="#b8923a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="32" r="3" fill="#d4a847" />
        </motion.g>
      </svg>
    </div>
  );
}
