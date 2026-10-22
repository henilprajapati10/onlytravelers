import type { Theme } from "./destinations";
import type { Zone } from "./states";

/**
 * Copy for the landing pages that answer a whole search at once — "beaches
 * in India", "where to go in July", "the Northeast". Written once, here, so
 * every one of these pages opens with something a person would actually
 * read, not a list with a heading. None of it quotes a price or an hour.
 */

export const themeSlug = (theme: Theme): string =>
  theme.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const THEME_INTRO: Record<Theme, { title: string; intro: string }> = {
  Heritage: {
    title: "Heritage destinations in India",
    intro:
      "Forts that held sieges, tombs that outlived their dynasties, stepwells built for a thirst that has not changed in a thousand years. India's heritage is not behind glass — most of it is still in use, which is the point of going.",
  },
  Spiritual: {
    title: "Spiritual places and pilgrimages in India",
    intro:
      "Ghats, gurdwaras, dargahs, monasteries and temples that are the reason a town exists. Visiting well means arriving for the ritual, not the photograph — these are the places where the timing matters most.",
  },
  Hills: {
    title: "Hill stations and mountain towns in India",
    intro:
      "From the colonial hill stations of the Himalaya to the coffee ridges of the Western Ghats. The best of them are the ones a half-day's drive past the famous name, where the view is the same and the town is still a town.",
  },
  Nature: {
    title: "Nature and landscape destinations in India",
    intro:
      "Waterfalls, craters, meadows, canyons and living root bridges. These are the places where the destination is the ground itself, and the season decides everything about what you will see.",
  },
  Wildlife: {
    title: "Wildlife sanctuaries and national parks in India",
    intro:
      "Tigers, rhinos, lions, elephants and the birds that bring people back more than the big cats do. Parks have seasons and gate quotas; the plan has to start from those, not from the hotel.",
  },
  Beach: {
    title: "Beaches in India beyond Goa",
    intro:
      "Seven thousand kilometres of coastline, most of it without a shack. From the Konkan to the Coromandel, these are the beaches worth the journey — and the quiet ones that reward going a little further.",
  },
  Islands: {
    title: "Islands of India: Andaman, Lakshadweep and more",
    intro:
      "Coral atolls, volcanic archipelagos and river islands bigger than some countries. Ferries and flights set the rhythm here; the itinerary bends to the schedule, never the other way round.",
  },
  Lakes: {
    title: "Lakes of India: high-altitude, palace and floating",
    intro:
      "Pangong at 4,300 metres, the palace lakes of Rajasthan, the floating phumdis of Loktak. Each one is a different kind of trip, and most of them are best at dawn.",
  },
  Cities: {
    title: "City breaks in India",
    intro:
      "Old quarters, food streets, planned cities and port towns. A city done well is three neighbourhoods on foot, not twelve sights by car — these pages are built around that.",
  },
  Trekking: {
    title: "Treks and trekking bases in India",
    intro:
      "Valleys of flowers, frozen rivers, ridge walks above the clouds. Treks have windows measured in weeks; we show the window and the base town to start from.",
  },
  Culture: {
    title: "Culture, crafts and living traditions in India",
    intro:
      "Tribal villages, weaving towns, painted havelis and festivals that fill a whole valley. The places where travelling means being a guest, and where how you arrive matters as much as where.",
  },
  "Food & Drink": {
    title: "Food destinations in India",
    intro:
      "Cities whose streets are the restaurant, hill regions grown around tea and coffee, coasts that cook what came in that morning. Eat where the queue is local and the menu is short.",
  },
  Desert: {
    title: "Desert destinations in India",
    intro:
      "The Thar's dunes and the white salt flat of the Rann — two deserts, nothing alike. Both are winter places with a short season, and both are at their best under a full moon.",
  },
  Backwaters: {
    title: "Backwaters of India",
    intro:
      "Kerala's famous canals, and the lagoons north and south of them that most houseboats never reach. Slow water, village life at the bank, and the quietest nights in the country.",
  },
};

export const MONTH_INTRO: Record<number, string> = {
  1: "Peak season almost everywhere below the mountains: clear skies across the plains, the desert and the coasts, and the one month the Rann and the Sundarbans are both at their best. The Himalaya is snowbound — go for it, not around it.",
  2: "The kindest month in India. Warm days from Rajasthan to Tamil Nadu, the Northeast dry and open, the beaches at their calmest. Book early; everyone else knows this too.",
  3: "Spring on the plains before the heat sets in, Holi in the north, and the first trekking windows opening in the lower Himalaya. The far south is already warming — head for the hills and the coast there.",
  4: "The plains start to bake, and the hill stations earn their keep. Ladakh's roads begin to open late in the month; the Northeast is green and wet-edged; Kerala's backwaters are still good before the rains.",
  5: "High summer. This is the month for the high Himalaya — Ladakh, Spiti, Sikkim — and for the cool ridges of the Western Ghats. Wildlife parks are hot but at their best for sightings before they close.",
  6: "The monsoon arrives in Kerala in the first week and moves north. Ladakh and Spiti are at their driest and best. On the west coast and in the Ghats the rains are a reason to go, not a reason to stay away.",
  7: "Monsoon India. Meghalaya's waterfalls, the Valley of Flowers, the green Konkan and the flooded Rann all belong to this month — and Ladakh sits in a rain shadow with its clearest skies of the year.",
  8: "Still wet across most of the country and still spectacular where the rain is the point: the Western Ghats, Coorg, the Northeast. Ladakh and Spiti stay dry; the east coast waits.",
  9: "The rains withdraw and the country turns green and clear. Trekking reopens in Uttarakhand and Himachal, Ladakh has its last clear weeks, and the first festivals of the season begin.",
  10: "The beginning of the best half of the year. Durga Puja in Bengal, the desert and the plains cooling, the parks reopening after the monsoon. Almost everywhere is good; the islands are just coming back into season.",
  11: "Pushkar's fair, the Hornbill build-up in Nagaland, Diwali, and dry, warm days from the Himalayan foothills to the southern beaches. The easiest month to plan in.",
  12: "Winter at its most comfortable in the south and the desert, Hornbill in Nagaland, the islands and Lakshadweep at their clearest. The north is cold and foggy at dawn — plan the mornings late.",
};

export const ZONE_SLUG: Record<Zone, string> = {
  "North India": "north",
  "West India": "west",
  "South India": "south",
  "East India": "east",
  "Central India": "central",
  "Northeast India": "northeast",
};

export const ZONE_INTRO: Record<Zone, string> = {
  "North India":
    "The Himalaya, the Golden Triangle and the desert in one zone — which is why most first trips to India start here, and why the best second trips go deeper into it.",
  "West India":
    "The Konkan coast, the Western Ghats, the salt desert of Kutch and India's biggest city. Beach, hill and heritage within a day's drive of each other.",
  "South India":
    "Backwaters, temple towns, coffee hills, the islands and the longest coastline in the country. The south runs on a different calendar — the rains come twice — and rewards those who read it.",
  "East India":
    "Kolkata, the Buddhist circuit, the temple coast of Odisha and the mangrove delta of the Sundarbans. Under-visited for no good reason.",
  "Central India":
    "Tiger country and the densest cluster of UNESCO sites in India. Khajuraho, Sanchi, the Bhimbetka rock shelters and the parks between them.",
  "Northeast India":
    "Eight states most travellers have never seen: root bridges, monasteries, rhino grasslands, the Hornbill festival and India's only floating national park. Permits for some, patience for all, and worth every bit of both.",
};
