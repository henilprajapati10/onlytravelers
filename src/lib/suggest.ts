import { destinations, type Destination } from "@/data/destinations";

/**
 * "Pairs well with": what you would realistically add to a trip built around
 * this destination. Close by, in season at the same time, and not a repeat of
 * the same thing.
 */
export function pairsWellWith(origin: Destination, limit = 3): Destination[] {
  const scored = destinations
    .filter((d) => d.slug !== origin.slug)
    .map((d) => {
      let score = 0;

      // Geography: same district is a bolt-on, same state is a short hop.
      if (d.district === origin.district && d.stateId === origin.stateId) score += 50;
      else if (d.stateId === origin.stateId) score += 35;
      else if (d.zone === origin.zone) score += 12;

      // Season: no point suggesting something you cannot combine.
      const overlap = d.bestMonths.filter((m) => origin.bestMonths.includes(m)).length;
      if (overlap === 0) score -= 60;
      else score += Math.min(overlap, 6) * 3;

      // Variety: a different theme makes a better second stop than a copy.
      const sharesTheme = d.themes.some((t) => origin.themes.includes(t));
      score += sharesTheme ? 2 : 10;

      // A permit or a ferry is a big ask as an add-on.
      if (d.permitRequired && !origin.permitRequired) score -= 20;
      if (d.ferryOrFlightOnly && !origin.ferryOrFlightOnly) score -= 25;

      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name));

  return scored.slice(0, limit).map((x) => x.d);
}
