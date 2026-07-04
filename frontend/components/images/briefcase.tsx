"use client";

import { motion } from "framer-motion";

export function Briefcase({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Briefcase handle */}
        <path
          d="M 80 60 Q 80 45, 100 45 Q 120 45, 120 60"
          fill="none"
          stroke="#4a2c1a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Briefcase body */}
        <rect
          x="40"
          y="60"
          width="120"
          height="90"
          rx="4"
          fill="#1a1208"
          stroke="#4a2c1a"
          strokeWidth="2"
        />

        {/* Briefcase highlight */}
        <rect x="40" y="60" width="120" height="90" rx="4" fill="#d4a847" opacity="0.08" />

        {/* Latch / lock */}
        <rect x="92" y="98" width="16" height="14" rx="1" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1" />
        <circle cx="100" cy="105" r="2" fill="#1a1208" />

        {/* Stitching lines */}
        <line x1="45" y1="68" x2="155" y2="68" stroke="#b8923a" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
        <line x1="45" y1="142" x2="155" y2="142" stroke="#b8923a" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />

        {/* Rising arrows (growth) */}
        {[0, 1, 2].map((i) => (
          <motion.g
            key={`arrow-${i}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: [30, -20, -20], opacity: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.8 }}
            style={{ transformOrigin: `${60 + i * 40}px 40px` }}
          >
            <path
              d={`M ${60 + i * 40} 45 L ${60 + i * 40} 25 M ${56 + i * 40} 29 L ${60 + i * 40} 25 L ${64 + i * 40} 29`}
              stroke="#d4a847"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>
        ))}

        {/* Money/coin stack on top */}
        <motion.ellipse
          cx="155"
          cy="55"
          rx="10"
          ry="3"
          fill="#b8923a"
          opacity="0.7"
          animate={{ cy: [60, 50, 60] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.ellipse
          cx="155"
          cy="50"
          rx="10"
          ry="3"
          fill="#d4a847"
          opacity="0.8"
          animate={{ cy: [55, 45, 55] }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.3 }}
        />
        <text x="155" y="52" textAnchor="middle" fill="#1a1208" fontSize="6" fontFamily="serif" fontWeight="bold">$</text>
      </svg>
    </div>
  );
}
