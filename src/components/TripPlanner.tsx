"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { buildTrip, formatMonths, monthFull, monthName, type TripWarning } from "@/lib/trip";
import { formatDays, shortDays, themeEmoji } from "@/lib/format";
import { downloadFile, parseBagParam, tripShareUrl, tripToIcs, tripToText } from "@/lib/export";

const WARNING_STYLE: Record<TripWarning["kind"], { ring: string; chip: string; label: string }> = {
  permit: { ring: "border-coral-400", chip: "bg-coral-100 text-coral-700", label: "Permit" },
  season: { ring: "border-amber-400", chip: "bg-amber-100 text-amber-800", label: "Season" },
  transport: { ring: "border-sky-400", chip: "bg-sky-100 text-sky-800", label: "Transport" },
  altitude: { ring: "border-violet-400", chip: "bg-violet-100 text-violet-800", label: "Altitude" },
  pace: { ring: "border-navy-300", chip: "bg-navy-100 text-navy-700", label: "Pace" },
  length: { ring: "border-emerald-400", chip: "bg-emerald-100 text-emerald-800", label: "Length" },
};

const LEG_ICON: Record<string, string> = {
  Flight: "✈️",
  "Ferry or flight": "⛴️",
  Road: "🚗",
  "Walk / local transport": "🚶",
  "Train or road": "🚆",
};

