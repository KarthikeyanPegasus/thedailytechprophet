"use client";

import { useEffect, useRef } from "react";

/**
 * DustParticles — floating dust motes, very few, slow movement,
 * opacity below 20%, only visible in brighter areas.
 * Respects prefers-reduced-motion.
 */
export function DustParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    const motes: HTMLDivElement[] = [];
    const count = 12; // Very few

    for (let i = 0; i < count; i++) {
      const mote = document.createElement("div");
      mote.className = "dust-mote";
      const size = 1.5 + Math.random() * 3;
      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.left = `${Math.random() * 100}%`;
      mote.style.top = `${Math.random() * 100}%`;
      // Opacity below 20%
      mote.style.opacity = String(0.05 + Math.random() * 0.12);

      // Slow movement — 20-40s per cycle
      const duration = 20 + Math.random() * 20;
      const delay = Math.random() * duration;
      mote.style.animation = `dust-float-${i} ${duration}s ease-in-out ${delay}s infinite alternate`;
      container.appendChild(mote);
      motes.push(mote);

      // Inject keyframes for this mote
      const styleSheet = document.styleSheets[document.styleSheets.length - 1];
      try {
        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 80;
        styleSheet.insertRule(
          `@keyframes dust-float-${i} {
            0% { transform: translate(0, 0); }
            50% { transform: translate(${dx * 0.5}px, ${dy * 0.5}px); }
            100% { transform: translate(${dx}px, ${dy}px); }
          }`,
          styleSheet.cssRules.length
        );
      } catch {}
    }

    return () => {
      motes.forEach((m) => m.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="dust-particles"
      aria-hidden="true"
      style={{
        // Only visible in brighter areas — radial mask that fades dust in dark regions
        maskImage: "radial-gradient(ellipse at center, black 0%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 90%)",
      }}
    />
  );
}