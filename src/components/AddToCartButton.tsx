"use client";

import { useCart } from "@/context/TripsContext";

export default function AddToCartButton({
  slug,
  size = "md",
  className = "",
}: {
  slug: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const { isInCart, toggleCart } = useCart();
  const inCart = isInCart(slug);

  return (
    <button
      type="button"
      onClick={() => toggleCart(slug)}
      className={`rounded-lg font-semibold transition ${className} ${
        size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
      } ${
        inCart
          ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
          : "bg-coral-500 text-white hover:bg-coral-600"
      }`}
    >
      {inCart ? "Added to Trip Bag ✓" : "Add to Trip Bag"}
    </button>
  );
}
