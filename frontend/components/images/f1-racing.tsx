"use client";

import { motion } from "framer-motion";

export function F1Racing({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Track lines (perspective) */}
        <line x1="0" y1="180" x2="200" y2="180" stroke="#4a2c1a" strokeWidth="1.5" opacity="0.4" />
        <line x1="0" y1="160" x2="200" y2="160" stroke="#4a2c1a" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />

        {/* Motion speed lines behind car */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.line
            key={`speed-${i}`}
            x1="0"
            y1={125 + i * 8}
            x2="40"
            y2={125 + i * 8}
            stroke="#b8923a"
            strokeWidth="1"
            opacity="0.5"
            animate={{ x1: [-20, 60], x2: [20, 100], opacity: [0, 0.6, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}

        {/* F1 Car body */}
        <motion.g
          animate={{ x: [0, 4, 0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Main chassis */}
          <path
            d="M 50 130 L 65 120 L 135 120 L 155 125 L 160 135 L 155 145 L 130 145 L 125 150 L 75 150 L 70 145 L 50 145 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
          />
          {/* Cockpit */}
          <path d="M 85 120 L 90 110 L 120 110 L 125 120 Z" fill="#1a1208" opacity="0.4" />
          {/* Driver helmet */}
          <ellipse cx="105" cy="108" rx="8" ry="6" fill="#d4a847" />
          {/* Nose */}
          <path d="M 50 130 L 35 138 L 50 140 Z" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1" />
          {/* Rear wing */}
          <rect x="148" y="115" width="6" height="15" fill="#4a2c1a" />
          <rect x="145" y="112" width="12" height="4" fill="#4a2c1a" />
          {/* Front wing */}
          <rect x="40" y="142" width="14" height="4" fill="#4a2c1a" />
        </motion.g>

        {/* Wheels */}
        <motion.circle
          cx="60"
          cy="150"
          r="9"
          fill="#1a1208"
          stroke="#b8923a"
          strokeWidth="1.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 150px" }}
        />
        <motion.circle
          cx="140"
          cy="150"
          r="9"
          fill="#1a1208"
          stroke="#b8923a"
          strokeWidth="1.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 150px" }}
        />

        {/* Wheel spokes */}
        <line x1="60" y1="141" x2="60" y2="159" stroke="#b8923a" strokeWidth="0.5" opacity="0.6" />
        <line x1="51" y1="150" x2="69" y2="150" stroke="#b8923a" strokeWidth="0.5" opacity="0.6" />
        <line x1="140" y1="141" x2="140" y2="159" stroke="#b8923a" strokeWidth="0.5" opacity="0.6" />
        <line x1="131" y1="150" x2="149" y2="150" stroke="#b8923a" strokeWidth="0.5" opacity="0.6" />

        {/* Exhaust flame */}
        <motion.path
          d="M 155 130 L 175 128 L 175 134 L 155 138 Z"
          fill="#c97a2e"
          animate={{ opacity: [0.7, 1, 0.7], d: [
            "M 155 130 L 175 128 L 175 134 L 155 138 Z",
            "M 155 130 L 180 126 L 180 136 L 155 138 Z",
            "M 155 130 L 175 128 L 175 134 L 155 138 Z",
          ] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
