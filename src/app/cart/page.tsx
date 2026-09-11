"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { primaryCategoryStyle } from "@/lib/categoryStyles";

export default function CartPage() {
  const { cartItems, totalDays, removeFromCart, clearCart, isHydrated } = useCart();

  if (isHydrated && cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-800">
          Your Trip Bag is empty
        </h1>
        <p className="mt-3 text-navy-500">
          Browse destinations and tap &quot;Add to Trip Bag&quot; on the
          places that pull you in. We&apos;ll turn your picks into a real
          itinerary.
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-navy-800">Your Trip Bag</h1>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-navy-400 hover:text-coral-500"
          >
            Clear all
          </button>
        )}
      </div>
      <p className="mt-2 text-navy-500">
        {cartItems.length} destination{cartItems.length !== 1 ? "s" : ""} selected ·{" "}
        {totalDays} day{totalDays !== 1 ? "s" : ""} of recommended time before travel days
      </p>

      <div className="mt-8 space-y-4">
        {cartItems.map((item) => {
          const style = primaryCategoryStyle(item.categories);
          return (
            <div
              key={item.slug}
              className="flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-4 shadow-card"
            >
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${style.gradient} text-2xl`}
              >
                {style.emoji}
              </div>
              <div className="flex-1">
                <Link
                  href={`/destinations/${item.slug}`}
                  className="font-display font-semibold text-navy-800 hover:text-coral-500"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-navy-400">
                  {item.state} · {item.region} · {item.recommendedDays} day
                  {item.recommendedDays > 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.slug)}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-navy-400 hover:bg-navy-50 hover:text-coral-500"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-navy-800 p-8 text-center text-white">
          <h2 className="font-display text-xl font-semibold">
            Ready to see this as a trip?
          </h2>
          <p className="max-w-md text-sm text-navy-200">
            We&apos;ll sequence your {cartItems.length} destination
            {cartItems.length !== 1 ? "s" : ""} by region and build a
            day-by-day plan automatically.
          </p>
          <Link
            href="/trip"
            className="mt-2 rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Generate My Trip
          </Link>
        </div>
      )}
    </div>
  );
}
