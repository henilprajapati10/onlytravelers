import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { getGuide } from "@/data/guides";
import { states } from "@/data/states";
import DestinationCard from "./DestinationCard";
import Breadcrumbs from "./Breadcrumbs";
import JsonLd from "./JsonLd";
import { itemListJsonLd, type Crumb } from "@/lib/seo";

/**
 * One shape for every landing page: a real introduction, the places, and
 * the states they are in — all of it server-rendered, all of it links.
 */
export default function LandingPage({
  title,
  intro,
  crumbs,
  list,
  eyebrow,
  path,
  aside,
}: {
  title: string;
  intro: string;
  crumbs: Crumb[];
  list: Destination[];
  eyebrow?: string;
  path: string;
  aside?: React.ReactNode;
}) {
  const stateIds = [...new Set(list.map((d) => d.stateId))];
  const stateList = states.filter((s) => stateIds.includes(s.id));
  const gems = list.filter((d) => d.hiddenGem).length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={itemListJsonLd(title, list.map((d) => ({ name: d.name, path: `/destinations/${d.slug}` })))} />
      <Breadcrumbs crumbs={crumbs} />
      {eyebrow && <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-coral-600">{eyebrow}</p>}
      <h1 className="font-display mt-1 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-navy-600">{intro}</p>
      <p className="mt-3 text-sm text-navy-500">
        {list.length} destinations across {stateList.length} {stateList.length === 1 ? "state" : "states and union territories"}
        {gems ? ` · ${gems} hidden ${gems === 1 ? "gem" : "gems"}` : ""}
      </p>

      {aside}

      {stateList.length > 1 && (
        <nav aria-label="States on this page" className="mt-6 flex flex-wrap gap-2">
          {stateList.map((s) => (
            <Link
              key={s.id}
              href={`/states/${s.id}`}
              className="rounded-full border border-navy-200 bg-white px-3 py-1 text-xs font-semibold text-navy-700 hover:border-coral-300"
            >
              {s.name} · {list.filter((d) => d.stateId === s.id).length}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <DestinationCard key={d.slug} destination={d} summary={getGuide(d.slug)?.summary} />
        ))}
      </div>

      <p className="mt-10 text-sm text-navy-500">
        Want this as a trip?{" "}
        <Link href={`/start?from=${encodeURIComponent(path)}`} className="font-semibold text-coral-500">
          Tell us how many days you have →
        </Link>
      </p>
    </div>
  );
}
