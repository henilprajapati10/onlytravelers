import { northGuides } from "./north";
import { westGuides } from "./west";
import { southGuides } from "./south";
import { eastGuides } from "./east";
import { centralGuides } from "./central";
import { northeastGuides } from "./northeast";
import { addedGuides } from "../additions";

export interface Guide {
  /** What the place is and why it is worth the time. */
  summary: string;
  /** What you actually do there. */
  highlights: string[];
  /** The travelers-not-tourists angle: how to do it differently. */
  tip: string;
}

export const guides: Record<string, Guide> = {
  ...northGuides,
  ...westGuides,
  ...southGuides,
  ...eastGuides,
  ...centralGuides,
  ...northeastGuides,
  // Places the directory did not carry; see src/data/additions.
  ...addedGuides,
};

export function getGuide(slug: string): Guide | undefined {
  return guides[slug];
}
