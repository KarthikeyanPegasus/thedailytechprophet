"use client";

import { Sun, Wind, CloudRain } from "lucide-react";

export function WeatherWidget() {
  return (
    <div className="newspaper-box">
      <div className="newspaper-box-title">Weather</div>
      <div className="flex items-center justify-center gap-3">
        <Sun className="w-6 h-6 text-gold" />
        <div className="text-left">
          <div className="font-display text-xl font-bold text-ink leading-none">68°F</div>
          <div className="font-sans text-[10px] text-ink-faded uppercase tracking-wider">Partly Cloudy</div>
        </div>
      </div>
      <div className="flex justify-center gap-3 text-[10px] font-sans text-ink-soft mt-1.5 border-t border-[var(--border-color)]/40 pt-1.5">
        <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-gold" /> 12 mph</span>
        <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-gold" /> 10%</span>
      </div>
    </div>
  );
}