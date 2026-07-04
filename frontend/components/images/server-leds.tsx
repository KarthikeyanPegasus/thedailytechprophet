"use client";

import { motion } from "framer-motion";

export function ServerLEDs({ className }: { className?: string }) {
  const leds = Array.from({ length: 24 }, (_, i) => ({
    x: 30 + (i % 4) * 40,
    y: 30 + Math.floor(i / 4) * 30,
    delay: Math.random() * 2,
    color: ["#b8923a", "#d4a847", "#7a3f10", "#b8923a"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Rack frame */}
        <rect x="15" y="15" width="170" height="170" rx="2" fill="none" stroke="#4a2c1a" strokeWidth="2" opacity="0.4" />
        <rect x="15" y="15" width="170" height="170" rx="2" fill="#1a1208" opacity="0.05" />

        {/* Server units */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <g key={row}>
            <rect x="20" y={22 + row * 27} width="160" height="22" rx="1" fill="none" stroke="#4a2c1a" strokeWidth="0.5" opacity="0.2" />
            {/* Vent slots */}
            {[0, 1, 2].map((i) => (
              <line key={i} x1={25 + i * 3} y1={26 + row * 27} x2={25 + i * 3} y2={40 + row * 27} stroke="#4a2c1a" strokeWidth="0.5" opacity="0.15" />
            ))}
          </g>
        ))}

        {/* LEDs */}
        {leds.map((led, i) => (
          <motion.circle
            key={i}
            cx={led.x + 80}
            cy={led.y}
            r="2"
            fill={led.color}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 5 + Math.random(), repeat: Infinity, delay: led.delay }}
          />
        ))}

        {/* Power bars */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <motion.rect
            key={`bar-${row}`}
            x="155"
            y={26 + row * 27}
            width="20"
            height="3"
            fill="#d4a847"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2 + row * 0.3, repeat: Infinity, delay: row * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
