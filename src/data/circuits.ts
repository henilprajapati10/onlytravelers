import { destinations, type Destination } from "./destinations";

/**
 * The directory closes by counting "12 sellable circuits" across the six
 * zones. These are those circuits: a starting shape for a trip, not a fixed
 * package — load one into the Trip Bag and edit it from there.
 */

export interface Circuit {
  id: string;
  name: string;
  tagline: string;
  /** Why this grouping holds together as one trip. */
  rationale: string;
  slugs: string[];
}

export const circuits: Circuit[] = [
  {
    id: "golden-triangle",
    name: "The Golden Triangle",
    tagline: "Delhi, Agra and Jaipur",
    rationale:
      "India's most-sold circuit for a reason: three cities, short hops, and the Mughal and Rajput stories side by side. The usual mistake is rushing Delhi — this version gives it the time it needs.",
    slugs: [
      "red-fort",
      "jama-masjid-chandni-chowk",
      "humayuns-tomb",
      "qutub-minar",
      "taj-mahal-agra",
      "agra-fort",
      "fatehpur-sikri",
      "jaipur-amber-fort-hawa-mahal-city-palace",
    ],
  },
  {
    id: "rajasthan-desert",
    name: "Desert Rajasthan",
    tagline: "Forts, lakes and the Thar",
    rationale:
      "Jaipur down to Udaipur and west into the desert. Each city is a different colour and a different dynasty, and the drives between them are short enough to do by road.",
    slugs: [
      "jaipur-amber-fort-hawa-mahal-city-palace",
      "pushkar",
      "udaipur-lake-pichola-city-palace",
      "kumbhalgarh-ranakpur",
      "jodhpur-mehrangarh-fort",
      "jaisalmer-sam-sand-dunes",
    ],
  },
  {
    id: "kerala-classic",
    name: "Kerala, coast to hills",
    tagline: "Backwaters, tea and a spice port",
    rationale:
      "The most packaged product in India, and still worth it. Kochi for history, the backwaters for a night on the water, Munnar and Thekkady for the Ghats — all within a few hours of each other.",
    slugs: [
      "fort-kochi-mattancherry",
      "munnar",
      "thekkady-periyar-reserve",
      "alleppey-backwaters",
      "kumarakom",
      "varkala-cliff",
    ],
  },
  {
    id: "ladakh-loop",
    name: "The Ladakh loop",
    tagline: "High passes, high lakes",
    rationale:
      "Acclimatise in Leh, then go out to the lakes and the valley. Built deliberately slowly — altitude, not distance, is what ends Ladakh trips early.",
    slugs: [
      "leh-shanti-stupa-leh-palace",
      "hemis-thiksey-monasteries",
      "khardung-la",
      "nubra-valley-diskit",
      "pangong-tso",
    ],
  },
  {
    id: "meghalaya-assam",
    name: "Rhinos and root bridges",
    tagline: "Assam and Meghalaya together",
    rationale:
      "The Northeast's easiest first trip. Guwahati is the hinge: rhino grassland on one side, the wettest hills on earth on the other, and no permits needed for either.",
    slugs: [
      "kamakhya-temple-guwahati",
      "kaziranga-national-park-unesco",
      "shillong-wards-lake-elephant-falls",
      "cherrapunji-sohra",
      "living-root-bridges-nongriat",
      "dawki-umngot-river",
      "mawlynnong",
    ],
  },
  {
    id: "buddhist-circuit",
    name: "The Buddhist circuit",
    tagline: "Where the Buddha taught",
    rationale:
      "High international demand, weak local packaging — the directory's words. Sarnath, Bodh Gaya, Nalanda and Rajgir trace the actual sequence of his life and teaching.",
    slugs: [
      "varanasi-ghats-kashi-vishwanath",
      "sarnath",
      "mahabodhi-temple-bodh-gaya-unesco",
      "rajgir-vishwa-shanti-stupa",
      "nalanda-mahavihara-unesco",
      "vaishali",
    ],
  },
  {
    id: "temple-south",
    name: "The temple south",
    tagline: "Dravidian architecture at scale",
    rationale:
      "Tamil Nadu's temple towns in build order, from the Pallava shore to the Chola bronzes to Madurai's painted gopurams. No other state matches this concentration.",
    slugs: [
      "mahabalipuram-unesco",
      "kumbakonam-chidambaram",
      "thanjavur-brihadeeswarar-temple",
      "meenakshi-temple-madurai",
      "rameswaram",
    ],
  },
  {
    id: "deccan-heritage",
    name: "Deccan stone",
    tagline: "Hampi, the Chalukyas and the Hoysalas",
    rationale:
      "Karnataka's ruins in the order the architecture developed — Badami's caves, Pattadakal's experiments, the Hoysala soapstone, then Hampi's boulder city.",
    slugs: [
      "badami-aihole-pattadakal",
      "hampi-unesco",
      "belur-halebidu",
      "shravanabelagola",
      "mysuru-palace-chamundi-hill",
    ],
  },
  {
    id: "tiger-trail",
    name: "The tiger trail",
    tagline: "Central India's reserves",
    rationale:
      "Madhya Pradesh is the tiger capital, and these four parks sit close enough to string together. Satpura is the one that allows walking safaris — worth building the trip around.",
    slugs: [
      "bandhavgarh-national-park",
      "kanha-national-park",
      "pench-national-park",
      "satpura-national-park",
    ],
  },
  {
    id: "kutch-saurashtra",
    name: "Salt desert and lion country",
    tagline: "Kutch and Saurashtra",
    rationale:
      "A winter-only run: the white Rann on a full moon, the craft villages around Bhuj, and the last wild Asiatic lions at Gir. Diu routes with this, not as its own trip.",
    slugs: [
      "white-rann-dhordo",
      "bhuj-aina-mahal-prag-mahal",
      "dholavira-unesco",
      "gir-national-park",
      "somnath-temple",
      "dwarka-bet-dwarka",
    ],
  },
  {
    id: "island-andaman",
    name: "Andaman islands",
    tagline: "Reefs, ferries and Cellular Jail",
    rationale:
      "Ferry timings drive this whole itinerary, so it is built around them: the history in Port Blair first, then Havelock and Neil with time to actually get in the water.",
    slugs: [
      "cellular-jail-port-blair",
      "ross-island-netaji-subhas-dweep",
      "radhanagar-beach-havelock",
      "elephant-beach-scuba",
      "neil-island-shaheed-dweep",
    ],
  },
  {
    id: "himalayan-himachal",
    name: "Himachal high road",
    tagline: "Shimla to Spiti",
    rationale:
      "Climbs gradually on purpose: the toy train to Shimla, up through Kinnaur's apple valleys, and into Spiti's cold desert — the safe way round, gaining altitude slowly.",
    slugs: [
      "shimla",
      "kinnaur-kalpa-sangla-chitkul",
      "spiti-valley-kaza-key-monastery",
      "manali-solang-valley",
    ],
  },
];

export interface CircuitSummary extends Circuit {
  items: Destination[];
  states: string[];
  /** Catalogue time at the destinations, before travel between them. */
  daysAtDestinations: number;
  /** Months that suit every stop in the circuit. */
  commonMonths: number[];
}

export function circuitSummary(circuit: Circuit): CircuitSummary {
  const items = circuit.slugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => Boolean(d));

  const commonMonths: number[] = [];
  for (let m = 1; m <= 12; m++) {
    if (items.length && items.every((d) => d.bestMonths.includes(m))) commonMonths.push(m);
  }

  return {
    ...circuit,
    items,
    states: [...new Set(items.map((d) => d.stateName))],
    daysAtDestinations: items.reduce((sum, d) => sum + d.idealDays, 0),
    commonMonths,
  };
}

export function getCircuit(id: string): Circuit | undefined {
  return circuits.find((c) => c.id === id);
}
