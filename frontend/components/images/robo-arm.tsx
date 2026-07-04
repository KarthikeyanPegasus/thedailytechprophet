"use client";

import { motion } from "framer-motion";

export function RoboArm({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Base */}
        <rect x="70" y="160" width="60" height="20" rx="2" fill="#1a1208" stroke="#4a2c1a" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`base-${i}`}
            x1={75 + i * 12}
            y1="160"
            x2={75 + i * 12}
            y2="155"
            stroke="#4a2c1a"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Lower arm joint pivot */}
        <circle cx="100" cy="160" r="6" fill="#b8923a" opacity="0.6" />

        {/* Lower arm */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 160px" }}
        >
          <rect x="92" y="100" width="16" height="65" fill="#e8dcc0" stroke="#4a2c1a" strokeWidth="1.5" />
          <line x1="92" y1="120" x2="108" y2="120" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="92" y1="140" x2="108" y2="140" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />

          {/* Upper arm joint */}
          <circle cx="100" cy="100" r="6" fill="#b8923a" opacity="0.6" />

          {/* Upper arm */}
          <motion.g
            animate={{ rotate: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <rect x="92" y="40" width="16" height="65" fill="#e8dcc0" stroke="#4a2c1a" strokeWidth="1.5" />
            <line x1="92" y1="60" x2="108" y2="60" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />
            <line x1="92" y1="80" x2="108" y2="80" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />

            {/* Wrist joint */}
            <circle cx="100" cy="40" r="5" fill="#b8923a" opacity="0.6" />

            {/* Gripper */}
            <motion.g
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ transformOrigin: "100px 40px" }}
            >
              <path d="M88 40 L88 28 L92 28 L92 40" fill="none" stroke="#4a2c1a" strokeWidth="2" />
              <path d="M112 40 L112 28 L108 28 L108 40" fill="none" stroke="#4a2c1a" strokeWidth="2" />
              {/* Gear being held */}
              <motion.circle
                cx="100"
                cy="22"
                r="5"
                fill="#d4a847"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Power indicator */}
        <motion.circle
          cx="100"
          cy="170"
          r="2"
          fill="#b8923a"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
