"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { circuits, circuitSummary } from "@/data/circuits";
import { useCart } from "@/context/CartContext";
import { buildTrip, formatMonths } from "@/lib/trip";
import { shortDays, themeEmoji } from "@/lib/format";
import { sceneSvg } from "@/lib/scene";

export default function CircuitList() {
  const { replaceAll, addMany, cartSlugs } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState<string | null>(null);

  const summaries = circuits.map(circuitSummary);

  const load = (slugs: string[]) => {
    replaceAll(slugs);
    router.push("/trip");
  };

  const append = (id: string, slugs: string[]) => {
    addMany(slugs);
    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Circuits</h1>
      <p className="mt-2 max-w-2xl text-navy-500">
        Twelve routes that hold together as one trip — grouped by geography and season, not
        by popularity. Load one into your Trip Bag and change it from there; nothing here is
        fixed.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {summaries.map((c) => {
          const plan = buildTrip(c.items);
          const scene = sceneSvg(c.id, [c.dominantTheme], { width: 640, height: 160 });
          return (
            <article
              key={c.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"
            >
              <div className="relative aspect-[4/1]">
                <div
                  className="absolute inset-0 h-full w-full"
                  dangerouslySetInnerHTML={{ __html: scene }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="font-display text-xl font-bold text-white">{c.name}</h2>
                  <p className="text-sm text-white/80">{c.tagline}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-sm text-navy-600">{c.rationale}</p>

                <dl className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-sand-100 p-2">
                    <dt className="text-[10px] uppercase tracking-wide text-navy-400">Stops</dt>
                    <dd className="font-display font-bold tabular-nums text-navy-800">{c.items.length}</dd>
                  </div>
                  <div className="rounded-lg bg-sand-100 p-2">
                    <dt className="text-[10px] uppercase tracking-wide text-navy-400">Days</dt>
                    <dd className="font-display font-bold tabular-nums text-navy-800">
                      {plan?.totalDays ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-sand-100 p-2">
                    <dt className="text-[10px] uppercase tracking-wide text-navy-400">States</dt>
                    <dd className="font-display font-bold tabular-nums text-navy-800">{c.states.length}</dd>
                  </div>
                </dl>

                <p className="text-xs text-navy-400">
                  Best months:{" "}
                  <span className="font-semibold text-navy-600">
                    {c.commonMonths.length ? formatMonths(c.commonMonths) : "varies by stop"}
                  </span>
                  {plan ? ` · ${shortDays(plan.travelDays)} of it in transit` : ""}
                </p>

                <ol className="flex flex-wrap gap-1.5">
                  {c.items.map((d, i) => (
                    <li key={d.slug} className="flex items-center gap-1">
                      {i > 0 && <span className="text-navy-300">→</span>}
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600 hover:bg-navy-100 hover:text-coral-500"
                      >
                        {themeEmoji[d.themes[0]]} {d.name}
                      </Link>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => load(c.slugs)}
                    className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
                  >
                    Use this trip
                  </button>
                  <button
                    type="button"
                    onClick={() => append(c.id, c.slugs)}
                    disabled={cartSlugs.length === 0}
                    className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-coral-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {added === c.id ? "Added ✓" : "Add to my bag"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
