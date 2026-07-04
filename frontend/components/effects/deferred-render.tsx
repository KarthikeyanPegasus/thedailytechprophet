"use client";

import { type ReactNode } from "react";
import { useSharedIllustration } from "@/hooks/use-shared-illustration-observer";

/**
 * DeferredRender — only mounts its children when the placeholder scrolls
 * within `margin` pixels of the viewport. Uses a module-scoped shared
 * IntersectionObserver (see use-shared-illustration-observer) so the
 * entire page has at most one observer instance regardless of how many
 * DeferredRender or useLazyIllustration components are mounted.
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
  const { ref, shouldRender } = useSharedIllustration<HTMLDivElement>(margin);

  if (shouldRender) {
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
