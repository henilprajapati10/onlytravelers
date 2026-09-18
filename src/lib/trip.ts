import { type Destination } from "@/data/destinations";
import { getState, type StateUnit, type Zone } from "@/data/states";
import { formatDays } from "@/lib/format";

/**
 * Turns a Trip Bag into a day-by-day itinerary.
 *
 * The directory is explicit on one point: "Days" in the catalogue is time AT
 * the destination and excludes travel to reach it. So every hop between
 * places gets its own costed travel leg, or the plan would be too optimistic.
 *
 * Time is tracked as a continuous cursor measured in days, not as whole
 * calendar days. Half-day stops in the same area therefore share a day the
 * way they would in reality, and a four-hour drive costs half a day rather
 * than nothing.
 */

const ZONE_ORDER: Zone[] = [
  "North India",
  "Central India",
  "West India",
  "South India",
  "East India",
  "Northeast India",
];

const EPSILON = 1e-9;

export type TravelMode =
  | "Walk / local transport"
  | "Road"
  | "Train or road"
  | "Flight"
  | "Ferry or flight";

export interface TravelLeg {
  fromName: string;
  toName: string;
  mode: TravelMode;
  /** Straight-line distance between hubs, rounded. Road distance runs longer. */
  approxKm: number;
  /** Door to door, including transfers. */
  approxHours: number;
  /** Days of the itinerary this consumes. Can be a fraction. */
  days: number;
  note: string;
}

export interface DayEntry {
  kind: "stay" | "travel";
  title: string;
  detail: string;
  destinationSlug?: string;
  /** "Half day", "Full day", "Morning" — how much of the day this takes. */
  share: string;
}

export interface ItineraryDay {
  day: number;
  entries: DayEntry[];
}

export interface TripStop {
  destination: Destination;
  state: StateUnit;
  startDay: number;
  endDay: number;
  /** The travel leg that gets you here. Absent for the first stop. */
  arrivalLeg?: TravelLeg;
  /** True when the selected travel month is outside this stop's season. */
  outOfSeason?: boolean;
}

export interface TripWarning {
  kind: "permit" | "season" | "transport" | "pace" | "altitude" | "length";
  title: string;
  detail: string;
}

export interface TripPlan {
  stops: TripStop[];
  days: ItineraryDay[];
  /** Calendar days the trip occupies, travel included. */
  totalDays: number;
  /** Catalogue time at the destinations themselves. Matches the Trip Bag. */
  daysAtDestinations: number;
  /** Days consumed by travel between stops. Can be a fraction. */
  travelDays: number;
  statesCovered: string[];
  zonesCovered: Zone[];
  approxKm: number;
  approxTravelHours: number;
  /** Months (1-12) that suit every destination in the bag. */
  commonMonths: number[];
  /** How many destinations each month suits, indexed 0 = January. */
  monthFit: number[];
  /** The months that suit the most destinations, when none suits all. */
  bestPartialMonths: number[];
  bestPartialCount: number;
  warnings: TripWarning[];
  arrivalAirports: string[];
  departureAirports: string[];
  /** Echoed back so the UI can render against what was asked for. */
  travelMonth?: number;
  daysAvailable?: number;
}

