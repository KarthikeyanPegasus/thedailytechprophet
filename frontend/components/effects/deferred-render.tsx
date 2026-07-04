"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * DeferredRender — only mounts its children when the placeholder scrolls
 * within `margin` pixels of the viewport. This avoids rendering hundreds of
 * DOM nodes and animation observers for below-the-fold content on initial
 * load. A single shared IntersectionObserver per instance.
 *
 * Once revealed, children stay mounted (no unmount on scroll away).
 */
export function DeferredRender({
  children,
  margin = "400px",
  placeholderHeight = "200px",
  className,
}: {
  children: ReactNode;
  margin?: string;
  placeholderHeight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, margin]);

  if (visible) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: placeholderHeight }}
      aria-hidden="true"
    />
  );
}
