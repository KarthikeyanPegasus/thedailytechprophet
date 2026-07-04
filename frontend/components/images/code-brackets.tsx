"use client";

import { motion } from "framer-motion";

export function CodeBrackets({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Left bracket */}
        <motion.path
          d="M 70 50 L 40 100 L 70 150"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ x: [-5, 0, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Right bracket */}
        <motion.path
          d="M 130 50 L 160 100 L 130 150"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ x: [5, 0, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Slash through center */}
        <motion.line
          x1="90"
          y1="60"
          x2="110"
          y2="140"
          stroke="#d4a847"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Floating code symbols */}
        {[
          { x: 50, y: 30, char: "{", delay: 0 },
          { x: 150, y: 30, char: "}", delay: 0.4 },
          { x: 40, y: 170, char: "(", delay: 0.8 },
          { x: 160, y: 170, char: ")", delay: 1.2 },
        ].map((sym, i) => (
          <motion.text
            key={`sym-${i}`}
            x={sym.x}
            y={sym.y}
            textAnchor="middle"
            fill="#b8923a"
            fontSize="14"
            fontFamily="monospace"
            opacity="0.5"
            animate={{ y: [sym.y, sym.y - 5, sym.y], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: sym.delay }}
          >
            {sym.char}
          </motion.text>
        ))}

        {/* Sparkles around brackets */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = 100 + Math.cos(angle) * 60;
          const y = 100 + Math.sin(angle) * 60;
          return (
            <motion.circle
              key={`spark-${i}`}
              cx={x}
              cy={y}
              r="1.5"
              fill="#d4a847"
              animate={{ opacity: [0, 1, 0], r: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.33 }}
            />
          );
        })}
      </svg>
    </div>
  );
}