export interface TripOptions {
  /** 1-12. Marks stops that are out of season that month. */
  travelMonth?: number;
  /** Warns when the plan does not fit, and suggests what to cut. */
  daysAvailable?: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function monthName(m: number): string {
  return MONTH_NAMES[m - 1] ?? "";
}

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Abbreviations belong in chips and tables, not in sentences. */
export function monthFull(m: number): string {
  return MONTH_FULL[m - 1] ?? "";
}

/** Formats [1,2,3,10,11,12] as "Oct-Mar". */
export function formatMonths(months: number[]): string {
  if (months.length === 0) return "No overlapping window";
  if (months.length === 12) return "Year round";
  const set = new Set(months);
  const runs: number[][] = [];
  // rotate so a run wrapping December is not split in two
  let start = 1;
  while (start <= 12 && set.has(start) && set.has(start === 1 ? 12 : start - 1)) start++;
  let current: number[] = [];
  for (let i = 0; i < 12; i++) {
    const m = ((start - 1 + i) % 12) + 1;
    if (set.has(m)) {
      current.push(m);
    } else if (current.length) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length) runs.push(current);
  return runs
    .map((r) => (r.length === 1 ? monthName(r[0]) : `${monthName(r[0])}-${monthName(r[r.length - 1])}`))
    .join(", ");
}

/** Re-exported so trip consumers have one import for day formatting. */
export const formatDayCount = formatDays;

function haversineKm(a: StateUnit, b: StateUnit): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function buildLeg(from: Destination, to: Destination): TravelLeg {
  const fromState = getState(from.stateId)!;
  const toState = getState(to.stateId)!;
  const sameState = from.stateId === to.stateId;
  const sameDistrict = sameState && from.district === to.district;
  const km = sameState ? (sameDistrict ? 25 : 140) : Math.round(haversineKm(fromState, toState));

  if (to.ferryOrFlightOnly || from.ferryOrFlightOnly) {
    const islandHop = to.ferryOrFlightOnly && from.ferryOrFlightOnly && sameState;
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Ferry or flight",
      approxKm: km,
      approxHours: islandHop ? 2.5 : 5,
      days: islandHop ? 0.5 : 1,
      note: islandHop
        ? "Inter-island ferry. Sailings are limited and sell out — book this before you book a room."
        : "Reached by air or ship only. Lock transport first; everything else depends on it.",
    };
  }

  // Inside one district, or inside a unit small enough to cross locally,
  // getting there is already part of the catalogue's time at the destination.
  if (sameDistrict || (sameState && fromState.compactUnit)) {
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Walk / local transport",
      approxKm: sameDistrict ? 25 : 40,
      approxHours: sameDistrict ? 0.5 : 1,
      days: 0,
      note: sameDistrict
        ? "Same area — no travel day needed, just move between them."
        : `Both inside ${fromState.name}. Local transport; no travel day needed.`,
    };
  }

  // Puducherry and Daman & Diu have districts in different parts of the
  // country, so an intra-unit hop here is a full journey.
  if (sameState && fromState.nonContiguous) {
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Train or road",
      approxKm: 400,
      approxHours: 8,
      days: 1,
      note: `${fromState.name}'s districts are not contiguous — ${from.district} and ${to.district} are a full day apart by road.`,
    };
  }

  if (sameState) {
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Road",
      approxKm: km,
      approxHours: 4,
      days: 0.5,
      note: `Within ${fromState.name}. Half a day on the road; hill roads run slower than the map suggests.`,
    };
  }

  if (km < 350) {
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Train or road",
      approxKm: km,
      approxHours: 6,
      days: 0.5,
      note: `${fromState.railhead.split(",")[0]} to ${toState.railhead.split(",")[0]} is the usual rail run.`,
    };
  }

  if (km < 700) {
    return {
      fromName: from.name,
      toName: to.name,
      mode: "Train or road",
      approxKm: km,
      approxHours: 10,
      days: 1,
      note: "An overnight train saves a daytime day — book the sleeper class well ahead.",
    };
  }

  return {
    fromName: from.name,
    toName: to.name,
    mode: "Flight",
    approxKm: km,
    approxHours: 5,
    days: 1,
    note: `Fly ${fromState.airports[0] ?? "the nearest airport"} to ${
      toState.airports[0] ?? "the nearest airport"
    }, then transfer by road.`,
  };
}

/** Orders the bag: by zone, then state, keeping each state's picks together. */
function sequence(items: Destination[]): Destination[] {
  const byZone = new Map<Zone, Destination[]>();
  items.forEach((d) => {
    const list = byZone.get(d.zone) ?? [];
    list.push(d);
    byZone.set(d.zone, list);
  });

  const out: Destination[] = [];
  ZONE_ORDER.filter((z) => byZone.has(z)).forEach((zone) => {
    const inZone = byZone.get(zone)!;
    const byState = new Map<string, Destination[]>();
    inZone.forEach((d) => {
      const list = byState.get(d.stateId) ?? [];
      list.push(d);
      byState.set(d.stateId, list);
    });
    // states with more picks first, then keep each district's stops together
    [...byState.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([, group]) => {
        group
          .slice()
          .sort(
            (a, b) =>
              a.district.localeCompare(b.district) ||
              b.idealDays - a.idealDays ||
              a.name.localeCompare(b.name)
          )
          .forEach((d) => out.push(d));
      });
  });
  return out;
}

