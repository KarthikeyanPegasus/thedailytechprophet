"use client";

/**
 * PaperPhysics — disabled for performance.
 *
 * The previous implementation applied a `translateY` transform to the
 * entire `<main>` element on every scroll event, which forced a full
 * subtree repaint on each frame and dominated the Paint cost in the
 * profile (404 samples, 98% of self-time).
 *
 * The current implementation returns null and does no work. Scroll
 * settle/parallax effects are removed until a cheaper implementation
 * (e.g. scroll-linked variable + individual element will-change) can be
 * safely added without re-introducing the paint cost.
 */
export function PaperPhysics() {
  return null;
}
