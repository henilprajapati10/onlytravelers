"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { destinations, type Destination } from "@/data/destinations";
import {
  sanitiseSlugs,
  isSavedTrip,
  suggestTripName,
  type SavedTrip,
  type TripStatus,
} from "@/data/trips";
import { STORAGE_KEYS, newId, readJson, removeKey, writeJson } from "@/lib/storage";

interface TripsContextValue {
  trips: SavedTrip[];
  activeTrip: SavedTrip | null;
  activeItems: Destination[];
  isHydrated: boolean;

  setActiveTrip: (id: string) => void;
  createTrip: (input?: { name?: string; slugs?: string[]; activate?: boolean }) => SavedTrip;
  updateTrip: (id: string, patch: Partial<Omit<SavedTrip, "id" | "createdAt">>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => SavedTrip | null;

  /** Bag operations, applied to the active trip. */
  isInTrip: (slug: string) => boolean;
  addToTrip: (slug: string) => void;
  removeFromTrip: (slug: string) => void;
  toggleInTrip: (slug: string) => void;
  clearTrip: () => void;
  addMany: (slugs: string[]) => void;
  replaceAll: (slugs: string[]) => void;
  reorder: (slug: string, direction: -1 | 1) => void;
}

const TripsContext = createContext<TripsContextValue | undefined>(undefined);

function now() {
  return new Date().toISOString();
}

function makeTrip(name: string, slugs: string[]): SavedTrip {
  const stamp = now();
  return {
    id: newId("trip"),
    name,
    slugs: sanitiseSlugs(slugs),
    status: "planning",
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readJson<unknown[]>(STORAGE_KEYS.trips, []);
    let loaded = Array.isArray(stored) ? stored.filter(isSavedTrip) : [];
    loaded = loaded.map((t) => ({ ...t, slugs: sanitiseSlugs(t.slugs) }));

    // The app used to hold exactly one Trip Bag. Carry it across so nobody
    // opens the new version to an empty screen.
    if (loaded.length === 0) {
      const legacy = sanitiseSlugs(readJson<unknown>(STORAGE_KEYS.legacyCart, []));
      if (legacy.length) {
        loaded = [makeTrip(suggestTripName(legacy), legacy)];
        removeKey(STORAGE_KEYS.legacyCart);
      }
    }

    const storedActive = readJson<string | null>(STORAGE_KEYS.activeTrip, null);
    setTrips(loaded);
    setActiveId(
      storedActive && loaded.some((t) => t.id === storedActive)
        ? storedActive
        : (loaded[0]?.id ?? null)
    );
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeJson(STORAGE_KEYS.trips, trips);
  }, [trips, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeJson(STORAGE_KEYS.activeTrip, activeId);
  }, [activeId, isHydrated]);

  const activeTrip = useMemo(
    () => trips.find((t) => t.id === activeId) ?? null,
    [trips, activeId]
  );

  const activeItems = useMemo(
    () =>
      (activeTrip?.slugs ?? [])
        .map((slug) => destinations.find((d) => d.slug === slug))
        .filter((d): d is Destination => Boolean(d)),
    [activeTrip]
  );

  const patchActive = useCallback(
    (fn: (trip: SavedTrip) => SavedTrip) => {
      setTrips((prev) => {
        // Adding to an empty app should just work, so make a trip on demand.
        if (!prev.length || !prev.some((t) => t.id === activeId)) {
          const created = fn(makeTrip("New trip", []));
          setActiveId(created.id);
          return [...prev, { ...created, updatedAt: now() }];
        }
        return prev.map((t) => (t.id === activeId ? { ...fn(t), updatedAt: now() } : t));
      });
    },
    [activeId]
  );

  const createTrip: TripsContextValue["createTrip"] = useCallback((input = {}) => {
    const slugs = sanitiseSlugs(input.slugs ?? []);
    const trip = makeTrip(input.name?.trim() || suggestTripName(slugs), slugs);
    setTrips((prev) => [...prev, trip]);
    if (input.activate !== false) setActiveId(trip.id);
    return trip;
  }, []);

