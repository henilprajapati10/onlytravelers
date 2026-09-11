"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { generateTrip } from "@/lib/tripGenerator";
import { primaryCategoryStyle } from "@/lib/categoryStyles";

export default function TripPage() {
  const { cartItems, isHydrated } = useCart();
  const trip = generateTrip(cartItems);

  if (isHydrated && !trip) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-800">
          Nothing to build yet
        </h1>
        <p className="mt-3 text-navy-500">
          Add a few destinations to your Trip Bag first, and we&apos;ll
          auto-generate an itinerary out of exactly what you picked.
        </p>
        <Link
          href="/destinations"
          className="mt-6 inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Explore Destinations
        </Link>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Your Auto-Generated Trip</h1>
      <p className="mt-2 text-navy-500">
        Built from the {trip.totalDestinations} destination
        {trip.totalDestinations !== 1 ? "s" : ""} in your Trip Bag, sequenced
        by region with travel days built in.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock label="Total length" value={`${trip.totalDays} days`} />
        <StatBlock label="Destinations" value={String(trip.totalDestinations)} />
        <StatBlock label="Regions covered" value={String(trip.regionsCovered.length)} />
        <StatBlock label="Travel/buffer days" value={String(trip.totalTravelBufferDays)} />
      </div>

      <div className="mt-10 space-y-10">
        {trip.legs.map((leg, legIndex) => (
          <div key={leg.region}>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {legIndex + 1}
              </span>
              <h2 className="font-display text-xl font-semibold text-navy-800">{leg.region}</h2>
            </div>

            <div className="mt-4 ml-4 space-y-4 border-l-2 border-navy-100 pl-6">
              {leg.stops.map((stop) => {
                const style = primaryCategoryStyle(stop.destination.categories);
                return (
                  <div
                    key={stop.destination.slug}
                    className="rounded-xl border border-navy-100 bg-white p-5 shadow-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/destinations/${stop.destination.slug}`}
                        className="font-display font-semibold text-navy-800 hover:text-coral-500"
                      >
                        {stop.destination.name}
                      </Link>
                      <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600">
                        Day {stop.startDay}
                        {stop.endDay > stop.startDay ? `–${stop.endDay}` : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-navy-500">{stop.destination.tagline}</p>
                    <p className="mt-2 text-xs text-navy-400">
                      Best time: {stop.destination.bestTime}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-navy-400">
                      <span className="text-base">{style.emoji}</span>
                      {stop.destination.travelerTip}
                    </p>
                  </div>
                );
              })}
            </div>

            {leg.travelBufferDaysAfter > 0 && (
              <div className="ml-4 mt-3 flex items-center gap-2 pl-6 text-sm text-navy-400">
                <span aria-hidden="true">✈️</span>
                <span>
                  {leg.travelBufferDaysAfter} travel day
                  {leg.travelBufferDaysAfter > 1 ? "s" : ""} to reach the next
                  region
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy-100 bg-navy-50 p-6">
        <h3 className="font-display font-semibold text-navy-800">Best times to travel</h3>
        <p className="mt-2 text-sm text-navy-600">
          Your selected destinations are best visited during: {trip.bestTimes.join(" · ")}.
          If these windows don&apos;t all line up, prioritize the destinations
          you care about most, or split this into two trips.
        </p>
      </div>

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
          Add More Destinations
        </Link>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
      <div className="font-display text-2xl font-bold text-navy-800">{value}</div>
      <div className="text-xs uppercase tracking-wide text-navy-400">{label}</div>
    </div>
  );
}
