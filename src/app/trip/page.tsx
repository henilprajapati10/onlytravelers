"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { buildTrip, formatMonths, monthName, type TripWarning } from "@/lib/trip";
import { formatDays, themeEmoji } from "@/lib/format";

const WARNING_STYLE: Record<TripWarning["kind"], { ring: string; chip: string; label: string }> = {
  permit: { ring: "border-coral-400", chip: "bg-coral-100 text-coral-700", label: "Permit" },
  season: { ring: "border-amber-400", chip: "bg-amber-100 text-amber-800", label: "Season" },
  transport: { ring: "border-sky-400", chip: "bg-sky-100 text-sky-800", label: "Transport" },
  altitude: { ring: "border-violet-400", chip: "bg-violet-100 text-violet-800", label: "Altitude" },
  pace: { ring: "border-navy-300", chip: "bg-navy-100 text-navy-700", label: "Pace" },
};

export default function TripPage() {
  const { cartItems, isHydrated } = useCart();
  const trip = buildTrip(cartItems);

  if (!isHydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading your trip…</div>;
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-800">Nothing to build yet</h1>
        <p className="mt-3 text-navy-500">
          Add a few destinations to your Trip Bag and we will sequence them into a real
          itinerary — route, travel time, season fit and the warnings that catch people out.
        </p>
        <Link
          href="/destinations"
          className="mt-6 inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Explore destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Your trip</h1>
      <p className="mt-2 text-navy-500">
        Built from {trip.stops.length} {trip.stops.length === 1 ? "destination" : "destinations"} across{" "}
        {trip.statesCovered.length} {trip.statesCovered.length === 1 ? "state" : "states"}, with travel
        between them costed in.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [`${trip.totalDays}`, "days total"],
          [`${trip.daysAtDestinations}`, "days at places"],
          [`${trip.travelDays}`, "days in transit"],
          [`${trip.approxKm.toLocaleString("en-IN")} km`, "approx distance"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
            <div className="font-display text-2xl font-bold tabular-nums text-navy-800">{value}</div>
            <div className="text-xs uppercase tracking-wide text-navy-400">{label}</div>
          </div>
        ))}
      </div>

      {/* When to go */}
      <div className="mt-6 rounded-xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
          When to go
        </h2>
        {trip.commonMonths.length > 0 ? (
          <>
            <p className="mt-2 text-lg font-semibold text-navy-800">
              {formatMonths(trip.commonMonths)}
            </p>
            <p className="mt-1 text-sm text-navy-500">
              These months suit every destination in the bag.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-coral-600">No month suits all of them</p>
            <p className="mt-1 text-sm text-navy-500">
              The best you can do is {formatMonths(trip.bestPartialMonths)}, which suits{" "}
              {trip.bestPartialCount} of {trip.stops.length}. Drop the outliers, or split this
              into two trips.
            </p>
          </>
        )}
        <div className="mt-3 flex flex-wrap gap-1">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const fit = trip.monthFit[m - 1];
            const ratio = trip.stops.length ? fit / trip.stops.length : 0;
            const tone =
              ratio === 1
                ? "bg-emerald-600 text-white"
                : ratio >= 0.66
                  ? "bg-emerald-300 text-emerald-900"
                  : ratio >= 0.34
                    ? "bg-emerald-100 text-emerald-800"
                    : ratio > 0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-navy-50 text-navy-300";
            return (
              <span
                key={m}
                className={`rounded px-2 py-1 text-[11px] font-semibold ${tone}`}
                title={`${fit} of ${trip.stops.length} destinations are in season in ${monthName(m)}`}
              >
                {monthName(m)}
                <span className="ml-1 tabular-nums opacity-70">{fit}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {trip.warnings.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {trip.warnings.map((w) => {
            const style = WARNING_STYLE[w.kind];
            return (
              <div key={w.title} className={`rounded-xl border-l-4 bg-white p-4 shadow-card ${style.ring}`}>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${style.chip}`}>
                    {style.label}
                  </span>
                  <h3 className="font-display text-sm font-semibold text-navy-800">{w.title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-navy-600">{w.detail}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Route summary */}
      <h2 className="mt-10 font-display text-xl font-semibold text-navy-800">The route</h2>
      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 rounded-xl border border-navy-100 bg-white p-4 text-sm shadow-card">
        <span className="rounded bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-500">
          Fly into {trip.arrivalAirports[0] ?? "—"}
        </span>
        {trip.stops.map((stop) => (
          <span key={stop.destination.slug} className="flex items-center gap-1">
            <span className="text-navy-300">→</span>
            <Link
              href={`/destinations/${stop.destination.slug}`}
              className="font-medium text-navy-700 hover:text-coral-500"
            >
              {stop.destination.name}
            </Link>
          </span>
        ))}
        <span className="text-navy-300">→</span>
        <span className="rounded bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-500">
          Out of {trip.departureAirports[0] ?? "—"}
        </span>
      </div>

      {/* Stops with travel legs */}
      <h2 className="mt-10 font-display text-xl font-semibold text-navy-800">Day by day</h2>
      <div className="mt-4 flex flex-col gap-4">
        {trip.stops.map((stop, i) => (
          <div key={stop.destination.slug}>
            {stop.arrivalLeg && (
              <div className="mb-4 ml-4 flex items-start gap-3 border-l-2 border-dashed border-navy-200 pl-6 text-sm text-navy-500">
                <span aria-hidden="true">
                  {stop.arrivalLeg.mode === "Flight"
                    ? "✈️"
                    : stop.arrivalLeg.mode === "Ferry or flight"
                      ? "⛴️"
                      : stop.arrivalLeg.mode === "Road"
                        ? "🚗"
                        : stop.arrivalLeg.mode === "Walk / local transport"
                          ? "🚶"
                          : "🚆"}
                </span>
                <div>
                  <p className="font-semibold text-navy-700">
                    {stop.arrivalLeg.mode} · ~{stop.arrivalLeg.approxKm} km · ~
                    {stop.arrivalLeg.approxHours} hrs
                  </p>
                  <p className="mt-0.5">{stop.arrivalLeg.note}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-coral-500">
                    Stop {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-navy-800">
                    <Link href={`/destinations/${stop.destination.slug}`} className="hover:text-coral-500">
                      {stop.destination.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-navy-400">
                    {stop.destination.district} · {stop.state.name}
                  </p>
                </div>
                <span className="rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                  Day {stop.startDay}
                  {stop.endDay > stop.startDay ? `–${stop.endDay}` : ""}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {stop.destination.themes.map((t) => (
                  <span key={t} className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] text-navy-600">
                    {themeEmoji[t]} {t}
                  </span>
                ))}
                <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] text-navy-600">
                  {formatDays(stop.destination.idealDays)} here
                </span>
                <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] text-navy-600">
                  Best: {stop.destination.bestMonthsLabel}
                </span>
              </div>

              <p className="mt-3 text-xs text-navy-400">
                Airports: {stop.state.airports.join(" · ")} · Railhead:{" "}
                {stop.state.railhead.split(",")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full day list */}
      <details className="mt-8 rounded-xl border border-navy-100 bg-white p-5 shadow-card">
        <summary className="cursor-pointer font-display text-sm font-semibold text-navy-800">
          See all {trip.totalDays} days as a list
        </summary>
        <ol className="mt-4 flex flex-col gap-2">
          {trip.days.map((d) => (
            <li key={`${d.day}-${d.title}`} className="flex gap-3 text-sm">
              <span className="w-16 shrink-0 font-semibold tabular-nums text-navy-400">Day {d.day}</span>
              <span>
                <span className={d.kind === "travel" ? "text-navy-500" : "font-medium text-navy-800"}>
                  {d.kind === "travel" ? "In transit — " : ""}
                  {d.title}
                </span>
                <span className="block text-xs text-navy-400">{d.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </details>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/cart"
          className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
        >
          Edit Trip Bag
        </Link>
        <Link
          href="/destinations"
          className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Add more destinations
        </Link>
      </div>
    </div>
  );
}
