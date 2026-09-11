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

/** "0.5" reads badly as "0.5 days" on a card. */
export function formatDays(days: number): string {
  if (days === 0.5) return "Half a day";
  if (days === 1) return "1 day";
  if (days === 1.5) return "1½ days";
  return `${days} days`;
}

export function shortDays(days: number): string {
  if (days === 0.5) return "½ day";
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function seasonBadge(d: Destination): { label: string; tone: "peak" | "monsoon" | "year" } {
  if (d.bestMonths.length === 12) return { label: "Year round", tone: "year" };
  if (d.monsoonProduct) return { label: `Monsoon · ${d.bestMonthsLabel}`, tone: "monsoon" };
  return { label: d.bestMonthsLabel, tone: "peak" };
}

export function isOpenInMonth(d: Destination, month: number): boolean {
  return d.bestMonths.includes(month);
}
