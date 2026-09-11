"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/states", label: "States" },
  { href: "/trip", label: "Build a Trip" },
  { href: "/campaign", label: "Our Campaign" },
];

export default function Header() {
  const { cartSlugs, isHydrated } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-coral-500 ${
                pathname === link.href ? "text-coral-500" : "text-navy-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:border-coral-400 hover:text-coral-500"
          >
            <span aria-hidden="true">🎒</span>
            <span className="hidden sm:inline">Trip Bag</span>
            {isHydrated && cartSlugs.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                {cartSlugs.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-md border border-navy-200 p-2 text-navy-700 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-navy-100 bg-sand-50 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-coral-500" : "text-navy-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
