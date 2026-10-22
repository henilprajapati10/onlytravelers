import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { withinKm } from "@/lib/distance";
import { themeEmoji } from "@/lib/format";

/**
 * What else is close — as the crow flies, across state lines. The distance
 * is straight-line and says so; the road is always longer.
 */
export default function WithinReach({ destination, radiusKm = 100 }: { destination: Destination; radiusKm?: number }) {
  const near = withinKm(destination, radiusKm, 6);
  if (!near.length) return null;
  return (
    <section data-testid="within-reach">
      <h2 className="font-display text-2xl font-semibold text-navy-800">Within {radiusKm} km</h2>
      <p className="mt-1 text-sm text-navy-500">
        Straight-line distance from {destination.name}; by road, count on more.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {near.map(({ destination: d, km }) => (
          <li key={d.slug}>
            <Link
              href={`/destinations/${d.slug}`}
              className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 shadow-card transition hover:border-coral-300"
            >
              <span className="text-xl" aria-hidden="true">
                {themeEmoji[d.themes[0]]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-navy-800">{d.name}</span>
                <span className="block text-xs text-navy-500">
                  {d.stateName}
                  {d.hiddenGem ? " · ◆ Hidden gem" : ""}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-navy-600">{km} km</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
