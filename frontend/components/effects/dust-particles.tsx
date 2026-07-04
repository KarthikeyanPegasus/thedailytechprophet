"use client";

/**
 * DustParticles — disabled for performance.
 *
 * The previous implementation created 12 absolutely-positioned divs
 * that translated continuously via injected `@keyframes` rules. Each
 * particle kept its own GPU layer alive, producing constant compositor
 * work even when the page was otherwise idle.
 *
 * The current implementation is a no-op.
 */
export function DustParticles() {
  return null;
}
