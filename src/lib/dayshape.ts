import type { Destination, Theme } from "@/data/destinations";
import type { TripStop } from "@/lib/trip";

/**
 * What a day there actually looks like.
 *
 * An itinerary that says "Day 4: Varanasi" has told you nothing you could
 * act on. India runs on a daily rhythm that most planning tools ignore
 * entirely — the light, the heat, and the hours a place is actually itself.
 * A fort at noon in May and the same fort at seven in the morning are not
 * the same visit.
 *
 * The shape comes from the destination's own character; the specific advice
 * is the guide's, surfaced in the slot it belongs to rather than buried at
 * the bottom of a page.
 */

export type DayPart = "Early" | "Midday" | "Evening";

export interface DaySlot {
  part: DayPart;
  what: string;
}

export interface DayShape {
  slots: DaySlot[];
  /** The destination's own tip, placed in the part of the day it refers to. */
  localAdvice?: string;
  adviceIn?: DayPart;
  /** Set when the month makes the middle of the day genuinely unusable. */
  heatWarning?: string;
}

type Rhythm = Record<DayPart, string>;

/**
 * The daily rhythm each kind of place rewards. These are not preferences —
 * they are when the light, the heat, the wildlife and the rituals actually
 * happen.
 */
const RHYTHMS: Partial<Record<Theme, Rhythm>> = {
  Wildlife: {
    Early: "Dawn safari. Animals move in the first two hours and stop when it warms up — this drive is the reason you are here.",
    Midday: "Back at the lodge. Nothing is moving in the open, so rest, eat and let the naturalist talk you through what you saw.",
    Evening: "Second drive, out until the gate closes. Cats and sloth bears both come out as it cools.",
  },
  Spiritual: {
    Early: "First darshan before the queues build. Dawn is when temples are working rather than performing.",
    Midday: "Most sanctums close for a few hours around noon — eat, and see the smaller shrines nobody queues for.",
    Evening: "Evening aarti. Arrive a good half hour early and take a position off the main steps.",
  },
  Heritage: {
    Early: "Be at the gate as it opens. You get the site nearly empty and the low light that makes carving legible.",
    Midday: "Stone holds heat badly and the light goes flat — move to a museum, a meal, or the shaded interiors.",
    Evening: "Back out for the last hour of sun, or the sound-and-light show if the site runs one.",
  },
  Hills: {
    Early: "Get to the viewpoint before nine. Himalayan and Ghat views cloud over by mid-morning almost every day.",
    Midday: "Walk the lower trails, the bazaar or a tea estate while the tops are in cloud.",
    Evening: "Sunset from the ridge, then an early night — the good viewpoints need an early start again.",
  },
  Trekking: {
    Early: "Start walking at first light. You cover the climb before the heat and reach camp with daylight to spare.",
    Midday: "Keep going or rest properly — do not start a long ascent at noon.",
    Evening: "In by dusk. Trails in forest and at altitude are no place to be after dark.",
  },
  Beach: {
    Early: "The sea is calmest and the sand is empty. This is also when the fishing boats come in.",
    Midday: "Out of the sun. The UV between eleven and three is the reason people come home burnt.",
    Evening: "Back for the swim and the sunset — the whole coast turns out for it.",
  },
  Islands: {
    Early: "First boat out. Water clarity is best before the day's traffic churns the shallows.",
    Midday: "Shade and a long lunch; the reef is crowded and the light is overhead.",
    Evening: "Beach walk and sunset. Be out of the water by dusk where there are crocodile advisories.",
  },
  Backwaters: {
    Early: "Out on a small canoe through the narrow canals, when the village is waking and the water is glass.",
    Midday: "Moored up for lunch. Houseboats mostly hold station through the middle of the day anyway.",
    Evening: "Back onto open water for the sunset, then a quiet night on board.",
  },
  Lakes: {
    Early: "Still water and reflections; wind picks up later almost everywhere.",
    Midday: "Walk the shore or the town rather than sitting in an open boat.",
    Evening: "Golden hour on the water, which is what you came for.",
  },
  Cities: {
    Early: "Markets, flower sellers and the old quarter before the traffic. Cities are at their best and coolest now.",
    Midday: "Museums, galleries, a long lunch — the indoor half of the day.",
    Evening: "Street food and the promenade. Most Indian cities genuinely come alive after seven.",
  },
  Nature: {
    Early: "Out early for birds and clear air. Waterfalls and canyons also photograph best before the sun is overhead.",
    Midday: "Shaded trails or a rest; heat and haze both peak now.",
    Evening: "Back out for the last light, then an early stop.",
  },
  Desert: {
    Early: "Before the glare. Dunes and salt flats are unbearable and unphotographable in flat midday light.",
    Midday: "Indoors, properly. This is not a heat you push through.",
    Evening: "Out for sunset and stay after dark — desert nights and the stars are the real event.",
  },
  Culture: {
    Early: "Weekly haats, workshops and villages start early and thin out by lunch.",
    Midday: "Eat where the market eats, and let the afternoon be slow.",
    Evening: "Performances and festivals are almost always after dark.",
  },
  "Food & Drink": {
    Early: "Breakfast is its own cuisine here — go out for it rather than eating at the hotel.",
    Midday: "The main meal of the day, and the one worth planning around.",
    Evening: "Night markets and street stalls, which is where most of the good eating is.",
  },
};

