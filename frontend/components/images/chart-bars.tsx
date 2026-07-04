"use client";

import { motion } from "framer-motion";

export function ChartBars({ className }: { className?: string }) {
  const bars = [
    { x: 30, baseH: 60, target: 90, delay: 0 },
    { x: 60, baseH: 60, target: 120, delay: 0.15 },
    { x: 90, baseH: 60, target: 75, delay: 0.3 },
    { x: 120, baseH: 60, target: 140, delay: 0.45 },
    { x: 150, baseH: 60, target: 100, delay: 0.6 },
  ];

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Axes */}
        <line x1="20" y1="170" x2="180" y2="170" stroke="#4a2c1a" strokeWidth="1.5" opacity="0.5" />
        <line x1="20" y1="20" x2="20" y2="170" stroke="#4a2c1a" strokeWidth="1.5" opacity="0.5" />

        {/* Grid lines */}
        {[40, 70, 100, 130].map((y) => (
          <line
            key={`grid-${y}`}
            x1="20"
            y1={y}
            x2="180"
            y2={y}
            stroke="#4a2c1a"
            strokeWidth="0.3"
            strokeDasharray="2 3"
            opacity="0.2"
          />
        ))}

        {/* Bars */}
        {bars.map((bar, i) => (
          <g key={`bar-${i}`}>
            <motion.rect
              x={bar.x - 8}
              y={170 - bar.target}
              width="16"
              height={bar.target}
              rx="1"
              fill="#b8923a"
              opacity="0.6"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                delay: bar.delay,
                times: [0, 0.4, 0.7, 1],
              }}
              style={{ transformOrigin: `${bar.x}px 170px` }}
            />
            <motion.rect
              x={bar.x - 8}
              y={170 - bar.target}
              width="16"
              height="4"
              rx="1"
              fill="#d4a847"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, delay: bar.delay }}
            />
          </g>
        ))}

        {/* Trend line */}
        <motion.polyline
          points="30,80 60,50 90,95 120,30 150,70"
          fill="none"
          stroke="#c97a2e"
          strokeWidth="1.5"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: [200, 0, 0, 200] }}
          transition={{ duration: 7, repeat: Infinity, times: [0, 0.5, 0.8, 1] }}
        />

        {/* Trend dots */}
        {[
          { x: 30, y: 80 },
          { x: 60, y: 50 },
          { x: 90, y: 95 },
          { x: 120, y: 30 },
          { x: 150, y: 70 },
        ].map((pt, i) => (
          <motion.circle
            key={`pt-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="2.5"
            fill="#d4a847"
            stroke="#1a1208"
            strokeWidth="0.5"
            animate={{ r: [2, 3.5, 2] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
