import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestination } from "@/data/destinations";
import { getState } from "@/data/states";
import { getGuide } from "@/data/guides";
import { getImages } from "@/data/images";
import AddToCartButton from "@/components/AddToCartButton";
import DestinationCard from "@/components/DestinationCard";
import DestinationImage from "@/components/DestinationImage";
import StateMap from "@/components/StateMap";
import { formatDays, seasonBadge, themeEmoji } from "@/lib/format";
import { sceneSvg } from "@/lib/scene";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const d = getDestination(params.slug);
  if (!d) return {};
  const guide = getGuide(d.slug);
  return {
    title: `${d.name}, ${d.stateName} — OnlyTravelers`,
    description: guide?.summary ?? `${d.name} in ${d.district}, ${d.stateName}.`,
  };
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = getDestination(params.slug);
  if (!destination) notFound();

  const state = getState(destination.stateId)!;
  const guide = getGuide(destination.slug);
  const images = getImages(destination.slug);
  const season = seasonBadge(destination);

  const nearby = destinations
    .filter((d) => d.slug !== destination.slug && d.stateId === destination.stateId)
    .slice(0, 3);

  return (
    <article>
      {/* Hero — 16:5 per the directory's destination page layout */}
      <div className="relative">
        <DestinationImage destination={destination} ratio="hero" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
            <Link href="/destinations" className="text-sm font-medium text-white/80 hover:text-white">
              ← All destinations
            </Link>
            <h1 className="font-display mt-2 text-3xl font-bold text-white sm:text-5xl">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta strip: district, state, zone · themes · days · season */}
      <div className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-sm sm:px-6">
          <span className="text-navy-600">
            {destination.district} ·{" "}
            <Link href={`/states/${state.id}`} className="font-semibold text-navy-800 hover:text-coral-500">
              {state.name}
            </Link>{" "}
            · {destination.zone}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {destination.themes.map((t) => (
              <span key={t} className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600">
                {themeEmoji[t]} {t}
              </span>
            ))}
          </span>
          <span className="rounded-full bg-navy-800 px-2.5 py-1 text-[11px] font-semibold text-white">
            {formatDays(destination.idealDays)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              season.tone === "monsoon"
                ? "bg-emerald-100 text-emerald-800"
                : season.tone === "year"
                  ? "bg-sky-100 text-sky-800"
                  : "bg-amber-100 text-amber-800"
            }`}
          >
            {season.label}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {guide && (
              <>
                <h2 className="font-display text-2xl font-semibold text-navy-800">
                  About {destination.name}
                </h2>
                <p className="mt-3 max-w-[65ch] text-navy-600">{guide.summary}</p>

                <h3 className="mt-8 font-display text-lg font-semibold text-navy-800">What to do</h3>
                <ul className="mt-3 space-y-2">
                  {guide.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-navy-600">
                      <span className="text-coral-500" aria-hidden="true">
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-xl border border-navy-100 bg-sand-100 p-5">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-navy-500">
                    Traveler tip
                  </h3>
                  <p className="mt-2 text-navy-700">{guide.tip}</p>
                </div>
              </>
            )}

            {/* How to reach */}
            <h3 className="mt-10 font-display text-lg font-semibold text-navy-800">How to reach</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-navy-100 bg-white p-4">
                <dt className="text-xs uppercase tracking-wide text-navy-400">Nearest airports</dt>
                <dd className="mt-1 font-semibold text-navy-800">
                  {state.airports.join(" · ") || "—"}
                </dd>
              </div>
              <div className="rounded-lg border border-navy-100 bg-white p-4">
                <dt className="text-xs uppercase tracking-wide text-navy-400">Railhead</dt>
                <dd className="mt-1 font-semibold text-navy-800">{state.railhead}</dd>
              </div>
              <div className="rounded-lg border border-navy-100 bg-white p-4">
                <dt className="text-xs uppercase tracking-wide text-navy-400">Where to base</dt>
                <dd className="mt-1 font-semibold text-navy-800">
                  {destination.district}, or {state.capital} for connections
                </dd>
              </div>
              <div className="rounded-lg border border-navy-100 bg-white p-4">
                <dt className="text-xs uppercase tracking-wide text-navy-400">State peak season</dt>
                <dd className="mt-1 font-semibold text-navy-800">{state.peakSeason}</dd>
              </div>
            </dl>

            {destination.permitRequired && (
              <div className="mt-6 rounded-xl border-l-4 border-coral-500 bg-coral-50 p-4">
                <h4 className="font-display text-sm font-bold text-coral-700">Permit required</h4>
                <p className="mt-1 text-sm text-navy-700">
                  This is a permit-controlled area. An Inner Line Permit must be arranged in
                  advance through a registered agent or the state portal — it is not issued on
                  arrival, and you will be turned back at the checkpost without one.
                </p>
              </div>
            )}

            {destination.ferryOrFlightOnly && (
              <div className="mt-4 rounded-xl border-l-4 border-sky-500 bg-sky-50 p-4">
                <h4 className="font-display text-sm font-bold text-sky-700">Ferry and flight constrained</h4>
                <p className="mt-1 text-sm text-navy-700">
                  Sailings and island flights are limited and fill early. Lock your transport
                  before booking a room, not after.
                </p>
              </div>
            )}

            {destination.monsoonProduct && (
              <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
                <h4 className="font-display text-sm font-bold text-emerald-700">A monsoon destination</h4>
                <p className="mt-1 text-sm text-navy-700">
                  This one is deliberately at its best in the rains, when most of the country is
                  off-season. Go between June and September and you get it at full force.
                </p>
              </div>
            )}

            {/* Gallery — 3:2, three to six slots per the layout spec */}
            <h3 className="mt-10 font-display text-lg font-semibold text-navy-800">Gallery</h3>
            {images.gallery?.length ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {images.gallery.map((g) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={g.src}
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-[3/2] overflow-hidden rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: sceneSvg(`${destination.slug}-${i}`, destination.themes, {
                          width: 300,
                          height: 200,
                        }),
                      }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-navy-400">
                  Generated artwork. Photograph slots are ready — add licensed or own
                  photographs in <code className="text-navy-500">src/data/images.ts</code> and
                  they replace these automatically.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-navy-400">Time here</dt>
                    <dd className="text-right font-semibold text-navy-800">
                      {formatDays(destination.idealDays)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-navy-400">Best months</dt>
                    <dd className="text-right font-semibold text-navy-800">
                      {destination.bestMonthsLabel}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-navy-400">Theme</dt>
                    <dd className="text-right font-semibold text-navy-800">{destination.rawTheme}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-navy-400">District</dt>
                    <dd className="text-right font-semibold text-navy-800">{destination.district}</dd>
                  </div>
                </dl>
                <p className="mt-4 rounded-lg bg-sand-100 p-3 text-xs text-navy-500">
                  Time shown is time <strong>at</strong> the destination. Your trip plan adds
                  the travel to reach it.
                </p>
                <AddToCartButton slug={destination.slug} size="lg" className="mt-4 w-full" />
                <Link
                  href="/trip"
                  className="mt-3 block text-center text-sm font-semibold text-coral-500"
                >
                  Go to my trip →
                </Link>
              </div>

              {/* Map slot — 1:1 per the layout spec */}
              <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wide text-navy-500">
                  Where it is
                </h3>
                <StateMap stateId={state.id} />
                <p className="mt-2 text-xs text-navy-400">
                  {destination.district}, {state.name}. Pin marks the state travel hub — verify
                  exact coordinates and access roads before you set out.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {nearby.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-navy-800">
                More in {state.name}
              </h2>
              <Link
                href={`/states/${state.id}`}
                className="shrink-0 text-sm font-semibold text-coral-500"
              >
                All of {state.name} →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((d) => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
