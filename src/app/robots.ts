import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Everything the catalogue says is for crawling. The pages that are only
 * ever one person's — their trips, bag, profile — and the offline shell are
 * not, and say so again in their own metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/trips", "/trips/", "/trip", "/cart", "/profile", "/offline", "/_next/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
