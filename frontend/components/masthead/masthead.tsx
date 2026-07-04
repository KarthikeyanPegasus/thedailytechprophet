"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DateBanner } from "./date-banner";
import { BreakingTicker } from "./ticker";
import { SearchButton } from "./search-button";
import { EditionInfo } from "./edition-info";
import { NewspaperArchive } from "@/components/newspaper/newspaper-archive";
import { SoundManager } from "@/components/effects/sound-manager";

export function Masthead() {
  return (
    <header className="border-b-4 border-double border-[var(--border-color)] paper-texture">
      <div className="max-w-[90rem] mx-auto px-4 py-3 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Left indexes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block lg:col-span-2 text-xs font-sans text-ink-soft leading-tight"
          >
            <div className="font-bold uppercase tracking-widest border-b border-[var(--border-color)] pb-0.5 mb-0.5" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>AI Index</div>
            <div className="flex justify-between font-body text-xs"><span className="text-gold font-bold">▲ 2.4%</span> <span>1,248.33</span></div>
            <div className="font-bold uppercase tracking-widest border-b border-[var(--border-color)] pb-0.5 mb-0.5 mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>S&P Tech</div>
            <div className="flex justify-between font-body text-xs"><span className="text-gold font-bold">▲ 1.1%</span> <span>4,802.11</span></div>
            <div className="font-bold uppercase tracking-widest border-b border-[var(--border-color)] pb-0.5 mb-0.5 mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>BTC</div>
            <div className="flex justify-between font-body text-xs"><span className="text-gold font-bold">$68.4K</span> <span>▲ 1.8%</span></div>
          </motion.div>

          {/* Center masthead */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 text-center relative"
          >
            <Link href="/" className="inline-block group">
              <h1 className="headline-gothic text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink tracking-tight leading-[0.85]">
                THE DAILY
              </h1>
              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink tracking-tight leading-[0.85] -mt-1">
                <span className="text-gold">TECH</span> PROPHET
              </h1>

              <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2">
                <span className="w-10 h-px bg-[var(--border-color)]" />
                <span className="font-body italic text-xs sm:text-base text-ink-soft">"All the Tech That's Fit to Print"</span>
                <span className="w-10 h-px bg-[var(--border-color)]" />
              </div>
            </Link>
          </motion.div>

          {/* Right utilities */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:flex lg:col-span-2 flex-col items-end gap-1"
          >
            <div className="flex items-center gap-1">
              <SearchButton />
              <SoundManager />
            </div>
            <EditionInfo />
            <div className="text-right text-xs font-sans text-ink-soft leading-tight">
              <div className="font-bold uppercase tracking-widest border-b border-[var(--border-color)] pb-0.5 mb-0.5 mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>Price</div>
              <div className="font-body text-xs">2 Sickles</div>
            </div>
            <NewspaperArchive />
          </motion.div>
        </div>
      </div>
      <DateBanner />
      <BreakingTicker />
    </header>
  );
}
