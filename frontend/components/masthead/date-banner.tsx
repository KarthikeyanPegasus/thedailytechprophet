"use client";

import { Cloud, Sun, CloudRain, Snowflake, Zap, CloudFog } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "@/hooks/use-location";
import { useWeather } from "@/hooks/use-weather";
import { DateSelector } from "./date-selector";

export function DateBanner() {
  const location = useLocation();
  const weather = useWeather(location.lat, location.lon);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const WeatherIcon = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
    snow: Snowflake,
    thunder: Zap,
    fog: CloudFog,
  }[weather.icon];

  const locationLabel = [location.city, location.country].filter(Boolean).join(", ") || "Local";

  return (
    <div className="border-y-2 border-[var(--border-color)] bg-parchment-aged/60">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-sans tracking-wide text-ink">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="uppercase font-bold tracking-[0.15em]"
          >
            {now ? formatLocal(now, location.timezone) : "—"}
          </motion.div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-body italic text-ink-soft">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-1.5">
              <WeatherIcon className="w-4 h-4 text-gold" />
              <span>{locationLabel} — {weather.condition}, {weather.temp}°F</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="hidden sm:block">
              {location.region} Edition
            </motion.div>
            <DateSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLocal(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
