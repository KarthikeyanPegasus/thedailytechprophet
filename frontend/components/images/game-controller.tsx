"use client";

import { motion } from "framer-motion";

export function GameController({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Controller body */}
        <path
          d="M 50 80 Q 40 60, 60 55 L 140 55 Q 160 60, 150 80 L 155 130 Q 155 150, 135 145 L 120 130 L 80 130 L 65 145 Q 45 150, 45 130 Z"
          fill="#1a1208"
          stroke="#4a2c1a"
          strokeWidth="1.5"
        />

        {/* D-pad */}
        <rect x="55" y="85" width="8" height="20" fill="#4a2c1a" />
        <rect x="49" y="91" width="20" height="8" fill="#4a2c1a" />

        {/* Action buttons (ABXY style) */}
        <circle cx="140" cy="80" r="5" fill="#b8923a" />
        <circle cx="152" cy="92" r="5" fill="#7a3f10" />
        <circle cx="128" cy="92" r="5" fill="#5c3a22" />
        <circle cx="140" cy="104" r="5" fill="#d4a847" />

        {/* Center buttons */}
        <circle cx="92" cy="75" r="3" fill="#b8923a" opacity="0.6" />
        <circle cx="100" cy="75" r="3" fill="#b8923a" opacity="0.6" />

        {/* Sticks (analogs) */}
        <motion.g
          animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="75" cy="115" r="6" fill="#4a2c1a" />
          <circle cx="75" cy="115" r="3" fill="#b8923a" opacity="0.6" />
        </motion.g>
        <motion.g
          animate={{ x: [2, -2, 2], y: [1, -1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="120" cy="115" r="6" fill="#4a2c1a" />
          <circle cx="120" cy="115" r="3" fill="#b8923a" opacity="0.6" />
        </motion.g>

        {/* Pulsing button press indicators */}
        {[
          { x: 140, y: 80, color: "#b8923a" },
          { x: 152, y: 92, color: "#7a3f10" },
          { x: 128, y: 92, color: "#5c3a22" },
          { x: 140, y: 104, color: "#d4a847" },
        ].map((btn, i) => (
          <motion.circle
            key={`press-${i}`}
            cx={btn.x}
            cy={btn.y}
            r="5"
            fill={btn.color}
            animate={{ r: [5, 9], opacity: [0.6, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Sparkle accents */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`spark-${i}`}
            cx={30 + i * 70}
            cy={30 + (i % 2) * 20}
            r="1.5"
            fill="#d4a847"
            animate={{ opacity: [0, 1, 0], r: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </svg>
    </div>
  );
}
