import type { Destination } from "@/data/destinations";
import { coordFor } from "@/data/coords";
import { mapQuery } from "./maps";

/**
 * The things you look up standing on a street corner.
 *
 * None of this needs an API key or a place database of our own. Google Maps
 * will answer "pharmacy near here" better than any list we could keep
 * current, so the app's job is to put the right query, centred on the right
 * place, one tap away — and never to invent an address or a phone number.
 */

export interface NearbyKind {
  id: string;
  label: string;
  icon: string;
  /** The search term Google Maps resolves most reliably in India. */
  query: string;
}

export const NEARBY_KINDS: NearbyKind[] = [
  { id: "atm", label: "ATM", icon: "🏧", query: "ATM" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊", query: "pharmacy" },
  { id: "hospital", label: "Hospital", icon: "🏥", query: "hospital" },
  { id: "police", label: "Police", icon: "👮", query: "police station" },
  { id: "station", label: "Railway station", icon: "🚆", query: "railway station" },
  { id: "bus", label: "Bus stand", icon: "🚌", query: "bus stand" },
  { id: "food", label: "Food", icon: "🍲", query: "restaurants" },
  { id: "petrol", label: "Petrol", icon: "⛽", query: "petrol pump" },
];

const MAPS_BASE = "https://www.google.com/maps";

/**
 * A Google Maps search for `kind` around the destination. With a coordinate
 * the map opens centred on the exact spot at street zoom; without one it
 * searches "pharmacy near <place, district, state>", which Google handles
 * well for any named place in India.
 */
export function nearbyUrl(destination: Destination, kind: NearbyKind): string {
  const c = coordFor(destination.slug);
  if (c) {
    return `${MAPS_BASE}/search/${encodeURIComponent(kind.query)}/@${c.lat},${c.lng},15z`;
  }
  return `${MAPS_BASE}/search/?api=1&query=${encodeURIComponent(`${kind.query} near ${mapQuery(destination)}`)}`;
}

export function nearbyLinks(destination: Destination): { kind: NearbyKind; url: string }[] {
  return NEARBY_KINDS.map((kind) => ({ kind, url: nearbyUrl(destination, kind) }));
}
