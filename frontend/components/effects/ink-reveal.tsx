"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * InkReveal — applies ink-spread animations to headlines, self-drawing
 * dividers, animating borders, and extending horizontal rules.
 *
 * Re-fires on every route change (via usePathname) and also watches for
 * async-loaded content via a short-lived MutationObserver so that
 * data-fetched elements get animated even though they arrive after mount.
 */
export function InkReveal() {
  const pathname = usePathname();
  const observerRef = useRef<MutationObserver | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The core function that queries the DOM and applies ink-reveal classes.
  const applyInkReveal = () => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // 1. Headlines — ink spread effect
    const headlines = document.querySelectorAll(
      ".headline-article, .headline-masthead, .headline-gothic, h1.headline, h2.banner-title",
    );
    headlines.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-headline")) return;
      htmlEl.classList.add("ink-reveal-headline");
      htmlEl.style.animationDelay = `${0.1 + i * 0.15}s`;
    });

    // 2. Dividers / horizontal rules — draw themselves
    const rules = document.querySelectorAll(
      ".newspaper-section-break, .section-rule, .ornament-divider > *:first-child, .ornament-divider > *:last-child, .newspaper-section-banner",
    );
    rules.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-rule")) return;
      htmlEl.classList.add("ink-reveal-rule");
      htmlEl.style.animationDelay = `${0.3 + i * 0.1}s`;
    });

    // 3. Victorian borders / framed elements — border draws in
    const borders = document.querySelectorAll(
      ".victorian-border, .ornate-frame > div:first-child, .newspaper-box, .newspaper-block",
    );
    borders.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-border")) return;
      htmlEl.classList.add("ink-reveal-border");
      htmlEl.style.animationDelay = `${0.2 + i * 0.08}s`;
    });

    // 4. Body text / paragraphs — ink absorbs
    const bodyText = document.querySelectorAll(
      ".body-text p:first-of-type, .dateline-lead, .deck",
    );
    bodyText.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-body")) return;
      htmlEl.classList.add("ink-reveal-body");
      htmlEl.style.animationDelay = `${0.5 + i * 0.1}s`;
    });

    // 5. Section titles — ink pool effect
    const sectionTitles = document.querySelectorAll(
      ".headline-section, .also-in-edition, .newspaper-box-title",
    );
    sectionTitles.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-section")) return;
      htmlEl.classList.add("ink-reveal-section");
      htmlEl.style.animationDelay = `${0.4 + i * 0.12}s`;
    });

    // 6. Horizontal rules — extend from center
    const hrElements = document.querySelectorAll("hr, .newspaper-rule");
    hrElements.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains("ink-reveal-rule")) return;
      htmlEl.classList.add("ink-reveal-rule");
      htmlEl.style.animationDelay = `${0.3 + i * 0.1}s`;
    });
  };

  // Remove all ink-reveal classes so elements can be re-animated
  // on the next visit (e.g. navigating away and back to home).
  const cleanupInkReveal = () => {
    const classes = [
      "ink-reveal-headline",
      "ink-reveal-rule",
      "ink-reveal-border",
      "ink-reveal-body",
      "ink-reveal-section",
    ];
    classes.forEach((cls) => {
      document.querySelectorAll(`.${cls}`).forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.classList.remove(cls);
        htmlEl.style.animationDelay = "";
      });
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // 1. Clean up previous page's ink-reveal classes
    cleanupInkReveal();

    // 2. Apply immediately for already-rendered content
    // Small delay to let the new page's DOM settle
    requestAnimationFrame(() => {
      applyInkReveal();
    });

    // 3. Set up a MutationObserver to catch async-loaded content
    // (e.g. articles fetched after mount on the home page).
    // Auto-disconnects after 15s to avoid permanent overhead.
    if (observerRef.current) observerRef.current.disconnect();

    let mutationCount = 0;
    const maxMutations = 30;

    const observer = new MutationObserver(() => {
      mutationCount++;
      if (mutationCount > maxMutations) {
        observer.disconnect();
        return;
      }
      // Debounce — apply ink reveal after a short pause
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        applyInkReveal();
      }, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    observerRef.current = observer;

    // Auto-disconnect after 15s — by then async content should be loaded
    const disconnectTimer = setTimeout(() => {
      observer.disconnect();
    }, 15000);

    return () => {
      observer.disconnect();
      clearTimeout(disconnectTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]); // Re-fire on every route change

  return null;
}
