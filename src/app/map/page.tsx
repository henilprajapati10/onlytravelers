import { Suspense } from "react";
import MapExplorer from "@/components/MapExplorer";

export const metadata = {
  title: "Explore on the map — OnlyTravelers",
  description: "Every OnlyTravelers destination on Google Maps, with directions and what is around it.",
};

export default function MapPage() {
  return (
    <Suspense fallback={null}>
      <MapExplorer />
    </Suspense>
  );
}
