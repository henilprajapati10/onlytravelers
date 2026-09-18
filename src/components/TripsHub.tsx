"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTrips } from "@/context/TripsContext";
import { TRIP_STATUS } from "@/data/trips";
import { buildTrip, formatMonths, monthFull } from "@/lib/trip";
import { countLabel, shortDays, themeEmoji } from "@/lib/format";
import { destinations } from "@/data/destinations";

export default function TripsHub() {
  const { trips, activeTrip, setActiveTrip, createTrip, deleteTrip, duplicateTrip, isHydrated } =
    useTrips();
  const router = useRouter();

  if (!isHydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading your trips…</div>;
  }

  const start = () => {
    createTrip({ name: "New trip" });
    router.push("/destinations");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-800">My trips</h1>
          <p className="mt-2 text-navy-500">
            {trips.length === 0
              ? "Nothing saved yet."
              : `${trips.length} ${trips.length === 1 ? "trip" : "trips"} on this device.`}
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          className="rounded-lg bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
        >
          New trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
          <h2 className="font-display text-lg font-semibold text-navy-800">
            Start with a place, or a circuit
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-navy-500">
            Add destinations as you browse and they collect into a trip. Or load one of the
            twelve circuits and edit it from there.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/destinations"
              className="rounded-lg bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
            >
              Explore destinations
            </Link>
            <Link
              href="/circuits"
              className="rounded-lg border border-navy-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-500"
            >
              Browse circuits
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {trips.map((trip) => {
            const items = trip.slugs
              .map((s) => destinations.find((d) => d.slug === s))
              .filter((d): d is (typeof destinations)[number] => Boolean(d));
            const plan = buildTrip(items, {
              travelMonth: trip.travelMonth,
              daysAvailable: trip.daysAvailable,
            });
            const status = TRIP_STATUS.find((s) => s.id === trip.status) ?? TRIP_STATUS[0];
            const isActive = activeTrip?.id === trip.id;

            return (
              <article
                key={trip.id}
                className={`rounded-2xl border bg-white p-5 shadow-card transition ${
                  isActive ? "border-coral-300 ring-1 ring-coral-200" : "border-navy-100"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.tone}`}>
                        {status.label}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[11px] font-semibold text-coral-700">
                          Active
                        </span>
                      )}
                    </div>
                    <h2 className="font-display mt-2 text-xl font-semibold text-navy-800">
                      <Link href={`/trips/${trip.id}`} className="hover:text-coral-500">
                        {trip.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-navy-400">
                      {items.length === 0
                        ? "No destinations yet"
                        : `${items.length} ${items.length === 1 ? "stop" : "stops"} · ${
                            plan ? `${plan.totalDays} days` : ""
                          }${plan && plan.statesCovered.length ? ` · ${countLabel(plan.statesCovered.length, "state")}` : ""}`}
                      {trip.travelMonth ? ` · ${monthFull(trip.travelMonth)}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => setActiveTrip(trip.id)}
                        className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-coral-300"
                      >
                        Make active
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => duplicateTrip(trip.id)}
                      className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-coral-300"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${trip.name}"? This cannot be undone.`)) {
                          deleteTrip(trip.id);
                        }
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-400 hover:bg-navy-50 hover:text-coral-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {items.length > 0 && (
                  <>
                    <ol className="mt-3 flex flex-wrap gap-1.5">
                      {items.slice(0, 6).map((d) => (
                        <li
                          key={d.slug}
                          className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600"
                        >
                          {themeEmoji[d.themes[0]]} {d.name}
                        </li>
                      ))}
                      {items.length > 6 && (
                        <li className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] text-navy-400">
                          +{items.length - 6} more
                        </li>
                      )}
                    </ol>

                    {plan && (
                      <p className="mt-3 text-xs text-navy-400">
                        {shortDays(plan.daysAtDestinations)} at the places ·{" "}
                        {shortDays(plan.travelDays)} in transit ·{" "}
                        {plan.commonMonths.length
                          ? `best ${formatMonths(plan.commonMonths)}`
                          : "seasons do not fully overlap"}
                      </p>
                    )}
                  </>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
                  >
                    Open trip
                  </Link>
                  <Link
                    href={`/trips/${trip.id}?tab=prep`}
                    className="rounded-lg border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-700 hover:border-coral-300"
                  >
                    Prep list
                  </Link>
                  <Link
                    href={`/trips/${trip.id}?tab=bookings`}
                    className="rounded-lg border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-700 hover:border-coral-300"
                  >
                    Bookings
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
