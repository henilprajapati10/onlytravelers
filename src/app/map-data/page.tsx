import Link from "next/link";
import { MAP_ATTRIBUTION } from "@/components/IndiaMap";
import { stateShapes } from "@/data/shapes";
import { coords, DATASET_GAPS } from "@/data/coords";
import { destinations } from "@/data/destinations";

export const metadata = {
  title: "Where the maps come from — OnlyTravelers",
  description:
    "The boundary data, coordinates and licences behind every map in the app, and what we know is missing from them.",
};

export default function MapDataPage() {
  const placed = destinations.filter((d) => coords[d.slug]).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Where the maps come from</h1>
      <p className="mt-3 text-navy-600">
        Every outline and every pin in this app comes from a named source under a licence
        that allows it. This page is the register. If something here is wrong, it is worth
        telling us — a map that quietly misplaces a village is worse than no map.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy-800">State boundaries</h2>
        <dl className="mt-3 flex flex-col gap-3 text-sm">
          <div className="rounded-lg border border-navy-100 bg-white p-4">
            <dt className="text-[11px] uppercase tracking-wide text-navy-400">Source</dt>
            <dd className="mt-0.5 text-navy-700">
              <a
                href="https://github.com/amcharts/amcharts4-geodata"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-coral-500"
              >
                amCharts geodata ↗
              </a>{" "}
              — the <code>india2023</code> set, which matches the 36 states and union
              territories as they stand after the 2019 and 2020 reorganisations.
            </dd>
          </div>
          <div className="rounded-lg border border-navy-100 bg-white p-4">
            <dt className="text-[11px] uppercase tracking-wide text-navy-400">Licence</dt>
            <dd className="mt-0.5 text-navy-700">
              amCharts linkware: free for commercial use, with attribution shown wherever
              the data is displayed. Ours reads “{MAP_ATTRIBUTION}” under every map.
            </dd>
          </div>
          <div className="rounded-lg border border-navy-100 bg-white p-4">
            <dt className="text-[11px] uppercase tracking-wide text-navy-400">Projection</dt>
            <dd className="mt-0.5 text-navy-700">
              One equirectangular projection for the whole country, with longitude squeezed
              by the cosine of India&apos;s mid-latitude so the shapes are not stretched.
              The national map and each state page use the same coordinates at different
              zooms, so a pin lands in the same place on both. {stateShapes.length} units
              are drawn.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy-800">Destination pins</h2>
        <p className="mt-2 text-sm text-navy-600">
          {placed} of {destinations.length} destinations carry a coordinate. Nothing is
          guessed: a place we could not put on the map is left off it rather than dropped
          somewhere plausible. Every coordinate is checked, on each build, against the real
          boundary of the state it claims — see{" "}
          <code className="text-navy-700">scripts/check_coords.mjs</code>.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy-800">
          What we know is missing
        </h2>
        <p className="mt-2 text-sm text-navy-600">
          The boundary dataset is not complete at the smallest scales. These are the gaps
          we have found. In each case the coordinate is right and the outline is short —
          the pin is where the place is, even when the shape behind it is not.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {DATASET_GAPS.map((gap) => (
            <li
              key={gap.slug}
              className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-sm"
            >
              <span className="font-semibold text-navy-800">{gap.name}</span>
              <span className="text-navy-600"> — {gap.why}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-navy-100 bg-sand-50 p-5">
        <h2 className="font-display text-lg font-semibold text-navy-800">
          On national boundaries
        </h2>
        <p className="mt-2 text-sm text-navy-600">
          International boundaries in third-party datasets are usually drawn as they are
          administered rather than as any one country claims them, and Indian law is
          specific about how the national boundary may be depicted. All boundary geometry
          in this app lives in a single generated file, so it can be replaced wholesale
          with a Survey of India–compliant set before any commercial launch. Treat the maps
          here as illustrative, not authoritative.
        </p>
      </section>

      <p className="mt-8 text-sm">
        <Link href="/states" className="font-semibold text-coral-500">
          ← Back to states
        </Link>
      </p>
    </div>
  );
}
