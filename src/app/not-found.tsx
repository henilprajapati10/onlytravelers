import Link from "next/link";
import { destinations } from "@/data/destinations";

export default function NotFound() {
  const suggestions = ["taj-mahal-agra", "alleppey-backwaters", "hampi-unesco", "pangong-tso"]
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is (typeof destinations)[number] => Boolean(d));

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-coral-500">
        Off the map
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold text-navy-800">
        We haven&apos;t mapped that one
      </h1>
      <p className="mx-auto mt-4 max-w-md text-navy-500">
        The page you were after isn&apos;t here. The catalogue covers {destinations.length}{" "}
        destinations across all 36 states and union territories — one of these might be what you
        were looking for.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {suggestions.map((d) => (
          <Link
            key={d.slug}
            href={`/destinations/${d.slug}`}
            className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:border-coral-300 hover:text-coral-500"
          >
            {d.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/destinations"
          className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Browse all destinations
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
