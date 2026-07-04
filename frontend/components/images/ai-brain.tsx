"use client";

import { motion } from "framer-motion";

export function AIBrain({ className }: { className?: string }) {
  const nodes = [
    { x: 40, y: 40 }, { x: 100, y: 30 }, { x: 160, y: 40 },
    { x: 30, y: 100 }, { x: 70, y: 80 }, { x: 100, y: 100 }, { x: 130, y: 80 }, { x: 170, y: 100 },
    { x: 40, y: 160 }, { x: 100, y: 170 }, { x: 160, y: 160 },
    { x: 70, y: 130 }, { x: 130, y: 130 },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 4], [1, 4], [1, 5], [2, 6], [3, 4], [4, 5], [5, 6], [3, 7],
    [0, 3], [2, 7], [3, 8], [4, 11], [5, 12], [6, 10], [7, 10], [8, 9], [9, 10], [11, 8], [12, 10], [11, 12], [4, 12], [5, 11],
  ];

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        {/* Glow */}
        <motion.circle
          cx="100" cy="100" r="70"
          fill="#d4a847"
          opacity="0.04"
          animate={{ r: [65, 80, 65], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Connections */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={`conn-${i}`}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="#4a2c1a" strokeWidth="0.5"
            opacity="0.3"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 6 + Math.random() * 2, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}

        {/* Pulsing synapses */}
        {connections.map(([a, b], i) => (
          <motion.circle
            key={`synapse-${i}`}
            r="1.5"
            fill="#d4a847"
            animate={{
              cx: [nodes[a].x, nodes[b].x],
              cy: [nodes[a].y, nodes[b].y],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 5 + Math.random(), repeat: Infinity, delay: i * 0.08 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x} cy={node.y}
            r="4"
            fill="#1a1208"
            stroke="#b8923a" strokeWidth="1"
            animate={{ r: [3, 5, 3] }}
            transition={{ duration: 6 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
