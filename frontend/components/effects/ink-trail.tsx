"use client";

/**
 * InkTrail — disabled for performance.
 *
 * The previous implementation attached a `mousemove` listener that drew
 * up to 80 ink particles on each move and ran a requestAnimationFrame
 * loop until particles decayed. Combined with `useInkTrail` being a
 * fixed full-viewport `<canvas>` with `opacity: 0.35` it produced
 * continuous per-frame paint work.
 *
 * The current implementation is a no-op.
 */
export function InkTrail() {
  return null;
}
