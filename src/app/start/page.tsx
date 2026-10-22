import { Suspense } from "react";
import TripStarter from "@/components/TripStarter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Plan a trip — OnlyTravelers",
  description: "Tell us how long you have, roughly when, and what you like. We build a real itinerary you can change.",
  path: "/start",
  image: "/opengraph-image",
});

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <TripStarter />
    </Suspense>
  );
}
