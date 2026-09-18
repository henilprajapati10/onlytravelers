import { Suspense } from "react";
import TripPlanner from "@/components/TripPlanner";

export const metadata = {
  title: "Your trip — OnlyTravelers",
  description:
    "Your Trip Bag, sequenced into a day-by-day itinerary with travel time, season fit, permits and export.",
};

export default function TripPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading your trip…</div>}>
      <TripPlanner />
    </Suspense>
  );
}
