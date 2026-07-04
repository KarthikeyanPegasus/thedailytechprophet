"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if typing in input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      // / — focus search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>("#archive-search");
        searchInput?.focus();
      }

      // j / k — scroll down / up
      if (e.key === "j" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: 200, behavior: "smooth" });
      }
      if (e.key === "k" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: -200, behavior: "smooth" });
      }

      // b — toggle bookmark on current article (if on article page)
      if (e.key === "b" && !e.metaKey && !e.ctrlKey) {
        const btn = document.querySelector<HTMLButtonElement>("#bookmark-btn");
        btn?.click();
      }

      // h — go home
      if (e.key === "h" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.location.href = "/";
      }

      // Escape — close overlays
      if (e.key === "Escape") {
        const overlay = document.querySelector("[data-overlay]");
        if (overlay) {
          (overlay as HTMLElement).style.display = "none";
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
