"use client";

import { motion } from "framer-motion";

export function Microscope({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Base */}
        <path d="M 40 180 L 60 165 L 140 165 L 160 180 Z" fill="#1a1208" stroke="#4a2c1a" strokeWidth="1.5" />
        <rect x="70" y="160" width="60" height="8" fill="#4a2c1a" opacity="0.3" />

        {/* Stage (where the slide goes) */}
        <rect x="60" y="145" width="80" height="10" fill="#e8dcc0" stroke="#4a2c1a" strokeWidth="1" />
        <rect x="75" y="142" width="50" height="3" fill="#1a1208" opacity="0.4" />

        {/* Arm */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          {/* Body tube */}
          <rect x="92" y="50" width="16" height="60" fill="#4a2c1a" stroke="#1a1208" strokeWidth="1" />
          <rect x="95" y="55" width="10" height="3" fill="#b8923a" opacity="0.6" />
          <rect x="95" y="80" width="10" height="3" fill="#b8923a" opacity="0.6" />

          {/* Eyepiece */}
          <rect x="88" y="40" width="24" height="12" rx="2" fill="#1a1208" stroke="#4a2c1a" strokeWidth="1.5" />
          <ellipse cx="100" cy="40" rx="12" ry="3" fill="#b8923a" opacity="0.5" />

          {/* Objective lens */}
          <path d="M 88 110 L 112 110 L 105 125 L 95 125 Z" fill="#1a1208" stroke="#4a2c1a" strokeWidth="1" />

          {/* Focus knob */}
          <circle cx="120" cy="90" r="6" fill="#b8923a" opacity="0.6" />
          <circle cx="80" cy="90" r="6" fill="#b8923a" opacity="0.6" />
        </motion.g>

        {/* Light beam onto slide */}
        <motion.rect
          x="96"
          y="125"
          width="8"
          height="20"
          fill="#d4a847"
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Microscopic particles on slide */}
        {[
          { x: 85, y: 148 }, { x: 95, y: 149 }, { x: 105, y: 148 },
          { x: 115, y: 149 }, { x: 100, y: 147 },
        ].map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r="1"
            fill="#d4a847"
            animate={{ r: [0.5, 1.5, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
