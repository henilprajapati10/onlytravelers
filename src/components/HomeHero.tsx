"use client";

import Link from "next/link";
import { useTrips } from "@/context/TripsContext";
import { destinations } from "@/data/destinations";
import { buildTrip } from "@/lib/trip";
import { TRIP_STATUS } from "@/data/trips";
import TodayCard from "./TodayCard";

/**
 * With a trip on the go, home opens on it. The marketing hero is for people
 * who have not started one — everyone else wants the thing they are doing.
 */
export default function HomeHero() {
  const { trips, activeTrip, isHydrated } = useTrips();

  const trip = activeTrip ?? trips[0] ?? null;
  const items = (trip?.slugs ?? [])
    .map((s) => destinations.find((d) => d.slug === s))
    .filter((d): d is (typeof destinations)[number] => Boolean(d));
  const plan = items.length
    ? buildTrip(items, { travelMonth: trip?.travelMonth, daysAvailable: trip?.daysAvailable })
    : null;

  // Server and first client render must match, so the marketing hero is the
  // default until we know what is stored.
  if (!isHydrated || !trip || !plan) {
    return (
      <section className="bg-topo border-b border-navy-100">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-4 inline-block rounded-full bg-navy-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
            Be travelers, not tourists
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.1] text-navy-800 sm:text-6xl">
            Before life gets too busy, travel.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-600">
            Every state, every union territory, {destinations.length} destinations — each with
            what it is, how long it deserves, when to go and how to reach it. Tell us how long
            you have and we will build the whole trip around it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/start"
              className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-coral-600"
            >
              Plan my trip in 30 seconds
            </Link>
            <Link
              href="/destinations"
              className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition hover:border-navy-500"
            >
              Browse {destinations.length} destinations
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["36", "states & UTs"],
              [String(destinations.length), "destinations"],
              ["12", "ready circuits"],
              ["100%", "with a guide"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-bold text-navy-800">{value}</dt>
                <dd className="text-xs uppercase tracking-wide text-navy-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  const status = TRIP_STATUS.find((s) => s.id === trip.status) ?? TRIP_STATUS[0];

  return (
    <section className="border-b border-navy-100 bg-sand-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Your trip
            </p>
            <h1 className="font-display text-2xl font-bold text-navy-800">{trip.name}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.tone}`}>
            {status.label}
          </span>
        </div>

        <TodayCard trip={trip} plan={plan} compact />

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/trips"
            className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            All my trips{trips.length > 1 ? ` (${trips.length})` : ""}
          </Link>
          <Link
            href="/start"
            className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Plan another
          </Link>
          <Link
            href="/destinations"
            className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
          >
            Add a stop
          </Link>
        </div>
      </div>
    </section>
  );
}
