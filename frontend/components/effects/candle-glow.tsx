"use client";

import { useEffect, useRef } from "react";

export function CandleGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let raf = 0;
    let loopActive = false;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const startLoop = () => {
      if (loopActive) return;
      loopActive = true;
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      startLoop();
    };

    // Only animate while catching up to the cursor; cancels once settled.
    const SETTLE_THRESHOLD = 0.5;

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (
        Math.abs(targetX - currentX) < SETTLE_THRESHOLD &&
        Math.abs(targetY - currentY) < SETTLE_THRESHOLD
      ) {
        currentX = targetX;
        currentY = targetY;
        glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
        raf = 0;
        loopActive = false;
        return;
      }

      glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    // Position once on mount so the glow starts centred instead of 0,0.
    glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={glowRef} className="candle-glow" aria-hidden="true" />;
}
