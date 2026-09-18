import { destinations, themes, type Theme } from "@/data/destinations";
import { states, zones } from "@/data/states";
import { circuits } from "@/data/circuits";
import { guides } from "@/data/guides";
import { renownScore } from "@/data/renown";

/**
 * One search box for the whole catalogue.
 *
 * A super app is judged on how fast it answers "where is that thing I want",
 * so this searches destinations, states, circuits and themes together and
 * ranks them in one list rather than making people pick a section first.
 */

export type ResultKind = "destination" | "state" | "circuit" | "theme" | "action";

export interface SearchResult {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Kept for the caller so a result can be added to a trip straight away. */
  slug?: string;
  score: number;
}

/** Fold accents and punctuation so "Munnar," and "munnar" are one token. */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(input: string): string[] {
  return normalise(input).split(" ").filter(Boolean);
}

/**
 * Scores one haystack against the query terms. A match at the start of a
 * word beats a match buried inside one, and every term has to appear
 * somewhere or the record is not a hit at all.
 */
function matchScore(haystack: string, terms: string[], weight: number): number {
  const hay = normalise(haystack);
  let total = 0;
  for (const term of terms) {
    const at = hay.indexOf(term);
    if (at < 0) return 0;
    const wordStart = at === 0 || hay[at - 1] === " ";
    const whole = wordStart && (at + term.length === hay.length || hay[at + term.length] === " ");
    total += weight * (whole ? 3 : wordStart ? 2 : 1);
  }
  return total;
}

/** Best of several fields, not the sum — one strong field should win. */
function best(...scores: number[]): number {
  return Math.max(0, ...scores);
}

const ACTIONS: { id: string; title: string; subtitle: string; href: string; keywords: string }[] = [
  {
    id: "start",
    title: "Plan a new trip",
    subtitle: "Answer three questions, get a full itinerary",
    href: "/start",
    keywords: "start plan new trip build itinerary generate auto",
  },
  {
    id: "trips",
    title: "My trips",
    subtitle: "Everything you have saved, active trip first",
    href: "/trips",
    keywords: "my trips saved bag cart itinerary",
  },
  {
    id: "profile",
    title: "Travel profile",
    subtitle: "Pace, interests and who you travel with",
    href: "/profile",
    keywords: "profile you settings pace interests preferences",
  },
  {
    id: "circuits",
    title: "Ready-made circuits",
    subtitle: "Twelve routes that already hold together",
    href: "/circuits",
    keywords: "circuits routes ready made packages itineraries",
  },
  {
    id: "campaign",
    title: "Be travelers, not tourists",
    subtitle: "What the campaign actually asks of you",
    href: "/campaign",
    keywords: "campaign travelers not tourists manifesto about",
  },
];

export function search(query: string, limit = 12): SearchResult[] {
  const terms = tokens(query);
  if (!terms.length) return [];

  const out: SearchResult[] = [];

  for (const d of destinations) {
    const guide = guides[d.slug];
    const score = best(
      matchScore(d.name, terms, 100),
      matchScore(`${d.name} ${d.district}`, terms, 70),
      matchScore(`${d.district} ${d.stateName}`, terms, 45),
      matchScore(d.themes.join(" "), terms, 30),
      matchScore(d.rawTheme, terms, 26),
      matchScore(guide?.summary ?? "", terms, 12)
    );
    if (score > 0) {
      out.push({
        kind: "destination",
        id: d.slug,
        slug: d.slug,
        title: d.name,
        subtitle: `${d.district}, ${d.stateName} · ${d.themes.slice(0, 2).join(", ")}`,
        href: `/destinations/${d.slug}`,
        // Renown only breaks ties between equally good text matches.
        score: score + renownScore(d.slug),
      });
    }
  }

  for (const s of states) {
    const count = destinations.filter((d) => d.stateId === s.id).length;
    const score = best(
      matchScore(s.name, terms, 110),
      matchScore(s.capital, terms, 60),
      matchScore(s.zone, terms, 40),
      matchScore(s.airports.join(" "), terms, 35),
      matchScore(s.positioning, terms, 12)
    );
    if (score > 0) {
      out.push({
        kind: "state",
        id: s.id,
        title: s.name,
        subtitle: `${s.kind} · ${s.zone} · ${count} destinations`,
        href: `/states/${s.id}`,
        score,
      });
    }
  }

  for (const c of circuits) {
    const score = best(
      matchScore(c.name, terms, 95),
      matchScore(c.tagline, terms, 55),
      matchScore(c.rationale, terms, 14)
    );
    if (score > 0) {
      out.push({
        kind: "circuit",
        id: c.id,
        title: c.name,
        subtitle: `Circuit · ${c.tagline} · ${c.slugs.length} stops`,
        href: `/circuits#${c.id}`,
        score,
      });
    }
  }

  for (const theme of themes) {
    const score = matchScore(theme, terms, 80);
    if (score > 0) {
      const count = destinations.filter((d) => d.themes.includes(theme as Theme)).length;
      out.push({
        kind: "theme",
        id: theme,
        title: theme,
        subtitle: `Theme · ${count} destinations`,
        href: `/destinations?theme=${encodeURIComponent(theme)}`,
        score,
      });
    }
  }

  for (const zone of zones) {
    const score = matchScore(zone, terms, 75);
    if (score > 0) {
      const count = destinations.filter((d) => d.zone === zone).length;
      out.push({
        kind: "theme",
        id: zone,
        title: zone,
        subtitle: `Zone · ${count} destinations`,
        href: `/states?zone=${encodeURIComponent(zone)}`,
        score,
      });
    }
  }

  for (const a of ACTIONS) {
    const score = best(matchScore(a.title, terms, 70), matchScore(a.keywords, terms, 50));
    if (score > 0) {
      out.push({
        kind: "action",
        id: a.id,
        title: a.title,
        subtitle: a.subtitle,
        href: a.href,
        score,
      });
    }
  }

  return out
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** Shown before anyone types — the things people actually come here for. */
export const SEARCH_SUGGESTIONS = [
  "Ladakh",
  "backwaters",
  "Rajasthan",
  "beaches",
  "Northeast",
  "trekking",
];
