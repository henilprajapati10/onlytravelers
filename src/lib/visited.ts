import { destinations } from "@/data/destinations";
import { states } from "@/data/states";
import type { SavedTrip } from "@/data/trips";
import { readJson, writeJson } from "./storage";

/**
 * My India: the map of where you have actually been.
 *
 * Two sources, merged. Completed trips contribute their states
 * automatically; anything else — the childhood holiday, the work trip, the
 * state you drove through — is one tap on the map. The result is the thing
 * people screenshot: 36 units, how many are coloured in, which are next.
 */

export const VISITED_KEY = "onlytravelers.visited.v1";

export function loadManualVisited(): string[] {
  const raw = readJson<unknown>(VISITED_KEY, []);
  if (!Array.isArray(raw)) return [];
  const valid = new Set(states.map((s) => s.id));
  return raw.filter((x): x is string => typeof x === "string" && valid.has(x));
}

export function saveManualVisited(ids: string[]): void {
  writeJson(VISITED_KEY, [...new Set(ids)]);
}

/** States a set of completed trips passed through. */
export function statesFromTrips(trips: SavedTrip[]): string[] {
  const out = new Set<string>();
  for (const t of trips) {
    if (t.status !== "completed") continue;
    for (const slug of t.slugs) {
      const d = destinations.find((x) => x.slug === slug);
      if (d) out.add(d.stateId);
    }
  }
  return [...out];
}

export interface VisitedSummary {
  /** Every state counted as visited, from either source. */
  ids: Set<string>;
  /** Of those, the ones that came only from a completed trip. */
  fromTrips: Set<string>;
  count: number;
  total: number;
  percent: number;
  /** Zones where nothing has been visited yet — the obvious next trip. */
  untouchedZones: string[];
}

export function summariseVisited(manual: string[], trips: SavedTrip[]): VisitedSummary {
  const fromTrips = new Set(statesFromTrips(trips));
  // A stale or hand-edited store must never produce 37 of 36.
  const valid = new Set(states.map((s) => s.id));
  const ids = new Set([...manual.filter((id) => valid.has(id)), ...fromTrips]);
  const total = states.length;
  const zones = [...new Set(states.map((s) => s.zone))];
  const untouchedZones = zones.filter((z) => !states.some((s) => s.zone === z && ids.has(s.id)));
  return {
    ids,
    fromTrips,
    count: ids.size,
    total,
    percent: Math.round((ids.size / total) * 100),
    untouchedZones,
  };
}
