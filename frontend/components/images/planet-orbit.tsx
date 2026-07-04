"use client";

import { motion } from "framer-motion";

export function PlanetOrbit({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Orbit paths */}
        {[35, 55, 75, 90].map((r, i) => (
          <ellipse
            key={`orbit-${i}`}
            cx="100"
            cy="100"
            rx={r}
            ry={r * 0.6}
            fill="none"
            stroke="#4a2c1a"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.3"
          />
        ))}

        {/* Central sun */}
        <circle cx="100" cy="100" r="14" fill="#1a1208" stroke="#b8923a" strokeWidth="1.5" />
        <motion.circle
          cx="100"
          cy="100"
          r="14"
          fill="#d4a847"
          animate={{ opacity: [0.2, 0.6, 0.2], r: [13, 16, 13] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <motion.line
            key={`ray-${rot}`}
            x1="100"
            y1="100"
            x2="100"
            y2="85"
            stroke="#c97a2e"
            strokeWidth="1"
            transform={`rotate(${rot} 100 100)`}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: rot / 360 }}
          />
        ))}

        {/* Planets on orbits */}
        {[
          { r: 35, size: 3, dur: 4, color: "#b8923a" },
          { r: 55, size: 4, dur: 6, color: "#4a2c1a" },
          { r: 75, size: 5, dur: 9, color: "#d4a847" },
          { r: 90, size: 3.5, dur: 12, color: "#b8923a" },
        ].map((planet, i) => (
          <motion.g
            key={`planet-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: planet.dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle
              cx={100 + planet.r}
              cy="100"
              r={planet.size}
              fill={planet.color}
              stroke="#1a1208"
              strokeWidth="0.5"
            />
          </motion.g>
        ))}

        {/* Saturn ring on outer planet */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <ellipse
            cx={190}
            cy="100"
            rx="6"
            ry="1.5"
            fill="none"
            stroke="#b8923a"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </motion.g>
      </svg>
    </div>
  );
}
