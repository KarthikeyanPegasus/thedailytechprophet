"use client";

import { useEffect, useState } from "react";

export interface UserLocation {
  lat: number | null;
  lon: number | null;
  city: string;
  country: string;
  region: string;
  timezone: string;
  loading: boolean;
  error: string | null;
}

const DEFAULT_LOCATION: UserLocation = {
  lat: null,
  lon: null,
  city: "London",
  country: "United Kingdom",
  region: "Europe",
  timezone: "Europe/London",
  loading: true,
  error: null,
};

export function useLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocation((prev) => ({ ...prev, loading: false, error: "Geolocation not available" }));
      return;
    }

    const stored = sessionStorage.getItem("dtp-location");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocation({ ...parsed, loading: false, error: null });
        return;
      } catch {
        // ignore parse error and fetch fresh
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

        try {
          // Use OpenStreetMap Nominatim for reverse geocoding (free, no key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en`,
            { headers: { "User-Agent": "dailytechprophet/1.0" } }
          );
          const data = await res.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.suburb || address.county || "Local";
          const country = address.country || "";
          const countryCode = (address.country_code || "").toUpperCase();
          const region = inferRegion(countryCode, timezone);

          const loc: UserLocation = {
            lat: latitude,
            lon: longitude,
            city,
            country,
            region,
            timezone,
            loading: false,
            error: null,
          };
          sessionStorage.setItem("dtp-location", JSON.stringify(loc));
          setLocation(loc);
        } catch {
          // Fallback to coordinates + browser timezone
          const loc: UserLocation = {
            lat: latitude,
            lon: longitude,
            city: "Local",
            country: "",
            region: inferRegion("", timezone),
            timezone,
            loading: false,
            error: null,
          };
          sessionStorage.setItem("dtp-location", JSON.stringify(loc));
          setLocation(loc);
        }
      },
      () => {
        // On permission denial, fallback to browser timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        const loc: UserLocation = {
          ...DEFAULT_LOCATION,
          timezone,
          region: inferRegion("", timezone),
          loading: false,
          error: null,
        };
        setLocation(loc);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    );
  }, []);

  return location;
}

function inferRegion(countryCode: string, timezone: string): string {
  const tz = timezone.toLowerCase();
  const cc = countryCode.toUpperCase();

  const northAmerica = ["US", "CA", "MX", "PR", "CU", "GT", "HN", "SV", "NI", "CR", "PA", "BS", "JM", "HT", "DO"];
  const europe = [
    "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "IE", "PT", "GR", "PL", "CZ",
    "HU", "SK", "SI", "HR", "BG", "RO", "LT", "LV", "EE", "LU", "MT", "CY", "IS", "AL", "BA", "MK", "MD", "ME",
    "RS", "XK", "UA", "BY", "RU",
  ];
  const asiaPacific = [
    "CN", "JP", "KR", "IN", "SG", "AU", "NZ", "TH", "VN", "MY", "ID", "PH", "TW", "HK", "MO", "BD", "PK", "LK",
    "NP", "MM", "KH", "LA", "BN", "MN", "PG", "FJ", "SB", "VU", "NC",
  ];
  const middleEastAfrica = [
    "AE", "SA", "QA", "BH", "KW", "OM", "JO", "IL", "TR", "EG", "ZA", "NG", "KE", "GH", "UG", "TZ", "MA", "DZ",
    "TN", "LY", "SD", "ET", "ZW", "ZM", "MW", "MZ", "BW", "NA", "SZ", "LS", "RW", "BI", "SS", "ER", "DJ", "SO",
    "TD", "NE", "ML", "BF", "SN", "GM", "GW", "GN", "SL", "LR", "CI", "TG", "BJ", "KM", "MG", "MU", "SC", "CV",
  ];
  const southAmerica = [
    "BR", "AR", "CO", "CL", "PE", "VE", "EC", "BO", "PY", "UY", "GY", "SR", "GF",
  ];

  if (northAmerica.includes(cc)) return "North America";
  if (europe.includes(cc)) return "Europe";
  if (asiaPacific.includes(cc)) return "Asia-Pacific";
  if (middleEastAfrica.includes(cc)) return "Middle East & Africa";
  if (southAmerica.includes(cc)) return "South America";

  if (tz.startsWith("america/")) return "North America";
  if (tz.startsWith("europe/")) return "Europe";
  if (tz.startsWith("asia/") || tz.startsWith("australia/") || tz.startsWith("pacific/")) return "Asia-Pacific";
  if (tz.startsWith("africa/")) return "Middle East & Africa";
  if (tz.startsWith("atlantic/")) return "North America";

  return "Global";
}
