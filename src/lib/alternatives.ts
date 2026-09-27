import { destinations, type Destination, type Theme } from "@/data/destinations";
import { getState } from "@/data/states";
import { renownOf } from "@/data/renown";
import type { TripPlan } from "@/lib/trip";
import { monthFull } from "@/lib/trip";

/**
 * The honest swap.
 *
 * Every packaged itinerary in this market has the same failure: it sells you
 * Manali in July because Manali is what it has, not because July suits it. A
 * catalogue that covers all 36 states can do the thing a package cannot —
 * say "not this one, in this month; this one instead", and mean it.
 *
 * Nothing here is automatic. Each suggestion states what is wrong with the
 * original and what the replacement actually buys, and the traveller decides.
 */

export type SwapReason = "out-of-season" | "permit" | "detour" | "quieter-twin";

export interface Swap {
  reason: SwapReason;
  from: Destination;
  to: Destination;
  /** What is wrong with the original for this particular trip. */
  why: string;
  /** What the replacement gets you. */
  gain: string;
  score: number;
}

const REASON_LABEL: Record<SwapReason, string> = {
  "out-of-season": "Out of season",
  permit: "Needs a permit",
  detour: "Costs the most travel",
  "quieter-twin": "Has a quieter twin",
};

export function swapReasonLabel(reason: SwapReason): string {
  return REASON_LABEL[reason];
}

/** Distance proxy: same state is near, same zone is reachable, else far. */
function nearness(a: Destination, b: Destination): number {
  if (a.stateId === b.stateId) return 40;
  if (a.zone === b.zone) return 18;
  return 0;
}

function sharedThemes(a: Destination, b: Destination): Theme[] {
  return a.themes.filter((t) => b.themes.includes(t));
}

interface CandidateOptions {
  /** Must be in season in this month, when one is set. */
  month?: number;
  /** Slugs already in the trip. */
  taken: Set<string>;
  /** Prefer somewhere quieter than the original. */
  preferQuieter?: boolean;
  /** Exclude permit-controlled destinations. */
  avoidPermit?: boolean;
  /** Exclude ferry/flight-only destinations. */
  avoidIsland?: boolean;
}

/**
 * The best stand-in for one destination: same character, genuinely reachable
 * from the rest of the trip, and actually open when you are going.
 */
function bestCandidate(from: Destination, opts: CandidateOptions): Destination | null {
  let best: Destination | null = null;
  let bestScore = 0;

  for (const d of destinations) {
    if (d.slug === from.slug || opts.taken.has(d.slug)) continue;
    if (opts.month && !d.bestMonths.includes(opts.month)) continue;
    if (opts.avoidPermit && d.permitRequired) continue;
    if (opts.avoidIsland && d.ferryOrFlightOnly) continue;

    // The monument down the road is not an alternative to this one.
    if (d.stateId === from.stateId && d.district === from.district) continue;

    // A replacement in another zone is a different trip, not a swap: the
    // route, the flights and the season all change with it.
    const near = nearness(from, d);
    if (near === 0) continue;

    const shared = sharedThemes(from, d).length;
    // A swap that changes what kind of place it is has missed the point.
    if (shared === 0) continue;

    let score = shared * 22 + near;

    // Similar time commitment, or the day budget shifts under the traveller.
    score -= Math.abs(d.idealDays - from.idealDays) * 6;

    if (opts.preferQuieter) {
      const fromTier = renownOf(from.slug);
      const tier = renownOf(d.slug);
      // Somewhere known enough to be set up for visitors, quieter than the
      // original. A famous place swapped for another famous place is no help.
      if (tier === "strong") score += 14;
      else if (tier === "quiet") score += 6;
      if (tier === "hero" && fromTier === "hero") score -= 30;
    } else {
      // Otherwise lean on places that are at least established.
      if (renownOf(d.slug) !== "quiet") score += 8;
    }

    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }

  return bestScore > 30 ? best : null;
}

function themePhrase(a: Destination, b: Destination): string {
  const shared = sharedThemes(a, b);
  if (!shared.length) return "a comparable stop";
  return shared.length === 1 ? shared[0].toLowerCase() : `${shared[0].toLowerCase()} and ${shared[1].toLowerCase()}`;
}

function placeOf(d: Destination): string {
  return d.stateId ? `${d.district}, ${d.stateName}` : d.stateName;
}

/** A stop that does not fit the month, and for which nothing better exists. */
export interface Stranded {
  destination: Destination;
  why: string;
}

export interface SwapReport {
  swaps: Swap[];
  /**
   * Out-of-season stops we could not honestly replace. Saying nothing here
   * would read as approval, which is the failure this whole feature exists
   * to avoid.
   */
  stranded: Stranded[];
}

/**
 * Reads a built plan and proposes swaps for the stops that do not fit it.
 * Returns at most `limit`, worst-fitting first.
 */
export function suggestSwaps(plan: TripPlan, limit = 4): Swap[] {
  return swapReport(plan, limit).swaps;
}

