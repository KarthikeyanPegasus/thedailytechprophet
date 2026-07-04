"use client";

import { motion } from "framer-motion";

export function GraduationCap({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="gradGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#d4a847" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#gradGlow)"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Diploma scroll behind */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <rect
            x="55"
            y="115"
            width="90"
            height="55"
            rx="3"
            fill="#e8dcc0"
            stroke="#b8923a"
            strokeWidth="1.5"
          />
          <line x1="65" y1="128" x2="135" y2="128" stroke="#4a2c1a" strokeWidth="1" />
          <line x1="65" y1="138" x2="135" y2="138" stroke="#4a2c1a" strokeWidth="1" />
          <line x1="65" y1="148" x2="115" y2="148" stroke="#4a2c1a" strokeWidth="1" />
          <line x1="65" y1="158" x2="125" y2="158" stroke="#4a2c1a" strokeWidth="1" />
          {/* Ribbon seal */}
          <circle cx="135" cy="155" r="10" fill="#c97a2e" stroke="#b8923a" strokeWidth="1.5" />
          <text x="135" y="160" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1a1208">
            ★
          </text>
        </motion.g>

        {/* Mortarboard top - square diamond */}
        <motion.g
          animate={{ rotate: [-3, 3, -3], y: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          style={{ transformOrigin: "100px 95px" }}
        >
          <path
            d="M 100 75 L 160 95 L 100 115 L 40 95 Z"
            fill="#4a2c1a"
            stroke="#d4a847"
            strokeWidth="2.5"
          />
          <path
            d="M 100 80 L 152 95 L 100 110 L 48 95 Z"
            fill="#1a1208"
            stroke="#b8923a"
            strokeWidth="1"
          />
          {/* Center button */}
          <circle cx="100" cy="95" r="4" fill="#d4a847" />
        </motion.g>

        {/* Tassel string */}
        <motion.path
          d="M 100 95 Q 140 100 145 115"
          fill="none"
          stroke="#d4a847"
          strokeWidth="2"
          animate={{ d: ["M 100 95 Q 140 100 145 115", "M 100 95 Q 140 105 148 120", "M 100 95 Q 140 100 145 115"] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Tassel */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ transformOrigin: "145px 120px" }}
        >
          <line x1="145" y1="120" x2="145" y2="135" stroke="#d4a847" strokeWidth="2" />
          <circle cx="145" cy="138" r="6" fill="#c97a2e" />
          {[-3, 0, 3].map((dx, i) => (
            <line
              key={i}
              x1={145 + dx}
              y1="144"
              x2={145 + dx}
              y2="155"
              stroke="#d4a847"
              strokeWidth="1.5"
            />
          ))}
        </motion.g>

        {/* Floating knowledge symbols */}
        {[
          { x: 35, y: 60, sym: "∑", d: 0 },
          { x: 165, y: 55, sym: "π", d: 0.5 },
          { x: 30, y: 130, sym: "λ", d: 1 },
          { x: 170, y: 125, sym: "∞", d: 1.5 },
        ].map((s, i) => (
          <motion.text
            key={i}
            x={s.x}
            y={s.y}
            fontSize="20"
            fill="#b8923a"
            textAnchor="middle"
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [s.y, s.y - 8, s.y],
            }}
            transition={{ duration: 7, repeat: Infinity, delay: s.d }}
          >
            {s.sym}
          </motion.text>
        ))}

        {/* Sparkles */}
        {[
          { x: 60, y: 50, d: 0.2 },
          { x: 140, y: 45, d: 0.7 },
          { x: 50, y: 165, d: 1.2 },
          { x: 155, y: 170, d: 1.7 },
        ].map((s, i) => (
          <motion.g
            key={i}
            transform={`translate(${s.x},${s.y})`}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: s.d }}
          >
            <path
              d="M 0 -5 L 0 5 M -5 0 L 5 0"
              stroke="#d4a847"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
