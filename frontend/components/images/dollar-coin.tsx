"use client";

import { motion } from "framer-motion";

export function DollarCoin({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="coinGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#d4a847" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#coinGlow)"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Stacked coins in background */}
        {[0, 1, 2].map((i) => (
          <motion.g
            key={i}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.2 }}
          >
            <ellipse
              cx={70 + i * 6}
              cy={140 + i * 6}
              rx="22"
              ry="6"
              fill="#4a2c1a"
              stroke="#b8923a"
              strokeWidth="1.5"
            />
            <ellipse
              cx={70 + i * 6}
              cy={136 + i * 6}
              rx="22"
              ry="6"
              fill="#b8923a"
              stroke="#d4a847"
              strokeWidth="1.5"
            />
          </motion.g>
        ))}

        {/* Main spinning coin */}
        <motion.g
          style={{ transformOrigin: "100px 100px" }}
          animate={{ scaleX: [1, 0.2, 1, 0.2, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <circle cx="100" cy="100" r="50" fill="#b8923a" />
          <circle cx="100" cy="100" r="46" fill="#d4a847" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#b8923a" strokeWidth="2" />
          {/* Dollar sign */}
          <text
            x="100"
            y="120"
            textAnchor="middle"
            fontSize="56"
            fontWeight="bold"
            fill="#1a1208"
            fontFamily="serif"
          >
            $
          </text>
        </motion.g>

        {/* Highlight on coin */}
        <motion.ellipse
          cx="85"
          cy="80"
          rx="12"
          ry="6"
          fill="#c97a2e"
          opacity="0.6"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Rising money particles */}
        {[
          { x: 50, d: 0 },
          { x: 100, d: 0.4 },
          { x: 150, d: 0.8 },
          { x: 75, d: 1.2 },
          { x: 125, d: 1.6 },
        ].map((p, i) => (
          <motion.g
            key={i}
            initial={{ y: 170, opacity: 0 }}
            animate={{ y: [170, 40], opacity: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: p.d }}
          >
            <text
              x={p.x}
              y="0"
              fontSize="14"
              fontWeight="bold"
              fill="#c97a2e"
              textAnchor="middle"
            >
              $
            </text>
          </motion.g>
        ))}

        {/* Up arrow on the right */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <path
            d="M 170 130 L 170 90 L 165 95 M 170 90 L 175 95"
            fill="none"
            stroke="#d4a847"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}
