import Link from "next/link";
import Logo from "./Logo";
import { themes } from "@/data/destinations";
import { zones } from "@/data/states";
import { themeSlug, ZONE_SLUG } from "@/data/landing";
import { monthFull } from "@/lib/trip";

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-800 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Logo className="mb-3" tone="light" />
            <p className="max-w-xs text-sm text-navy-200">
              Be travelers, not tourists. We help you go deeper into India —
              one honest, well-researched destination at a time.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-300">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations" className="hover:text-coral-400">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/trip" className="hover:text-coral-400">
                  Build a Trip
                </Link>
              </li>
              <li>
                <Link href="/states" className="hover:text-coral-400">
                  States &amp; UTs
                </Link>
              </li>
              <li>
                <Link href="/circuits" className="hover:text-coral-400">
                  Circuits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-coral-400">
                  Your Trip Bag
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-navy-300">
              The Campaign
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campaign" className="hover:text-coral-400">
                  Travelers, Not Tourists
                </Link>
              </li>
              <li>
                <Link href="/image-rights" className="hover:text-coral-400">
                  Image rights register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Every landing page, one hop from every page: the site's own index. */}
        <div className="mt-10 grid gap-8 border-t border-navy-700 pt-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-300">By month</h3>
            <ul className="grid grid-cols-3 gap-x-2 gap-y-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <li key={m}>
                  <Link href={`/best-time/${monthFull(m).toLowerCase()}`} className="hover:text-coral-400">
                    {monthFull(m)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-300">By theme</h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5">
              {themes.map((t) => (
                <li key={t}>
                  <Link href={`/themes/${themeSlug(t)}`} className="hover:text-coral-400">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-300">By region</h3>
            <ul className="space-y-1.5">
              {zones.map((z) => (
                <li key={z}>
                  <Link href={`/zones/${ZONE_SLUG[z]}`} className="hover:text-coral-400">
                    {z}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/festivals" className="hover:text-coral-400">Festival calendar</Link>
              </li>
              <li>
                <Link href="/map-data" className="hover:text-coral-400">Map data</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-700 pt-6 text-xs text-navy-300">
          © {new Date().getFullYear()} OnlyTravelers. Made for people who
          want to see India, not just check it off a list.
        </div>
      </div>
    </footer>
  );
}
