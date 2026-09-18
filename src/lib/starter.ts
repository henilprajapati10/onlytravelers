import { destinations, type Destination, type Theme } from "@/data/destinations";
import { getState, type Zone } from "@/data/states";
import { renownScore } from "@/data/renown";
import { buildTrip, type TripPlan } from "@/lib/trip";

/**
 * The blank page is where most trips die. Given only the three things
 * everyone already knows — how long they have, roughly when, and what they
 * like — this produces a real itinerary that is in season and actually fits.
 */

export interface StarterInput {
  /** Days available, including travel. */
  days: number;
  /** 1-12. */
  month: number;
  /** Where they are setting out from, or "anywhere". */
  fromStateId?: string;
  interests: Theme[];
  /** Fewer, longer stops versus covering ground. */
  pace?: "slow" | "balanced" | "packed";
}

export interface StarterResult {
  slugs: string[];
  plan: TripPlan;
  /** Plain-language reasons this particular set was chosen. */
  reasons: string[];
  /** Set when we had to ignore part of the request to find anything. */
  relaxed?: "interests";
  /** Months when the requested interests actually are in season. */
  betterMonths?: number[];
}

/** Months with a real choice of destinations for these themes. */
export function monthsForInterests(interests: Theme[], minimum = 3): number[] {
  if (!interests.length) return [];
  const out: number[] = [];
  for (let m = 1; m <= 12; m++) {
    const count = destinations.filter(
      (d) => d.bestMonths.includes(m) && d.themes.some((t) => interests.includes(t))
    ).length;
    if (count >= minimum) out.push(m);
  }
  return out;
}

const PACE_TARGET: Record<NonNullable<StarterInput["pace"]>, number> = {
  // Roughly how many days of the budget one stop should account for.
  slow: 3.5,
  balanced: 2.5,
  packed: 1.6,
};

/** Higher is better. Season is a hard filter; everything else is a nudge. */
function scoreDestination(d: Destination, input: StarterInput, fromZone?: Zone): number {
  let score = 0;

  if (input.interests.length) {
    const hits = d.themes.filter((t) => input.interests.includes(t)).length;
    if (hits === 0) return -1;
    score += hits * 30;
  } else {
    score += 10;
  }

  // Start close to home when we know where home is.
  if (fromZone) {
    if (d.zone === fromZone) score += 18;
    else score -= 6;
  }

  // Permits and island transport are a lot to ask of a first plan.
  if (d.permitRequired) score -= 14;
  if (d.ferryOrFlightOnly) score -= 10;

  // Prefer places that carry a day or more; half-day stops are add-ons.
  score += Math.min(d.idealDays, 3) * 4;

  // Lean towards what people have actually heard of, without burying the
  // quiet places entirely — they stay reachable through browsing.
  score += renownScore(d.slug);

  // A shorter trip should not be spent in a single park.
  if (input.days <= 5 && d.idealDays >= 5) score -= 25;

  return score;
}

export function startTrip(input: StarterInput): StarterResult | null {
  const pace = input.pace ?? "balanced";
  const fromState = input.fromStateId ? getState(input.fromStateId) : undefined;
  const fromZone = fromState?.zone;

  const inSeason = destinations.filter((d) => d.bestMonths.includes(input.month));
  if (!inSeason.length) return null;

  let relaxed: StarterResult["relaxed"];
  let effective = input;

  let ranked = inSeason
    .map((d) => ({ d, score: scoreDestination(d, effective, fromZone) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Nothing in these themes is in season that month — say so, and plan
  // around the month instead of returning nothing at all.
  if (ranked.length < 2 && input.interests.length) {
    relaxed = "interests";
    effective = { ...input, interests: [] };
    ranked = inSeason
      .map((d) => ({ d, score: scoreDestination(d, effective, fromZone) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  if (!ranked.length) return null;

  // Anchor on the best match, then keep adding the best thing near it that
  // still fits. Staying inside one or two states is what makes a short trip
  // feel unhurried rather than spent on the road.
  const anchor = ranked[0].d;
  const chosen: Destination[] = [anchor];
  const targetStops = Math.max(1, Math.round(input.days / PACE_TARGET[pace]));

  const nearness = (d: Destination): number => {
    const sameState = chosen.some((c) => c.stateId === d.stateId);
    const sameZone = chosen.some((c) => c.zone === d.zone);
    const sameDistrict = chosen.some((c) => c.stateId === d.stateId && c.district === d.district);
    if (sameDistrict) return 40;
    if (sameState) return 30;
    if (sameZone) return 12;
    return 0;
  };

  const pool = ranked.filter((x) => x.d.slug !== anchor.slug);
  const MAX_STOPS = 12;

  // Pace sets how many stops to aim for, but it should never leave days
  // unspent: keep going while there is a clear day or two still free.
  const wantsMore = () => {
    if (chosen.length >= MAX_STOPS) return false;
    if (chosen.length < targetStops) return true;
    const current = buildTrip(chosen, { travelMonth: input.month });
    return Boolean(current && input.days - current.totalDays >= 2);
  };

  while (wantsMore()) {
    const next = pool
      .filter((x) => !chosen.some((c) => c.slug === x.d.slug))
      .map((x) => ({ ...x, total: x.score + nearness(x.d) }))
      .sort((a, b) => b.total - a.total)[0];
    if (!next) break;

    const candidate = [...chosen, next.d];
    const plan = buildTrip(candidate, { travelMonth: input.month, daysAvailable: input.days });
    if (!plan || plan.totalDays > input.days) {
      // Does not fit. Try the next best rather than giving up — a big stop
      // may be blocking several small ones that would.
      const idx = pool.findIndex((p) => p.d.slug === next.d.slug);
      if (idx >= 0) pool.splice(idx, 1);
      if (!pool.length) break;
      continue;
    }
    chosen.push(next.d);
  }

  const plan = buildTrip(chosen, { travelMonth: input.month, daysAvailable: input.days });
  if (!plan) return null;

  const reasons: string[] = [];
  reasons.push(
    `Every stop is in season in ${new Date(2000, input.month - 1, 1).toLocaleString("en-IN", { month: "long" })}.`
  );
  reasons.push(
    plan.totalDays <= input.days
      ? `Fits your ${input.days} days with ${plan.totalDays} used, travel included.`
      : `Needs ${plan.totalDays} days — the closest we could get to ${input.days}.`
  );
  if (effective.interests.length) {
    reasons.push(`Built around ${effective.interests.join(", ").toLowerCase()}.`);
  }
  if (fromState) {
    const sameZone = chosen.filter((d) => d.zone === fromState.zone).length;
    reasons.push(
      sameZone === chosen.length
        ? `All of it is in ${fromState.zone}, so you are not crossing the country to start.`
        : `Starts from ${fromState.name}'s side of the country where it can.`
    );
  }
  if (plan.statesCovered.length <= 2) {
    reasons.push(`Kept to ${plan.statesCovered.join(" and ")} so you spend the time there, not moving.`);
  }

  return {
    slugs: chosen.map((d) => d.slug),
    plan,
    reasons,
    relaxed,
    betterMonths: relaxed ? monthsForInterests(input.interests) : undefined,
  };
}
