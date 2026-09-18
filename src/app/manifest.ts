import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OnlyTravelers — Before life gets too busy, travel.",
    short_name: "OnlyTravelers",
    description:
      "Plan and carry your India trips: 359 destinations, itineraries with real travel time, prep lists, bookings and spend — offline when you need it.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f3",
    theme_color: "#0b1b30",
    categories: ["travel", "navigation", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "My trips", url: "/trips" },
      { name: "Explore destinations", url: "/destinations" },
      { name: "Circuits", url: "/circuits" },
    ],
  };
}