function shareLabel(days: number): string {
  if (days >= 1 - EPSILON) return days > 1 + EPSILON ? `${formatDayCount(days)}` : "Full day";
  if (days >= 0.5 - EPSILON) return "Half day";
  return "Short stop";
}

function collectWarnings(
  plan: Omit<TripPlan, "warnings">,
  options: TripOptions
): TripWarning[] {
  const warnings: TripWarning[] = [];
  const { stops, commonMonths, totalDays, zonesCovered } = plan;

  const permitStops = stops.filter((s) => s.destination.permitRequired);
  if (permitStops.length) {
    warnings.push({
      kind: "permit",
      title: "Permits needed before you travel",
      detail: `${permitStops
        .map((s) => s.destination.name)
        .join(", ")} sit in permit-controlled areas. Inner Line Permits are arranged in advance through a registered agent or online — they are not issued on arrival.`,
    });
  }

  const islandStops = stops.filter((s) => s.destination.ferryOrFlightOnly);
  if (islandStops.length) {
    warnings.push({
      kind: "transport",
      title: "Island transport drives this itinerary",
      detail:
        "Ferries and island flights are limited and fill early. Book transport before accommodation — if the sailing moves, every other booking has to move with it.",
    });
  }

  if (options.travelMonth) {
    const out = stops.filter((s) => s.outOfSeason);
    if (out.length) {
      warnings.push({
        kind: "season",
        title: `${out.length} ${out.length === 1 ? "stop is" : "stops are"} out of season in ${monthFull(options.travelMonth)}`,
        detail: `${out
          .map((s) => `${s.destination.name} (${s.destination.bestMonthsLabel})`)
          .join(", ")}. Either move your dates, or swap these for something in season.`,
      });
    }
  } else if (commonMonths.length === 0) {
    warnings.push({
      kind: "season",
      title: "No single month suits every destination",
      detail:
        "Your picks have non-overlapping seasons. Either drop the outliers, or split this into two trips timed to each season's window.",
    });
  }

  const monsoonStops = stops.filter((s) => s.destination.monsoonProduct);
  if (monsoonStops.length) {
    warnings.push({
      kind: "season",
      title: "Monsoon destinations in this trip",
      detail: `${monsoonStops
        .map((s) => s.destination.name)
        .join(", ")} are at their best in the rains, roughly June to September — the opposite of the rest of the catalogue. Plan the timing deliberately.`,
    });
  }

  const highAltitude = stops.filter((s) =>
    ["ladakh", "sikkim", "himachal-pradesh", "jammu-kashmir", "uttarakhand", "arunachal-pradesh"].includes(
      s.destination.stateId
    )
  );
  if (highAltitude.length) {
    warnings.push({
      kind: "altitude",
      title: "High-altitude days in this plan",
      detail:
        "Give yourself two easy days before going above 3,500m, drink more water than feels necessary, and do not climb higher on the day you arrive. Altitude, not distance, is what ends these trips early.",
    });
  }

  if (options.daysAvailable) {
    const over = totalDays - options.daysAvailable;
    if (over > 0) {
      const droppable = [...stops]
        .filter((s) => s.arrivalLeg)
        .sort(
          (a, b) =>
            b.destination.idealDays + (b.arrivalLeg?.days ?? 0) -
            (a.destination.idealDays + (a.arrivalLeg?.days ?? 0))
        )
        .slice(0, Math.min(3, stops.length - 1));
      warnings.push({
        kind: "length",
        title: `This runs ${formatDayCount(over)} over your ${options.daysAvailable} days`,
        detail: `The plan needs ${totalDays} days. The most expensive stops to keep are ${droppable
          .map((s) => `${s.destination.name} (${formatDayCount(s.destination.idealDays + (s.arrivalLeg?.days ?? 0))} with travel)`)
          .join(", ")} — dropping one usually brings it back into range.`,
      });
    } else if (over < -1) {
      warnings.push({
        kind: "length",
        title: `You have ${formatDayCount(-over)} spare`,
        detail:
          "There is room for another stop, or for giving the places you already picked longer than the catalogue minimum.",
      });
    }
  }

  const zoneCount = zonesCovered.length;
  if (zoneCount >= 3 && totalDays < zoneCount * 6) {
    warnings.push({
      kind: "pace",
      title: "This is a fast itinerary",
      detail: `You are crossing ${zoneCount} zones in ${totalDays} days. It works, but you will spend a lot of it moving. Cutting one zone usually buys a much better trip.`,
    });
  }

  return warnings;
}

