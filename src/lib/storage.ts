/**
 * One place that knows how this app persists things.
 *
 * Everything is local to the device today. When accounts arrive, this is the
 * layer that grows a sync backend behind it — nothing above it should be
 * reaching for localStorage directly.
 */

export const STORAGE_KEYS = {
  trips: "onlytravelers.trips.v1",
  activeTrip: "onlytravelers.activeTrip.v1",
  profile: "onlytravelers.profile.v1",
  checklists: "onlytravelers.checklists.v1",
  expenses: "onlytravelers.expenses.v1",
  /** The single Trip Bag this app had before trips became plural. */
  legacyCart: "onlytravelers.cart.v2",
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode, quota, or storage switched off. The session still works;
    // it just will not be here next time.
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Short, readable, and good enough to key local records. */
export function newId(prefix = "t"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${rand}`;
}
