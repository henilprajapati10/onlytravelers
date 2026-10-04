import type { Destination } from "@/data/destinations";
import type { StateUnit } from "@/data/states";
import type { TravelMode, TripPlan } from "@/lib/trip";

/**
 * Google Maps, without pretending to know more than we do.
 *
 * The directory is explicit that exact coordinates must be verified before
 * publishing, so nothing here invents a lat/lng for a destination. Every link
 * hands Google the place by name — "Hampi, Vijayanagara, Karnataka, India" —
 * and lets Google's own geocoder find it. That is also what a traveller would
 * type, so the pin they see matches the one they would have found themselves.
 *
 * Everything works with no API key: Maps URLs and the classic embed are both
 * keyless. A key (the Maps Embed API, which Google does not bill) upgrades the
 * embedded maps to the supported endpoint and draws whole routes.
 *
 * Pure functions only — no window, no process.env — so the same module runs
 * in the Next app and in the single-file app build.
 */

const MAPS = "https://www.google.com/maps";

/** What Google is asked to find. Name first, then enough context to disambiguate. */
export function placeQuery(d: Pick<Destination, "name" | "district" | "stateName">): string {
  const parts = [d.name];
  // "Old Delhi, Delhi" reads fine; "Goa, Goa" does not.
  if (d.district && d.district !== d.name && d.district !== d.stateName) parts.push(d.district);
  if (d.stateName && d.stateName !== d.name) parts.push(d.stateName);
  parts.push("India");
  return parts.join(", ");
}

export function stateQuery(s: Pick<StateUnit, "name">): string {
  return `${s.name}, India`;
}

