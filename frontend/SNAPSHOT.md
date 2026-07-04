# Snapshot of selected files

## `frontend/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* === NEWSPAPER TYPOGRAPHY === */
  --font-display: "Playfair Display", Georgia, "Times New Roman", serif;
  --font-headline: "UnifrakturCook", "Playfair Display", Georgia, serif;
  --font-body: "EB Garamond", Georgia, "Times New Roman", serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;
  --font-old: "Old Standard TT", Georgia, serif;

  /* === AGED NEWSPAPER PALETTE === */
  --color-parchment: #f3e9d0;
  --color-parchment-light: #f9f2e3;
  --color-parchment-dark: #e6d8b6;
  --color-parchment-aged: #dcc9a6;
  --color-ink: #150f0a;
  --color-ink-soft: #3a2a1a;
  --color-ink-faded: #6b5643;
  --color-gold: #a67c2e;
  --color-gold-bright: #c9a03f;
  --color-gold-deep: #7a5a1c;
  --color-brown-deep: #3d2412;
  --color-brown: #5c3a22;
  --color-brown-light: #8b6b4a;
  --color-rust: #7a3f10;
  --color-sepia: #6b4423;
  --color-cream: #fbf6eb;
  --color-border-ink: #2a1c10;
  --color-candle: #ff9a35;

  /* === DARK MODE (CANDLELIGHT) === */
  --color-dark-paper: #23180c;
  --color-dark-paper-light: #332414;
  --color-dark-ink: #f0ddbc;
  --color-dark-ink-soft: #c9b18a;
  --color-dark-gold: #d4a84a;
  --color-dark-candle-glow: #ffb84d;
}

:root {
  --background: var(--color-parchment);
  --foreground: var(--color-ink);
  --paper-bg: var(--color-parchment);
  --paper-text: var(--color-ink);
  --accent: var(--color-gold);
  --border-color: var(--color-brown);
}

.dark {
  --background: var(--color-dark-paper);
  --foreground: var(--color-dark-ink);
  --paper-bg: var(--color-dark-paper);
  --paper-text: var(--color-dark-ink);
  --accent: var(--color-dark-gold);
  --border-color: var(--color-dark-ink-soft);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  overflow-x: hidden;
}

/* === AUTHENTIC AGED PAPER TEXTURE === */
.paper-texture {
  background-color: var(--paper-bg);
  background-image:
    /* Top-left light aging */
    radial-gradient(ellipse at 15% 10%, rgba(120, 90, 40, 0.08) 0%, transparent 45%),
    /* Bottom-right aging */
    radial-gradient(ellipse at 85% 90%, rgba(100, 70, 35, 0.07) 0%, transparent 50%),
    /* Center warmth */
    radial-gradient(ellipse at 50% 50%, rgba(200, 170, 100, 0.03) 0%, transparent 70%),
    /* Paper grain noise */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.dark .paper-texture {
  background-color: var(--color-dark-paper);
  background-image:
    radial-gradient(ellipse at 20% 20%, rgba(255, 168, 64, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(212, 168, 71, 0.03) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* === PAPER EDGES / VIGNETTE === */
.paper-edges {
  box-shadow:
    inset 0 0 120px rgba(80, 50, 20, 0.08),
    inset 0 0 220px rgba(100, 70, 30, 0.04);
}

.dark .paper-edges {
  box-shadow:
    inset 0 0 140px rgba(0, 0, 0, 0.6),
    inset 0 0 240px rgba(255, 168, 64, 0.03);
}

/* === NEWSPAPER COLUMNS === */
.news-columns {
  column-count: 3;
  column-gap: 2rem;
  column-rule: 1px solid var(--border-color);
  text-align: justify;
  hyphens: auto;
}

.news-columns-2 {
  column-count: 2;
  column-gap: 2rem;
  column-rule: 1px solid var(--border-color);
  text-align: justify;
  hyphens: auto;
}

.news-columns-3 {
  column-count: 3;
  column-gap: 1.5rem;
  column-rule: 1px solid var(--border-color);
  text-align: justify;
  hyphens: auto;
}

@media (max-width: 1024px) {
  .news-columns { column-count: 2; }
  .news-columns-3 { column-count: 2; }
}

@media (max-width: 768px) {
  .news-columns,
  .news-columns-2,
  .news-columns-3 { column-count: 1; }
}

/* === DROP CAP === */
.drop-cap::first-letter {
  float: left;
  font-family: var(--font-display);
  font-size: 5rem;
  line-height: 0.85;
  padding-right: 0.08em;
  padding-top: 0.08em;
  color: var(--color-brown-deep);
  font-weight: 900;
  text-shadow: 2px 1px 0 rgba(0,0,0,0.1);
}

.dark .drop-cap::first-letter {
  color: var(--color-dark-gold);
  text-shadow: 2px 1px 0 rgba(255, 168, 64, 0.15);
}

/* === ORNAMENTAL DIVIDER === */
.ornament-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2.5rem 0;
}

.ornament-divider::before,
.ornament-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color) 20%, var(--border-color) 80%, transparent);
}

