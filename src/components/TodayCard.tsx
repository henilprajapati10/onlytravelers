"use client";

import Link from "next/link";
import type { SavedTrip } from "@/data/trips";
import type { TripPlan } from "@/lib/trip";
import { todayFor, formatTripDate } from "@/lib/today";
import { NATIONAL_NUMBERS, essentialsFor } from "@/data/essentials";
import { themeEmoji } from "@/lib/format";

const LEG_ICON: Record<string, string> = {
  Flight: "✈️",
  "Ferry or flight": "⛴️",
  Road: "🚗",
  "Walk / local transport": "🚶",
  "Train or road": "🚆",
};

/**
 * The screen for a trip that is actually happening. Everything here answers a
 * question you ask standing on a platform, not at a desk.
 */
export default function TodayCard({
  trip,
  plan,
  compact = false,
}: {
  trip: SavedTrip;
  plan: TripPlan;
  compact?: boolean;
}) {
  const state = todayFor(trip, plan);

  if (!state) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-5">
        <h2 className="font-display font-semibold text-navy-800">Set a start date</h2>
        <p className="mt-1 text-sm text-navy-500">
          Add the date you leave and this becomes a day-by-day companion: where you are, what
          moves today, and what is next.
        </p>
        <Link
          href={`/trips/${trip.id}?tab=bookings`}
          className="mt-3 inline-block rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
        >
          Set start date
        </Link>
      </div>
    );
  }

  if (state.phase === "before") {
    const first = state.next;
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral-500">
          {state.daysUntil === 1 ? "Tomorrow" : `In ${state.daysUntil} days`}
        </p>
        <h2 className="font-display mt-1 text-xl font-semibold text-navy-800">{trip.name}</h2>
        {first && (
          <p className="mt-1 text-sm text-navy-500">
            Starts at {first.destination.name}, {first.state.name} on{" "}
            {formatTripDate(trip.startDate, 1)}.
          </p>
        )}
        <Link
          href={`/trips/${trip.id}?tab=prep`}
          className="mt-4 inline-block rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Check the prep list
        </Link>
      </div>
    );
  }

  if (state.phase === "after") {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display text-xl font-semibold text-navy-800">{trip.name} is done</h2>
        <p className="mt-1 text-sm text-navy-500">
          {plan.stops.length} stops, {plan.statesCovered.length} states,{" "}
          {plan.approxKm.toLocaleString("en-IN")} km.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/trips/${trip.id}?tab=spend`}
            className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            See what it cost
          </Link>
          <Link
            href="/start"
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Plan the next one
          </Link>
        </div>
      </div>
    );
  }

  const here = state.current;
  const essentials = here ? essentialsFor(here.state.id) : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="bg-navy-800 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral-400">
          Day {state.dayNumber} of {plan.totalDays} · {formatTripDate(trip.startDate, state.dayNumber)}
        </p>

        {state.todayLeg ? (
          <>
            <h2 className="font-display mt-1 text-2xl font-bold">
              {LEG_ICON[state.todayLeg.mode] ?? "🚆"} {state.todayLeg.toName}
            </h2>
            <p className="mt-1 text-sm text-navy-200">
              Moving today — {state.todayLeg.mode.toLowerCase()}, about{" "}
              {state.todayLeg.approxKm} km and {state.todayLeg.approxHours} hrs from{" "}
              {state.todayLeg.fromName}.
            </p>
          </>
        ) : here ? (
          <>
            <h2 className="font-display mt-1 text-2xl font-bold">{here.destination.name}</h2>
            <p className="mt-1 text-sm text-navy-200">
              {here.destination.district}, {here.state.name}
              {state.lastDayHere && state.next ? " · last day here" : ""}
            </p>
          </>
        ) : (
          <h2 className="font-display mt-1 text-2xl font-bold">On the road</h2>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {here && !state.todayLeg && (
          <div className="flex flex-wrap gap-1.5">
            {here.destination.themes.map((t) => (
              <span key={t} className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] text-navy-600">
                {themeEmoji[t]} {t}
              </span>
            ))}
            <Link
              href={`/destinations/${here.destination.slug}`}
              className="rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-semibold text-coral-600"
            >
              Open the guide →
            </Link>
          </div>
        )}

        {/* What's next */}
        {state.next && (
          <div className="rounded-xl bg-sand-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Next</p>
            <p className="mt-1 font-semibold text-navy-800">{state.next.destination.name}</p>
            <p className="text-sm text-navy-500">
              From {formatTripDate(trip.startDate, state.next.startDay)}
              {state.nextLeg && state.nextLeg.days > 0
                ? ` · ${state.nextLeg.mode.toLowerCase()}, ~${state.nextLeg.approxHours} hrs`
                : ""}
            </p>
            {state.nextLeg && state.nextLeg.days > 0 && (
              <p className="mt-1 text-xs text-navy-500">{state.nextLeg.note}</p>
            )}
          </div>
        )}

        {!compact && essentials && here && (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                In {here.state.name}
              </p>
              <dl className="mt-2 flex flex-col gap-2 text-sm">
                <div>
                  <dt className="font-semibold text-navy-700">Language</dt>
                  <dd className="text-navy-600">{essentials.languages.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-700">Getting around</dt>
                  <dd className="text-navy-600">{essentials.gettingAround}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-700">Eat</dt>
                  <dd className="text-navy-600">{essentials.eat}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-700">Watch for</dt>
                  <dd className="text-navy-600">{essentials.watchFor}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-2">
              {NATIONAL_NUMBERS.map((n) => (
                <a
                  key={n.number}
                  href={`tel:${n.number}`}
                  title={n.note}
                  className="rounded-lg border border-coral-200 bg-coral-50 px-3 py-2 text-sm font-semibold text-coral-700"
                >
                  {n.label}: {n.number}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/trips/${trip.id}`}
            className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Full itinerary
          </Link>
          <Link
            href={`/trips/${trip.id}?tab=spend`}
            className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Log a spend
          </Link>
        </div>
      </div>
    </div>
  );
}
