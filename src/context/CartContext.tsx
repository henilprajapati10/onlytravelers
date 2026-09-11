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

const STORAGE_KEY = "onlytravelers.cart.v1";

interface CartContextValue {
  cartSlugs: string[];
  cartItems: Destination[];
  totalDays: number;
  isInCart: (slug: string) => boolean;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  toggleCart: (slug: string) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCartSlugs(parsed.filter((s) => typeof s === "string"));
        }
      }
    } catch {
      // ignore corrupted local storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartSlugs));
    } catch {
      // storage unavailable (private mode, quota) — silently skip persistence
    }
  }, [cartSlugs, isHydrated]);

  const addToCart = useCallback((slug: string) => {
    setCartSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCartSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleCart = useCallback((slug: string) => {
    setCartSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const clearCart = useCallback(() => setCartSlugs([]), []);

  const isInCart = useCallback((slug: string) => cartSlugs.includes(slug), [cartSlugs]);

  const cartItems = useMemo(
    () =>
      cartSlugs
        .map((slug) => destinations.find((d) => d.slug === slug))
        .filter((d): d is Destination => Boolean(d)),
    [cartSlugs]
  );

  const totalDays = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.recommendedDays, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartSlugs,
      cartItems,
      totalDays,
      isInCart,
      addToCart,
      removeFromCart,
      toggleCart,
      clearCart,
      isHydrated,
    }),
    [cartSlugs, cartItems, totalDays, isInCart, addToCart, removeFromCart, toggleCart, clearCart, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
