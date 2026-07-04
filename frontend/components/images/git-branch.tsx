"use client";

import { motion } from "framer-motion";

export function GitBranch({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Main branch line */}
        <line x1="40" y1="100" x2="160" y2="100" stroke="#4a2c1a" strokeWidth="2" opacity="0.5" />

        {/* Branch curves */}
        <motion.path
          d="M 70 100 Q 70 50 100 50"
          fill="none"
          stroke="#b8923a"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: [200, 0, 0, 200] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.path
          d="M 70 100 Q 70 150 100 150"
          fill="none"
          stroke="#b8923a"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: [200, 0, 0, 200] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.path
          d="M 130 100 Q 130 50 160 50"
          fill="none"
          stroke="#d4a847"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: [200, 0, 0, 200] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />

        {/* Commit nodes on main branch */}
        {[
          { x: 40, y: 100 }, { x: 70, y: 100 },
          { x: 130, y: 100 }, { x: 160, y: 100 },
        ].map((node, i) => (
          <motion.circle
            key={`main-${i}`}
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#1a1208"
            stroke="#b8923a"
            strokeWidth="2"
            animate={{ r: [5, 7, 5] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Branch commit nodes */}
        {[
          { x: 100, y: 50, color: "#d4a847" },
          { x: 100, y: 150, color: "#d4a847" },
          { x: 160, y: 50, color: "#c97a2e" },
        ].map((node, i) => (
          <motion.circle
            key={`branch-${i}`}
            cx={node.x}
            cy={node.y}
            r="5"
            fill={node.color}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {/* HEAD pointer */}
        <motion.text
          x="160"
          y="40"
          textAnchor="middle"
          fill="#d4a847"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
          animate={{ y: [38, 42, 38] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ↑
        </motion.text>
      </svg>
    </div>
  );
}
