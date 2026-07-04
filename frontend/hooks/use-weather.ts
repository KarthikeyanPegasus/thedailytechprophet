"use client";

import { useEffect, useState } from "react";

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: "sun" | "cloud" | "rain" | "snow" | "thunder" | "fog";
}

const DEFAULT: WeatherInfo = { temp: 68, condition: "Clear", icon: "sun" };

export function useWeather(lat: number | null, lon: number | null): WeatherInfo {
  const [weather, setWeather] = useState<WeatherInfo>(DEFAULT);

  useEffect(() => {
    if (lat == null || lon == null) return;

    const cached = sessionStorage.getItem("dtp-weather");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < 600000) {
          setWeather(parsed.weather);
          return;
        }
      } catch {
        // ignore
      }
    }

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        const temp = Math.round(data.current?.temperature_2m ?? 68);
        const code = data.current?.weather_code ?? 0;
        const info = mapWeatherCode(code);
        const w = { temp, ...info };
        sessionStorage.setItem("dtp-weather", JSON.stringify({ weather: w, ts: Date.now() }));
        setWeather(w);
      })
      .catch(() => setWeather(DEFAULT));
  }, [lat, lon]);

  return weather;
}

function mapWeatherCode(code: number): Pick<WeatherInfo, "condition" | "icon"> {
  if (code === 0 || code === 1) return { condition: "Clear", icon: "sun" };
  if (code === 2) return { condition: "Partly Cloudy", icon: "cloud" };
  if (code === 3) return { condition: "Cloudy", icon: "cloud" };
  if ([45, 48].includes(code)) return { condition: "Foggy", icon: "fog" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) return { condition: "Rain", icon: "rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: "Snow", icon: "snow" };
  if ([95, 96, 99].includes(code)) return { condition: "Thunderstorm", icon: "thunder" };
  return { condition: "Clear", icon: "sun" };
}
