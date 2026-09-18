"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrips } from "@/context/TripsContext";

/** The super-app spine on a phone: five places, always one tap away. */
const TABS = [
  { href: "/", label: "Discover", icon: "🧭", match: (p: string) => p === "/" },
  {
    href: "/destinations",
    label: "Explore",
    icon: "🗺️",
    match: (p: string) => p.startsWith("/destinations") || p.startsWith("/states") || p.startsWith("/circuits"),
  },
  { href: "/trips", label: "Trips", icon: "🎒", match: (p: string) => p.startsWith("/trips") || p.startsWith("/trip") },
  { href: "/profile", label: "You", icon: "👤", match: (p: string) => p.startsWith("/profile") },
];

export default function TabBar() {
  const pathname = usePathname();
  const { trips, activeTrip } = useTrips();
  const count = activeTrip?.slugs.length ?? 0;

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-100 bg-white/95 backdrop-blur md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const badge = tab.href === "/trips" ? count : 0;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition ${
                  active ? "text-coral-500" : "text-navy-400"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {tab.icon}
                </span>
                {tab.label}
                {badge > 0 && (
                  <span className="absolute right-1/2 top-1 translate-x-4 rounded-full bg-coral-500 px-1.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
                {trips.length > 1 && tab.href === "/trips" && (
                  <span className="sr-only">{trips.length} saved trips</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
