import type { Destination } from "@/data/destinations";
import { coordFor } from "@/data/coords";
import { getState } from "@/data/states";

/**
 * Links into Google Maps that land in the right place.
 *
 * Two ways to point at somewhere, and they are good at different things:
 *
 * - By name. "Meenakshi Temple, Madurai, Tamil Nadu, India" resolves to
 *   Google's own record for the place, which carries the hours, the photos
 *   and the reviews a traveller actually wants. This is the default.
 * - By coordinate. Exact to the metre, but lands on a bare pin with no
 *   context. Better for a trailhead or a viewpoint Google has no record of.
 *
 * Both are offered, because the right one depends on the place.
 */

const MAPS_BASE = "https://www.google.com/maps";

/** The search string Google resolves most reliably for an Indian place. */
export function mapQuery(destination: Destination): string {
  const state = getState(destination.stateId);

  // Plenty of catalogue names already carry their district or state — "Taj
  // Mahal, Agra", "Golden Temple, Amritsar". Repeating it gives Google
  // "Taj Mahal, Agra, Agra, Uttar Pradesh", which geocodes worse, not better.
  // The match is on whole words, so "Gateway of India" does not swallow the
  // country and Agra does not match Agrasen.
  const has = (haystack: string, needle: string) =>
    new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack);

  const parts = [destination.name];
  for (const part of [destination.district, state?.name ?? destination.stateName]) {
    if (part && !has(parts.join(", "), part)) parts.push(part);
  }
  // "India" is always last, whatever the name happens to contain: it is what
  // keeps the geocoder from wandering to a namesake abroad.
  parts.push("India");
  return parts.join(", ");
}

/** Opens the place's card in Google Maps. */
export function googleMapsUrl(destination: Destination): string {
  return `${MAPS_BASE}/search/?api=1&query=${encodeURIComponent(mapQuery(destination))}`;
}

/** Drops a pin on the exact coordinate, when we have one. */
export function googleMapsPinUrl(destination: Destination): string | null {
  const c = coordFor(destination.slug);
  if (!c) return null;
  return `${MAPS_BASE}/search/?api=1&query=${c.lat},${c.lng}`;
}

/** A Google Maps search for any named thing in India — a state, a town. */
export function googleSearchUrl(target: { name: string }): string {
  return `${MAPS_BASE}/search/?api=1&query=${encodeURIComponent(`${target.name}, India`)}`;
}

/** Directions from wherever the traveller is now. */
export function googleDirectionsUrl(destination: Destination): string {
  const c = coordFor(destination.slug);
  const target = c ? `${c.lat},${c.lng}` : mapQuery(destination);
  return `${MAPS_BASE}/dir/?api=1&destination=${encodeURIComponent(target)}`;
}

/** A route through every stop, in order — the whole trip in one Maps link. */
export function googleRouteUrl(stops: Destination[]): string | null {
  if (stops.length < 2) return null;
  const point = (d: Destination) => {
    const c = coordFor(d.slug);
    return c ? `${c.lat},${c.lng}` : mapQuery(d);
  };
  const origin = encodeURIComponent(point(stops[0]));
  const destination = encodeURIComponent(point(stops[stops.length - 1]));
  // Maps caps the waypoint list; beyond that the link silently fails, so we
  // keep to the documented limit rather than shipping a URL that breaks.
  const middle = stops.slice(1, -1).slice(0, 9);
  const waypoints = middle.length
    ? `&waypoints=${middle.map((d) => encodeURIComponent(point(d))).join("|")}`
    : "";
  return `${MAPS_BASE}/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=driving`;
}

/**
 * The same route as an embeddable map (Maps Embed API, directions mode).
 * Needs a key, like the place embed; with the same 9-waypoint cap.
 */
export function googleRouteEmbedUrl(stops: Destination[], apiKey: string): string | null {
  if (stops.length < 2) return null;
  const point = (d: Destination) => {
    const c = coordFor(d.slug);
    return c ? `${c.lat},${c.lng}` : mapQuery(d);
  };
  const params = new URLSearchParams({
    key: apiKey,
    origin: point(stops[0]),
    destination: point(stops[stops.length - 1]),
    mode: "driving",
  });
  const middle = stops.slice(1, -1).slice(0, 9);
  if (middle.length) params.set("waypoints", middle.map(point).join("|"));
  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

/** True when the trip is longer than one Maps link can carry. */
export function routeIsTruncated(stops: Destination[]): boolean {
  return stops.length > 11;
}

/**
 * The embedded map, which needs a key. Without one the site falls back to its
 * own map plus the links above — which is why nothing here is required for
 * the app to be useful.
 */
export function googleEmbedUrl(destination: Destination, apiKey: string): string {
  const c = coordFor(destination.slug);
  const params = new URLSearchParams({
    key: apiKey,
    q: mapQuery(destination),
    zoom: "12",
  });
  if (c) params.set("center", `${c.lat},${c.lng}`);
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

export function mapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return key && key.trim() ? key.trim() : undefined;
}
