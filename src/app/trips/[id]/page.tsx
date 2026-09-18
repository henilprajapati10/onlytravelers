import { Suspense } from "react";
import TripWorkspace from "@/components/TripWorkspace";

export const metadata = {
  title: "Trip — OnlyTravelers",
};

/**
 * Trips live on the device, so the route is a client shell rather than a
 * pre-rendered page — the server has never heard of this trip.
 */
export default function TripDetailPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading trip…</div>}
    >
      <TripWorkspace />
    </Suspense>
  );
}
