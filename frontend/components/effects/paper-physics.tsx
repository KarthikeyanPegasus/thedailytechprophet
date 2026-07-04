"use client";

import { useEffect, useRef } from "react";

/**
 * PaperPhysics — scroll parallax (translateY) + mouse-move paper tilt
 * (max 2° 2D rotation) + scroll-settle effect.
 *
 * Uses only 2D transforms to avoid the compositing-layer repaint issues
 * that 3D perspective caused during fast scroll. Mouse tilt is disabled
 * while scrolling is active, then re-enabled after scroll settles.
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

    // --- Tilt state ---
    let isScrolling = false;
    let mouseEnabled = true;
    let mouseRaf = 0;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      // Tiny parallax — max 3px shift
      targetOffset = window.scrollY * 0.003;

      // Disable mouse tilt during active scroll
      if (!isScrolling) {
        isScrolling = true;
        mouseEnabled = false;
        // Gently return tilt to zero
        surface.style.setProperty("--paper-tilt", "0");
      }

      // Reset scroll-end timer — fires after scrolling stops
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
        mouseEnabled = true;
        // Trigger the settle animation
        surface.classList.add("paper-settle");
        setTimeout(() => surface.classList.remove("paper-settle"), 600);
      }, 150);

      requestAnimationFrame(() => {
        ticking = false;
      });
    };

    // Animation loop — combines translateY parallax + 2D rotate tilt
    const animate = () => {
      currentOffset += (targetOffset - currentOffset) * 0.06;
      const tilt = surface.style.getPropertyValue("--paper-tilt") || "0";
      surface.style.transform = `translateY(${currentOffset}px) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(animate);
    };

    // --- Mouse tilt — very subtle 2D rotation, max 2 degrees ---
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseEnabled) return;
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0;
        // Normalise mouse position relative to viewport centre (-1 to 1)
        const cx = window.innerWidth / 2;
        const dx = (e.clientX - cx) / cx;
        // Max 2 degrees of tilt
        const tilt = Math.max(-2, Math.min(2, dx * 2));
        surface.style.setProperty("--paper-tilt", tilt.toFixed(2));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      surface.style.transform = "";
      surface.style.removeProperty("--paper-tilt");
      surface.classList.remove("paper-settle");
    };
  }, []);

  return null;
}
