import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { primaryCategoryStyle } from "@/lib/categoryStyles";
import AddToCartButton from "@/components/AddToCartButton";
import DestinationCard from "@/components/DestinationCard";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const destination = getDestinationBySlug(params.slug);
  if (!destination) return {};
  return {
    title: `${destination.name} — OnlyTravelers`,
    description: destination.description,
  };
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = getDestinationBySlug(params.slug);
  if (!destination) notFound();

  const style = primaryCategoryStyle(destination.categories);
  const related = destinations
    .filter((d) => d.slug !== destination.slug && d.region === destination.region)
    .slice(0, 3);

  return (
    <div>
      <div className={`bg-gradient-to-br ${style.gradient}`}>
        <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:px-6">
          <Link href="/destinations" className="text-sm font-medium text-white/80 hover:text-white">
            ← All Destinations
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {destination.categories.map((c) => (
              <span key={c} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {c}
              </span>
            ))}
          </div>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {destination.name}
          </h1>
          <p className="mt-2 text-lg text-white/90">{destination.tagline}</p>
          <p className="mt-1 text-sm text-white/70">
            {destination.state} · {destination.region}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-navy-800">
              About {destination.name}
            </h2>
            <p className="mt-4 text-navy-600">{destination.description}</p>

            <h3 className="mt-8 font-display text-lg font-semibold text-navy-800">
              Highlights
            </h3>
            <ul className="mt-3 space-y-2">
              {destination.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-navy-600">
                  <span className="text-coral-500">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-navy-100 bg-navy-50 p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
                Traveler tip
              </h3>
              <p className="mt-2 text-navy-700">{destination.travelerTip}</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-navy-400">Recommended time</dt>
                  <dd className="font-semibold text-navy-800">
                    {destination.recommendedDays} day{destination.recommendedDays > 1 ? "s" : ""}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-navy-400">Best time to visit</dt>
                  <dd className="font-semibold text-navy-800">{destination.bestTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-navy-400">State</dt>
                  <dd className="font-semibold text-navy-800">{destination.state}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-navy-400">Region</dt>
                  <dd className="font-semibold text-navy-800">{destination.region}</dd>
                </div>
              </dl>
              <AddToCartButton slug={destination.slug} size="lg" className="mt-4 w-full" />
              <Link
                href="/trip"
                className="mt-3 block text-center text-sm font-semibold text-coral-500"
              >
                Go to Trip Bag →
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-navy-800">
              More in {destination.region}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
