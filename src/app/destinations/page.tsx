import { Suspense } from "react";
import DestinationsExplorer from "@/components/DestinationsExplorer";

export const metadata = {
  title: "All Destinations — OnlyTravelers",
};

export default function DestinationsPage() {
  return (
    <Suspense fallback={null}>
      <DestinationsExplorer />
    </Suspense>
  );
}