/* === VICTORIAN BORDERS === */
.victorian-border {
  border: 3px double var(--border-color);
  position: relative;
}

.victorian-border::before {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid var(--border-color);
  opacity: 0.35;
  pointer-events: none;
}

.ink-border {
  border: 1px solid var(--border-color);
  box-shadow: 2px 2px 0 0 rgba(74, 44, 26, 0.15);
}

.dark .ink-border {
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.4);
}

/* === HEADLINE STYLES === */
.headline-masthead {
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 0.88;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.08);
}

.headline-article {
  font-family: var(--font-display);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.headline-section {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Blackletter masthead variant */
.headline-gothic {
  font-family: var(--font-headline);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 0.9;
}

/* === INK LINKS === */
.ink-link {
  position: relative;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  transition: color 0.2s ease;
}

.ink-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 1px;
  background: var(--color-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.ink-link:hover::after {
  transform: scaleX(1);
}

/* === VINTAGE CARD === */
.vintage-card {
  background: var(--paper-bg);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.vintage-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(180, 150, 90, 0.04), transparent 60%);
  pointer-events: none;
}

.vintage-card:hover {
  transform: translateY(-3px) rotate(0.3deg);
  box-shadow: 0 6px 20px rgba(74, 44, 26, 0.12);
}

.dark .vintage-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 18px rgba(255, 168, 64, 0.06);
}

/* === CANDLE GLOW === */
.candle-glow {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 169, 64, 0.07) 0%, transparent 70%);
  transition: opacity 0.3s ease;
}

.dark .candle-glow {
  background: radial-gradient(circle, rgba(255, 184, 77, 0.11) 0%, transparent 60%);
}

/* === INK TRAIL === */
.ink-trail-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.35;
}

/* === DUST PARTICLES === */
.dust-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dust-mote {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 168, 71, 0.55), transparent);
  pointer-events: none;
}

.dark .dust-mote {
  background: radial-gradient(circle, rgba(255, 184, 77, 0.45), transparent);
}

/* === SCROLLBAR === */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--paper-bg); }
::-webkit-scrollbar-thumb {
  background: var(--color-brown);
  border-radius: 0;
  border: 2px solid var(--paper-bg);
}
::-webkit-scrollbar-thumb:hover { background: var(--color-brown-deep); }

/* === PRINT MODE === */
@media print {
  .dust-particles, .candle-glow, .ink-trail-canvas { display: none !important; }
  body { background: white !important; color: black !important; }
  .paper-texture { background: white !important; }
  .no-print { display: none !important; }
}

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === TICKER === */
@keyframes ticker-scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.ticker-track {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker-scroll 80s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
}

/* === SELECTION === */
::selection {
  background: var(--color-gold);
  color: var(--color-ink);
}

.dark ::selection {
  background: var(--color-dark-gold);
  color: var(--color-dark-paper);
}

/* === UTILITY === */
.text-gold { color: var(--color-gold); }
.text-sepia { color: var(--color-sepia); }
.text-ink { color: var(--color-ink); }
.text-ink-soft { color: var(--color-ink-soft); }
.text-ink-faded { color: var(--color-ink-faded); }
.text-brown { color: var(--color-brown); }
.bg-ink { background-color: var(--color-ink); }
.bg-gold { background-color: var(--color-gold); }
.bg-parchment { background-color: var(--color-parchment); }
.border-ink { border-color: var(--border-color); }
.font-display { font-family: var(--font-display); }
.font-headline { font-family: var(--font-headline); }
.font-body { font-family: var(--font-body); }

.dark .text-gold { color: var(--color-dark-gold); }
.dark .text-ink { color: var(--color-dark-ink); }
.dark .text-ink-soft { color: var(--color-dark-ink-soft); }

/* === NEWSPAPER EXTRAS === */
.newspaper-rule {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--border-color) 0, var(--border-color) 1px, transparent 1px, transparent 6px);
  opacity: 0.4;
}

