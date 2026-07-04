"use client";

import { useEffect, useRef } from "react";

interface InkParticle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  vx: number;
  vy: number;
}

export function InkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: InkParticle[] = [];
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let moveTimer: ReturnType<typeof setTimeout>;
    let raf = 0;
    let loopActive = false;

    const startLoop = () => {
      if (loopActive) return;
      loopActive = true;
      raf = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => { isMoving = false; }, 100);

      if (particles.length < 80) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 4,
            y: e.clientY + (Math.random() - 0.5) * 4,
            life: 0,
            maxLife: 30 + Math.random() * 20,
            size: 1 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
          });
        }
      }
      startLoop();
    };

    window.addEventListener("mousemove", onMouseMove);

    // Only render while particles exist; cancels once all have decayed.
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const isDark = document.documentElement.classList.contains("dark");
      const inkColor = isDark ? "212, 168, 71" : "74, 44, 26";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = (1 - p.life / p.maxLife) * 0.3;
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const size = p.size * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${inkColor}, ${alpha})`;
        ctx.fill();
      }

      if (particles.length === 0) {
        // Nothing to draw — stop the loop until the next mousemove.
        raf = 0;
        loopActive = false;
        return;
      }

      raf = requestAnimationFrame(animate);
    };

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(moveTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-trail-canvas" aria-hidden="true" />;
}
