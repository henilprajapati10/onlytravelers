"use client";

import { useMemo, useState } from "react";
import type { TripPlan } from "@/lib/trip";
import { formatDays } from "@/lib/format";
import {
  PIN_NOTE,
  embedPlaceUrl,
  embedRouteUrl,
  mapLegs,
  mapsSearchUrl,
  placeQuery,
  routeSegments,
} from "@/lib/maps";
import { googleMapsKey } from "@/lib/mapsConfig";
import GoogleMapEmbed from "./GoogleMapEmbed";
import { MapButtons, NearbyChips } from "./MapActions";

const LEG_ICON: Record<string, string> = {
  Flight: "✈️",
  "Ferry or flight": "⛴️",
  Road: "🚗",
  "Walk / local transport": "🚶",
  "Train or road": "🚆",
};

type Focus = { kind: "segment"; index: number } | { kind: "stop"; slug: string };

/**
 * The trip on Google Maps. A road map cannot draw a flight or a sailing, and a
 * phone opens at most five stops per link, so the route comes in parts — and
 * every leg gets the link that suits it.
 */
export default function TripMap({ plan }: { plan: TripPlan }) {
  const segments = useMemo(() => routeSegments(plan), [plan]);
  const legs = useMemo(() => mapLegs(plan), [plan]);
  const [focus, setFocus] = useState<Focus>(
    segments.length ? { kind: "segment", index: 0 } : { kind: "stop", slug: plan.stops[0].destination.slug }
  );

  const segment = focus.kind === "segment" ? segments[focus.index] : undefined;
  const stop = focus.kind === "stop" ? plan.stops.find((s) => s.destination.slug === focus.slug) : undefined;
  const focusStop = stop ?? plan.stops[0];
  const embed = segment
    ? embedRouteUrl(segment.queries, googleMapsKey)
    : embedPlaceUrl(placeQuery(focusStop.destination), googleMapsKey);
  const openUrl = segment ? segment.url : mapsSearchUrl(placeQuery(focusStop.destination));
  const hasSeaOrAir = legs.some((l) => !l.drivable);

  return (
    <div className="flex flex-col gap-6" data-trip-map>
      <section className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
        {segments.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Route parts">
            {segments.map((seg, i) => {
              const on = focus.kind === "segment" && focus.index === i;
              return (
                <button
                  key={seg.slugs.join("-")}
                  type="button"
                  onClick={() => setFocus({ kind: "segment", index: i })}
                  aria-pressed={on}
                  data-route-part={i}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    on ? "bg-navy-800 text-white" : "border border-navy-200 text-navy-600 hover:border-coral-300"
                  }`}
                >
                  Part {i + 1}: {seg.names[0]} → {seg.names[seg.names.length - 1]}
                </button>
              );
            })}
          </div>
        )}

        <GoogleMapEmbed
          key={embed}
          src={embed}
          title={segment ? `Route from ${segment.names[0]} to ${segment.names[segment.names.length - 1]}` : `Google Map of ${focusStop.destination.name}`}
          openUrl={openUrl}
          className="aspect-[4/3] sm:aspect-[16/9]"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-navy-600">
            {segment ? segment.names.join(" → ") : `${focusStop.destination.name}, ${focusStop.state.name}`}
          </p>
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-open-route
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
          >
            {segment ? "Navigate this route in Google Maps" : "Open in Google Maps"}
          </a>
        </div>
        <p className="mt-2 text-xs text-navy-400">
          {hasSeaOrAir ? "The road map breaks where you fly or sail — those legs link to flights instead. " : ""}
          {PIN_NOTE}
        </p>
      </section>

      {legs.length > 0 && (
        <section>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">Every move</h2>
          <ol className="mt-3 flex flex-col gap-2">
            {legs.map((leg) => (
              <li
                key={`${leg.fromSlug}-${leg.toSlug}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white p-3"
              >
                <span className="min-w-0 text-sm text-navy-700">
                  <span aria-hidden="true">{LEG_ICON[leg.mode] ?? "🚆"}</span> {leg.fromName} → {leg.toName}
                  <span className="block text-xs text-navy-400">
                    {leg.mode}
                    {leg.approxKm ? ` · ~${leg.approxKm.toLocaleString("en-IN")} km as the crow flies` : ""}
                  </span>
                </span>
                <a
                  href={leg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-leg-link={leg.drivable ? "directions" : "flights"}
                  className="shrink-0 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-coral-300"
                >
                  {leg.drivable ? "🧭" : "✈️"} {leg.urlLabel}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">Stops</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {plan.stops.map((s, i) => {
            const on = focus.kind === "stop" && focus.slug === s.destination.slug;
            const q = placeQuery(s.destination);
            return (
              <li key={s.destination.slug} className={`rounded-xl border bg-white p-4 ${on ? "border-coral-300" : "border-navy-100"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setFocus({ kind: "stop", slug: s.destination.slug })}
                    data-map-stop={s.destination.slug}
                    className="min-w-0 text-left"
                  >
                    <span className="font-display font-semibold text-navy-800">
                      {i + 1}. {s.destination.name}
                    </span>
                    <span className="block text-xs text-navy-400">
                      {s.destination.district}, {s.state.name} · {formatDays(s.destination.idealDays)} · show on map
                    </span>
                  </button>
                  <MapButtons query={q} compact />
                </div>
                {on && (
                  <div className="mt-3">
                    <NearbyChips place={q} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
