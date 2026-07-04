"use client";

import { motion } from "framer-motion";

export function TelescopeStars({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Star field */}
        {[...Array(30)].map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={Math.random() * 200}
            cy={Math.random() * 140}
            r={Math.random() < 0.8 ? 0.6 : 1.2}
            fill="#b8923a"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}

        {/* Distant planet */}
        <motion.circle
          cx="155"
          cy="40"
          r="12"
          fill="#1a1208"
          stroke="#b8923a"
          strokeWidth="1"
          opacity="0.6"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <ellipse cx="155" cy="40" rx="18" ry="3" fill="none" stroke="#b8923a" strokeWidth="0.5" opacity="0.4" />

        {/* Ground line */}
        <line x1="0" y1="180" x2="200" y2="180" stroke="#4a2c1a" strokeWidth="1" opacity="0.4" />

        {/* Tripod legs */}
        <line x1="100" y1="135" x2="75" y2="180" stroke="#4a2c1a" strokeWidth="2" />
        <line x1="100" y1="135" x2="125" y2="180" stroke="#4a2c1a" strokeWidth="2" />
        <line x1="100" y1="135" x2="100" y2="180" stroke="#4a2c1a" strokeWidth="2" />

        {/* Telescope tube */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 135px" }}
        >
          <rect
            x="70"
            y="60"
            width="80"
            height="20"
            rx="2"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
            transform="rotate(-20 100 135)"
          />
          <circle cx="60" cy="100" r="6" fill="#1a1208" stroke="#b8923a" strokeWidth="1.5" transform="rotate(-20 100 135)" />
          {/* Lens glow */}
          <motion.circle
            cx="60"
            cy="100"
            r="4"
            fill="#d4a847"
            transform="rotate(-20 100 135)"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.g>

        {/* Pivot joint */}
        <circle cx="100" cy="135" r="5" fill="#b8923a" opacity="0.7" />
      </svg>
    </div>
  );
}
