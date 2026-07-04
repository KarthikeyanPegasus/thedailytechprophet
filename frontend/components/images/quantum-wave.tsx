"use client";

import { motion } from "framer-motion";

export function QuantumWave({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Coordinate axes */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.3" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.3" />

        {/* Wave function - sine wave */}
        <motion.path
          d="M 20 100 Q 40 60, 60 100 T 100 100 T 140 100 T 180 100"
          fill="none"
          stroke="#d4a847"
          strokeWidth="2"
          opacity="0.7"
          animate={{ d: [
            "M 20 100 Q 40 60, 60 100 T 100 100 T 140 100 T 180 100",
            "M 20 100 Q 40 140, 60 100 T 100 100 T 140 100 T 180 100",
            "M 20 100 Q 40 60, 60 100 T 100 100 T 140 100 T 180 100",
          ] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Probability cloud (smaller secondary wave) */}
        <motion.path
          d="M 20 100 Q 50 70, 80 100 T 140 100 T 180 100"
          fill="none"
          stroke="#c97a2e"
          strokeWidth="1.5"
          opacity="0.5"
          strokeDasharray="3 2"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Particle marker moving along wave */}
        <motion.circle
          r="4"
          fill="#d4a847"
          stroke="#1a1208"
          strokeWidth="1"
          animate={{
            cx: [20, 60, 100, 140, 180, 140, 100, 60, 20],
            cy: [100, 60, 100, 60, 100, 140, 100, 140, 100],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave packets (pulse markers) */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`pkt-${i}`}
            r="2"
            fill="#b8923a"
            opacity="0.6"
            animate={{
              cx: [20, 180],
              cy: [100, 100],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, delay: i * 0.75 }}
          />
        ))}

        {/* Psi symbol label */}
        <text x="100" y="190" textAnchor="middle" fill="#b8923a" fontSize="10" fontFamily="serif" opacity="0.5" fontStyle="italic">
          ψ
        </text>
      </svg>
    </div>
  );
}
