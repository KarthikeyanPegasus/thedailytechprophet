"use client";

/**
 * GlobalEffects — minimal.
 *
 * All previous global effects (candle-glow, paper-physics, ink-trail,
 * ink-reveal, print-noise, dust-particles) were disabled individually
 * for performance. Their `.tsx` files now return null; this component
 * remains in the tree so the layout `<RootLayout>` import still
 * resolves, but renders no DOM.
 */
export function GlobalEffects() {
  return null;
}
