"use client";

import type { Destination } from "@/data/destinations";
import { coordFor } from "@/data/coords";
import { useWeather } from "@/lib/useWeather";
import { dayLabel, describeCode, forecastAdvice, isFresh } from "@/lib/weather";

/**
 * Live weather at the place, from Open-Meteo. Shows nothing it does not
 * know: no coordinate or no network means the card says so and stays small.
 */
export default function WeatherCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  const coord = coordFor(destination.slug);
  const { forecast, status } = useWeather(coord ?? undefined);

  if (!coord) return null;

  const shell = compact ? "" : "rounded-2xl border border-navy-100 bg-white p-4 shadow-card";

  if (!forecast) {
    return (
      <div data-testid="weather" data-status={status} className={shell}>
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-navy-500">Weather now</p>
        <p className="mt-1 text-sm text-navy-400">
          {status === "unavailable"
            ? "No forecast right now — the weather service could not be reached. The best-months guidance above still holds."
            : "Checking the forecast…"}
        </p>
      </div>
    );
  }

  const now = describeCode(forecast.nowCode);
  const advice = forecastAdvice(forecast);
  const fresh = isFresh(forecast);
  const asOf = new Date(forecast.fetchedAt);

  return (
    <div data-testid="weather" data-status={status} className={shell}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-navy-500">
            Weather {fresh ? "now" : "as of " + asOf.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mt-1 text-2xl font-bold text-navy-800">
            <span aria-hidden="true">{now.icon}</span> {forecast.nowC}°C
            <span className="ml-2 text-sm font-medium text-navy-500">{now.label}</span>
          </p>
        </div>
      </div>
      <ul className={`mt-3 grid gap-1 ${compact ? "grid-cols-5" : "grid-cols-5"}`}>
        {forecast.days.slice(0, 5).map((d) => {
          const w = describeCode(d.code);
          return (
            <li key={d.date} className="rounded-lg bg-sand-50 px-1 py-1.5 text-center" title={w.label}>
              <p className="text-[10px] font-semibold uppercase text-navy-400">{dayLabel(d.date)}</p>
              <p className="text-base leading-tight" aria-hidden="true">{w.icon}</p>
              <p className="text-[11px] tabular-nums text-navy-700">
                {d.maxC}° <span className="text-navy-400">{d.minC}°</span>
              </p>
              {d.rainChance >= 30 && <p className="text-[10px] text-sky-600">💧{d.rainChance}%</p>}
            </li>
          );
        })}
      </ul>
      {advice && <p className="mt-3 rounded-lg border-l-4 border-navy-300 bg-sand-100 p-2.5 text-xs text-navy-700">{advice}</p>}
      {!compact && (
        <p className="mt-2 text-[11px] text-navy-400">
          Forecast by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline">
            Open-Meteo
          </a>{" "}
          (CC BY 4.0) for {coord.lat.toFixed(2)}°N {coord.lng.toFixed(2)}°E. Refreshed hourly.
        </p>
      )}
    </div>
  );
}