export default function TripPlanner() {
  const { cartItems, cartSlugs, removeFromCart, replaceAll, isHydrated } = useCart();
  const searchParams = useSearchParams();

  const [travelMonth, setTravelMonth] = useState(0);
  const [daysAvailable, setDaysAvailable] = useState(0);
  const [copied, setCopied] = useState(false);
  const appliedBag = useRef(false);

  // A shared link carries the bag: /trip?bag=slug,slug
  useEffect(() => {
    if (appliedBag.current || !isHydrated) return;
    const incoming = parseBagParam(searchParams.get("bag"));
    if (incoming.length) {
      replaceAll(incoming);
      appliedBag.current = true;
    }
  }, [searchParams, isHydrated, replaceAll]);

  const trip = useMemo(
    () =>
      buildTrip(cartItems, {
        travelMonth: travelMonth || undefined,
        daysAvailable: daysAvailable || undefined,
      }),
    [cartItems, travelMonth, daysAvailable]
  );

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
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/destinations"
            className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Explore destinations
          </Link>
          <Link
            href="/circuits"
            className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
          >
            Start from a circuit
          </Link>
        </div>
      </div>
    );
  }

  const copyLink = async () => {
    const url = tripShareUrl(cartSlugs);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your trip link:", url);
    }
  };

  const fitsLabel =
    trip.daysAvailable && trip.totalDays <= trip.daysAvailable
      ? `Fits your ${trip.daysAvailable} days`
      : trip.daysAvailable
        ? `${formatDays(trip.totalDays - trip.daysAvailable)} over`
        : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-800">Your trip</h1>
          <p className="mt-2 text-navy-500">
            Built from {trip.stops.length} {trip.stops.length === 1 ? "destination" : "destinations"} across{" "}
            {trip.statesCovered.length} {trip.statesCovered.length === 1 ? "state" : "states"}, with travel
            between them costed in.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            {copied ? "Link copied ✓" : "Share link"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => downloadFile("onlytravelers-itinerary.txt", tripToText(trip), "text/plain")}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => {
              const start = new Date();
              start.setDate(start.getDate() + 30);
              downloadFile("onlytravelers-itinerary.ics", tripToIcs(trip, start), "text/calendar");
            }}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Planner controls */}
      <div className="mt-6 grid gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-card sm:grid-cols-2 print:hidden">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-navy-700">When are you going?</span>
          <select
            id="travel-month"
            value={travelMonth}
            onChange={(e) => setTravelMonth(Number(e.target.value))}
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            <option value={0}>Not decided yet</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </select>
          <span className="text-xs text-navy-400">
            {travelMonth
              ? `${trip.stops.filter((s) => !s.outOfSeason).length} of ${trip.stops.length} stops are in season`
              : "Pick a month to check every stop against its season"}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-navy-700">How many days do you have?</span>
          <select
            id="days-available"
            value={daysAvailable}
            onChange={(e) => setDaysAvailable(Number(e.target.value))}
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            <option value={0}>However long it takes</option>
            {[3, 5, 7, 10, 14, 21, 30].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
          <span className={`text-xs ${fitsLabel?.includes("over") ? "text-coral-600" : "text-navy-400"}`}>
            {fitsLabel ?? `This plan needs ${trip.totalDays} days`}
          </span>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [`${trip.totalDays}`, "days total"],
          [shortDays(trip.daysAtDestinations), "at the places"],
          [shortDays(trip.travelDays), "in transit"],
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
            <p className="mt-2 text-lg font-semibold text-navy-800">{formatMonths(trip.commonMonths)}</p>
            <p className="mt-1 text-sm text-navy-500">These months suit every destination in the bag.</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-coral-600">No month suits all of them</p>
            <p className="mt-1 text-sm text-navy-500">
              The best you can do is {formatMonths(trip.bestPartialMonths)}, which suits{" "}
              {trip.bestPartialCount} of {trip.stops.length}. Drop the outliers, or split this into two
              trips.
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
            const selected = travelMonth === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setTravelMonth(selected ? 0 : m)}
                className={`rounded px-2 py-1 text-[11px] font-semibold transition ${tone} ${
                  selected ? "ring-2 ring-navy-800 ring-offset-1" : ""
                }`}
                title={`${fit} of ${trip.stops.length} destinations are in season in ${monthName(m)}`}
              >
                {monthName(m)}
                <span className="ml-1 tabular-nums opacity-70">{fit}</span>
              </button>
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

      {/* Route */}
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
              className={`font-medium hover:text-coral-500 ${
                stop.outOfSeason ? "text-coral-600 line-through decoration-coral-300" : "text-navy-700"
              }`}
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

      {/* Stops */}
      <h2 className="mt-10 font-display text-xl font-semibold text-navy-800">Day by day</h2>
      <div className="mt-4 flex flex-col gap-4">
        {trip.stops.map((stop, i) => (
          <div key={stop.destination.slug}>
            {stop.arrivalLeg && (
              <div className="mb-4 ml-4 flex items-start gap-3 border-l-2 border-dashed border-navy-200 pl-6 text-sm text-navy-500">
                <span aria-hidden="true">{LEG_ICON[stop.arrivalLeg.mode] ?? "🚆"}</span>
                <div>
                  <p className="font-semibold text-navy-700">
                    {stop.arrivalLeg.mode} · ~{stop.arrivalLeg.approxKm} km · ~{stop.arrivalLeg.approxHours} hrs
                    {stop.arrivalLeg.days > 0 ? ` · costs ${formatDays(stop.arrivalLeg.days)}` : " · no travel day"}
                  </p>
                  <p className="mt-0.5">{stop.arrivalLeg.note}</p>
                </div>
              </div>
            )}

            <div
              className={`rounded-xl border bg-white p-5 shadow-card ${
                stop.outOfSeason ? "border-coral-300" : "border-navy-100"
              }`}
            >
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
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                    Day {stop.startDay}
                    {stop.endDay > stop.startDay ? `–${stop.endDay}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(stop.destination.slug)}
                    aria-label={`Remove ${stop.destination.name} from the trip`}
                    className="rounded-md px-2 py-1 text-sm font-semibold text-navy-300 hover:bg-navy-50 hover:text-coral-500 print:hidden"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {stop.outOfSeason && (
                <p className="mt-2 rounded-lg bg-coral-50 px-3 py-2 text-xs font-medium text-coral-700">
                  Out of season in {monthFull(trip.travelMonth!)} — best {stop.destination.bestMonthsLabel}.
                </p>
              )}

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
                Airports: {stop.state.airports.join(" · ")} · Railhead: {stop.state.railhead.split(",")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full day list, now grouped so shared days show together */}
      <details className="mt-8 rounded-xl border border-navy-100 bg-white p-5 shadow-card print:hidden">
        <summary className="cursor-pointer font-display text-sm font-semibold text-navy-800">
          See all {trip.totalDays} days as a list
        </summary>
        <ol className="mt-4 flex flex-col gap-3">
          {trip.days.map((d) => (
            <li key={d.day} className="flex gap-3 text-sm">
              <span className="w-16 shrink-0 font-semibold tabular-nums text-navy-400">Day {d.day}</span>
              <span className="flex flex-1 flex-col gap-1">
                {d.entries.map((e, idx) => (
                  <span key={`${e.title}-${idx}`}>
                    <span className={e.kind === "travel" ? "text-navy-500" : "font-medium text-navy-800"}>
                      {e.kind === "travel" ? "In transit — " : ""}
                      {e.title}
                    </span>
                    <span className="ml-2 rounded bg-navy-50 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-navy-400">
                      {e.share}
                    </span>
                    <span className="block text-xs text-navy-400">{e.detail}</span>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </details>

      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
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
