import type { TripPlan } from "@/lib/trip";
import { renownOf } from "@/data/renown";

/**
 * "Be travelers, not tourists" as something the app actually does.
 *
 * A campaign line on a homepage is marketing. This is the same claim turned
 * into specific conduct for the specific trip in front of you — what the law
 * requires where you are going, what the place cannot absorb, and where your
 * money lands. Every item is derived from what is really in the itinerary,
 * so nobody gets a lecture about coral on a trip through Rajasthan.
 */

export type NoteKind =
  /** Enforced by law. Getting this wrong is an offence, not a faux pas. */
  | "law"
  /** The place is physically fragile and visitors are the pressure. */
  | "fragile"
  /** Someone's home, faith or livelihood. */
  | "respect"
  /** Where the money goes. */
  | "money";

export interface ResponsibleNote {
  id: string;
  kind: NoteKind;
  title: string;
  detail: string;
  /** The stops that put this on the list. */
  because: string[];
}

export const NOTE_LABEL: Record<NoteKind, string> = {
  law: "The law",
  fragile: "Fragile",
  respect: "Respect",
  money: "Where it lands",
};

const HIMALAYAN = [
  "ladakh",
  "sikkim",
  "himachal-pradesh",
  "jammu-kashmir",
  "uttarakhand",
  "arunachal-pradesh",
];

const TRIBAL_HEARTLAND = ["nagaland", "arunachal-pradesh", "chhattisgarh", "mizoram", "manipur"];

