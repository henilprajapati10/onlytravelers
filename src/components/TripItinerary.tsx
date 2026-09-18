"use client";

import Link from "next/link";
import { useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { formatMonths, monthFull, monthName, type TripPlan, type TripWarning } from "@/lib/trip";
import { formatDays, shortDays, themeEmoji } from "@/lib/format";
import { downloadFile, tripShareUrl, tripToIcs, tripToText } from "@/lib/export";

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

export default function TripItinerary({
  plan,
  travelMonth,
  daysAvailable,
  onChange,
}: {
  plan: TripPlan;
  tripId: string;
  travelMonth: number;
  daysAvailable: number;
  startDate: string;
  onChange: (patch: { travelMonth?: number; daysAvailable?: number }) => void;
}) {
  const { removeFromTrip, reorder } = useTrips();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = tripShareUrl(plan.stops.map((s) => s.destination.slug));
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your trip link:", url);
    }
  };

  const fitsLabel =
    daysAvailable && plan.totalDays <= daysAvailable
      ? `Fits your ${daysAvailable} days`
      : daysAvailable
        ? `${formatDays(plan.totalDays - daysAvailable)} over`
        : `This plan needs ${plan.totalDays} days`;

  return (
    <div>
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
          onClick={() => downloadFile("onlytravelers-itinerary.txt", tripToText(plan), "text/plain")}
          className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => {
            const start = new Date();
            start.setDate(start.getDate() + 30);
            downloadFile("onlytravelers-itinerary.ics", tripToIcs(plan, start), "text/calendar");
          }}
          className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
        >
          Calendar
        </button>
      </div>

      {/* Controls */}
      <div className="mt-4 grid gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-card sm:grid-cols-2 print:hidden">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-navy-700">When are you going?</span>
          <select
            id="travel-month"
            value={travelMonth}
            onChange={(e) => onChange({ travelMonth: Number(e.target.value) || undefined })}
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            <option value={0}>Not decided yet</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {monthFull(m)}
              </option>
            ))}
          </select>
          <span className="text-xs text-navy-400">
            {travelMonth
              ? `${plan.stops.filter((s) => !s.outOfSeason).length} of ${plan.stops.length} stops are in season`
              : "Pick a month to check every stop against its season"}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-navy-700">How many days do you have?</span>
          <select
            id="days-available"
            value={daysAvailable}
            onChange={(e) => onChange({ daysAvailable: Number(e.target.value) || undefined })}
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            <option value={0}>However long it takes</option>
            {[3, 5, 7, 10, 14, 21, 30].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
          <span className={`text-xs ${fitsLabel.includes("over") ? "text-coral-600" : "text-navy-400"}`}>
            {fitsLabel}
          </span>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [`${plan.totalDays}`, "days total"],
          [shortDays(plan.daysAtDestinations), "at the places"],
          [shortDays(plan.travelDays), "in transit"],
          [`${plan.approxKm.toLocaleString("en-IN")} km`, "approx distance"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
            <div className="font-display text-2xl font-bold tabular-nums text-navy-800">{value}</div>
            <div className="text-xs uppercase tracking-wide text-navy-400">{label}</div>
          </div>
        ))}
      </div>

      {/* When to go */}
      <div className="mt-4 rounded-xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
          When to go
        </h2>
        {plan.commonMonths.length > 0 ? (
          <>
            <p className="mt-2 text-lg font-semibold text-navy-800">{formatMonths(plan.commonMonths)}</p>
            <p className="mt-1 text-sm text-navy-500">These months suit every destination in the trip.</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-coral-600">No month suits all of them</p>
            <p className="mt-1 text-sm text-navy-500">
              The best you can do is {formatMonths(plan.bestPartialMonths)}, which suits{" "}
              {plan.bestPartialCount} of {plan.stops.length}.
            </p>
          </>
        )}
        <div className="mt-3 flex flex-wrap gap-1">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const fit = plan.monthFit[m - 1];
            const ratio = plan.stops.length ? fit / plan.stops.length : 0;
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
              <button
                key={m}
                type="button"
                onClick={() => onChange({ travelMonth: travelMonth === m ? undefined : m })}
                className={`rounded px-2 py-1 text-[11px] font-semibold transition ${tone} ${
                  travelMonth === m ? "ring-2 ring-navy-800 ring-offset-1" : ""
                }`}
                title={`${fit} of ${plan.stops.length} in season in ${monthName(m)}`}
              >
                {monthName(m)}
                <span className="ml-1 tabular-nums opacity-70">{fit}</span>
              </button>
            );
          })}
        </div>
      </div>

      {plan.warnings.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {plan.warnings.map((w) => {
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

      <h2 className="mt-8 font-display text-xl font-semibold text-navy-800">Day by day</h2>
      <div className="mt-4 flex flex-col gap-4">
        {plan.stops.map((stop, i) => (
          <div key={stop.destination.slug}>
            {stop.arrivalLeg && (
              <div className="mb-4 ml-4 flex items-start gap-3 border-l-2 border-dashed border-navy-200 pl-6 text-sm text-navy-500">
                <span aria-hidden="true">{LEG_ICON[stop.arrivalLeg.mode] ?? "🚆"}</span>
                <div>
                  <p className="font-semibold text-navy-700">
                    {stop.arrivalLeg.mode} · ~{stop.arrivalLeg.approxKm} km · ~
                    {stop.arrivalLeg.approxHours} hrs
                    {stop.arrivalLeg.days > 0
                      ? ` · costs ${formatDays(stop.arrivalLeg.days)}`
                      : " · no travel day"}
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
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                    Day {stop.startDay}
                    {stop.endDay > stop.startDay ? `–${stop.endDay}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => reorder(stop.destination.slug, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${stop.destination.name} earlier`}
                    className="rounded px-1.5 text-navy-300 hover:text-navy-700 disabled:opacity-30 print:hidden"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(stop.destination.slug, 1)}
                    disabled={i === plan.stops.length - 1}
                    aria-label={`Move ${stop.destination.name} later`}
                    className="rounded px-1.5 text-navy-300 hover:text-navy-700 disabled:opacity-30 print:hidden"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromTrip(stop.destination.slug)}
                    aria-label={`Remove ${stop.destination.name} from the trip`}
                    className="rounded px-1.5 text-navy-300 hover:text-coral-500 print:hidden"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {stop.outOfSeason && (
                <p className="mt-2 rounded-lg bg-coral-50 px-3 py-2 text-xs font-medium text-coral-700">
                  Out of season in {monthFull(travelMonth)} — best {stop.destination.bestMonthsLabel}.
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
              </div>

              <p className="mt-3 text-xs text-navy-400">
                Airports: {stop.state.airports.join(" · ")} · Railhead:{" "}
                {stop.state.railhead.split(",")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/destinations"
          className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Add more destinations
        </Link>
        <Link
          href="/circuits"
          className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
        >
          Browse circuits
        </Link>
      </div>
    </div>
  );
}
