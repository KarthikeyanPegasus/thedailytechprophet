"use client";

import { motion } from "framer-motion";

export function CPUGlow({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Outer glow */}
        <motion.circle
          cx="100" cy="100" r="80"
          fill="#d4a847"
          opacity="0.05"
          animate={{ r: [70, 85, 70], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* CPU body */}
        <rect x="60" y="60" width="80" height="80" rx="4" fill="#1a1208" stroke="#b8923a" strokeWidth="2" />

        {/* Inner die */}
        <rect x="75" y="75" width="50" height="50" rx="2" fill="#3d2817" stroke="#b8923a" strokeWidth="1" />
        <motion.rect
          x="75" y="75" width="50" height="50" rx="2"
          fill="#d4a847"
          animate={{ opacity: [0.05, 0.25, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Circuit traces */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            {/* Top */}
            <line x1={70 + i * 20} y1="60" x2={70 + i * 20} y2="45" stroke="#4a2c1a" strokeWidth="1.5" />
            <circle cx={70 + i * 20} cy="42" r="2" fill="#b8923a" />
            {/* Bottom */}
            <line x1={70 + i * 20} y1="140" x2={70 + i * 20} y2="155" stroke="#4a2c1a" strokeWidth="1.5" />
            <circle cx={70 + i * 20} cy="158" r="2" fill="#b8923a" />
            {/* Left */}
            <line x1="60" y1={70 + i * 20} x2="45" y2={70 + i * 20} stroke="#4a2c1a" strokeWidth="1.5" />
            <circle cx="42" cy={70 + i * 20} r="2" fill="#b8923a" />
            {/* Right */}
            <line x1="140" y1={70 + i * 20} x2="155" y2={70 + i * 20} stroke="#4a2c1a" strokeWidth="1.5" />
            <circle cx="158" cy={70 + i * 20} r="2" fill="#b8923a" />
          </g>
        ))}

        {/* Pulsing energy on traces */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="2"
            fill="#c97a2e"
            animate={{
              cx: [70 + i * 20, 70 + i * 20],
              cy: [60, 42],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* Center label */}
        <text x="100" y="103" textAnchor="middle" fill="#b8923a" fontSize="8" fontFamily="monospace" opacity="0.6">
          CPU
        </text>
      </svg>
    </div>
  );
}
