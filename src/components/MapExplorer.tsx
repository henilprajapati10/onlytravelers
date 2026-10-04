"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { destinations, getDestination } from "@/data/destinations";
import { getState, states } from "@/data/states";
import { useTrips } from "@/context/TripsContext";
import { formatDays, themeEmoji } from "@/lib/format";
import { PIN_NOTE, embedPlaceUrl, mapsSearchUrl, placeQuery, stateQuery } from "@/lib/maps";
import { googleMapsKey } from "@/lib/mapsConfig";
import AddToCartButton from "./AddToCartButton";
import GoogleMapEmbed from "./GoogleMapEmbed";
import { MapButtons, NearbyChips } from "./MapActions";

/**
 * Explore on a map: pick a state, pick a place, see it on Google Maps with
 * directions and what is around it. The URL carries the selection, so a
 * destination or state page can deep-link straight in.
 */
export default function MapExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const { activeTrip } = useTrips();
  const [filter, setFilter] = useState("");

  const place = getDestination(params.get("place") ?? "");
  const state = getState(params.get("state") ?? "") ?? (place ? getState(place.stateId) : undefined);

  const select = (next: { place?: string; state?: string }) => {
    const qs = new URLSearchParams();
    if (next.state) qs.set("state", next.state);
    if (next.place) qs.set("place", next.place);
    const s = qs.toString();
    router.replace(`/map${s ? `?${s}` : ""}`, { scroll: false });
  };

  const list = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return destinations.filter((d) => {
      if (state && d.stateId !== state.id) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.themes.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [filter, state]);

  const query = place ? placeQuery(place) : state ? stateQuery(state) : "India";
  const title = place ? place.name : state ? state.name : "India";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-800">Explore on the map</h1>
          <p className="mt-1 text-navy-500">
            Every destination on Google Maps, with directions and what is around it.
          </p>
        </div>
        {activeTrip && activeTrip.slugs.length > 1 && (
          <Link
            href={`/trips/${activeTrip.id}?tab=map`}
            className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            🧭 {activeTrip.name} on the map
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Picker */}
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-2">
          <label className="text-sm font-semibold text-navy-700">
            State or union territory
            <select
              value={state?.id ?? ""}
              onChange={(e) => select({ state: e.target.value || undefined })}
              aria-label="State or union territory"
              className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">All of India</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, district or theme"
            aria-label="Filter places"
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm"
          />
          <p className="text-xs text-navy-400">
            {list.length} {list.length === 1 ? "place" : "places"}
            {state ? ` in ${state.name}` : ""}
          </p>
          <ul className="max-h-[22rem] overflow-y-auto rounded-xl border border-navy-100 bg-white lg:max-h-[30rem]" data-map-list>
            {list.slice(0, 120).map((d) => {
              const on = place?.slug === d.slug;
              return (
                <li key={d.slug} className="border-b border-navy-50 last:border-0">
                  <button
                    type="button"
                    onClick={() => select({ state: d.stateId, place: d.slug })}
                    aria-pressed={on}
                    data-map-place={d.slug}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${on ? "bg-coral-50" : "hover:bg-sand-50"}`}
                  >
                    <span aria-hidden="true">{themeEmoji[d.themes[0]]}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate font-semibold ${on ? "text-coral-600" : "text-navy-800"}`}>{d.name}</span>
                      <span className="block truncate text-xs text-navy-400">
                        {d.district}, {d.stateName}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {list.length > 120 && (
              <li className="px-3 py-2.5 text-xs text-navy-400">Pick a state or filter to see the rest.</li>
            )}
            {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-navy-400">Nothing matches.</li>}
          </ul>
        </div>

        {/* Map */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
          <GoogleMapEmbed
            key={query}
            src={embedPlaceUrl(query, googleMapsKey)}
            title={`Google Map of ${title}`}
            openUrl={mapsSearchUrl(query)}
            className="aspect-[4/3]"
          />

          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <h2 className="font-display text-xl font-semibold text-navy-800" data-map-title>
              {title}
            </h2>
            {place ? (
              <>
                <p className="mt-1 text-sm text-navy-500">
                  {place.district}, {place.stateName} · {formatDays(place.idealDays)} · best {place.bestMonthsLabel}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <MapButtons query={query} />
                  <AddToCartButton slug={place.slug} />
                  <Link
                    href={`/destinations/${place.slug}`}
                    className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
                  >
                    Read the guide
                  </Link>
                </div>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-navy-400">Find nearby</p>
                <NearbyChips place={query} />
                <p className="mt-3 text-xs text-navy-400">{PIN_NOTE}</p>
              </>
            ) : state ? (
              <>
                <p className="mt-1 text-sm text-navy-500">{state.positioning}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <MapButtons query={query} />
                  <Link
                    href={`/states/${state.id}`}
                    className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
                  >
                    About {state.name}
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-navy-500">
                Pick a state, then a place, to see it here — or filter the list by what you are after.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
