"use client";

/**
 * PrintNoise — a fixed, pointer-events-none overlay that adds subtle
 * printing imperfections: ink misalignment, printing noise, uneven density.
 * CSS-only, GPU-accelerated. Respects prefers-reduced-motion.
 */
export function PrintNoise() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9997] print-noise"
      aria-hidden="true"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='printNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='1' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.03'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23printNoise)'/%3E%3C/svg%3E\")",
        opacity: 0.5,
      }}
    />
  );
}