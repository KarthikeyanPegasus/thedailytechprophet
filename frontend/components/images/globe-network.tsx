"use client";

import { motion } from "framer-motion";

export function GlobeNetwork({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Globe sphere */}
        <circle cx="100" cy="100" r="60" fill="#1a1208" opacity="0.06" stroke="#4a2c1a" strokeWidth="1.5" />

        {/* Latitude lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const ry = 12 + i * 12;
          return (
            <ellipse
              key={`lat-${i}`}
              cx="100"
              cy="100"
              rx={Math.sqrt(3600 - ry * ry)}
              ry="3"
              fill="none"
              stroke="#4a2c1a"
              strokeWidth="0.5"
              opacity="0.25"
            />
          );
        })}

        {/* Longitude lines (rotating) */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          {[0, 45, 90, 135].map((rot) => (
            <ellipse
              key={`lon-${rot}`}
              cx="100"
              cy="100"
              rx="60"
              ry="20"
              fill="none"
              stroke="#4a2c1a"
              strokeWidth="0.5"
              opacity="0.3"
              transform={`rotate(${rot} 100 100)`}
            />
          ))}
        </motion.g>

        {/* Network nodes */}
        {[
          { x: 70, y: 80 }, { x: 130, y: 75 }, { x: 75, y: 120 },
          { x: 135, y: 125 }, { x: 100, y: 65 }, { x: 105, y: 140 },
        ].map((node, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="3"
              fill="#d4a847"
              animate={{ r: [2.5, 4, 2.5], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="none"
              stroke="#d4a847"
              strokeWidth="0.5"
              animate={{ r: [6, 12], opacity: [0.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
            />
          </g>
        ))}

        {/* Connection arcs */}
        {[
          { x1: 70, y1: 80, x2: 130, y2: 75 },
          { x1: 75, y1: 120, x2: 135, y2: 125 },
          { x1: 100, y1: 65, x2: 105, y2: 140 },
        ].map((arc, i) => (
          <motion.line
            key={`arc-${i}`}
            x1={arc.x1}
            y1={arc.y1}
            x2={arc.x2}
            y2={arc.y2}
            stroke="#b8923a"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            animate={{ strokeDashoffset: [0, -10] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
            opacity="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
