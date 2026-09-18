import type { TripPlan } from "@/lib/trip";
import type { TravelerProfile } from "@/data/profile";
import { monthFull } from "@/lib/trip";

/**
 * The prep list is derived, not authored: everything here comes from what is
 * actually in the itinerary — permits, ferries, altitude, season, distance —
 * so it changes when the trip changes.
 */

export type PrepCategory = "Before you book" | "Paperwork" | "Health" | "Packing" | "On the day";

export interface PrepItem {
  /** Stable across rebuilds so ticks survive an itinerary edit. */
  id: string;
  category: PrepCategory;
  title: string;
  detail: string;
  /** Blocks the trip if skipped. */
  critical?: boolean;
  /** Which stops caused this item to appear. */
  because?: string[];
}

const CATEGORY_ORDER: PrepCategory[] = [
  "Before you book",
  "Paperwork",
  "Health",
  "Packing",
  "On the day",
];

export function buildPrepList(plan: TripPlan, profile?: TravelerProfile): PrepItem[] {
  const items: PrepItem[] = [];
  const stops = plan.stops;
  const month = plan.travelMonth;

  /* ---------- permits ---------- */
  const permitStops = stops.filter((s) => s.destination.permitRequired);
  if (permitStops.length) {
    const states = [...new Set(permitStops.map((s) => s.state.name))];
    items.push({
      id: "permit-ilp",
      category: "Paperwork",
      critical: true,
      title: `Inner Line Permit for ${states.join(", ")}`,
      detail:
        "Apply in advance through the state's official permit portal or a registered agent. These are not issued at the checkpost, and you will be turned back without one. Carry printed copies as well as digital.",
      because: permitStops.map((s) => s.destination.name),
    });
    items.push({
      id: "permit-photos",
      category: "Paperwork",
      title: "Passport photos and ID copies for the permit",
      detail:
        "Permit applications normally want photographs and photo ID. Carry several spare copies — checkposts keep them.",
    });
  }

  /* ---------- island transport ---------- */
  const islandStops = stops.filter((s) => s.destination.ferryOrFlightOnly);
  if (islandStops.length) {
    items.push({
      id: "island-transport",
      category: "Before you book",
      critical: true,
      title: "Book island ferries and flights first",
      detail:
        "Sailings are limited and sell out well ahead. Lock transport before accommodation — if the sailing moves, every other booking has to move with it.",
      because: islandStops.map((s) => s.destination.name),
    });
  }

  /* ---------- altitude ---------- */
  const HIGH_STATES = ["ladakh", "sikkim", "himachal-pradesh", "jammu-kashmir", "uttarakhand", "arunachal-pradesh"];
  const highStops = stops.filter((s) => HIGH_STATES.includes(s.destination.stateId));
  if (highStops.length) {
    items.push({
      id: "altitude-acclimatise",
      category: "Health",
      critical: true,
      title: "Build in acclimatisation days",
      detail:
        "Give yourself two easy days before going above 3,500m, and do not sleep higher on the day you arrive. Altitude, not distance, is what ends these trips early.",
      because: highStops.map((s) => s.destination.name),
    });
    items.push({
      id: "altitude-kit",
      category: "Packing",
      title: "Altitude and cold kit",
      detail:
        "Layers including a windproof outer, sun cream and sunglasses (glare is brutal at altitude), lip balm, and a headache remedy. Talk to a doctor about acetazolamide before you travel, not after you feel unwell.",
    });
  }

  /* ---------- monsoon ---------- */
  const monsoonStops = stops.filter((s) => s.destination.monsoonProduct);
  const travellingInMonsoon = month ? [6, 7, 8, 9].includes(month) : false;
  if (monsoonStops.length || travellingInMonsoon) {
    items.push({
      id: "monsoon-gear",
      category: "Packing",
      title: "Real rain gear, not an umbrella",
      detail:
        "A waterproof shell, dry bags for electronics, and shoes you do not mind soaking. Leeches are common on wet forest trails — carry salt or repellent.",
      because: monsoonStops.map((s) => s.destination.name),
    });
    items.push({
      id: "monsoon-buffer",
      category: "Before you book",
      title: "Leave slack for weather delays",
      detail:
        "Monsoon closes hill roads and grounds small flights at short notice. Avoid booking a tight connection on the day you travel out.",
    });
  }

  /* ---------- winter ---------- */
  if (month && [12, 1, 2].includes(month)) {
    const northStops = stops.filter((s) => s.destination.zone === "North India");
    if (northStops.length) {
      items.push({
        id: "winter-north",
        category: "Packing",
        title: "North India in winter is genuinely cold",
        detail:
          "Nights drop close to freezing on the plains and below it in the hills, and most budget rooms are unheated. Fog also delays trains and flights through December and January — build in a buffer.",
        because: northStops.map((s) => s.destination.name),
      });
    }
  }

  /* ---------- season mismatch ---------- */
  if (month) {
    const outOfSeason = stops.filter((s) => s.outOfSeason);
    if (outOfSeason.length) {
      items.push({
        id: "season-recheck",
        category: "Before you book",
        critical: true,
        title: `Re-check ${outOfSeason.length} stop${outOfSeason.length === 1 ? "" : "s"} for ${monthFull(month)}`,
        detail: `${outOfSeason
          .map((s) => `${s.destination.name} (best ${s.destination.bestMonthsLabel})`)
          .join(", ")}. Some parks and passes close entirely out of season — confirm access before you book anything around them.`,
        because: outOfSeason.map((s) => s.destination.name),
      });
    }
  }

  /* ---------- wildlife parks ---------- */
  const parkStops = stops.filter((s) => s.destination.themes.includes("Wildlife"));
  if (parkStops.length) {
    items.push({
      id: "park-permits",
      category: "Before you book",
      critical: true,
      title: "Book safari zones and park entry online",
      detail:
        "Core-zone permits for the popular reserves open months ahead and sell out the day they do. Book the specific zone yourself rather than leaving it to a hotel, and carry the ID you booked with.",
      because: parkStops.map((s) => s.destination.name),
    });
  }

  /* ---------- trekking ---------- */
  const trekStops = stops.filter((s) => s.destination.themes.includes("Trekking"));
  if (trekStops.length) {
    items.push({
      id: "trek-kit",
      category: "Packing",
      title: "Worn-in boots and a head torch",
      detail:
        "New boots on a multi-day trek are how trips end early. Add a head torch for pre-dawn starts, and check whether your trek needs a forest-department permit with a daily cap.",
      because: trekStops.map((s) => s.destination.name),
    });
  }

  /* ---------- long rail or flight legs ---------- */
  const longLegs = stops.filter((s) => s.arrivalLeg && s.arrivalLeg.approxHours >= 8);
  if (longLegs.length) {
    items.push({
      id: "long-legs",
      category: "Before you book",
      title: `Book ${longLegs.length} long leg${longLegs.length === 1 ? "" : "s"} early`,
      detail:
        "Sleeper and AC classes on overnight trains open 60 days ahead and fill fast on these routes. Booking late usually means flying instead, at several times the cost.",
      because: longLegs.map((s) => `${s.arrivalLeg!.fromName} → ${s.arrivalLeg!.toName}`),
    });
  }

  /* ---------- universal, but phrased for this trip ---------- */
  items.push({
    id: "id-proof",
    category: "Paperwork",
    critical: true,
    title: "Photo ID for every hotel and train",
    detail:
      "Every check-in and every reserved train ticket needs government photo ID, and foreign nationals need a passport plus visa page. Keep a photo of each on your phone as a backup.",
  });

  items.push({
    id: "connectivity",
    category: "On the day",
    title: "Download offline maps and this itinerary",
    detail:
      "Signal is patchy in the hills, in the parks and on the islands. This app keeps your saved trips available offline — download offline maps for the same stretches.",
  });

  items.push({
    id: "cash",
    category: "On the day",
    title: "Carry cash for the small places",
    detail:
      "UPI covers most of urban India, but homestays, permits, park gates and rural transport often want cash — and ATMs thin out fast outside the towns.",
  });

  if (profile?.vegetarian) {
    items.push({
      id: "diet",
      category: "On the day",
      title: "Vegetarian on the road",
      detail:
        "Most of this route is easy, but ask about fish in coastal and Northeast kitchens, where it is often not counted as meat.",
    });
  }

  if (plan.statesCovered.length >= 3) {
    items.push({
      id: "language",
      category: "On the day",
      title: `You are crossing ${plan.statesCovered.length} states`,
      detail:
        "The language changes with the border, and so does what "+
        "a rickshaw costs. Learn the numbers and a greeting for each — it changes how you are treated.",
    });
  }

  return items;
}

export function groupPrep(items: PrepItem[]): { category: PrepCategory; items: PrepItem[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
}
