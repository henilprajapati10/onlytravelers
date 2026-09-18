import type { Theme } from "./destinations";

/**
 * What the app knows about the traveller. Local to the device for now, and
 * deliberately about how they travel rather than who they are — none of this
 * needs an account to be useful.
 */

export type Pace = "slow" | "balanced" | "packed";
export type Company = "solo" | "couple" | "family" | "friends";
export type StayStyle = "homestays" | "hotels" | "mixed";

export interface TravelerProfile {
  name?: string;
  /** Where trips start from, used for the first leg and for "near me". */
  homeCity?: string;
  pace: Pace;
  company: Company;
  stayStyle: StayStyle;
  interests: Theme[];
  vegetarian: boolean;
  /** Step-free access, limited walking, or similar needs. */
  accessibilityNotes?: string;
  /** Marked done so the prep list stops nagging. */
  hasIndianIdProof: boolean;
}

export const DEFAULT_PROFILE: TravelerProfile = {
  pace: "balanced",
  company: "solo",
  stayStyle: "mixed",
  interests: [],
  vegetarian: false,
  hasIndianIdProof: false,
};

export const PACE_OPTIONS: { id: Pace; label: string; detail: string; maxStopsPerWeek: number }[] = [
  {
    id: "slow",
    label: "Slow",
    detail: "Few places, long stays. You would rather know one town than see six.",
    maxStopsPerWeek: 3,
  },
  {
    id: "balanced",
    label: "Balanced",
    detail: "A new place every couple of days, with room to sit still.",
    maxStopsPerWeek: 5,
  },
  {
    id: "packed",
    label: "Packed",
    detail: "Cover ground. You are happy to move most days.",
    maxStopsPerWeek: 8,
  },
];

export const COMPANY_OPTIONS: { id: Company; label: string }[] = [
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends" },
];

export const STAY_OPTIONS: { id: StayStyle; label: string; detail: string }[] = [
  { id: "homestays", label: "Homestays", detail: "Local families, guesthouses, village stays." },
  { id: "hotels", label: "Hotels", detail: "Predictable rooms and service." },
  { id: "mixed", label: "A mix", detail: "Whatever suits the place." },
];

export function paceFor(profile: TravelerProfile) {
  return PACE_OPTIONS.find((p) => p.id === profile.pace) ?? PACE_OPTIONS[1];
}
