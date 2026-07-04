"use client";

import { motion } from "framer-motion";

export function BrainNeural({ className }: { className?: string }) {
  // Brain hemispheres outline approximated with two arcs
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Brain outline (left + right hemispheres) */}
        <path
          d="M 100 30 C 60 30, 35 55, 35 95 C 35 135, 60 170, 100 170 C 140 170, 165 135, 165 95 C 165 55, 140 30, 100 30 Z"
          fill="#1a1208"
          opacity="0.06"
          stroke="#4a2c1a"
          strokeWidth="1.5"
        />
        {/* Center divide */}
        <motion.line
          x1="100"
          y1="35"
          x2="100"
          y2="165"
          stroke="#4a2c1a"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.4"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />

        {/* Folds (curved lines suggesting brain texture) */}
        {[
          { d: "M 50 60 Q 70 70, 60 90", side: "L" },
          { d: "M 55 100 Q 75 105, 65 125", side: "L" },
          { d: "M 150 60 Q 130 70, 140 90", side: "R" },
          { d: "M 145 100 Q 125 105, 135 125", side: "R" },
        ].map((fold, i) => (
          <path
            key={`fold-${i}`}
            d={fold.d}
            fill="none"
            stroke="#4a2c1a"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Firing neurons */}
        {[
          { x: 55, y: 75, delay: 0 },
          { x: 75, y: 60, delay: 0.3 },
          { x: 70, y: 95, delay: 0.6 },
          { x: 50, y: 115, delay: 0.9 },
          { x: 85, y: 130, delay: 0.2 },
          { x: 130, y: 70, delay: 0.5 },
          { x: 145, y: 90, delay: 0.8 },
          { x: 125, y: 110, delay: 0.1 },
          { x: 140, y: 130, delay: 0.7 },
          { x: 115, y: 140, delay: 0.4 },
          { x: 100, y: 100, delay: 0.55 },
        ].map((n, i) => (
          <g key={`n-${i}`}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="3"
              fill="#d4a847"
              animate={{
                r: [2, 4, 2],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: n.delay }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="5"
              fill="none"
              stroke="#c97a2e"
              strokeWidth="0.5"
              animate={{ r: [5, 10], opacity: [0.6, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: n.delay }}
            />
          </g>
        ))}

        {/* Synaptic connections (firing signals) */}
        {[
          { x1: 55, y1: 75, x2: 75, y2: 60 },
          { x1: 75, y1: 60, x2: 100, y2: 100 },
          { x1: 100, y1: 100, x2: 130, y2: 70 },
          { x1: 130, y1: 70, x2: 145, y2: 90 },
          { x1: 50, y1: 115, x2: 70, y2: 95 },
          { x1: 70, y1: 95, x2: 100, y2: 100 },
          { x1: 100, y1: 100, x2: 125, y2: 110 },
          { x1: 125, y1: 110, x2: 140, y2: 130 },
        ].map((conn, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="#d4a847"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            opacity="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
