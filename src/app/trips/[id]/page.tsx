import { Suspense } from "react";
import TripWorkspace from "@/components/TripWorkspace";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Trip — OnlyTravelers",
};

/**
 * Trips live on the device, so the route is a client shell rather than a
 * pre-rendered page — the server has never heard of this trip.
 *
 * For a static export there is no server at all: one placeholder page is
 * written so the route exists, and the 404 page (TripFallback) renders any
 * real trip id. A Node host ignores the placeholder and answers every id.
 */
export function generateStaticParams() {
  return [{ id: "view" }];
}

export default function TripDetailPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading trip…</div>}
    >
      <TripWorkspace />
    </Suspense>
  );
}