  const updateTrip: TripsContextValue["updateTrip"] = useCallback((id, patch) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...patch, slugs: patch.slugs ? sanitiseSlugs(patch.slugs) : t.slugs, updatedAt: now() }
          : t
      )
    );
  }, []);

  const deleteTrip: TripsContextValue["deleteTrip"] = useCallback((id) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setActiveId((current) => (current === id ? (next[0]?.id ?? null) : current));
      return next;
    });
  }, []);

  const duplicateTrip: TripsContextValue["duplicateTrip"] = useCallback(
    (id) => {
      const source = trips.find((t) => t.id === id);
      if (!source) return null;
      const copy: SavedTrip = {
        ...source,
        id: newId("trip"),
        name: `${source.name} (copy)`,
        status: "planning",
        createdAt: now(),
        updatedAt: now(),
      };
      setTrips((prev) => [...prev, copy]);
      return copy;
    },
    [trips]
  );

  const isInTrip = useCallback(
    (slug: string) => Boolean(activeTrip?.slugs.includes(slug)),
    [activeTrip]
  );

  const addToTrip = useCallback(
    (slug: string) =>
      patchActive((t) => (t.slugs.includes(slug) ? t : { ...t, slugs: [...t.slugs, slug] })),
    [patchActive]
  );

  const removeFromTrip = useCallback(
    (slug: string) => patchActive((t) => ({ ...t, slugs: t.slugs.filter((s) => s !== slug) })),
    [patchActive]
  );

  const toggleInTrip = useCallback(
    (slug: string) =>
      patchActive((t) => ({
        ...t,
        slugs: t.slugs.includes(slug) ? t.slugs.filter((s) => s !== slug) : [...t.slugs, slug],
      })),
    [patchActive]
  );

  const clearTrip = useCallback(() => patchActive((t) => ({ ...t, slugs: [] })), [patchActive]);

  const addMany = useCallback(
    (slugs: string[]) =>
      patchActive((t) => ({
        ...t,
        slugs: [...t.slugs, ...sanitiseSlugs(slugs).filter((s) => !t.slugs.includes(s))],
      })),
    [patchActive]
  );

  const replaceAll = useCallback(
    (slugs: string[]) => patchActive((t) => ({ ...t, slugs: sanitiseSlugs(slugs) })),
    [patchActive]
  );

  const reorder = useCallback(
    (slug: string, direction: -1 | 1) =>
      patchActive((t) => {
        const index = t.slugs.indexOf(slug);
        const target = index + direction;
        if (index === -1 || target < 0 || target >= t.slugs.length) return t;
        const slugs = [...t.slugs];
        [slugs[index], slugs[target]] = [slugs[target], slugs[index]];
        return { ...t, slugs };
      }),
    [patchActive]
  );

  const value = useMemo(
    () => ({
      trips,
      activeTrip,
      activeItems,
      isHydrated,
      setActiveTrip: setActiveId,
      createTrip,
      updateTrip,
      deleteTrip,
      duplicateTrip,
      isInTrip,
      addToTrip,
      removeFromTrip,
      toggleInTrip,
      clearTrip,
      addMany,
      replaceAll,
      reorder,
    }),
    [
      trips, activeTrip, activeItems, isHydrated, createTrip, updateTrip, deleteTrip,
      duplicateTrip, isInTrip, addToTrip, removeFromTrip, toggleInTrip, clearTrip,
      addMany, replaceAll, reorder,
    ]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within a TripsProvider");
  return ctx;
}

/**
 * The Trip Bag, which is now just the active trip's list. Kept as its own
 * hook so every card, button and page did not have to change when trips
 * became plural.
 */
export function useCart() {
  const t = useTrips();
  return {
    cartSlugs: t.activeTrip?.slugs ?? [],
    cartItems: t.activeItems,
    daysAtDestinations: t.activeItems.reduce((sum, d) => sum + d.idealDays, 0),
    isInCart: t.isInTrip,
    addToCart: t.addToTrip,
    removeFromCart: t.removeFromTrip,
    toggleCart: t.toggleInTrip,
    clearCart: t.clearTrip,
    addMany: t.addMany,
    replaceAll: t.replaceAll,
    isHydrated: t.isHydrated,
  };
}

export type { SavedTrip, TripStatus };