export function buildTrip(items: Destination[], options: TripOptions = {}): TripPlan | null {
  if (items.length === 0) return null;

  const ordered = sequence(items);
  const stops: TripStop[] = [];
  const dayMap = new Map<number, DayEntry[]>();

  const pushEntry = (day: number, entry: DayEntry) => {
    const list = dayMap.get(day) ?? [];
    list.push(entry);
    dayMap.set(day, list);
  };

  // Continuous position in the trip, measured in days from the start.
  let cursor = 0;
  let approxKm = 0;
  let travelDays = 0;
  let approxTravelHours = 0;

  ordered.forEach((destination, i) => {
    const state = getState(destination.stateId)!;
    let arrivalLeg: TravelLeg | undefined;

    if (i > 0) {
      arrivalLeg = buildLeg(ordered[i - 1], destination);
      approxKm += arrivalLeg.approxKm;
      approxTravelHours += arrivalLeg.approxHours;

      if (arrivalLeg.days > 0) {
        const legStartDay = Math.floor(cursor + EPSILON) + 1;
        pushEntry(legStartDay, {
          kind: "travel",
          title: `${arrivalLeg.fromName} → ${arrivalLeg.toName}`,
          detail: `${arrivalLeg.mode} · about ${arrivalLeg.approxKm} km, ${arrivalLeg.approxHours} hrs door to door. ${arrivalLeg.note}`,
          share: shareLabel(arrivalLeg.days),
        });
        cursor += arrivalLeg.days;
        travelDays += arrivalLeg.days;
      }
    }

    const stayStart = cursor;
    const stayEnd = cursor + destination.idealDays;
    const startDay = Math.floor(stayStart + EPSILON) + 1;
    const endDay = Math.max(startDay, Math.ceil(stayEnd - EPSILON));

    for (let d = startDay; d <= endDay; d++) {
      const nth = d - startDay + 1;
      const spans = endDay - startDay + 1;
      pushEntry(d, {
        kind: "stay",
        title: destination.name,
        detail:
          spans === 1
            ? `${destination.district}, ${state.name}. ${destination.rawTheme}.`
            : `${destination.district}, ${state.name}. Day ${nth} of ${spans} here.`,
        destinationSlug: destination.slug,
        share: shareLabel(destination.idealDays),
      });
    }

    const outOfSeason = options.travelMonth
      ? !destination.bestMonths.includes(options.travelMonth)
      : undefined;

    stops.push({ destination, state, startDay, endDay, arrivalLeg, outOfSeason });
    cursor = stayEnd;
  });

  const totalDays = Math.max(1, Math.ceil(cursor - EPSILON));
  const daysAtDestinations = ordered.reduce((sum, d) => sum + d.idealDays, 0);

  const days: ItineraryDay[] = [...dayMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, entries]) => ({ day, entries }));

  const monthSets = items.map((d) => new Set(d.bestMonths));
  const commonMonths: number[] = [];
  const monthFit: number[] = [];
  for (let m = 1; m <= 12; m++) {
    const fit = monthSets.filter((s) => s.has(m)).length;
    monthFit.push(fit);
    if (fit === items.length) commonMonths.push(m);
  }
  const bestPartialCount = Math.max(...monthFit);
  const bestPartialMonths = monthFit
    .map((fit, i) => (fit === bestPartialCount ? i + 1 : 0))
    .filter(Boolean);

  const statesCovered = [...new Set(ordered.map((d) => d.stateName))];
  const zonesCovered = ZONE_ORDER.filter((z) => ordered.some((d) => d.zone === z));

  const firstState = getState(ordered[0].stateId)!;
  const lastState = getState(ordered[ordered.length - 1].stateId)!;

  const base = {
    stops,
    days,
    totalDays,
    daysAtDestinations,
    travelDays,
    statesCovered,
    zonesCovered,
    approxKm: Math.round(approxKm),
    approxTravelHours,
    commonMonths,
    monthFit,
    bestPartialMonths,
    bestPartialCount,
    arrivalAirports: firstState.airports,
    departureAirports: lastState.airports,
    travelMonth: options.travelMonth,
    daysAvailable: options.daysAvailable,
  };

  return { ...base, warnings: collectWarnings(base, options) };
}
