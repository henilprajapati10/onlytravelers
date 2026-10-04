"use client";

import { useEffect, useState } from "react";
import { readJson, writeJson } from "./storage";
import {
  forecastUrl,
  isFresh,
  parseForecast,
  WEATHER_CACHE_KEY,
  type Forecast,
} from "./weather";

/**
 * A forecast for one coordinate, cached per place on the device for an hour.
 *
 * `status` is "idle" until the browser has had a chance to look, "loading"
 * while a request is out, "ready" with a forecast (fresh or cached) and
 * "unavailable" when the network said no. The last cached forecast is kept
 * through a failed refresh, marked by its own `fetchedAt`, so a place with
 * no signal still shows what was known when there was.
 */
export type WeatherStatus = "idle" | "loading" | "ready" | "unavailable";

type Cache = Record<string, Forecast>;

export function useWeather(coord: { lat: number; lng: number } | undefined) {
  const key = coord ? `${coord.lat.toFixed(3)},${coord.lng.toFixed(3)}` : null;
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");

  useEffect(() => {
    if (!key || !coord) return;
    let live = true;
    const cache = readJson<Cache>(WEATHER_CACHE_KEY, {});
    const cached = cache[key] ?? null;
    if (cached) setForecast(cached);
    if (isFresh(cached)) {
      setStatus("ready");
      return;
    }

    setStatus("loading");
    const ctrl = new AbortController();
    fetch(forecastUrl(coord.lat, coord.lng), { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((raw) => {
        if (!live) return;
        const parsed = parseForecast(raw);
        if (!parsed) throw new Error("bad forecast");
        setForecast(parsed);
        setStatus("ready");
        // Keep the cache small: this place plus the most recent few.
        const next: Cache = { ...readJson<Cache>(WEATHER_CACHE_KEY, {}), [key]: parsed };
        const keys = Object.keys(next).sort((a, b) => next[b].fetchedAt - next[a].fetchedAt).slice(0, 12);
        writeJson(WEATHER_CACHE_KEY, Object.fromEntries(keys.map((k) => [k, next[k]])));
      })
      .catch(() => {
        if (!live) return;
        setStatus(cached ? "ready" : "unavailable");
      });
    return () => {
      live = false;
      ctrl.abort();
    };
    // coord is derived from key; key is the stable identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { forecast, status };
}