/** Opens Google Maps on a place. On a phone this opens the Maps app. */
export function mapsSearchUrl(query: string): string {
  return `${MAPS}/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type GoogleTravelMode = "driving" | "walking" | "transit" | "bicycling";

export interface DirectionsRequest {
  /** Omit to start from wherever the traveller is — Google uses their location. */
  origin?: string;
  destination: string;
  waypoints?: string[];
  mode?: GoogleTravelMode;
}

export function directionsUrl({ origin, destination, waypoints = [], mode = "driving" }: DirectionsRequest): string {
  const params = new URLSearchParams({ api: "1" });
  if (origin) params.set("origin", origin);
  params.set("destination", destination);
  if (waypoints.length) params.set("waypoints", waypoints.join("|"));
  params.set("travelmode", mode);
  return `${MAPS}/dir/?${params.toString()}`;
}

/** Turn-by-turn from the traveller's current position to the place. */
export function directionsFromHereUrl(query: string, mode: GoogleTravelMode = "driving"): string {
  return directionsUrl({ destination: query, mode });
}

/** Legs Google can draw on a road map. Flights and sailings it cannot. */
export function isDrivable(mode: TravelMode): boolean {
  return mode !== "Flight" && mode !== "Ferry or flight";
}

export function googleModeFor(mode: TravelMode): GoogleTravelMode {
  return mode === "Train or road" ? "transit" : "driving";
}

/** Google Flights search between two places, for the legs a road map cannot show. */
export function flightsUrl(from: string, to: string): string {
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${from} to ${to}`)}`;
}

/* ---------- the trip on a map ---------- */

export interface RouteSegment {
  /** Destination names, in order. */
  names: string[];
  slugs: string[];
  queries: string[];
  url: string;
}

export interface MapLeg {
  fromSlug: string;
  toSlug: string;
  fromName: string;
  toName: string;
  mode: TravelMode;
  approxKm: number;
  drivable: boolean;
  /** Directions for drivable legs, Google Flights for the rest. */
  url: string;
  urlLabel: string;
}

/**
 * Google Maps on a phone browser accepts at most three waypoints, so a route
 * link carries at most five stops: origin, three waypoints, destination.
 * Anything longer is split into parts that share their end points.
 */
export const MAX_STOPS_PER_LINK = 5;

/**
 * Splits a trip into routes Google can actually draw: a break wherever the
 * trip flies or sails (a driving route to Havelock does not exist), and a
 * break every five stops so the link opens on any device.
 */
export function routeSegments(plan: Pick<TripPlan, "stops">): RouteSegment[] {
  const runs: Destination[][] = [];
  let current: Destination[] = [];
  plan.stops.forEach((stop, i) => {
    const leg = stop.arrivalLeg;
    if (i > 0 && leg && !isDrivable(leg.mode)) {
      runs.push(current);
      current = [];
    }
    current.push(stop.destination);
  });
  if (current.length) runs.push(current);

  const segments: RouteSegment[] = [];
  for (const run of runs) {
    if (run.length < 2) continue;
    for (let start = 0; start < run.length - 1; start += MAX_STOPS_PER_LINK - 1) {
      const slice = run.slice(start, start + MAX_STOPS_PER_LINK);
      if (slice.length < 2) break;
      const queries = slice.map(placeQuery);
      segments.push({
        names: slice.map((d) => d.name),
        slugs: slice.map((d) => d.slug),
        queries,
        url: directionsUrl({
          origin: queries[0],
          destination: queries[queries.length - 1],
          waypoints: queries.slice(1, -1),
        }),
      });
    }
  }
  return segments;
}

/** Every move in the trip, each with the right Google link for that kind of leg. */
export function mapLegs(plan: Pick<TripPlan, "stops">): MapLeg[] {
  const legs: MapLeg[] = [];
  for (let i = 1; i < plan.stops.length; i++) {
    const from = plan.stops[i - 1].destination;
    const to = plan.stops[i].destination;
    const leg = plan.stops[i].arrivalLeg;
    const mode: TravelMode = leg?.mode ?? "Road";
    const drivable = isDrivable(mode);
    legs.push({
      fromSlug: from.slug,
      toSlug: to.slug,
      fromName: from.name,
      toName: to.name,
      mode,
      approxKm: leg?.approxKm ?? 0,
      drivable,
      url: drivable
        ? directionsUrl({ origin: placeQuery(from), destination: placeQuery(to), mode: googleModeFor(mode) })
        : flightsUrl(from.district || from.name, to.district || to.name),
      urlLabel: drivable ? "Directions" : "Flights",
    });
  }
  return legs;
}

/* ---------- what is near a stop ---------- */

export interface NearbyKind {
  id: string;
  label: string;
  icon: string;
  /** What Google is asked to find, before "near <place>". */
  search: string;
}

/** The things people actually go looking for on the ground. */
export const NEARBY_KINDS: NearbyKind[] = [
  { id: "stay", label: "Stays", icon: "🛏️", search: "Hotels and homestays" },
  { id: "food", label: "Food", icon: "🍛", search: "Restaurants" },
  { id: "atm", label: "ATM", icon: "🏧", search: "ATM" },
  { id: "fuel", label: "Fuel", icon: "⛽", search: "Petrol pump" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊", search: "Pharmacy" },
  { id: "hospital", label: "Hospital", icon: "🏥", search: "Hospital" },
  { id: "police", label: "Police", icon: "🚓", search: "Police station" },
  { id: "transit", label: "Station", icon: "🚉", search: "Railway station or bus stand" },
];

export function nearbyUrl(kind: NearbyKind, place: string): string {
  return mapsSearchUrl(`${kind.search} near ${place}`);
}

/* ---------- embedded maps ---------- */

/**
 * The map shown inside the app. With a key this is the Maps Embed API; with
 * none it is Google's classic keyless embed of the same search.
 */
export function embedPlaceUrl(query: string, apiKey?: string): string {
  if (apiKey) {
    return `${MAPS}/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}`;
  }
  return `${MAPS}?q=${encodeURIComponent(query)}&output=embed`;
}

/** A drawn route between two or more places. */
export function embedRouteUrl(queries: string[], apiKey?: string): string {
  if (queries.length < 2) return embedPlaceUrl(queries[0] ?? "India", apiKey);
  const origin = queries[0];
  const destination = queries[queries.length - 1];
  const via = queries.slice(1, -1);
  if (apiKey) {
    const params = new URLSearchParams({ key: apiKey, origin, destination, mode: "driving" });
    if (via.length) params.set("waypoints", via.join("|"));
    return `${MAPS}/embed/v1/directions?${params.toString()}`;
  }
  // The classic embed chains stops with "to:".
  const daddr = [...via, destination].join(" to:");
  return `${MAPS}?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(daddr)}&output=embed`;
}

/** Said wherever a pin is shown, because it is true. */
export const PIN_NOTE =
  "Google places the pin from the name. Check it, and the road in, before you set off.";
