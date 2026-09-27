"use client";

import Link from "next/link";
import { swapReasonLabel, type SwapReport } from "@/lib/alternatives";

const REASON_TONE: Record<string, string> = {
  "out-of-season": "bg-coral-100 text-coral-700",
  permit: "bg-amber-100 text-amber-800",
  detour: "bg-navy-100 text-navy-700",
  "quieter-twin": "bg-emerald-100 text-emerald-800",
};

/**
 * The honest swap, offered rather than applied. A package tour cannot tell
 * you its own itinerary is wrong for your dates; a catalogue covering all 36
 * states can, and should.
 */
export default function SwapList({
  report,
  onSwap,
}: {
  report: SwapReport;
  onSwap?: (fromSlug: string, toSlug: string) => void;
}) {
  const { swaps, stranded } = report;
  if (!swaps.length && !stranded.length) return null;

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
          Would this trip be better with a change?
        </h2>
        <p className="mt-1 text-sm text-navy-500">
          Nothing here happens automatically — each one says what is wrong and what you would get instead.
        </p>
      </div>

      {swaps.map((s) => (
        <div
          key={`${s.from.slug}-${s.to.slug}`}
          className="rounded-xl border border-navy-100 bg-white p-4 shadow-card"
        >
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              REASON_TONE[s.reason] ?? "bg-navy-100 text-navy-700"
            }`}
          >
            {swapReasonLabel(s.reason)}
          </span>

          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-800">
            <Link href={`/destinations/${s.from.slug}`} className="line-through decoration-navy-300">
              {s.from.name}
            </Link>
            <span aria-hidden="true" className="text-coral-500">
              →
            </span>
            <Link href={`/destinations/${s.to.slug}`} className="text-coral-600">
              {s.to.name}
            </Link>
          </p>

          <p className="mt-2 text-sm text-navy-600">{s.why}</p>
          <p className="mt-1 text-sm text-navy-600">{s.gain}</p>

          {onSwap && (
            <button
              type="button"
              onClick={() => onSwap(s.from.slug, s.to.slug)}
              className="mt-3 rounded-lg border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-700 transition hover:border-coral-300 hover:text-coral-500"
            >
              Make the swap
            </button>
          )}
        </div>
      ))}

      {stranded.map((s) => (
        <div
          key={s.destination.slug}
          className="rounded-xl border-l-4 border-coral-400 bg-coral-50 p-4"
        >
          <h3 className="font-display text-sm font-semibold text-navy-800">
            {s.destination.name} does not fit these dates, and we have nothing better
          </h3>
          <p className="mt-1 text-sm text-navy-600">{s.why}</p>
        </div>
      ))}
    </section>
  );
}
