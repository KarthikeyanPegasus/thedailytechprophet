"use client";

import { DustParticles } from "./dust-particles";
import { InkTrail } from "./ink-trail";
import { InkReveal } from "./ink-reveal";
import { PrintNoise } from "./print-noise";
import { PaperPhysics } from "./paper-physics";
import { CandleGlow } from "./candle-glow";

export function GlobalEffects() {
  return (
    <>
      <CandleGlow />
      <PaperPhysics />
      <DustParticles />
      <InkTrail />
      <InkReveal />
      <PrintNoise />
    </>
  );
}