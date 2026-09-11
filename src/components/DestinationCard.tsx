"use client";

import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { getGuide } from "@/data/guides";
import { useCart } from "@/context/CartContext";
import { shortDays, themeEmoji } from "@/lib/format";
import DestinationImage from "./DestinationImage";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { isInCart, toggleCart } = useCart();
  const inCart = isInCart(destination.slug);
  const guide = getGuide(destination.slug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-1">
      <Link href={`/destinations/${destination.slug}`} className="relative block">
        <DestinationImage destination={destination} ratio="card" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy-800">
          {destination.stateName}
        </span>
        {destination.permitRequired && (
          <span className="absolute right-3 top-3 rounded-full bg-coral-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Permit
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {destination.themes.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600"
            >
              {themeEmoji[t]} {t}
            </span>
          ))}
        </div>

        <Link href={`/destinations/${destination.slug}`}>
          <h3 className="font-display text-lg font-semibold leading-snug text-navy-800 group-hover:text-coral-500">
            {destination.name}
          </h3>
        </Link>
        <p className="text-xs text-navy-400">{destination.district}</p>

        {guide && <p className="line-clamp-3 text-sm text-navy-500">{guide.summary}</p>}

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-navy-400">
          <span>{shortDays(destination.idealDays)}</span>
          <span>{destination.bestMonthsLabel}</span>
        </div>

        <button
          type="button"
          onClick={() => toggleCart(destination.slug)}
          className={`mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold transition ${
            inCart
              ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
              : "bg-coral-500 text-white hover:bg-coral-600"
          }`}
        >
          {inCart ? "In your Trip Bag ✓" : "Add to Trip Bag"}
        </button>
      </div>
    </article>
  );
}
