import { destinations, type Destination } from "@/data/destinations";
import { coordFor } from "@/data/coords";

/** Great-circle distance between two coordinates, in km. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface NearbyPlace {
  destination: Destination;
  km: number;
}

/**
 * Catalogue places within `radiusKm` of one, nearest first, across state
 * lines — the thing "more in this state" cannot tell you. Straight-line
 * distance; the road is longer, and the card says so.
 */
export function withinKm(of: Destination, radiusKm = 100, limit = 6): NearbyPlace[] {
  const here = coordFor(of.slug);
  if (!here) return [];
  const out: NearbyPlace[] = [];
  for (const d of destinations) {
    if (d.slug === of.slug) continue;
    const c = coordFor(d.slug);
    if (!c) continue;
    const km = haversineKm(here, c);
    if (km <= radiusKm) out.push({ destination: d, km: Math.round(km) });
  }
  return out.sort((a, b) => a.km - b.km).slice(0, limit);
}
