import { destinations, type Destination } from "@/data/destinations";

/**
 * The reason to open the app on a day with no trip.
 *
 * A travel app that only matters in the three weeks a year someone is
 * travelling is a brochure the rest of the time. One place a day — the same
 * place for everyone, changing at midnight, drawn from the quiet half of the
 * catalogue as often as the famous half — gives the app a daily reason to
 * exist, and the traveller a slowly growing list of places they now know.
 *
 * Determinism matters: the pick is a function of the date alone, so it is
 * identical on the server, in the demo and on every device, and a page can be
 * cached for the whole day.
 */

/** Days since the Unix epoch, in local time, so the pick rolls at local midnight. */
export function dayIndex(date = new Date()): number {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local.getTime() - local.getTimezoneOffset() * 60000) / 86400000);
}

/**
 * A fixed-seed shuffle of the catalogue, so consecutive days are not
 * consecutive entries in the same state. Mulberry32 again — tiny, stable
 * across platforms.
 */
function shuffled<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ORDER_SEED = 20260101;
let cachedOrder: Destination[] | null = null;

function order(): Destination[] {
  if (!cachedOrder) cachedOrder = shuffled(destinations, ORDER_SEED);
  return cachedOrder;
}

export function placeOfTheDay(date = new Date()): Destination {
  const list = order();
  return list[((dayIndex(date) % list.length) + list.length) % list.length];
}

/** Yesterday's and the day before's, so a missed day can be caught up. */
export function recentPlaces(count = 3, date = new Date()): Destination[] {
  const list = order();
  const today = dayIndex(date);
  const out: Destination[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (((today - i) % list.length) + list.length) % list.length;
    out.push(list[idx]);
  }
  return out;
}

/* ---------- streak ---------- */

export interface Streak {
  /** Consecutive days the app was opened, counting today if opened today. */
  current: number;
  longest: number;
  /** dayIndex of the last visit. */
  lastDay: number;
  /** How many distinct places of the day have been seen. */
  seen: number;
}

export const EMPTY_STREAK: Streak = { current: 0, longest: 0, lastDay: -1, seen: 0 };

/** Pure: given the stored streak and today's index, what it becomes. */
export function advanceStreak(prev: Streak, today: number): Streak {
  if (prev.lastDay === today) return prev;
  const continues = prev.lastDay === today - 1;
  const current = continues ? prev.current + 1 : 1;
  return {
    current,
    longest: Math.max(prev.longest, current),
    lastDay: today,
    seen: prev.seen + 1,
  };
}
