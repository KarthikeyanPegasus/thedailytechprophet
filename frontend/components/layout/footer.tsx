"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  const date = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="footer-silhouette relative border-t-4 border-double border-[var(--border-color)] mt-12 overflow-hidden"
    >
      {/* Decorative masthead silhouette as background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="footer-silhouette-text font-display font-black text-[18vw] sm:text-[14vw] md:text-[10vw] leading-none whitespace-nowrap">
          The Daily Tech Prophet
        </span>
      </div>

      <div className="relative max-w-[90rem] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colophon — left */}
          <div className="text-center md:text-left">
            <h3 className="font-display font-black text-2xl text-ink mb-1 leading-none">THE DAILY<br/>TECH PROPHET</h3>
            <p className="font-body italic text-ink-soft text-sm">All the Tech That's Fit to Print</p>
            <p className="colophon mt-3">© {date} The Daily Tech Prophet</p>
          </div>

          {/* Navigation links — center */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="ornament-divider text-gold text-xl w-full max-w-xs mb-2" style={{ margin: "0 auto 0.5rem" }}>§</div>
            <div className="flex justify-center gap-5 text-sm font-sans font-bold uppercase tracking-widest text-ink-soft">
              <Link href="/" className="hover:text-ink hover:underline decoration-gold decoration-2 underline-offset-4 transition-colors">Home</Link>
              <Link href="/search" className="hover:text-ink hover:underline decoration-gold decoration-2 underline-offset-4 transition-colors">Archives</Link>
              <Link href="/bookmarks" className="hover:text-ink hover:underline decoration-gold decoration-2 underline-offset-4 transition-colors">Saved</Link>
            </div>
          </div>

          {/* Keyboard shortcuts — right */}
          <div className="text-center md:text-right colophon">
            <p className="font-bold uppercase tracking-[0.15em] text-ink-soft mb-1.5">Keyboard Shortcuts</p>
            <p>/ Search the Archives · j/k Scroll · t Candlelight · b Bookmark</p>
            <p className="mt-1">Accessibility-first · Reduces motion automatically</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}