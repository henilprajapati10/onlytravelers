import { notFound } from "next/navigation";
import Link from "next/link";
import { states, getState } from "@/data/states";
import { destinationsInState } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import StateMap from "@/components/StateMap";

export function generateStaticParams() {
  return states.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const state = getState(params.id);
  if (!state) return {};
  return {
    title: `${state.name} — OnlyTravelers`,
    description: state.positioning,
  };
}

export default function StatePage({ params }: { params: { id: string } }) {
  const state = getState(params.id);
  if (!state) notFound();

  const list = destinationsInState(state.id);
  const totalDays = list.reduce((sum, d) => sum + d.idealDays, 0);

  return (
    <div>
      <div className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link href="/states" className="text-sm font-medium text-navy-400 hover:text-coral-500">
            ← All states &amp; union territories
          </Link>
          <div className="mt-3 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {state.kind}
                </span>
                <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-600">
                  {state.zone}
                </span>
                {state.permitRequired && (
                  <span className="rounded-full bg-coral-100 px-2.5 py-1 text-[11px] font-bold uppercase text-coral-700">
                    Permit required
                  </span>
                )}
                {state.ferryOrFlightOnly && (
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold uppercase text-sky-700">
                    Ferry / flight only
                  </span>
                )}
              </div>
              <h1 className="font-display mt-3 text-4xl font-bold text-navy-800">{state.name}</h1>
              <p className="mt-3 max-w-[65ch] text-lg text-navy-600">{state.positioning}</p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Capital", state.capital],
                  ["Airports", state.airports.join(" · ")],
                  ["Peak season", state.peakSeason],
                  ["Destinations", `${list.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-navy-100 bg-sand-50 p-3">
                    <dt className="text-[11px] uppercase tracking-wide text-navy-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-navy-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 rounded-lg border border-navy-100 bg-sand-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-navy-400">Railhead</dt>
                <dd className="mt-0.5 text-sm font-semibold text-navy-800">{state.railhead}</dd>
              </div>

              {state.routingNote && (
                <p className="mt-3 rounded-lg border-l-4 border-navy-300 bg-sand-100 p-3 text-sm text-navy-600">
                  <strong>Routing note:</strong> best travelled as part of {state.routingNote}, not
                  as a standalone trip.
                </p>
              )}
            </div>

            <div className="lg:col-span-1">
              <StateMap stateId={state.id} />
              <p className="mt-2 text-center text-xs text-navy-400">
                {state.capital} · {state.lat.toFixed(2)}°N, {state.lng.toFixed(2)}°E
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-navy-800">
            {list.length} destinations in {state.name}
          </h2>
          <p className="text-sm text-navy-400">
            {totalDays} days to see all of it, before travel between them
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
