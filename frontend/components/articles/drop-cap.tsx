"use client";

export function DropCap({ children }: { children: string }) {
  return <p className="drop-cap font-body text-lg leading-relaxed text-ink mb-4">{children}</p>;
}
