import { Suspense } from "react";
import TripStarter from "@/components/TripStarter";

export const metadata = {
  title: "Plan a trip — OnlyTravelers",
  description:
    "Tell us how long you have, roughly when, and what you like. We build a real itinerary you can change.",
};

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <TripStarter />
    </Suspense>
  );
}
