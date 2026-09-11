import Link from "next/link";
import { destinations, categories } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import { categoryStyle } from "@/lib/categoryStyles";

const featuredSlugs = [
  "jaipur",
  "kerala-backwaters",
  "hampi",
  "leh-ladakh",
  "varanasi",
  "andaman",
];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter(Boolean) as typeof destinations;

  return (
    <div>
      <section className="bg-topo relative overflow-hidden border-b border-navy-100 bg-sand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-4 inline-block rounded-full bg-navy-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
            Be travelers, not tourists
          </p>
          <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight text-navy-800 sm:text-5xl">
            India, one honest destination at a time.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-600">
            Browse every corner of India with real, informative guides — then
            add the places that pull you in to your Trip Bag. We&apos;ll
            auto-build a day-by-day itinerary out of exactly what you chose.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/destinations"
              className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-coral-600"
            >
              Explore Destinations
            </Link>
            <Link
              href="/trip"
              className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition hover:border-navy-500"
            >
              Build a Trip
            </Link>
          </div>
          <p className="mt-4 text-sm text-navy-500">
            {destinations.length}+ places mapped across every region of India.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-800">
            Start somewhere
          </h2>
          <Link href="/destinations" className="text-sm font-semibold text-coral-500">
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
          <h2 className="font-display mb-6 text-2xl font-semibold text-navy-800">
            Travel by what pulls you in
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/destinations?category=${encodeURIComponent(category)}`}
                className={`flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br ${categoryStyle[category].gradient} px-4 py-6 text-center text-white shadow-card transition hover:scale-[1.02]`}
              >
                <span className="text-2xl">{categoryStyle[category].emoji}</span>
                <span className="text-sm font-semibold">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 rounded-2xl bg-navy-800 p-10 text-white sm:grid-cols-2 sm:p-14">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Add to your Trip Bag. Get a trip.
            </h2>
            <p className="mt-4 text-navy-200">
              Pick destinations the way you&apos;d save items you actually
              want — not a checklist. Once you&apos;ve got a shortlist, we
              group them by region, sequence the route, and give you a
              realistic day-by-day plan with travel buffers built in.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-navy-700/60 p-4">
              <span className="text-2xl">🎒</span>
              <p className="text-sm">Add destinations to your Trip Bag as you browse.</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-navy-700/60 p-4">
              <span className="text-2xl">🗺️</span>
              <p className="text-sm">We sequence them into regions and a sensible route.</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-navy-700/60 p-4">
              <span className="text-2xl">📅</span>
              <p className="text-sm">Get a day-by-day itinerary, generated instantly.</p>
            </div>
            <Link
              href="/trip"
              className="mt-2 rounded-lg bg-coral-500 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-coral-600"
            >
              Generate My Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