.newspaper-label {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  padding: 0.15rem 0.4rem;
  display: inline-block;
}

.newspaper-stamp {
  font-family: var(--font-headline);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-rust);
  border: 2px solid var(--color-rust);
  padding: 0.15rem 0.5rem;
  transform: rotate(-2deg);
  display: inline-block;
}

/* === AUTHENTIC DAILY PROPHET EXTRAS === */

/* Footer masthead silhouette — large outlined "The Daily Tech Prophet" wordmark
   sitting behind the footer content as a decorative background. */
.footer-silhouette {
  isolation: isolate;
}
.footer-silhouette-text {
  color: transparent;
  -webkit-text-stroke: 1px rgba(62, 39, 22, 0.12);
  text-stroke: 1px rgba(62, 39, 22, 0.12);
  letter-spacing: -0.02em;
  transform: translateY(2%);
  user-select: none;
  opacity: 0.7;
  mix-blend-mode: multiply;
}
.dark .footer-silhouette-text {
  -webkit-text-stroke: 1px rgba(230, 220, 200, 0.07);
  text-stroke: 1px rgba(230, 220, 200, 0.07);
  mix-blend-mode: screen;
  opacity: 0.6;
}

/* Paper fold / crease running down the page */
.paper-crease {
  position: relative;
}
.paper-crease::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(62, 39, 22, 0.08) 10%,
    rgba(62, 39, 22, 0.15) 45%,
    rgba(62, 39, 22, 0.08) 90%,
    transparent
  );
  box-shadow: 0 0 6px rgba(62, 39, 22, 0.08);
  pointer-events: none;
  z-index: 1;
}
.dark .paper-crease::after {
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 0, 0, 0.35) 10%,
    rgba(0, 0, 0, 0.55) 45%,
    rgba(0, 0, 0, 0.35) 90%,
    transparent
  );
}

/* Subtle horizontal fold lines */
.fold-line {
  position: relative;
}
.fold-line::before {
  content: "";
  position: absolute;
  left: 5%;
  right: 5%;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(62, 39, 22, 0.1), transparent);
  box-shadow: 0 1px 2px rgba(62, 39, 22, 0.05);
  pointer-events: none;
}
.dark .fold-line::before {
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.35), transparent);
}

/* Torn / feathered paper edge */
.torn-edge {
  position: relative;
}
.torn-edge::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 20' preserveAspectRatio='none'%3E%3Cpath d='M0,0 Q15,8 30,3 T60,5 T90,2 T120,6 T150,4 T180,7 T210,3 T240,5 T270,2 T300,6 T330,4 T360,7 T390,3 T420,5 T450,2 T480,6 T510,4 T540,7 T570,3 T600,5 T630,2 T660,6 T690,4 T720,7 T750,3 T780,5 T810,2 T840,6 T870,4 T900,7 T930,3 T960,5 T990,2 T1020,6 T1050,4 T1080,7 T1110,3 T1140,5 T1170,2 T1200,6 L1200,20 L0,20 Z' fill='%23dcc9a6' opacity='0.85'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: 0.7;
  pointer-events: none;
}

/* Page corner curl */
.corner-curl {
  position: relative;
  background: var(--paper-bg);
}
.corner-curl::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, transparent 50%, rgba(62, 39, 22, 0.18) 50%, rgba(62, 39, 22, 0.35));
  border-top-left-radius: 8px;
  box-shadow: -2px -2px 4px rgba(62, 39, 22, 0.08);
  pointer-events: none;
}
.dark .corner-curl::after {
  background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.7));
}

/* Page number footnote style */
.page-marker {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-ink-faded);
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
  display: block;
}
.dark .page-marker {
  color: var(--color-dark-ink-soft);
}

/* Continued on page marker */
.continued-marker {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-gold);
  text-align: right;
  margin-top: 0.5rem;
}
.continued-marker::before {
  content: "✦ ";
  color: var(--color-ink-faded);
}

/* Handwritten marginal note */
.marginalia {
  font-family: var(--font-old);
  font-style: italic;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--color-rust);
  border-left: 2px solid var(--color-rust);
  padding-left: 0.75rem;
  position: relative;
}
.marginalia::before {
  content: "✍";
  position: absolute;
  left: -1.25rem;
  top: -0.1rem;
  font-size: 0.9rem;
  opacity: 0.6;
}
.dark .marginalia {
  color: var(--color-dark-gold);
  border-left-color: var(--color-dark-gold);
}

