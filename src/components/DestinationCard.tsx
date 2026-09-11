"use client";

import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { primaryCategoryStyle } from "@/lib/categoryStyles";
import { useCart } from "@/context/CartContext";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { isInCart, toggleCart } = useCart();
  const inCart = isInCart(destination.slug);
  const style = primaryCategoryStyle(destination.categories);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-1">
      <Link href={`/destinations/${destination.slug}`} className="block">
        <div
          className={`flex h-36 items-end justify-between bg-gradient-to-br ${style.gradient} p-4`}
        >
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy-800">
            {destination.region}
          </span>
          <span className="text-3xl drop-shadow" aria-hidden="true">
            {style.emoji}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {destination.categories.map((c) => (
            <span
              key={c}
              className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600"
            >
              {c}
            </span>
          ))}
        </div>

        <Link href={`/destinations/${destination.slug}`}>
          <h3 className="font-display text-lg font-semibold text-navy-800 group-hover:text-coral-500">
            {destination.name}
          </h3>
        </Link>
        <p className="text-xs font-medium uppercase tracking-wide text-coral-500">
          {destination.tagline}
        </p>
        <p className="line-clamp-3 text-sm text-navy-500">{destination.description}</p>

        <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
          <span>{destination.recommendedDays} day{destination.recommendedDays > 1 ? "s" : ""} recommended</span>
          <span>{destination.state}</span>
        </div>

        <button
          type="button"
          onClick={() => toggleCart(destination.slug)}
          className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold transition ${
            inCart
              ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
              : "bg-coral-500 text-white hover:bg-coral-600"
          }`}
        >
          {inCart ? "Added to Trip Bag ✓" : "Add to Trip Bag"}
        </button>
      </div>
    </div>
  );
}