export function buildResponsibleNotes(plan: TripPlan): ResponsibleNote[] {
  const notes: ResponsibleNote[] = [];
  const stops = plan.stops;
  const names = (filter: (slug: string, stateId: string, themes: string[]) => boolean) =>
    stops
      .filter((s) => filter(s.destination.slug, s.destination.stateId, s.destination.themes))
      .map((s) => s.destination.name);

  /* ---------- the Andamans' protected tribes ---------- */
  const andaman = names((_s, stateId) => stateId === "andaman-nicobar-islands");
  if (andaman.length) {
    notes.push({
      id: "jarawa",
      kind: "law",
      title: "Do not photograph or interact with the Jarawa",
      detail:
        "The road to Baratang crosses the Jarawa tribal reserve under convoy rules. Photographing, filming, stopping for or offering anything to the Jarawa is a criminal offence, and the 'human safari' tours that once ran here did real harm. Keep cameras down for the whole stretch.",
      because: andaman,
    });
  }

  /* ---------- reefs ---------- */
  const reef = names(
    (_s, stateId, themes) =>
      (stateId === "andaman-nicobar-islands" || stateId === "lakshadweep") &&
      (themes.includes("Islands") || themes.includes("Beach"))
  );
  if (reef.length) {
    notes.push({
      id: "coral",
      kind: "fragile",
      title: "Never stand on, touch or collect coral",
      detail:
        "A single footstep kills growth that took decades. Stand on sand, keep fins clear, pick an operator who briefs this before the boat leaves, and use a rash guard rather than sunscreen over the reef — most filters bleach coral.",
      because: reef,
    });
  }

  /* ---------- tribal regions ---------- */
  const tribal = names((_s, stateId) => TRIBAL_HEARTLAND.includes(stateId));
  if (tribal.length) {
    notes.push({
      id: "consent",
      kind: "respect",
      title: "Ask before every photograph, every time",
      detail:
        "Tattooed Konyak elders, Apatani women, Bastar haats and Ziro villages are people's homes and faces, not a set. Ask first, accept no, and go through a guide from the community rather than turning up with a lens. Blanket permission from a tour operator is not consent.",
      because: tribal,
    });
  }

  /* ---------- places of worship ---------- */
  const sacred = names((_s, _st, themes) => themes.includes("Spiritual"));
  if (sacred.length) {
    notes.push({
      id: "worship",
      kind: "respect",
      title: "These are working places of worship",
      detail:
        "Cover shoulders and knees, remove shoes and often leather altogether, and check before photographing — many sanctums forbid it. Several major temples admit Hindus only, which is worth knowing before you arrive rather than at the gate. Step aside for people who came to pray, not to look.",
      because: sacred.slice(0, 6),
    });
  }

  /* ---------- wildlife ---------- */
  const wildlife = names((_s, _st, themes) => themes.includes("Wildlife"));
  if (wildlife.length) {
    notes.push({
      id: "wildlife-conduct",
      kind: "fragile",
      title: "Do not push your driver for a sighting",
      detail:
        "Speeding, off-track driving and crowding a cat all happen because visitors make it clear they want a photograph at any cost. Stay in the vehicle, keep quiet, never feed anything, and tell your naturalist at the start that a good morning without a tiger is fine by you.",
      because: wildlife,
    });
  }

  /* ---------- high mountains ---------- */
  const high = names((_s, stateId) => HIMALAYAN.includes(stateId));
  if (high.length) {
    notes.push({
      id: "mountain-waste",
      kind: "fragile",
      title: "Carry your waste back down",
      detail:
        "There is no collection above the road head, so whatever goes up stays there. Carry out every wrapper and bottle, take a filter or purification tablets rather than buying cases of plastic water, and use no open flame on the meadows — Dzukou and Kaas have both burned.",
      because: high.slice(0, 6),
    });
  }

  // Water scarcity is a property of the place, not the state: Manali has a
  // river running through it, Spiti two valleys away does not.
  const desertWater = names(
    (slug, stateId, themes) =>
      stateId === "ladakh" ||
      stateId === "lakshadweep" ||
      themes.includes("Desert") ||
      /spiti|kinnaur|nubra|tso-moriri|khardung|zanskar/.test(slug)
  );
  if (desertWater.length) {
    notes.push({
      id: "water",
      kind: "fragile",
      title: "Water is the scarce thing here, not rooms",
      detail:
        "Ladakh, Spiti and the Thar all run on meltwater or a falling water table, and a guesthouse shower draws from the same supply the village uses. Keep showers short, refuse daily linen changes, and use the compost toilets where they exist rather than asking for a flush.",
      because: desertWater.slice(0, 6),
    });
  }

  /* ---------- living forts and villages under strain ---------- */
  const strained = names((slug) =>
    ["jaisalmer-sam-sand-dunes", "mawlynnong", "living-root-bridges-nongriat", "khonoma-green-village"].includes(slug)
  );
  if (strained.length) {
    notes.push({
      id: "strain",
      kind: "fragile",
      title: "These places are visibly carrying their own popularity",
      detail:
        "Jaisalmer's fort is a living fort whose drainage is failing under visitor numbers — sleep outside its walls. Mawlynnong's cleanliness is unpaid community labour, so carry your rubbish out. The root bridges are living trees; walk on them, not off them.",
      because: strained,
    });
  }

  /* ---------- where the money lands ---------- */
  const homestayCountries = new Set(stops.map((s) => s.state.name));
  notes.push({
    id: "money-local",
    kind: "money",
    title: "Book the bed and the guide locally",
    detail:
      `Across ${homestayCountries.size} ${homestayCountries.size === 1 ? "state" : "states"} on this trip, a homestay, a licensed local guide and a family kitchen put your money into the place you came to see, rather than into a chain's head office. In the hills and the Northeast the good homestays are often not listed on the big platforms at all — ask when you arrive.`,
    because: [],
  });

  const conservation = names((slug) =>
    ["manas-national-park-unesco", "khonoma-green-village", "chilika-lake", "thekkady-periyar-reserve"].includes(slug)
  );
  if (conservation.length) {
    notes.push({
      id: "former-poachers",
      kind: "money",
      title: "Hire the guides who used to hunt here",
      detail:
        "Manas, Khonoma, Mangalajodi on Chilika and Periyar all recovered because the people who once hunted them now earn more from guiding. Booking them is not charity; it is the mechanism that keeps the recovery paying for itself.",
      because: conservation,
    });
  }

  /* ---------- crowd pressure ---------- */
  const heroes = stops.filter((s) => renownOf(s.destination.slug) === "hero");
  if (heroes.length >= 3) {
    notes.push({
      id: "spread",
      kind: "fragile",
      title: `${heroes.length} of your stops are on everyone else's list too`,
      detail:
        "Going early, staying overnight where most people day-trip, and eating away from the monument gate all spread the load and get you a better version of the same place. The quieter alternatives in this app are there for exactly this.",
      because: heroes.map((s) => s.destination.name).slice(0, 6),
    });
  }

  /* ---------- bargaining ---------- */
  notes.push({
    id: "fair-pay",
    kind: "money",
    title: "Bargain over souvenirs, not over labour",
    detail:
      "Haggling in a market is normal and expected. Grinding down a porter, a boatman, an auto driver or a guide over the last fifty rupees is not — it is a day's margin to them and a rounding error to you.",
    because: [],
  });

  return notes;
}

/** Enforced rules first; they are the ones with consequences. */
const KIND_ORDER: NoteKind[] = ["law", "fragile", "respect", "money"];

export function groupResponsible(notes: ResponsibleNote[]) {
  return KIND_ORDER.map((kind) => ({
    kind,
    label: NOTE_LABEL[kind],
    notes: notes.filter((n) => n.kind === kind),
  })).filter((g) => g.notes.length > 0);
}
