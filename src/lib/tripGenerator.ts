import type { Destination, Region } from "@/data/destinations";

// Rough geographic loop so a multi-region trip is sequenced sensibly
// instead of bouncing across the country.
const REGION_ORDER: Region[] = [
  "North India",
  "Central India",
  "West India",
  "South India",
  "Islands",
  "East India",
  "Northeast India",
];

export interface TripStop {
  destination: Destination;
  startDay: number;
  endDay: number;
}

export interface TripLeg {
  region: Region;
  stops: TripStop[];
  travelBufferDaysAfter: number;
}

export interface TripPlan {
  legs: TripLeg[];
  totalDays: number;
  totalDestinations: number;
  totalTravelBufferDays: number;
  bestTimes: string[];
  regionsCovered: Region[];
}

export function generateTrip(cartItems: Destination[]): TripPlan | null {
  if (cartItems.length === 0) return null;

  const byRegion = new Map<Region, Destination[]>();
  for (const item of cartItems) {
    const list = byRegion.get(item.region) ?? [];
    list.push(item);
    byRegion.set(item.region, list);
  }

  const orderedRegions = REGION_ORDER.filter((region) => byRegion.has(region));

  const legs: TripLeg[] = [];
  let currentDay = 1;

  orderedRegions.forEach((region, index) => {
    const items = byRegion.get(region)!;
    const stops: TripStop[] = items.map((destination) => {
      const startDay = currentDay;
      const endDay = currentDay + destination.recommendedDays - 1;
      currentDay = endDay + 1;
      return { destination, startDay, endDay };
    });

    const isLastLeg = index === orderedRegions.length - 1;
    const travelBufferDaysAfter = isLastLeg ? 0 : 1;
    currentDay += travelBufferDaysAfter;

    legs.push({ region, stops, travelBufferDaysAfter });
  });

  const totalTravelBufferDays = legs.reduce((sum, leg) => sum + leg.travelBufferDaysAfter, 0);
  const totalDays = currentDay - 1;

  const bestTimes = Array.from(new Set(cartItems.map((d) => d.bestTime)));

  return {
    legs,
    totalDays,
    totalDestinations: cartItems.length,
    totalTravelBufferDays,
    bestTimes,
    regionsCovered: orderedRegions,
  };
}
