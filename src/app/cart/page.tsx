"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatDays, shortDays, themeEmoji } from "@/lib/format";
import { buildTrip } from "@/lib/trip";

export default function CartPage() {
  const { cartItems, daysAtDestinations, removeFromCart, clearCart, isHydrated } = useCart();
  const trip = buildTrip(cartItems);

  if (!isHydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading…</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-800">Your Trip Bag is empty</h1>
        <p className="mt-3 text-navy-500">
          Add the places that pull you in. We turn the bag into a sequenced itinerary with
          travel time, seasons and permits worked out.
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

  const byState = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    (acc[item.stateName] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-navy-800">Your Trip Bag</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-navy-400 hover:text-coral-500"
        >
          Clear all
        </button>
      </div>
      <p className="mt-2 text-navy-500">
        {cartItems.length} {cartItems.length === 1 ? "destination" : "destinations"} ·{" "}
        {formatDays(daysAtDestinations)} at the places themselves
        {trip ? ` · ${trip.totalDays} days once travel is added` : ""}
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {Object.entries(byState).map(([stateName, items]) => (
          <div key={stateName}>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-navy-400">
              {stateName}
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-4 shadow-card"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {themeEmoji[item.themes[0]]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/destinations/${item.slug}`}
                      className="font-display font-semibold text-navy-800 hover:text-coral-500"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-navy-400">
                      {item.district} · {shortDays(item.idealDays)} · {item.bestMonthsLabel}
                      {item.permitRequired && (
                        <span className="ml-2 rounded bg-coral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-coral-700">
                          Permit
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.slug)}
                    className="shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold text-navy-400 hover:bg-navy-50 hover:text-coral-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-navy-800 p-8 text-center text-white">
        <h2 className="font-display text-xl font-semibold">Ready to see this as a trip?</h2>
        <p className="max-w-md text-sm text-navy-200">
          We sequence these by zone and state, add every hop with its mode and hours, check
          the season fit and flag permits and ferries.
        </p>
        <Link
          href="/trip"
          className="mt-2 rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Build my trip
        </Link>
      </div>
    </div>
  );
}
