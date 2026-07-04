"use client";

/**
 * CandleGlow — disabled for performance.
 *
 * The previous implementation animated a fixed 420px gradient that
 * followed the cursor with a requestAnimationFrame loop. It forced
 * full-frame compositing every frame the cursor was moving, which the
 * profile flagged as continuous Paint work.
 *
 * The current implementation is a no-op. The "candlelight" feel is
 * preserved via static dark-mode palette variables and the paper-edges
 * vignette stylesheet.
 */
export function CandleGlow() {
  return null;
}
