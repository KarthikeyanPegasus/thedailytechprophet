"use client";

import { useEffect, useRef } from "react";

/**
 * PaperPhysics — scroll parallax (translateY) + scroll-settle effect.
 *
 * Uses only 2D transforms to avoid the compositing-layer repaint issues
 * that 3D perspective caused during fast scroll.
 *
 * The RAF loop is **idle-aware**: it only runs while the parallax offset
 * is still converging. Once it has settled the transform is cleared to
 * `none` and the loop is cancelled — zero cost when idle.
 *
 * Respects prefers-reduced-motion.
 */
export function PaperPhysics() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const surface = document.querySelector("main") as HTMLElement | null;
    if (!surface) return;

    // --- Scroll parallax (translateY) ---
    let currentOffset = 0;
    let targetOffset = 0;
    let raf = 0;
    let ticking = false;
    let loopActive = false;

    // Threshold below which we consider the surface "settled" and stop animating.
    const SETTLE_THRESHOLD = 0.05;

    const startLoop = () => {
      if (loopActive) return;
      loopActive = true;
      raf = requestAnimationFrame(animate);
    };

    // Animation loop — translates the surface for parallax.
    // Self-cancels once the offset has settled to avoid a permanent
    // 60fps transform-write on the entire <main> element.
    const animate = () => {
      currentOffset += (targetOffset - currentOffset) * 0.06;

      const offsetDelta = Math.abs(targetOffset - currentOffset);

      if (offsetDelta < SETTLE_THRESHOLD) {
        // Snap to final value and release the transform so the browser
        // can skip compositing the layer entirely while idle.
        currentOffset = targetOffset;
        surface.style.transform = currentOffset === 0 ? "" : `translateY(${currentOffset}px)`;
        raf = 0;
        loopActive = false;
        return;
      }

      surface.style.transform = `translateY(${currentOffset}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      // Tiny parallax — max 3px shift
      targetOffset = window.scrollY * 0.003;

      // Trigger the settle animation
      surface.classList.add("paper-settle");
      // Defer the class removal to the next frame so the animation can play.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          surface.classList.remove("paper-settle");
        });
      });

      startLoop();

      requestAnimationFrame(() => {
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      surface.style.transform = "";
      surface.classList.remove("paper-settle");
    };
  }, []);

  return null;
}
