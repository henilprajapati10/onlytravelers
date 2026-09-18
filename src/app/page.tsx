import Link from "next/link";
import { destinations, themes } from "@/data/destinations";
import { states, zones, zoneBlurbs } from "@/data/states";
import DestinationCard from "@/components/DestinationCard";
import HomeHero from "@/components/HomeHero";
import { themeEmoji } from "@/lib/format";

const FEATURED = [
  "taj-mahal-agra",
  "alleppey-backwaters",
  "hampi-unesco",
  "pangong-tso",
  "living-root-bridges-nongriat",
  "white-rann-dhordo",
];

export default function HomePage() {
  const featured = FEATURED.map((slug) => destinations.find((d) => d.slug === slug)).filter(
    (d): d is (typeof destinations)[number] => Boolean(d)
  );

  return (
    <div>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-800">Start somewhere</h2>
            <p className="mt-1 text-sm text-navy-500">
              Six that show the range of what is in here.
            </p>
          </div>
          <Link href="/destinations" className="shrink-0 text-sm font-semibold text-coral-500">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </section>

      <section className="border-y border-navy-100 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display mb-2 text-2xl font-semibold text-navy-800">
            Travel by what pulls you in
          </h2>
          <p className="mb-6 text-sm text-navy-500">
            Fourteen themes across the whole catalogue.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {themes.map((theme) => {
              const count = destinations.filter((d) => d.themes.includes(theme)).length;
              return (
                <Link
                  key={theme}
                  href={`/destinations?theme=${encodeURIComponent(theme)}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-navy-100 bg-sand-50 px-3 py-5 text-center transition hover:border-coral-300 hover:bg-white"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {themeEmoji[theme]}
                  </span>
                  <span className="text-xs font-semibold text-navy-700">{theme}</span>
                  <span className="text-[11px] text-navy-400">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display mb-2 text-2xl font-semibold text-navy-800">
          India, state by state
        </h2>
        <p className="mb-6 text-sm text-navy-500">
          Six zones, 36 states and union territories. Every one of them is covered.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => {
            const zoneStates = states.filter((s) => s.zone === zone);
            const count = destinations.filter((d) => d.zone === zone).length;
            return (
              <Link
                key={zone}
                href={`/states?zone=${encodeURIComponent(zone)}`}
                className="rounded-xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-semibold text-navy-800">{zone}</h3>
                  <span className="text-xs text-navy-400">{count} places</span>
                </div>
                <p className="mt-2 text-sm text-navy-500">{zoneBlurbs[zone]}</p>
                <p className="mt-3 text-xs text-navy-400">
                  {zoneStates.length} states &amp; UTs
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-10 rounded-2xl bg-navy-800 p-10 text-white sm:grid-cols-2 sm:p-14">
          <div>
            <h2 className="font-display text-3xl font-bold">
              A Trip Bag that turns into a real itinerary.
            </h2>
            <p className="mt-4 text-navy-200">
              Not a list of places — a plan. We sequence your picks by zone and state,
              add the travel between them with mode and hours, work out which months
              actually suit the whole trip, and flag the permits and ferries that
              catch people out.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
              >
                Build my trip
              </Link>
              <Link
                href="/circuits"
                className="inline-block rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-white/70"
              >
                Browse 12 circuits
              </Link>
            </div>
          </div>
          <ul className="flex flex-col justify-center gap-3">
            {[
              ["🗺️", "Route sequenced across zones, states and districts"],
              ["🚆", "Every hop costed: flight, train or road, with hours"],
              ["📅", "Day-by-day plan, travel days included"],
              ["🛂", "Permit, ferry, altitude and season warnings"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 rounded-lg bg-navy-700/60 p-4">
                <span className="text-xl" aria-hidden="true">
                  {icon}
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
