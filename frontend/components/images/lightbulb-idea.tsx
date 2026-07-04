"use client";

import { motion } from "framer-motion";

export function LightbulbIdea({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="bulbGlow" cx="0.5" cy="0.4" r="0.5">
            <stop offset="0%" stopColor="#c97a2e" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#d4a847" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill="#1a1208" />

        {/* Big background glow */}
        <motion.circle
          cx="100"
          cy="80"
          r="100"
          fill="url(#bulbGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Radiating light rays in 8 directions */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <motion.line
            key={`ray-${rot}`}
            x1="100"
            y1="80"
            x2="100"
            y2="55"
            stroke="#c97a2e"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${rot} 100 80)`}
            animate={{
              opacity: [0.3, 1, 0.3],
              x2: [100, 100],
              y2: [80, 50],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: rot / 360,
            }}
          />
        ))}

        {/* Sparkles around the bulb */}
        {[
          { x: 40, y: 40, d: 0 },
          { x: 160, y: 40, d: 0.3 },
          { x: 30, y: 90, d: 0.6 },
          { x: 170, y: 90, d: 0.9 },
          { x: 50, y: 20, d: 1.2 },
          { x: 150, y: 20, d: 1.5 },
        ].map((s, i) => (
          <motion.g
            key={`spark-${i}`}
            transform={`translate(${s.x},${s.y})`}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: s.d }}
          >
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#d4a847" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#d4a847" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="1.5" fill="#c97a2e" />
          </motion.g>
        ))}

        {/* Bulb glass */}
        <motion.g
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 75px" }}
        >
          <path
            d="M 100 25 C 75 25, 60 45, 60 70 C 60 90, 75 100, 80 110 L 120 110 C 125 100, 140 90, 140 70 C 140 45, 125 25, 100 25 Z"
            fill="#e8dcc0"
            stroke="#4a2c1a"
            strokeWidth="2"
          />

          {/* Glass highlight */}
          <ellipse
            cx="85"
            cy="55"
            rx="6"
            ry="12"
            fill="#f9f2e3"
            opacity="0.4"
          />

          {/* Inner glow / filament background */}
          <motion.circle
            cx="100"
            cy="70"
            r="20"
            fill="#c97a2e"
            opacity="0.3"
            animate={{ opacity: [0.2, 0.5, 0.2], r: [18, 22, 18] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Filament zigzag */}
          <motion.path
            d="M 85 70 L 90 60 L 95 80 L 100 60 L 105 80 L 110 60 L 115 70"
            fill="none"
            stroke="#c97a2e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Filament wire supports */}
          <line x1="85" y1="70" x2="80" y2="100" stroke="#4a2c1a" strokeWidth="1" />
          <line x1="115" y1="70" x2="120" y2="100" stroke="#4a2c1a" strokeWidth="1" />

          {/* Small rotating gear inside bulb */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 85px" }}
          >
            <circle cx="100" cy="85" r="6" fill="none" stroke="#d4a847" strokeWidth="1.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2;
              const x1 = 100 + Math.cos(angle) * 6;
              const y1 = 85 + Math.sin(angle) * 6;
              const x2 = 100 + Math.cos(angle) * 9;
              const y2 = 85 + Math.sin(angle) * 9;
              return (
                <line
                  key={`tooth-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#d4a847"
                  strokeWidth="1.5"
                />
              );
            })}
          </motion.g>
        </motion.g>

        {/* Threaded base (screw cap) */}
        <rect x="82" y="110" width="36" height="8" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1.5" />
        <rect x="84" y="118" width="32" height="3" fill="#4a2c1a" opacity="0.6" />
        <rect x="82" y="121" width="36" height="6" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1.5" />
        <rect x="84" y="127" width="32" height="3" fill="#4a2c1a" opacity="0.6" />
        <rect x="82" y="130" width="36" height="6" fill="#b8923a" stroke="#4a2c1a" strokeWidth="1.5" />

        {/* Contact tip at bottom */}
        <path
          d="M 88 136 L 88 148 Q 88 152, 100 152 Q 112 152, 112 148 L 112 136 Z"
          fill="#4a2c1a"
          stroke="#1a1208"
          strokeWidth="1.5"
        />

        {/* Floating idea symbols around the bulb */}
        {[
          { x: 35, y: 130, sym: "!", d: 0 },
          { x: 165, y: 130, sym: "?", d: 0.5 },
          { x: 25, y: 70, sym: "★", d: 1 },
          { x: 175, y: 70, sym: "★", d: 1.5 },
        ].map((s, i) => (
          <motion.text
            key={`idea-${i}`}
            x={s.x}
            y={s.y}
            fontSize="14"
            fill="#b8923a"
            textAnchor="middle"
            opacity="0.6"
            animate={{
              y: [s.y, s.y - 8, s.y],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: s.d }}
          >
            {s.sym}
          </motion.text>
        ))}
      </svg>
    </div>
  );
}
