import { destinations } from "./destinations";

export type TripStatus = "planning" | "booked" | "travelling" | "completed";

export const TRIP_STATUS: { id: TripStatus; label: string; tone: string }[] = [
  { id: "planning", label: "Planning", tone: "bg-navy-100 text-navy-700" },
  { id: "booked", label: "Booked", tone: "bg-sky-100 text-sky-800" },
  { id: "travelling", label: "Travelling", tone: "bg-emerald-100 text-emerald-800" },
  { id: "completed", label: "Completed", tone: "bg-sand-100 text-navy-500" },
];

export interface SavedTrip {
  id: string;
  name: string;
  /** Destination slugs, in the order they were added. */
  slugs: string[];
  status: TripStatus;
  /** 1-12, when the traveller plans to go. */
  travelMonth?: number;
  /** How many days they have. */
  daysAvailable?: number;
  /** ISO date the trip starts, once they have one. */
  startDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Drops slugs that are not in the catalogue, and duplicates. */
export function sanitiseSlugs(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of input) {
    if (typeof s !== "string" || seen.has(s)) continue;
    if (!destinations.some((d) => d.slug === s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

export function isSavedTrip(value: unknown): value is SavedTrip {
  if (!value || typeof value !== "object") return false;
  const t = value as Partial<SavedTrip>;
  return typeof t.id === "string" && typeof t.name === "string" && Array.isArray(t.slugs);
}

/** A name that means something before the traveller renames it. */
export function suggestTripName(slugs: string[]): string {
  const items = slugs
    .map((s) => destinations.find((d) => d.slug === s))
    .filter((d): d is (typeof destinations)[number] => Boolean(d));
  if (items.length === 0) return "New trip";

  const states = [...new Set(items.map((d) => d.stateName))];
  if (states.length === 1) return `${states[0]} trip`;
  if (states.length === 2) return `${states[0]} & ${states[1]}`;

  const zones = [...new Set(items.map((d) => d.zone))];
  if (zones.length === 1) return `${zones[0]} trip`;
  return `${states[0]} to ${states[states.length - 1]}`;
}