const DEFAULT_RHYTHM: Rhythm = {
  Early: "Start early. Almost everything in India is better, cooler and emptier before nine.",
  Midday: "Slow down through the hottest hours — eat properly and stay out of the sun.",
  Evening: "Back out as it cools, and stay for the light.",
};

const PARTS: DayPart[] = ["Early", "Midday", "Evening"];

/** Where the guide's own advice belongs in the day. */
function partForAdvice(tip: string): DayPart | undefined {
  const t = tip.toLowerCase();
  if (
    /\b(dawn|sunrise|first light|daybreak|early|first thing|before it opens|as it opens|opening|at opening|[1-9](?:[.:]\d{2})?am|1[01](?:[.:]\d{2})?am|morning)\b/.test(
      t
    )
  ) {
    return "Early";
  }
  if (/\b(sunset|dusk|evening|after dark|overnight|stay the night|night|aarti|[5-9](?:[.:]\d{2})?pm|1[012](?:[.:]\d{2})?pm|nightfall|last hour|last light)\b/.test(t)) {
    return "Evening";
  }
  if (/\b(noon|midday|afternoon|lunch|[1-4](?:[.:]\d{2})?pm)\b/.test(t)) return "Midday";
  return undefined;
}

const HOT_MONTHS = [4, 5, 6];
const COOL_STATES = [
  "ladakh",
  "himachal-pradesh",
  "jammu-kashmir",
  "uttarakhand",
  "sikkim",
  "arunachal-pradesh",
  "meghalaya",
  "mizoram",
  "nagaland",
];

/**
 * `tip` is the place's traveller tip from its guide, passed in by the caller
 * so this module does not pull the whole guide corpus into client bundles.
 */
export function shapeForDestination(destination: Destination, month?: number, tip?: string): DayShape {
  const primary = destination.themes.find((t) => RHYTHMS[t]) ?? destination.themes[0];
  const rhythm = (primary && RHYTHMS[primary]) || DEFAULT_RHYTHM;

  const slots: DaySlot[] = PARTS.map((part) => ({ part, what: rhythm[part] }));

  const adviceIn = tip ? partForAdvice(tip) : undefined;

  const hot =
    month !== undefined &&
    HOT_MONTHS.includes(month) &&
    !COOL_STATES.includes(destination.stateId);

  return {
    slots,
    localAdvice: tip,
    adviceIn,
    heatWarning: hot
      ? "In April to June the middle of the day here regularly passes 40°C. Treat the midday break as compulsory, not optional."
      : undefined,
  };
}

export function shapeForStop(stop: TripStop, month?: number): DayShape {
  return shapeForDestination(stop.destination, month);
}