export function swapReport(plan: TripPlan, limit = 4): SwapReport {
  const month = plan.travelMonth;
  const taken = new Set(plan.stops.map((s) => s.destination.slug));
  const out: Swap[] = [];
  const stranded: Stranded[] = [];

  const tripHasPermit = plan.stops.some((s) => s.destination.permitRequired);
  const tripHasIsland = plan.stops.some((s) => s.destination.ferryOrFlightOnly);

  /* ---------- 1. out of season ---------- */
  if (month) {
    for (const stop of plan.stops) {
      if (!stop.outOfSeason) continue;
      const to = bestCandidate(stop.destination, { month, taken });
      if (!to) {
        stranded.push({
          destination: stop.destination,
          why: `${stop.destination.name} is best ${stop.destination.bestMonthsLabel}, and nothing of the same character anywhere near it is in season in ${monthFull(month)} either. Move the dates, or accept it off-season and know why.`,
        });
        continue;
      }
      taken.add(to.slug);
      out.push({
        reason: "out-of-season",
        from: stop.destination,
        to,
        why: `${stop.destination.name} is best ${stop.destination.bestMonthsLabel}, and you are going in ${monthFull(month)}.`,
        gain: `${to.name} is ${themePhrase(stop.destination, to)} too, in ${placeOf(to)}, and it is in season then.`,
        score: 100,
      });
    }
  }

  /* ---------- 2. a lone permit or a lone island ---------- */
  for (const stop of plan.stops) {
    const d = stop.destination;
    const lonePermit = d.permitRequired && plan.stops.filter((s) => s.destination.permitRequired).length === 1;
    const loneIsland = d.ferryOrFlightOnly && plan.stops.filter((s) => s.destination.ferryOrFlightOnly).length === 1;
    if (!lonePermit && !loneIsland) continue;
    if (out.some((s) => s.from.slug === d.slug)) continue;

    const to = bestCandidate(d, { month, taken, avoidPermit: true, avoidIsland: true });
    if (!to) continue;
    taken.add(to.slug);
    out.push({
      reason: "permit",
      from: d,
      to,
      why: lonePermit
        ? `${d.name} is the only permit-controlled stop in this trip. An Inner Line Permit has to be arranged in advance for one destination.`
        : `${d.name} is the only ferry-or-flight stop, so the whole schedule hangs on one sailing.`,
      gain: `${to.name} gives you ${themePhrase(d, to)} with no permit and no sailing to miss.`,
      score: 70,
    });
  }

  /* ---------- 3. the stop that costs the most travel for the least time ---------- */
  const costly = plan.stops
    .filter((s) => s.arrivalLeg && s.arrivalLeg.days >= 1)
    .map((s) => ({ stop: s, ratio: (s.arrivalLeg?.days ?? 0) / Math.max(0.5, s.destination.idealDays) }))
    .sort((a, b) => b.ratio - a.ratio)[0];

  if (costly && costly.ratio >= 1 && !out.some((s) => s.from.slug === costly.stop.destination.slug)) {
    const d = costly.stop.destination;
    const leg = costly.stop.arrivalLeg;
    const to = bestCandidate(d, { month, taken, avoidIsland: !tripHasIsland, avoidPermit: !tripHasPermit });
    if (to && nearness(d, to) > 0) {
      taken.add(to.slug);
      out.push({
        reason: "detour",
        from: d,
        to,
        why: `Getting to ${d.name} costs about ${leg?.approxHours} hrs of travel for ${d.idealDays === 1 ? "one day" : `${d.idealDays} days`} there — the worst ratio in this trip.`,
        gain: `${to.name} is ${themePhrase(d, to)} in ${placeOf(to)}, much closer to the rest of your route.`,
        score: 50,
      });
    }
  }

  /* ---------- 4. the quieter twin of a famous region ----------
     Only for places you spend real time in. A one-day monument — the Taj,
     a single fort — has no substitute, and offering one is the kind of
     suggestion that tells a traveller we are guessing. For those the honest
     advice is the timing already in the guide, not a replacement. */
  for (const stop of plan.stops) {
    const d = stop.destination;
    if (renownOf(d.slug) !== "hero") continue;
    if (d.idealDays < 2) continue;
    if (out.some((s) => s.from.slug === d.slug)) continue;
    const to = bestCandidate(d, { month, taken, preferQuieter: true });
    if (!to || renownOf(to.slug) === "hero") continue;
    // A twin is only a twin if it is genuinely the same kind of place.
    if (sharedThemes(d, to).length < Math.min(2, d.themes.length)) continue;
    taken.add(to.slug);
    out.push({
      reason: "quieter-twin",
      from: d,
      to,
      why: `${d.name} is one of the best-known names in Indian travel, so it is at its busiest in exactly the months that suit it.`,
      gain: `${to.name} in ${placeOf(to)} is ${themePhrase(d, to)} of the same kind, near enough to keep your route. Add it, or take it instead — both work.`,
      score: 30,
    });
    break; // one is a useful nudge; four is nagging
  }

  return {
    swaps: out.sort((a, b) => b.score - a.score).slice(0, limit),
    stranded,
  };
}
