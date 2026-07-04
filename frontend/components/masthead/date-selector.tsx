"use client";

import { CalendarDays, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  useArticleDate,
  todayISO,
  isoDaysAgo,
  formatDateLabel,
} from "@/hooks/use-article-date";

const QUICK_OPTIONS: { label: string; value: string | null }[] = [
  { label: "Today", value: todayISO() },
  { label: "Yesterday", value: isoDaysAgo(1) },
  { label: "3 days ago", value: isoDaysAgo(3) },
  { label: "1 week ago", value: isoDaysAgo(7) },
  { label: "All", value: null },
];

export function DateSelector() {
  const { date, setDate } = useArticleDate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open]);

  const label = formatDateLabel(date);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 border border-[var(--border-color)] bg-parchment-aged/40 hover:bg-parchment-aged transition-colors font-sans uppercase tracking-[0.15em] text-[10px] sm:text-xs font-bold text-ink"
        aria-label="Select article date"
        aria-expanded={open}
      >
        <CalendarDays className="w-3.5 h-3.5 text-gold" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Date</span>
        {date && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setDate(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setDate(null);
              }
            }}
            className="ml-1 text-ink-faded hover:text-ink"
            aria-label="Clear date"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 z-50 vintage-card border-2 border-[var(--border-color)] bg-parchment p-3 w-64 shadow-lg">
          <div className="font-display text-sm font-bold text-ink mb-2 border-b border-[var(--border-color)] pb-1">
            Select Edition Date
          </div>

          <label className="block text-[10px] uppercase tracking-widest text-ink-faded font-sans font-bold mb-1">
            Pick a date
          </label>
          <input
            type="date"
            value={date ?? ""}
            max={todayISO()}
            onChange={(e) => {
              setDate(e.target.value || null);
              setOpen(false);
            }}
            className="w-full px-2 py-1.5 border border-[var(--border-color)] bg-parchment-aged/40 font-sans text-sm text-ink focus:outline-none focus:ring-1 focus:ring-gold"
          />

          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-widest text-ink-faded font-sans font-bold mb-1">
              Quick options
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_OPTIONS.map((opt) => {
                const active =
                  (opt.value ?? null) === (date ?? null);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setDate(opt.value);
                      setOpen(false);
                    }}
                    className={`px-2 py-1 text-[10px] uppercase tracking-widest font-sans font-bold border transition-colors ${
                      active
                        ? "bg-gold text-parchment border-gold"
                        : "border-[var(--border-color)] text-ink hover:bg-parchment-aged"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
