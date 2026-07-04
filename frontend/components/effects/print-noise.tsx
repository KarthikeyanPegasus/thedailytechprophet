"use client";

/**
 * PrintNoise — previously a full-viewport SVG feTurbulence overlay.
 * That filter forced a full-viewport repaint on every frame and was
 * the dominant paint cost in the profile. Removed entirely.
 * Printing imperfection is now produced only by static stylesheets
 * (.print-misalign transforms, .paper-texture radial gradients).
 */
export function PrintNoise() {
  return null;
}