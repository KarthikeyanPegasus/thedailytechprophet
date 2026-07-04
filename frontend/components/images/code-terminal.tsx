"use client";

import { motion } from "framer-motion";

export function CodeTerminal({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Terminal window frame */}
        <rect x="20" y="30" width="160" height="140" rx="4" fill="#1a1208" stroke="#4a2c1a" strokeWidth="1.5" />

        {/* Title bar */}
        <rect x="20" y="30" width="160" height="16" rx="4" fill="#4a2c1a" opacity="0.15" />
        <circle cx="30" cy="38" r="2.5" fill="#7a3f10" opacity="0.7" />
        <circle cx="40" cy="38" r="2.5" fill="#d4a847" opacity="0.7" />
        <circle cx="50" cy="38" r="2.5" fill="#b8923a" opacity="0.7" />
        <text x="100" y="41" textAnchor="middle" fill="#b8923a" fontSize="6" fontFamily="monospace" opacity="0.5">
          ~/project
        </text>

        {/* Code lines */}
        {[
          { y: 58, color: "#b8923a", w: 30, d: 0 },
          { y: 70, color: "#d4a847", w: 80, d: 0.4 },
          { y: 82, color: "#d4a847", w: 65, d: 0.6 },
          { y: 94, color: "#d4a847", w: 90, d: 0.8 },
          { y: 106, color: "#b8923a", w: 50, d: 1.0 },
          { y: 118, color: "#d4a847", w: 75, d: 1.2 },
          { y: 130, color: "#d4a847", w: 60, d: 1.4 },
          { y: 142, color: "#b8923a", w: 35, d: 1.6 },
        ].map((line, i) => (
          <motion.rect
            key={i}
            x="30"
            y={line.y}
            width={line.w}
            height="3"
            rx="1"
            fill={line.color}
            opacity="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6 + i * 0.2, repeat: Infinity, delay: line.d }}
          />
        ))}

        {/* Cursor */}
        <motion.rect
          x="30"
          y="150"
          width="6"
          height="8"
          fill="#d4a847"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <text x="42" y="156" fill="#b8923a" fontSize="5" fontFamily="monospace" opacity="0.5">$</text>
      </svg>
    </div>
  );
}
