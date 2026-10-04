import type { Destination } from "../destinations";
import type { Guide } from "../guides";
import type { Addition } from "./types";
import { getState } from "../states";
import { northAdditions } from "./north";
import { westAdditions } from "./west";
import { southAdditions } from "./south";
import { eastAdditions } from "./east";
import { centralAdditions } from "./central";
import { northeastAdditions } from "./northeast";

export type { Addition } from "./types";

/**
 * Everything the directory did not carry, in one list.
 *
 * "Every destination in India" is not a thing any catalogue can honestly
 * claim — the country has tens of thousands of places worth a day. What this
 * does is close the obvious gaps (a state's best-known temple town missing
 * because the source document skipped it) and add a deliberate tier of quiet
 * places, which is the half of the catalogue the campaign is actually about.
 */
export const additions: Addition[] = [
  ...northAdditions,
  ...westAdditions,
  ...southAdditions,
  ...eastAdditions,
  ...centralAdditions,
  ...northeastAdditions,
];

/** In the catalogue's own shape, so nothing downstream has to know the difference. */
export const addedDestinations: Destination[] = additions.map((a) => {
  const state = getState(a.stateId);
  if (!state) {
    // A typo in a stateId would otherwise produce a destination in a state
    // that does not exist, and it would only surface as a blank page.
    throw new Error(`Addition "${a.slug}" names an unknown state: ${a.stateId}`);
  }
  return {
    slug: a.slug,
    name: a.name,
    district: a.district,
    stateId: a.stateId,
    stateName: state.name,
    zone: state.zone,
    themes: a.themes,
    // The directory printed a single raw theme per row. Ours is the first of
    // the themes we assigned, so the field means the same thing either way.
    rawTheme: a.themes[0],
    idealDays: a.idealDays,
    bestMonthsLabel: a.bestMonthsLabel,
    bestMonths: a.bestMonths,
    source: "onlytravelers" as const,
    ...(a.hiddenGem ? { hiddenGem: true as const } : {}),
    ...(a.permitRequired ? { permitRequired: true as const } : {}),
    ...(a.monsoonProduct ? { monsoonProduct: true as const } : {}),
    ...(a.ferryOrFlightOnly ? { ferryOrFlightOnly: true as const } : {}),
  };
});

export const addedGuides: Record<string, Guide> = Object.fromEntries(
  additions.map((a) => [a.slug, a.guide])
);

export const addedCoords: Record<string, { lat: number; lng: number }> = Object.fromEntries(
  additions.filter((a) => a.coord).map((a) => [a.slug, a.coord!])
);
