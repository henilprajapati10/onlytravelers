import Link from "next/link";
import { SCALE_LABEL, type Festival } from "@/data/festivals";
import { formatMonths } from "@/lib/trip";

const SCALE_TONE: Record<Festival["scale"], string> = {
  international: "bg-coral-100 text-coral-700",
  major: "bg-navy-100 text-navy-700",
  local: "bg-emerald-100 text-emerald-800",
};

/**
 * Festivals are the single biggest thing a month-by-month "best time to go"
 * leaves out, so each one states plainly what it does to the trip, not just
 * that it exists.
 */
export default function FestivalList({
  festivals,
  showState = false,
}: {
  festivals: Festival[];
  showState?: boolean;
}) {
  if (!festivals.length) return null;

  return (
    <ul className="flex flex-col gap-3">
      {festivals.map((f) => (
        <li
          key={f.id}
          className="rounded-xl border border-navy-100 bg-white p-4 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${SCALE_TONE[f.scale]}`}>
              {SCALE_LABEL[f.scale]}
            </span>
            <span className="rounded-full bg-sand-50 px-2 py-0.5 text-[11px] font-medium text-navy-500">
              {formatMonths(f.months)}
            </span>
            {!f.fixedDates && (
              <span
                className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                title="The Gregorian date moves each year"
              >
                Date moves yearly
              </span>
            )}
          </div>

          <h3 className="font-display mt-2 font-semibold text-navy-800">{f.name}</h3>
          <p className="text-xs text-navy-400">
            {f.whenLabel}
            {showState && f.slugs.length > 0 && " · "}
            {showState && f.slugs.length > 0 && (
              <Link href={`/destinations/${f.slugs[0]}`} className="font-semibold text-coral-500">
                {f.slugs.length === 1 ? "see the destination" : `${f.slugs.length} destinations`}
              </Link>
            )}
          </p>

          <p className="mt-2 text-sm text-navy-600">{f.what}</p>
          <p className="mt-2 rounded-lg bg-sand-50 p-3 text-xs text-navy-600">
            <span className="font-semibold text-navy-700">What it does to your trip: </span>
            {f.impact}
          </p>
        </li>
      ))}
    </ul>
  );
}
