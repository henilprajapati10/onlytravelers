import { Suspense } from "react";
import Link from "next/link";
import { states, zones, zoneBlurbs } from "@/data/states";
import { destinations } from "@/data/destinations";

export const metadata = {
  title: "India, state by state — OnlyTravelers",
  description:
    "All 28 states and 8 union territories, with capitals, airports, peak seasons and every destination we cover.",
};

function StatesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">India, state by state</h1>
      <p className="mt-2 max-w-2xl text-navy-500">
        All 28 states and 8 union territories, grouped into six travel zones — with the
        capital, airports and peak window for each.
      </p>

      <div className="mt-10 flex flex-col gap-12">
        {zones.map((zone) => {
          const zoneStates = states.filter((s) => s.zone === zone);
          return (
            <section key={zone}>
              <div className="border-b border-navy-100 pb-3">
                <h2 className="font-display text-xl font-semibold text-navy-800">{zone}</h2>
                <p className="mt-1 text-sm text-navy-500">{zoneBlurbs[zone]}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {zoneStates.map((s) => {
                  const count = destinations.filter((d) => d.stateId === s.id).length;
                  return (
                    <Link
                      key={s.id}
                      href={`/states/${s.id}`}
                      className="flex flex-col rounded-xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-coral-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display font-semibold leading-snug text-navy-800">
                          {s.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-600">
                          {count}
                        </span>
                      </div>
                      <p className="mt-2 flex-1 text-sm text-navy-500">{s.positioning}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                        <span className="rounded bg-sand-100 px-2 py-0.5 text-navy-600">
                          {s.kind}
                        </span>
                        <span className="rounded bg-sand-100 px-2 py-0.5 text-navy-600">
                          Peak {s.peakSeason}
                        </span>
                        {s.permitRequired && (
                          <span className="rounded bg-coral-100 px-2 py-0.5 font-semibold text-coral-700">
                            Permit
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function StatesPage() {
  return (
    <Suspense fallback={null}>
      <StatesIndex />
    </Suspense>
  );
}
