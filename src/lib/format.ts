import type { Destination, Theme } from "@/data/destinations";

export const themeEmoji: Record<Theme, string> = {
  Heritage: "🏛️",
  Spiritual: "🪔",
  Hills: "⛰️",
  Nature: "🌿",
  Wildlife: "🐅",
  Beach: "🏖️",
  Islands: "🏝️",
  Lakes: "🛶",
  Cities: "🌆",
  Trekking: "🥾",
  Culture: "🧵",
  "Food & Drink": "🍲",
  Desert: "🐪",
  Backwaters: "⛵",
};

const EPSILON = 1e-9;

/**
 * The single day formatter for the whole site. Half days are real in this
 * catalogue — a third of it is half-day stops — so they are never rounded
 * away or printed as "0.5 days".
 */
export function formatDays(days: number): string {
  if (days <= 0) return "no time";
  if (Math.abs(days - 0.25) < EPSILON) return "a quarter day";
  if (Math.abs(days - 0.5) < EPSILON) return "half a day";
  if (Math.abs(days - 0.75) < EPSILON) return "three quarters of a day";
  const whole = Math.floor(days + EPSILON);
  const hasHalf = days - whole >= 0.5 - EPSILON;
  if (!hasHalf) return `${whole} ${whole === 1 ? "day" : "days"}`;
  return `${whole}½ days`;
}

/** Compact variant for chips and card footers. */
export function shortDays(days: number): string {
  if (days <= 0) return "0 days";
  if (Math.abs(days - 0.25) < EPSILON) return "¼ day";
  if (Math.abs(days - 0.75) < EPSILON) return "¾ day";
  if (Math.abs(days - 0.5) < EPSILON) return "½ day";
  const whole = Math.floor(days + EPSILON);
  const hasHalf = days - whole >= 0.5 - EPSILON;
  const label = hasHalf ? `${whole}½` : String(whole);
  return `${label} ${!hasHalf && whole === 1 ? "day" : "days"}`;
}

export function seasonBadge(d: Destination): { label: string; tone: "peak" | "monsoon" | "year" } {
  if (d.bestMonths.length === 12) return { label: "Year round", tone: "year" };
  if (d.monsoonProduct) return { label: `Monsoon · ${d.bestMonthsLabel}`, tone: "monsoon" };
  return { label: d.bestMonthsLabel, tone: "peak" };
}

export function isOpenInMonth(d: Destination, month: number): boolean {
  return d.bestMonths.includes(month);
}

/** "1 state", "3 states" — one stop and one state should not read as plural. */
export function countLabel(n: number, singular: string, plural?: string): string {
  return `${n} ${n === 1 ? singular : plural ?? singular + "s"}`;
}
