import { destinations } from "@/data/destinations";
import type { MetadataRoute } from "next";
import { withBase } from "@/lib/basePath";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OnlyTravelers — Before life gets too busy, travel.",
    short_name: "OnlyTravelers",
    description:
      `Plan and carry your India trips: ${destinations.length} destinations, itineraries with real travel time, prep lists, bookings and spend — offline when you need it.`,
    start_url: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f3",
    theme_color: "#0b1b30",
    categories: ["travel", "navigation", "lifestyle"],
    icons: [
      { src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: withBase("/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/icon-maskable.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "My trips", url: withBase("/trips") },
      { name: "Explore destinations", url: withBase("/destinations") },
      { name: "Circuits", url: withBase("/circuits") },
    ],
  };
}
