import { destinationsInState } from "@/data/destinations";
import { getState, states } from "@/data/states";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "State preview";

export function generateStaticParams() {
  return states.map((s) => ({ id: s.id }));
}

export default function Image({ params }: { params: { id: string } }) {
  const s = getState(params.id);
  if (!s) return ogImage({ title: "OnlyTravelers", subtitle: "Be travelers, not tourists.", facts: [], slug: "home", themes: ["Heritage"] });
  const list = destinationsInState(s.id);
  const lead = list[0];
  return ogImage({
    eyebrow: s.kind,
    title: s.name,
    subtitle: s.positioning.length > 70 ? s.positioning.slice(0, 67) + "…" : s.positioning,
    facts: [`${list.length} places`, `Peak ${s.peakSeason}`, s.zone],
    slug: lead?.slug ?? s.id,
    themes: lead?.themes ?? ["Heritage"],
  });
}
