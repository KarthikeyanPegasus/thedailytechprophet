"use client";

import { motion } from "framer-motion";

export function DNASpiral({ className }: { className?: string }) {
  const rungs = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Double helix backbone */}
        <motion.path
          d="M 50 20 Q 100 60 50 100 Q 0 140 50 180"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="2"
          opacity="0.5"
          animate={{ d: [
            "M 50 20 Q 100 60 50 100 Q 0 140 50 180",
            "M 50 20 Q 0 60 50 100 Q 100 140 50 180",
            "M 50 20 Q 100 60 50 100 Q 0 140 50 180",
          ] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 150 20 Q 100 60 150 100 Q 200 140 150 180"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="2"
          opacity="0.5"
          animate={{ d: [
            "M 150 20 Q 100 60 150 100 Q 200 140 150 180",
            "M 150 20 Q 200 60 150 100 Q 100 140 150 180",
            "M 150 20 Q 100 60 150 100 Q 200 140 150 180",
          ] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Base pair rungs */}
        {rungs.map((i) => {
          const y = 20 + i * 12;
          return (
            <motion.line
              key={`rung-${i}`}
              x1="55"
              y1={y}
              x2="145"
              y2={y}
              stroke="#d4a847"
              strokeWidth="1.5"
              opacity="0.6"
              animate={{ x1: [55, 145, 55], x2: [145, 55, 145] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
            />
          );
        })}

        {/* Glowing accent dots */}
        {[2, 5, 8, 11].map((i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={i % 2 === 0 ? 50 : 150}
            cy={20 + i * 12}
            r="2"
            fill="#c97a2e"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
}
