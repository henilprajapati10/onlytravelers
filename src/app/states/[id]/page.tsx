import { notFound } from "next/navigation";
import Link from "next/link";
import { states, getState } from "@/data/states";
import { destinationsInState } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import { getGuide } from "@/data/guides";
import { StateOutline } from "@/components/IndiaMap";
import LiveMapLoader from "@/components/LiveMapLoader";
import { coordFor } from "@/data/coords";
import { googleRouteUrl, googleSearchUrl as googleMapsUrl } from "@/lib/maps";

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
  const placed = list.filter((d) => coordFor(d.slug)).length;
  const routeUrl = googleRouteUrl(list.slice(0, 11));
  const pins = list
    .map((d) => {
      const c = coordFor(d.slug);
      return c ? { lat: c.lat, lng: c.lng, label: d.name, href: `/destinations/${d.slug}` } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
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

            <div className="mx-auto w-full max-w-md lg:col-span-1">
              {/* The accurate map: street tiles under the real boundary, with
                  every destination pinned where it actually is. The drawn
                  outline stands in until the tiles arrive. */}
              <LiveMapLoader
                stateId={state.id}
                pins={pins}
                className="h-[380px] w-full sm:h-[440px]"
                fallback={<StateOutline stateId={state.id} pins={pins} className="w-full" />}
              />
              <p className="mt-1 text-center text-xs text-navy-400">
                {placed} of {list.length} destinations pinned · {state.capital} is the travel hub
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <a
                  href={googleMapsUrl({ name: state.name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-coral-300"
                >
                  📍 {state.name} in Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-800">
              {list.length} destinations in {state.name}
            </h2>
            {routeUrl && (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-coral-500"
              >
                Open the first {Math.min(list.length, 11)} as a driving route in Google Maps ↗
              </a>
            )}
          </div>
          <p className="text-sm text-navy-400">
            {totalDays} days to see all of it, before travel between them
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <DestinationCard key={d.slug} destination={d} summary={getGuide(d.slug)?.summary} />
          ))}
        </div>
      </div>
    </div>
  );
}
