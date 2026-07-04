"use client";

import { useEffect, useRef, useState } from "react";

export function StockGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 40 }, () => 50 + Math.random() * 50);
    setPoints(initial);

    const interval = setInterval(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(100, last + (Math.random() - 0.45) * 12));
        return [...prev.slice(1), next];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(74, 44, 26, 0.1)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (h / 4) * i);
      ctx.lineTo(w, (h / 4) * i);
      ctx.stroke();
    }

    // Graph line
    const isDark = document.documentElement.classList.contains("dark");
    const lineColor = isDark ? "#d4a847" : "#4a2c1a";
    const fillColor = isDark ? "rgba(212, 168, 71, 0.08)" : "rgba(74, 44, 26, 0.08)";

    const stepX = w / (points.length - 1);
    const scaleY = h / 120;

    // Fill area
    ctx.beginPath();
    ctx.moveTo(0, h);
    points.forEach((p, i) => {
      ctx.lineTo(i * stepX, h - p * scaleY);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = i * stepX;
      const y = h - p * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Last point dot
    const lastX = (points.length - 1) * stepX;
    const lastY = h - points[points.length - 1] * scaleY;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#d4a847" : "#b8923a";
    ctx.fill();

    // Pulse ring
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? "rgba(212, 168, 71, 0.4)" : "rgba(184, 146, 58, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [points]);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
