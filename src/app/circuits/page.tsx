import CircuitList from "@/components/CircuitList";
import JsonLd from "@/components/JsonLd";
import { circuits, circuitSummary } from "@/data/circuits";
import { pageMetadata, touristTripJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Circuits — OnlyTravelers",
  description: "Twelve ready-made routes through India, each one a starting shape for a trip you can edit.",
  path: "/circuits",
  image: "/opengraph-image",
});

export default function CircuitsPage() {
  const trips = circuits.map((c) => {
    const sum = circuitSummary(c);
    return touristTripJsonLd({ name: c.name, description: c.rationale, path: "/circuits", stops: sum.items });
  });
  return (
    <>
      <JsonLd data={trips} />
      <CircuitList />
    </>
  );
}
