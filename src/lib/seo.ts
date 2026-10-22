import type { Metadata } from "next";
import type { Destination } from "@/data/destinations";
import { getState, type StateUnit } from "@/data/states";
import { coordFor } from "@/data/coords";
import { siteName, siteTagline, siteUrl } from "./site";

/**
 * Everything a search engine or a link preview reads, in one place.
 *
 * The rules are the ordinary ones, enforced here so no page drifts: one
 * canonical URL per page, a title under 60 characters, a description under
 * 160, an image for the preview, and structured data that says only what the
 * page itself says. Nothing in this file invents a fact the catalogue does
 * not hold — in particular, nothing here is a price, a rating or a review.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 158;

/** Cuts prose at a word boundary with an ellipsis, inside `max`. */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const atWord = cut.lastIndexOf(" ");
  return (atWord > max * 0.6 ? cut.slice(0, atWord) : cut).replace(/[,;:\-–—]$/, "") + "…";
}

/**
 * A static export writes each social image as an extension-less file, which
 * a plain file host would serve with the wrong type; the deploy renames
 * them to .png, and every reference here follows suit.
 */
export const OG_SUFFIX = typeof process !== "undefined" && process.env.STATIC_EXPORT === "1" ? ".png" : "";

export function ogImagePath(path: string): string {
  return /opengraph-image$/.test(path) ? `${path}${OG_SUFFIX}` : path;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageSeo {
  title: string;
  description: string;
  /** Path from the site root, e.g. "/states/kerala". */
  path: string;
  /** Path to the preview image; defaults to the route's own opengraph-image. */
  image?: string;
  imageAlt?: string;
  /** Pages that are private or transient: keep them out of the index. */
  noindex?: boolean;
  type?: "website" | "article";
}

/** Next metadata for a page, with canonical, Open Graph and Twitter filled in consistently. */
export function pageMetadata(seo: PageSeo): Metadata {
  const title = truncate(seo.title, TITLE_MAX);
  const description = truncate(seo.description, DESCRIPTION_MAX);
  const url = absoluteUrl(seo.path);
  const images = seo.image ? [{ url: absoluteUrl(ogImagePath(seo.image)), width: 1200, height: 630, alt: seo.imageAlt ?? title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: seo.type ?? "website",
      locale: "en_IN",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

/* ---------- JSON-LD ---------- */

export type JsonLdObject = Record<string, unknown>;

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteTagline,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/destinations?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/icon-512.png"),
    slogan: siteTagline,
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** One destination as a place a tourist visits. Only facts the catalogue holds. */
export function destinationJsonLd(d: Destination, summary?: string): JsonLdObject {
  const state = getState(d.stateId);
  const coord = coordFor(d.slug);
  const out: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    url: absoluteUrl(`/destinations/${d.slug}`),
    description: summary ? truncate(summary, 300) : `${d.name}, ${d.district}, ${d.stateName}.`,
    touristType: d.themes,
    image: absoluteUrl(ogImagePath(`/destinations/${d.slug}/opengraph-image`)),
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: state?.name ?? d.stateName,
      url: absoluteUrl(`/states/${d.stateId}`),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: d.district,
      addressRegion: state?.name ?? d.stateName,
      addressCountry: "IN",
    },
  };
  if (coord) out.geo = { "@type": "GeoCoordinates", latitude: coord.lat, longitude: coord.lng };
  return out;
}

export function stateJsonLd(s: StateUnit, count: number): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: s.name,
    url: absoluteUrl(`/states/${s.id}`),
    description: s.positioning,
    geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
    address: { "@type": "PostalAddress", addressRegion: s.name, addressCountry: "IN" },
    includesAttraction: { "@type": "ItemList", numberOfItems: count, url: absoluteUrl(`/states/${s.id}`) },
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export function touristTripJsonLd(trip: { name: string; description: string; path: string; stops: Destination[] }): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.name,
    description: trip.description,
    url: absoluteUrl(trip.path),
    itinerary: {
      "@type": "ItemList",
      numberOfItems: trip.stops.length,
      itemListElement: trip.stops.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristDestination", name: d.name, url: absoluteUrl(`/destinations/${d.slug}`) },
      })),
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