/* Pull quote like a reporter's note pinned to the page */
.pull-quote {
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.25;
  font-weight: 700;
  text-align: center;
  color: var(--color-brown-deep);
  padding: 1rem 1.25rem;
  border-top: 3px double var(--border-color);
  border-bottom: 3px double var(--border-color);
  margin: 1.25rem 0;
  position: relative;
}
.pull-quote::before,
.pull-quote::after {
  content: "❧";
  position: absolute;
  font-size: 0.8rem;
  color: var(--color-gold);
}
.pull-quote::before {
  top: -0.65rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--paper-bg);
  padding: 0 0.5rem;
}
.pull-quote::after {
  bottom: -0.65rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--paper-bg);
  padding: 0 0.5rem;
}
.dark .pull-quote {
  color: var(--color-dark-ink);
}

/* Dateline style */
.dateline {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-ink-faded);
}
.dateline strong {
  color: var(--color-ink);
}

/* Moving picture label */
.moving-picture-label {
  font-family: var(--font-headline);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-rust);
}

/* Ink splatter decoration */
.ink-splatter {
  position: absolute;
  width: 120px;
  height: 120px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23150f0a' opacity='0.08' d='M50,10 C55,15 48,22 52,28 C58,32 65,25 68,32 C70,38 62,42 65,48 C70,52 78,48 80,55 C81,62 72,63 74,70 C76,77 65,78 62,72 C58,78 50,75 46,80 C42,86 35,82 34,75 C28,78 22,72 25,66 C18,65 16,58 22,54 C17,50 18,42 25,40 C22,34 28,28 34,30 C35,23 44,22 46,28 C48,22 47,14 50,10 Z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
  opacity: 0.6;
}
.dark .ink-splatter {
  opacity: 0.25;
  filter: invert(1);
}

/* Newspaper column gap fix */
.newspaper-flow {
  column-rule: 1px solid var(--border-color);
}
.newspaper-flow > * {
  break-inside: avoid;
}

/* Authentically uneven columns for front page */
.front-page-spread {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 1024px) {
  .front-page-spread {
    grid-template-columns: 2fr 1fr;
    gap: 2.5rem;
  }
  .front-page-spread .main-column {
    column-count: 3;
    column-gap: 1.75rem;
    column-rule: 1px solid var(--border-color);
  }
  .front-page-spread .side-column {
    column-count: 1;
  }
}
@media (min-width: 1280px) {
  .front-page-spread .main-column {
    column-count: 4;
  }
}

/* Article size variants */
.story-span-2 {
  column-span: all;
}
.story-large h3 {
  font-size: 1.65rem;
  line-height: 1;
}
.story-small h3 {
  font-size: 1.05rem;
}
.story-tiny {
  font-size: 0.9rem;
}
.story-tiny h3 {
  font-size: 0.95rem;
}

