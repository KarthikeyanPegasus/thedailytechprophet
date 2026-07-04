"use client";

import { motion } from "framer-motion";

export function Palette({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Palette base (kidney shape approximated) */}
        <path
          d="M 50 60 Q 30 100, 50 150 Q 80 175, 130 165 Q 170 150, 170 100 Q 170 50, 130 40 Q 80 35, 50 60 Z"
          fill="#e8dcc0"
          stroke="#4a2c1a"
          strokeWidth="1.5"
        />

        {/* Thumb hole */}
        <ellipse cx="50" cy="110" rx="10" ry="12" fill="#1a1208" opacity="0.1" stroke="#4a2c1a" strokeWidth="1" />

        {/* Paint blobs */}
        {[
          { cx: 80, cy: 70, color: "#7a3f10", label: "R" },
          { cx: 110, cy: 60, color: "#d4a847", label: "Y" },
          { cx: 140, cy: 75, color: "#b8923a", label: "G" },
          { cx: 145, cy: 110, color: "#5c3a22", label: "B" },
          { cx: 125, cy: 140, color: "#a855f7", label: "P" },
          { cx: 90, cy: 145, color: "#c97a2e", label: "O" },
        ].map((blob, i) => (
          <motion.g
            key={`blob-${i}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
            style={{ transformOrigin: `${blob.cx}px ${blob.cy}px` }}
          >
            <circle cx={blob.cx} cy={blob.cy} r="10" fill={blob.color} opacity="0.85" />
            <circle cx={blob.cx - 3} cy={blob.cy - 3} r="3" fill="#f9f2e3" opacity="0.4" />
          </motion.g>
        ))}

        {/* Paint brush */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 170px" }}
        >
          <rect x="55" y="100" width="6" height="70" fill="#4a2c1a" />
          <rect x="50" y="160" width="16" height="15" fill="#b8923a" />
          <path d="M 48 175 Q 58 185, 68 175 L 65 160 L 51 160 Z" fill="#b8923a" opacity="0.7" />
          <motion.circle
            cx="58"
            cy="180"
            r="2"
            fill="#b8923a"
            animate={{ cy: [180, 190, 180], opacity: [1, 0, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.g>

        {/* Color swatches splatter */}
        {[
          { x: 30, y: 30, color: "#7a3f10" },
          { x: 175, y: 50, color: "#5c3a22" },
          { x: 180, y: 160, color: "#a855f7" },
          { x: 25, y: 170, color: "#d4a847" },
        ].map((d, i) => (
          <motion.circle
            key={`drop-${i}`}
            cx={d.x}
            cy={d.y}
            r="3"
            fill={d.color}
            opacity="0.5"
            animate={{ r: [2, 4, 2], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
}
