import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import { states, zones, type Zone } from "@/data/states";
import { ZONE_INTRO, ZONE_SLUG } from "@/data/landing";
import { renownScore } from "@/data/renown";
import LandingPage from "@/components/LandingPage";
import { IndiaMap } from "@/components/IndiaMap";
import { pageMetadata } from "@/lib/seo";

const zoneFromSlug = (slug: string): Zone | undefined => zones.find((z) => ZONE_SLUG[z] === slug);

export function generateStaticParams() {
  return zones.map((z) => ({ zone: ZONE_SLUG[z] }));
}

export function generateMetadata({ params }: { params: { zone: string } }) {
  const zone = zoneFromSlug(params.zone);
  if (!zone) return {};
  const count = destinations.filter((d) => d.zone === zone).length;
  return pageMetadata({
    title: `${zone}: ${count} places to visit, state by state`,
    description: ZONE_INTRO[zone],
    path: `/zones/${params.zone}`,
    image: "/opengraph-image",
  });
}

export default function ZonePage({ params }: { params: { zone: string } }) {
  const zone = zoneFromSlug(params.zone);
  if (!zone) notFound();
  const list = destinations
    .filter((d) => d.zone === zone)
    .sort((a, b) => renownScore(b.slug) - renownScore(a.slug) || a.name.localeCompare(b.name));
  const ids = states.filter((s) => s.zone === zone).map((s) => s.id);
  const fills = Object.fromEntries(ids.map((id) => [id, "#e8492a"]));
  return (
    <LandingPage
      eyebrow="Travel zone"
      title={`${zone}: places to visit`}
      intro={ZONE_INTRO[zone]}
      crumbs={[{ name: "States & UTs", path: "/states" }, { name: zone, path: `/zones/${params.zone}` }]}
      list={list}
      path={`/zones/${params.zone}`}
      aside={<IndiaMap fills={fills} linkStates className="mt-6 w-full max-w-xs" />}
    />
  );
}
