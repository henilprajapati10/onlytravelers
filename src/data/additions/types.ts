import type { Theme } from "../destinations";
import type { Guide } from "../guides";

/**
 * A destination the directory did not carry.
 *
 * The 359 entries in `destinations.ts` come from the OnlyTravelers State-wise
 * Destination Directory and are generated from it. These are ours: places
 * India obviously has that the directory left out, and the quiet ones that
 * never make a listicle. Keeping them in a separate file keeps the provenance
 * honest — you can always tell which half of the catalogue came from where.
 *
 * Everything an addition needs lives in one record: the catalogue fields, the
 * guide and the coordinate. A place added without knowing what you would do
 * there is a row in a table, not a destination.
 */
export interface Addition {
  slug: string;
  name: string;
  district: string;
  stateId: string;
  themes: Theme[];
  /** Time at the destination, excluding travel to reach it. */
  idealDays: number;
  bestMonthsLabel: string;
  bestMonths: number[];
  /**
   * Not on the usual route. This is the tier the whole campaign is about —
   * quiet, and better for it. It is a claim about crowds, not about quality.
   */
  hiddenGem?: boolean;
  permitRequired?: boolean;
  monsoonProduct?: boolean;
  ferryOrFlightOnly?: boolean;
  /** Omitted when we do not genuinely know where it is. Never guessed. */
  coord?: { lat: number; lng: number };
  guide: Guide;
}