/* Victorian corner ornaments */
.corner-ornament {
  position: relative;
}
.corner-ornament::before,
.corner-ornament::after {
  content: "❖";
  position: absolute;
  top: -0.65rem;
  font-size: 0.75rem;
  color: var(--color-gold);
}
.corner-ornament::before { left: -0.25rem; }
.corner-ornament::after { right: -0.25rem; }
```

## `frontend/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Playfair_Display, EB_Garamond, Inter, JetBrains_Mono, UnifrakturCook, Old_Standard_TT } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GlobalEffects } from "@/components/effects/global-effects";
import { KeyboardShortcuts } from "@/components/keyboard/keyboard-shortcuts";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const unifraktur = UnifrakturCook({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const oldStandard = Old_Standard_TT({
  variable: "--font-old-standard",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Daily Tech Prophet | All the Tech That's Fit to Print",
  description: "An immersive, cinematic technology newspaper. AI, programming, cybersecurity, space, and engineering news with a magical Victorian twist.",
  keywords: ["technology news", "AI", "programming", "cybersecurity", "space", "engineering", "startups", "open source"],
  authors: [{ name: "The Daily Tech Prophet" }],
  openGraph: {
    title: "The Daily Tech Prophet",
    description: "All the Tech That's Fit to Print",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Tech Prophet",
    description: "All the Tech That's Fit to Print",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#a67c2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${garamond.variable} ${inter.variable} ${jetbrains.variable} ${unifraktur.variable} ${oldStandard.variable}`}
      suppressHydrationWarning
    >
      <body className="paper-texture paper-edges min-h-screen font-body antialiased">
        <ThemeProvider>
          <GlobalEffects />
          <KeyboardShortcuts />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## `frontend/app/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FrontPageHero } from "@/components/newspaper/front-page-hero";
import { NewspaperSection } from "@/components/newspaper/newspaper-section";
import { SectionDivider } from "@/components/newspaper/section-divider";
import { EditorialBox } from "@/components/newspaper/editorial-box";
import { MarketPrices } from "@/components/newspaper/market-prices";
import { WeatherWidget } from "@/components/widgets/weather";
import { DevQuoteWidget } from "@/components/widgets/dev-quote";
import { TriviaWidget } from "@/components/widgets/trivia";
import { SideNotes } from "@/components/newspaper/side-notes";
import { fetchNews, fetchWidgets, type Article, type WidgetsResponse } from "@/lib/api";
import { useLocation } from "@/hooks/use-location";
import { useArticleDate, formatDateLabel } from "@/hooks/use-article-date";

export default function HomePage() {
  const location = useLocation();
  const { date: selectedDate } = useArticleDate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [widgets, setWidgets] = useState<WidgetsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchNews({
        category: "",
        page: 1,
        pageSize: 28,
        region: location.region,
        timezone: location.timezone,
        date: selectedDate ?? undefined,
      }),
      fetchWidgets(),
    ])
      .then(([newsData, widgetsData]) => {
        setArticles(newsData.articles);
        setWidgets(widgetsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location.region, location.timezone, selectedDate]);

  const featured = articles[0];
  const lateDispatches = articles.slice(1, 8);
  const opinionPieces = articles.slice(8, 12);
  const furtherAfield = articles.slice(12, 18);
  const snippets = articles.slice(18, 24);

  return (
    <div className="min-h-screen paper-texture paper-edges">
      <Masthead />
      <Navigation />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 paper-crease">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center font-body text-ink-soft italic text-lg">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              The presses are running…
            </motion.div>
          </div>
        ) : (
          <>
            {/* Current edition label */}
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-faded font-bold">
                Edition: <span className="text-gold">{formatDateLabel(selectedDate)}</span>
              </div>
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-faded">
                {articles.length} dispatches
              </div>
            </div>

            {articles.length === 0 ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center vintage-card">
                <div className="font-display text-2xl text-ink mb-2">The presses are still</div>
                <div className="font-body italic text-ink-soft">
                  No dispatches were filed for {formatDateLabel(selectedDate)}.
                </div>
              </div>
            ) : (
              <>
            {/* PAGE 1 HERO */}
            {featured && <FrontPageHero article={featured} />}

            {/* Authentic newspaper spread */}
            <div className="front-page-spread items-start">
              {/* MAIN COLUMN — real newspaper column flow */}
              <div className="space-y-8">
                {lateDispatches.length > 0 && (
                  <NewspaperSection
                    title="Late Dispatches"
                    subtitle="All the news from the wizarding world of technology"
                    articles={lateDispatches}
                    columns={3}
                    showImages
                    variant="front"
                  />
                )}

                {furtherAfield.length > 0 && (
                  <>
                    <SectionDivider title="Reports from Afar" />
                    <NewspaperSection
                      title="Further Afield"
                      subtitle="Laboratories, launchpads, and distant datacentres"
                      articles={furtherAfield}
                      columns={2}
                      showImages
                      variant="front"
                    />
                  </>
                )}
              </div>

              {/* SIDE COLUMN — editorial, weather, market, widgets */}
              <aside className="space-y-6 lg:sticky lg:top-6">
                <EditorialBox />
                <WeatherWidget />
                <MarketPrices />
                <SideNotes articles={snippets} />
                {widgets && (
                  <>
                    <DevQuoteWidget quote={widgets.dev_quote} />
                    <TriviaWidget trivia={widgets.trivia} />
                  </>
                )}
              </aside>
            </div>

            {/* Bottom opinion strip */}
            {opinionPieces.length > 0 && (
              <div className="mt-10 pt-8 border-t-4 border-double border-[var(--border-color)]">
                <NewspaperSection
                  title="Opinion & Commentary"
                  subtitle="Letters, editorials, and prophetic pronouncements"
                  articles={opinionPieces}
                  columns={4}
                  showImages={false}
                  variant="opinion"
                />
              </div>
            )}

            {/* Page number */}
            <div className="mt-10 flex items-center justify-between page-marker">
              <span>The Daily Tech Prophet</span>
              <span>Page 1</span>
              <span>Vol. CLXII No. 4,202</span>
            </div>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
```
