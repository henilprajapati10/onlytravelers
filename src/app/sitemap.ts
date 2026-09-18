import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { states } from "@/data/states";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/destinations", "/states", "/circuits", "/campaign", "/image-rights"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  return [
    ...staticPages,
    ...destinations.map((d) => ({
      url: `${siteUrl}/destinations/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...states.map((s) => ({
      url: `${siteUrl}/states/${s.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
