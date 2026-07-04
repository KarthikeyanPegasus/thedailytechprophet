"use client";

import { ReactNode } from "react";

interface OrnateFrameProps {
  children: ReactNode;
  caption?: string;
  className?: string;
}

export function OrnateFrame({ children, caption, className = "" }: OrnateFrameProps) {
  return (
    <div className={`relative p-2 ${className}`}>
      {/* Outer Victorian double border */}
      <div className="absolute inset-0 border-3 border-[var(--border-color)]" />
      <div className="absolute inset-[4px] border border-[var(--border-color)]/40" />

      {/* Gold corner ornaments */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-gold" />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-gold" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-gold" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-gold" />

      {/* Corner fleurons */}
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-parchment px-1 text-gold text-xs">❖</span>
      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-parchment px-1 text-gold text-xs">❖</span>

      <div className="relative bg-parchment-aged/30 dark:bg-[var(--color-dark-paper-light)]/40 overflow-hidden m-[4px]">
        {children}
        {/* Subtle film-grain / magical shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-multiply dark:mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {caption && (
        <div className="text-center mt-3 font-sans text-[10px] uppercase tracking-[0.15em] text-ink-faded italic">
          {caption}
        </div>
      )}
    </div>
  );
}
