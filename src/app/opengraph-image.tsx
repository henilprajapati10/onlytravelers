import { destinations } from "@/data/destinations";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "OnlyTravelers — Before life gets too busy, travel.";

export default function Image() {
  return ogImage({
    eyebrow: "Be travelers, not tourists",
    title: "Before life gets too busy, travel.",
    subtitle: "Every state, every union territory of India.",
    facts: [`${destinations.length} destinations`, "36 states & UTs", "Real travel time", "Offline"],
    slug: "pangong-tso",
    themes: ["Lakes"],
  });
}
