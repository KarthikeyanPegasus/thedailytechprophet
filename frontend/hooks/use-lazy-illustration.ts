"use client";

import type { RefObject } from "react";
import { useSharedIllustration } from "@/hooks/use-shared-illustration-observer";

/**
 * useLazyIllustration — backward-compatible wrapper around the
 * module-scoped shared IntersectionObserver.
 *
 * Previously each call created its own IntersectionObserver, which was
 * the dominant Layout/IntersectionObserver cost in the profile (~30+
 * observers on the home page). Now every call subscribes to a single
 * shared observer instance.
 *
 * Usage:
 * const { ref, shouldRender, isVisible } = useLazyIllustration<HTMLDivElement>();
 */
export function useLazyIllustration<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "200px",
): {
  ref: RefObject<T | null>;
  shouldRender: boolean;
  isVisible: boolean;
} {
  return useSharedIllustration<T>(rootMargin);
}
