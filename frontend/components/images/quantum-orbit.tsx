"use client";

import { motion } from "framer-motion";

export function QuantumOrbit({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Outer glow */}
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="#d4a847"
          opacity="0.05"
          animate={{ r: [45, 55, 45], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Orbit rings */}
        {[35, 50, 70].map((r, i) => (
          <ellipse
            key={`ring-${i}`}
            cx="100"
            cy="100"
            rx={r}
            ry={r * 0.4}
            fill="none"
            stroke="#4a2c1a"
            strokeWidth="0.5"
            opacity="0.3"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}

        {/* Electrons orbiting */}
        {[0, 1, 2].map((i) => (
          <motion.g
            key={`electron-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 7 + i * 0.5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px", transform: `rotate(${i * 30}deg)` }}
          >
            <circle cx={100 + [35, 50, 70][i]} cy="100" r="3" fill="#d4a847" />
            <motion.circle
              cx={100 + [35, 50, 70][i]}
              cy="100"
              r="5"
              fill="none"
              stroke="#c97a2e"
              strokeWidth="0.5"
              animate={{ r: [5, 10], opacity: [0.6, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.g>
        ))}

        {/* Nucleus */}
        <circle cx="100" cy="100" r="8" fill="#1a1208" stroke="#b8923a" strokeWidth="1.5" />
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="#d4a847"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`nuc-${i}`}
            cx="100"
            cy="100"
            r="2"
            fill="#d4a847"
            animate={{
              cx: [100, 100 + Math.cos(i * 1.5) * 4, 100],
              cy: [100, 100 + Math.sin(i * 1.5) * 4, 100],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
