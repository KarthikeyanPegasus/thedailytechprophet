"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useLazyIllustration — IntersectionObserver-based lazy mount for illustrations.
 * Only mounts the illustration when it enters the viewport.
 * Pauses CSS animations when off-screen by toggling a class.
 *
 * Usage:
 * const { ref, shouldRender, isVisible } = useLazyIllustration<HTMLDivElement>();
 *
 * if (!shouldRender) return <div ref={ref} className={className} />;
 * return <div ref={ref} className={cn(className, isVisible ? "" : "paused-anim")}><Illustration /></div>;
 */
export function useLazyIllustration<T extends HTMLElement = HTMLDivElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldRender(true);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, shouldRender, isVisible };
}