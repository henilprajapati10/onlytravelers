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

const STORAGE_KEY = "onlytravelers.cart.v2";

interface CartContextValue {
  cartSlugs: string[];
  cartItems: Destination[];
  /** Time at destinations only — travel is added by the trip builder. */
  daysAtDestinations: number;
  isInCart: (slug: string) => boolean;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  toggleCart: (slug: string) => void;
  clearCart: () => void;
  /** Adds several at once, skipping any already in the bag. */
  addMany: (slugs: string[]) => void;
  /** Replaces the bag wholesale — used by circuits and shared links. */
  replaceAll: (slugs: string[]) => void;
  isHydrated: boolean;
}

/** Keeps only slugs that exist in the catalogue, with no duplicates. */
function sanitise(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of slugs) {
    if (typeof s !== "string" || seen.has(s)) continue;
    if (!destinations.some((d) => d.slug === s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCartSlugs(sanitise(JSON.parse(raw)));
    } catch {
      // corrupted or unavailable storage — start empty
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartSlugs));
    } catch {
      // storage blocked — the trip still works for this session
    }
  }, [cartSlugs, isHydrated]);

  const addToCart = useCallback((slug: string) => {
    setCartSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCartSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleCart = useCallback((slug: string) => {
    setCartSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const clearCart = useCallback(() => setCartSlugs([]), []);

  const addMany = useCallback((slugs: string[]) => {
    const clean = sanitise(slugs);
    setCartSlugs((prev) => [...prev, ...clean.filter((s) => !prev.includes(s))]);
  }, []);

  const replaceAll = useCallback((slugs: string[]) => {
    setCartSlugs(sanitise(slugs));
  }, []);

  const isInCart = useCallback((slug: string) => cartSlugs.includes(slug), [cartSlugs]);

  const cartItems = useMemo(
    () =>
      cartSlugs
        .map((slug) => destinations.find((d) => d.slug === slug))
        .filter((d): d is Destination => Boolean(d)),
    [cartSlugs]
  );

  const daysAtDestinations = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.idealDays, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartSlugs,
      cartItems,
      daysAtDestinations,
      isInCart,
      addToCart,
      removeFromCart,
      toggleCart,
      clearCart,
      addMany,
      replaceAll,
      isHydrated,
    }),
    [
      cartSlugs,
      cartItems,
      daysAtDestinations,
      isInCart,
      addToCart,
      removeFromCart,
      toggleCart,
      clearCart,
      addMany,
      replaceAll,
      isHydrated,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
