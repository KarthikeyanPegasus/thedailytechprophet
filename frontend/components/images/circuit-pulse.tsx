"use client";

import { motion } from "framer-motion";

export function CircuitPulse({ className }: { className?: string }) {
  const traces = [
    "M20 100 L60 100 L60 60 L100 60 L100 100 L140 100 L140 140 L180 140",
    "M20 40 L100 40 L100 80 L180 80",
    "M20 160 L60 160 L60 120 L140 120 L180 120",
    "M60 100 L60 180 L100 180 L180 180",
  ];

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* PCB background */}
        <rect x="0" y="0" width="200" height="200" fill="#1a1208" opacity="0.03" />

        {/* Traces */}
        {traces.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#4a2c1a" strokeWidth="1" opacity="0.25" />
        ))}

        {/* Pulsing energy along traces */}
        {traces.map((d, i) => (
          <motion.path
            key={`pulse-${i}`}
            d={d}
            fill="none"
            stroke="#d4a847"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
          />
        ))}

        {/* Nodes */}
        {[
          { x: 60, y: 100 }, { x: 100, y: 60 }, { x: 100, y: 100 },
          { x: 140, y: 100 }, { x: 60, y: 160 }, { x: 100, y: 180 }, { x: 140, y: 120 },
          { x: 100, y: 40 }, { x: 180, y: 80 }, { x: 20, y: 40 },
        ].map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x} cy={node.y}
            r="3"
            fill="#b8923a"
            animate={{ r: [2, 4, 2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5 + Math.random(), repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* IC chip */}
        <rect x="75" y="75" width="50" height="50" rx="2" fill="#1a1208" opacity="0.15" stroke="#4a2c1a" strokeWidth="1" />
        <text x="100" y="103" textAnchor="middle" fill="#b8923a" fontSize="6" fontFamily="monospace" opacity="0.5">IC</text>
      </svg>
    </div>
  );
}
