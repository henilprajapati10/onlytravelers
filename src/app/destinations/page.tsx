import { Suspense } from "react";
import DestinationsExplorer from "@/components/DestinationsExplorer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "All Destinations — OnlyTravelers",
  description: "Be travelers, not tourists. Every state, every union territory of India.",
  path: "/destinations",
  image: "/opengraph-image",
});

export default function DestinationsPage() {
  return (
    <Suspense fallback={null}>
      <DestinationsExplorer />
    </Suspense>
  );
}
