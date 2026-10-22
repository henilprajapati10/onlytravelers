import type { Destination } from "@/data/destinations";
import { getState } from "@/data/states";
import { formatDays } from "./format";

export interface Faq {
  question: string;
  answer: string;
}

/**
 * The questions people type into a search box about a place, answered from
 * the catalogue and nothing else. No price, no opening hours, no rating —
 * those go stale and are not ours to assert.
 */
export function destinationFaq(d: Destination, summary?: string): Faq[] {
  const state = getState(d.stateId);
  const out: Faq[] = [
    {
      question: `Where is ${d.name}?`,
      answer: `${d.name} is in ${d.district} district, ${state?.name ?? d.stateName}, ${d.zone}.${
        state?.airports?.length ? ` The nearest airports are ${state.airports.filter((a) => !/^via/i.test(a)).join(", ")}.` : ""
      }${state?.railhead ? ` Railhead: ${state.railhead}.` : ""}`,
    },
    {
      question: `How many days do you need at ${d.name}?`,
      answer: `${formatDays(d.idealDays)} at the place itself — travel to reach it comes on top. OnlyTravelers builds that into a trip plan with real travel time.`,
    },
    {
      question: `When is the best time to visit ${d.name}?`,
      answer: `${d.bestMonthsLabel}.${
        d.monsoonProduct ? " This is a monsoon place: it is at its best in the rains, not despite them." : ""
      }`,
    },
  ];
  if (d.permitRequired || state?.permitRequired) {
    out.push({
      question: `Do you need a permit for ${d.name}?`,
      answer: `Yes. ${state?.name ?? d.stateName} requires a permit for visitors; arrange it before you travel and carry it. The trip prep list reminds you.`,
    });
  }
  if (d.ferryOrFlightOnly || state?.ferryOrFlightOnly) {
    out.push({
      question: `How do you reach ${d.name}?`,
      answer: `By ferry or flight only — there is no road or rail. Build the crossing's schedule into the trip, not around it.`,
    });
  }
  if (d.hiddenGem) {
    out.push({
      question: `Is ${d.name} crowded?`,
      answer: `${d.name} is one of the catalogue's hidden gems: well short of the tourist circuit, with the trade-off of fewer services. Go for the place, not the comforts.`,
    });
  }
  if (summary) {
    out.push({ question: `What is ${d.name} known for?`, answer: summary });
  }
  return out;
}
