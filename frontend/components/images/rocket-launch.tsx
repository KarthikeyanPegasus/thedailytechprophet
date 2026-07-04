"use client";

import { motion } from "framer-motion";

export function RocketLaunch({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 200}
            cy={Math.random() * 200}
            r="1"
            fill="#b8923a"
            opacity="0.4"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 6 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Ground */}
        <rect x="0" y="270" width="200" height="30" fill="#3d2817" opacity="0.15" />

        {/* Launch pad */}
        <rect x="85" y="250" width="30" height="20" fill="#4a2c1a" opacity="0.3" />
        <line x1="80" y1="270" x2="120" y2="270" stroke="#4a2c1a" strokeWidth="2" opacity="0.3" />

        {/* Rocket */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Flame */}
          <motion.path
            d="M100 240 L92 270 L100 260 L108 270 Z"
            fill="#d4a847"
            animate={{ d: [
              "M100 240 L92 270 L100 260 L108 270 Z",
              "M100 240 L90 280 L100 258 L110 280 Z",
              "M100 240 L92 270 L100 260 L108 270 Z",
            ] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path
            d="M100 245 L95 265 L100 258 L105 265 Z"
            fill="#c97a2e"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Body */}
          <path d="M100 180 L88 210 L88 245 L112 245 L112 210 Z" fill="#e8dcc0" stroke="#4a2c1a" strokeWidth="1.5" />
          {/* Nose cone */}
          <path d="M100 160 L88 210 L112 210 Z" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1.5" />
          {/* Window */}
          <circle cx="100" cy="215" r="6" fill="#1a1208" stroke="#b8923a" strokeWidth="1" />
          <motion.circle
            cx="100" cy="215" r="4"
            fill="#d4a847"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          {/* Fins */}
          <path d="M88 235 L78 250 L88 245 Z" fill="#4a2c1a" />
          <path d="M112 235 L122 250 L112 245 Z" fill="#4a2c1a" />
        </motion.g>

        {/* Smoke particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`smoke-${i}`}
            cx={100 + (Math.random() - 0.5) * 20}
            cy={270}
            r="2"
            fill="#6b5535"
            opacity="0.2"
            animate={{
              cy: [270, 290],
              cx: [100 + (Math.random() - 0.5) * 20, 100 + (Math.random() - 0.5) * 40],
              r: [2, 6],
              opacity: [0.2, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
