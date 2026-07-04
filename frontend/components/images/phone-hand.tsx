"use client";

import { motion } from "framer-motion";

export function PhoneHand({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Phone body */}
        <rect
          x="60"
          y="20"
          width="80"
          height="150"
          rx="10"
          fill="#1a1208"
          stroke="#4a2c1a"
          strokeWidth="2"
        />
        {/* Screen */}
        <rect x="66" y="35" width="68" height="125" rx="3" fill="#e8dcc0" opacity="0.4" />

        {/* Notch / speaker */}
        <rect x="90" y="25" width="20" height="3" rx="1" fill="#4a2c1a" opacity="0.5" />

        {/* Status bar time */}
        <text x="100" y="46" textAnchor="middle" fill="#1a1208" fontSize="6" fontFamily="monospace" opacity="0.7">9:41</text>

        {/* Notification cards */}
        {[
          { y: 58, color: "#b8923a", w: 50 },
          { y: 82, color: "#d4a847", w: 40 },
          { y: 106, color: "#7a3f10", w: 55 },
        ].map((notif, i) => (
          <motion.g
            key={`notif-${i}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 1.5, repeatDelay: 4.5 }}
          >
            <rect x="70" y={notif.y} width="60" height="18" rx="2" fill="#f9f2e3" opacity="0.85" />
            <circle cx="76" cy={notif.y + 9} r="3" fill={notif.color} />
            <rect x="82" y={notif.y + 5} width={notif.w} height="2" rx="1" fill="#4a2c1a" opacity="0.6" />
            <rect x="82" y={notif.y + 10} width={notif.w - 10} height="1.5" rx="0.75" fill="#4a2c1a" opacity="0.3" />
          </motion.g>
        ))}

        {/* App dock icons at bottom */}
        {[
          { x: 72, color: "#b8923a" },
          { x: 84, color: "#d4a847" },
          { x: 96, color: "#7a3f10" },
          { x: 108, color: "#5c3a22" },
          { x: 120, color: "#a855f7" },
        ].map((app, i) => (
          <motion.rect
            key={`app-${i}`}
            x={app.x}
            y="140"
            width="8"
            height="8"
            rx="2"
            fill={app.color}
            opacity="0.7"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* Home indicator */}
        <rect x="90" y="160" width="20" height="2" rx="1" fill="#4a2c1a" opacity="0.5" />
      </svg>
    </div>
  );
}
