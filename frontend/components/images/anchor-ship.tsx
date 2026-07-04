"use client";

import { motion } from "framer-motion";

export function AnchorShip({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="anchorGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#d4a847" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        {/* Background glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#anchorGlow)"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Ripple circles from base */}
        {[
          { delay: 0 },
          { delay: 0.6 },
          { delay: 1.2 },
        ].map((r, i) => (
          <motion.circle
            key={`ripple-${i}`}
            cx="100"
            cy="175"
            r="10"
            fill="none"
            stroke="#b8923a"
            strokeWidth="1"
            strokeDasharray="2 3"
            animate={{ r: [10, 50], opacity: [0.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: r.delay }}
          />
        ))}

        {/* Sparkle particles drifting up */}
        {[
          { x: 40, y: 170, d: 0 },
          { x: 60, y: 180, d: 0.4 },
          { x: 140, y: 175, d: 0.8 },
          { x: 160, y: 185, d: 1.2 },
          { x: 30, y: 160, d: 1.6 },
          { x: 170, y: 165, d: 2.0 },
        ].map((p, i) => (
          <motion.circle
            key={`spark-${i}`}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="#d4a847"
            animate={{
              y: [p.y, p.y - 60],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, delay: p.d }}
          />
        ))}

        {/* Anchor (gently bobs) */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Top ring */}
          <circle
            cx="100"
            cy="40"
            r="8"
            fill="none"
            stroke="#e8dcc0"
            strokeWidth="3"
          />

          {/* Rope coil inside top ring */}
          <motion.circle
            cx="100"
            cy="40"
            r="3"
            fill="none"
            stroke="#d4a847"
            strokeWidth="1"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Crossbar (stock) */}
          <rect
            x="70"
            y="55"
            width="60"
            height="6"
            rx="1"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
          />
          {/* End caps on crossbar */}
          <circle cx="70" cy="58" r="4" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1" />
          <circle cx="130" cy="58" r="4" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1" />

          {/* Vertical shaft */}
          <rect
            x="96"
            y="55"
            width="8"
            height="100"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
          />

          {/* Crown band where arms meet shaft */}
          <rect
            x="92"
            y="150"
            width="16"
            height="6"
            rx="1"
            fill="#b8923a"
            stroke="#4a2c1a"
            strokeWidth="1"
          />

          {/* Left fluke (curved arm) */}
          <motion.path
            d="M 96 155 Q 70 165, 65 145 Q 70 130, 80 145"
            fill="none"
            stroke="#e8dcc0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M 96 155 Q 70 165, 65 145 Q 70 130, 80 145"
            fill="none"
            stroke="#4a2c1a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left fluke tip arrow */}
          <path d="M 80 145 L 75 138 M 80 145 L 75 152" stroke="#4a2c1a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right fluke (curved arm) */}
          <motion.path
            d="M 104 155 Q 130 165, 135 145 Q 130 130, 120 145"
            fill="none"
            stroke="#e8dcc0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            d="M 104 155 Q 130 165, 135 145 Q 130 130, 120 145"
            fill="none"
            stroke="#4a2c1a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right fluke tip arrow */}
          <path d="M 120 145 L 125 138 M 120 145 L 125 152" stroke="#4a2c1a" strokeWidth="1.5" strokeLinecap="round" />

          {/* ALN engraving on shaft */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            fill="#4a2c1a"
            fontSize="8"
            fontFamily="serif"
            fontWeight="bold"
            opacity="0.6"
          >
            ALN
          </text>
        </motion.g>

        {/* Sea floor / sand line at bottom */}
        <path
          d="M 0 185 Q 30 180 60 183 Q 90 186 120 182 Q 150 178 200 184"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
