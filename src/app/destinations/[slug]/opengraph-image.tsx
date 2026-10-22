import { destinations, getDestination } from "@/data/destinations";
import { formatDays } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Destination preview";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const d = getDestination(params.slug);
  if (!d) return ogImage({ title: "OnlyTravelers", subtitle: "Be travelers, not tourists.", facts: [], slug: "home", themes: ["Heritage"] });
  return ogImage({
    eyebrow: d.hiddenGem ? "Hidden gem" : d.themes[0],
    title: d.name,
    subtitle: `${d.district}, ${d.stateName}`,
    facts: [formatDays(d.idealDays), `Best ${d.bestMonthsLabel}`, ...d.themes.slice(0, 2)],
    slug: d.slug,
    themes: d.themes,
  });
}
