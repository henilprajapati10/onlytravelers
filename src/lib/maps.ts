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
  // The district disambiguates the many repeated place names in India;
  // "India" keeps the geocoder from wandering to a namesake abroad.
  return [destination.name, destination.district, state?.name ?? destination.stateName, "India"]
    .filter(Boolean)
    .join(", ");
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
