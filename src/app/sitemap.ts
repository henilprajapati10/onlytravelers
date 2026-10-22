import type { MetadataRoute } from "next";
import { destinations, themes } from "@/data/destinations";
import { states, zones } from "@/data/states";
import { themeSlug, ZONE_SLUG } from "@/data/landing";
import { monthFull } from "@/lib/trip";
import { siteUrl } from "@/lib/site";

/**
 * Every indexable page, once. The private pages (trips, bag, profile) and
 * the offline shell are deliberately absent and carry noindex besides.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/destinations", 0.9, "weekly"),
    page("/states", 0.8),
    page("/circuits", 0.8),
    page("/festivals", 0.8),
    page("/start", 0.6),
    page("/campaign", 0.5),
    page("/map-data", 0.3),
    page("/image-rights", 0.3),
    ...themes.map((t) => page(`/themes/${themeSlug(t)}`, 0.8)),
    ...Array.from({ length: 12 }, (_, i) => page(`/best-time/${monthFull(i + 1).toLowerCase()}`, 0.8)),
    ...zones.map((z) => page(`/zones/${ZONE_SLUG[z]}`, 0.7)),
    ...states.map((s) => page(`/states/${s.id}`, 0.7)),
    ...destinations.map((d) => page(`/destinations/${d.slug}`, d.hiddenGem ? 0.6 : 0.65)),
  ];
}
