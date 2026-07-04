"use client";

import { motion } from "framer-motion";

export function HandshakeDeal({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="dealGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#d4a847" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        {/* Background glow */}
        <motion.circle
          cx="100"
          cy="105"
          r="80"
          fill="url(#dealGlow)"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Contract / paper underlay behind hands */}
        <motion.g
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <path
            d="M 30 130 L 100 120 L 170 130 L 170 160 L 100 170 L 30 160 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <line x1="50" y1="138" x2="150" y2="138" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="50" y1="148" x2="150" y2="148" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="50" y1="158" x2="150" y2="158" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.4" />
          {/* Ribbon on contract */}
          <path d="M 100 120 L 95 110 L 105 110 Z" fill="#c97a2e" opacity="0.7" />
        </motion.g>

        {/* Opposing arrows in background */}
        <motion.g
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          {/* Left arrow pointing right */}
          <line x1="20" y1="90" x2="55" y2="90" stroke="#b8923a" strokeWidth="1.5" />
          <path d="M 55 90 L 50 86 M 55 90 L 50 94" stroke="#b8923a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Right arrow pointing left */}
          <line x1="180" y1="90" x2="145" y2="90" stroke="#b8923a" strokeWidth="1.5" />
          <path d="M 145 90 L 150 86 M 145 90 L 150 94" stroke="#b8923a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* Left arm (sleeve + hand) */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "30px 110px" }}
        >
          {/* Sleeve */}
          <path
            d="M 10 130 L 50 100 L 70 105 L 80 120 L 75 135 L 30 145 Z"
            fill="#4a2c1a"
            stroke="#b8923a"
            strokeWidth="1.5"
          />
          {/* Cuff */}
          <rect x="65" y="100" width="10" height="12" fill="#b8923a" />
          {/* Hand (palm coming in from left) */}
          <path
            d="M 70 110 Q 85 105, 100 110 Q 105 115, 100 120 Q 90 125, 80 122 Q 70 118, 70 110 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
          />
          {/* Thumb */}
          <path
            d="M 85 110 Q 90 105, 95 108 Q 95 113, 90 115 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1"
          />
        </motion.g>

        {/* Right arm (sleeve + hand) */}
        <motion.g
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "170px 110px" }}
        >
          {/* Sleeve */}
          <path
            d="M 190 130 L 150 100 L 130 105 L 120 120 L 125 135 L 170 145 Z"
            fill="#4a2c1a"
            stroke="#b8923a"
            strokeWidth="1.5"
          />
          {/* Cuff */}
          <rect x="125" y="100" width="10" height="12" fill="#b8923a" />
          {/* Hand (palm coming in from right) */}
          <path
            d="M 130 110 Q 115 105, 100 110 Q 95 115, 100 120 Q 110 125, 120 122 Q 130 118, 130 110 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1.5"
          />
          {/* Thumb */}
          <path
            d="M 115 110 Q 110 105, 105 108 Q 105 113, 110 115 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="1"
          />
        </motion.g>

        {/* Glowing handshake point at center */}
        <motion.circle
          cx="100"
          cy="115"
          r="14"
          fill="#d4a847"
          opacity="0.3"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ transformOrigin: "100px 115px" }}
        />

        <motion.circle
          cx="100"
          cy="115"
          r="8"
          fill="#c97a2e"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: "100px 115px" }}
        />

        {/* Radiating sparkle lines from center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <motion.line
            key={`spark-${rot}`}
            x1="100"
            y1="115"
            x2="100"
            y2="95"
            stroke="#d4a847"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${rot} 100 115)`}
            animate={{
              opacity: [0, 1, 0],
              x2: [100, 100],
              y2: [115, 85],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: rot / 360,
            }}
          />
        ))}

        {/* Floating dollar coin above */}
        <motion.g
          animate={{ y: [0, -5, 0], rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 60px" }}
        >
          <circle cx="100" cy="60" r="14" fill="#b8923a" />
          <circle cx="100" cy="60" r="11" fill="#d4a847" />
          <text
            x="100"
            y="66"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#1a1208"
            fontFamily="serif"
          >
            $
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
