"use client";

/**
 * InkReveal — disabled for performance.
 *
 * The previous implementation:
 *   1. Set up a `MutationObserver` on the entire `document.body`
 *      subtree and ran for 15 seconds after every route change.
 *   2. Attached `ink-reveal-*` CSS classes (with `filter: blur()` and
 *      `transform: scale()` animations) to EVERY matching element on the
 *      page — hundreds of elements on the home page.
 *
 * Net effect: hundreds of composited layers each frame and a permanent
 * MutationObserver firing on every DOM update.
 *
 * The current implementation is a no-op. If ink-reveal animations are
 * desired in the future they should be scoped to a small, known set of
 * elements (e.g. the masthead only) and use the Web Animations API on a
 * per-element basis — not CSS classes plus a body-wide observer.
 */
export function InkReveal() {
  return null;
}
