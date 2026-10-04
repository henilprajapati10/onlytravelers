import type { Addition } from "./types";

/** Maharashtra, Gujarat, Goa, Dadra & Nagar Haveli and Daman & Diu. */
export const westAdditions: Addition[] = [
  /* ---------- Maharashtra ---------- */
  {
    slug: "bibi-ka-maqbara",
    name: "Bibi ka Maqbara",
    district: "Chhatrapati Sambhajinagar",
    stateId: "maharashtra",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 19.901, lng: 75.32 },
    guide: {
      summary:
        "Aurangzeb's son built this for his mother in 1660 as a deliberate answer to the Taj, on a tenth of the budget — marble only to the dado, plaster above. The compromise is visible, and that is what makes it interesting.",
      highlights: [
        "The main chamber, open to the sky above the grave",
        "The marble screen around the cenotaph",
        "The Deccan plateau setting, quite unlike Agra's riverbank",
      ],
      tip: "Visit it after Ajanta and Ellora, not before. Seeing Mughal marble immediately after 1,500-year-old rock-cut halls tells you a great deal about what changed in between.",
    },
  },
  {
    slug: "daulatabad-fort",
    name: "Daulatabad Fort",
    district: "Chhatrapati Sambhajinagar",
    stateId: "maharashtra",
    themes: ["Heritage", "Trekking"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 19.943, lng: 75.22 },
    guide: {
      summary:
        "A hill fort on a 200m basalt cone scarped smooth on every side, with a moat cut into the rock and a pitch-dark spiral tunnel designed to kill anyone who got that far. Muhammad bin Tughlaq once marched the whole population of Delhi here and back.",
      highlights: [
        "The dark passage, still unlit, with a guide carrying a torch",
        "Chand Minar, a 30m victory tower of 1435",
        "The summit, an hour of steps, for the Deccan in every direction",
      ],
      tip: "Take the official guide for the tunnel — this is the one place in India where walking it alone is a genuinely bad idea, and the fort's design says so on purpose.",
    },
  },
  {
    slug: "lonar-crater",
    name: "Lonar Crater",
    district: "Buldhana",
    stateId: "maharashtra",
    themes: ["Nature", "Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 19.976, lng: 76.508 },
    guide: {
      summary:
        "The only meteorite crater in basalt rock anywhere on Earth, around 50,000 years old, holding a lake that is both saline and alkaline at once — chemistry that occurs nowhere else. Twelve temples from the Chalukya period ring the rim and the floor.",
      highlights: [
        "The rim walk, about 6 km all the way round",
        "Daitya Sudan temple, Chalukyan, in the town above",
        "The lake itself, which turned pink for weeks in 2020",
      ],
      tip: "Walk down to the water at dawn with a local guide. The descent paths are unmarked, the temples on the floor are the best of the set, and the microbiology of that lake is genuinely world-class — ask about it.",
    },
  },
  {
    slug: "bhimashankar",
    name: "Bhimashankar",
    district: "Pune",
    stateId: "maharashtra",
    themes: ["Spiritual", "Wildlife", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Jun - Feb",
    bestMonths: [1, 2, 6, 7, 8, 9, 10, 11, 12],
    coord: { lat: 19.072, lng: 73.536 },
    guide: {
      summary:
        "One of the twelve jyotirlingas, in a wildlife sanctuary on the Sahyadri crest that is the last stronghold of the Indian giant squirrel. Temple and forest in the same place, which is not the usual arrangement.",
      highlights: [
        "The 13th-century Nagara-style temple in the valley",
        "Shekaru, the Indian giant squirrel, in the canopy at dawn",
        "The Ganesh Ghat and Shidi Ghat trails up from Khandas",
      ],
      tip: "Walk up one of the ghat trails instead of driving to the temple door. It is three to four hours through the sanctuary, and it is the difference between a darshan and a day in the Sahyadris.",
    },
  },
  {
    slug: "harishchandragad",
    name: "Harishchandragad",
    district: "Ahmednagar",
    stateId: "maharashtra",
    themes: ["Trekking", "Heritage"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Feb",
    bestMonths: [1, 2, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 19.386, lng: 73.777 },
    guide: {
      summary:
        "A fort-mountain in the Sahyadris with a rock-cut Shiva temple, a cave complex and the Konkan Kada — a concave cliff 1,200 feet high that curls over your head. The hardest and the best of Maharashtra's trek forts.",
      highlights: [
        "Konkan Kada at sunset, and the updraft that runs along it",
        "Kedareshwar cave, with a lingam standing in waist-deep water",
        "Harishchandreshwar temple, carved out of one rock",
      ],
      tip: "Camp on top rather than doing it in a day. The cliff at dawn, with cloud pouring up over the lip, is why people come back to this one for years.",
    },
  },
  {
    slug: "kolhapur-mahalaxmi",
    name: "Kolhapur — Mahalaxmi & Rajwada",
    district: "Kolhapur",
    stateId: "maharashtra",
    themes: ["Spiritual", "Heritage", "Food & Drink"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 16.705, lng: 74.2433 },
    guide: {
      summary:
        "A 7th-century Mahalaxmi temple that is one of the Shakti Peethas, a black-basalt New Palace by Charles Mant, and the most aggressive food in Maharashtra. Also where Kolhapuri chappals and the wrestling akhadas come from.",
      highlights: [
        "Kiranotsav, when the setting sun lines up on the deity twice a year",
        "New Palace and its Chhatrapati Shahu museum",
        "Motibag and the old wrestling pits, still in daily use",
      ],
      tip: "Eat the tambda and pandhra rassa at a local khanaval rather than a hotel, and ask for it mild first. Kolhapuri heat is not a marketing claim.",
    },
  },
  {
    slug: "panhala-fort",
    name: "Panhala Fort",
    district: "Kolhapur",
    stateId: "maharashtra",
    themes: ["Heritage", "Hills"],
    idealDays: 1,
    bestMonthsLabel: "Jun - Feb",
    bestMonths: [1, 2, 6, 7, 8, 9, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 16.813, lng: 74.11 },
    guide: {
      summary:
        "The largest fort in the Deccan, and the one Shivaji escaped from in 1660 in the episode every Maharashtrian schoolchild knows. A working town lives inside the walls, so it is a fort you walk around rather than tour.",
      highlights: [
        "Andhar Bavadi, the hidden three-storey well with its own garrison",
        "The enormous Ganga Kothi granaries",
        "Teen Darwaza and the ramparts at monsoon, in cloud",
      ],
      tip: "Read the Pavan Khind story before you go, then walk the Teen Darwaza route out. The geography of that night makes sense only on the ground.",
    },
  },
  {
    slug: "amboli",
    name: "Amboli",
    district: "Sindhudurg",
    stateId: "maharashtra",
    themes: ["Hills", "Nature", "Wildlife"],
    idealDays: 2,
    bestMonthsLabel: "Jun - Sep, Nov - Feb",
    bestMonths: [1, 2, 6, 7, 8, 9, 11, 12],
    hiddenGem: true,
    monsoonProduct: true,
    coord: { lat: 15.96, lng: 73.997 },
    guide: {
      summary:
        "The wettest place in Maharashtra, on the Sahyadri edge above the Konkan, and one of the richest amphibian hotspots in the Western Ghats — several species here are found nowhere else on Earth.",
      highlights: [
        "Monsoon waterfalls straight off the ghat road",
        "Night herping walks in June and July with a local naturalist",
        "Mahadevgad and Kavlesad viewpoints over the Konkan",
      ],
      tip: "Go with one of the local naturalists rather than alone at night. They know which species are breeding, and they will stop you handling animals that a torch and a phone camera can genuinely harm.",
    },
  },
  {
    slug: "ganpatipule",
    name: "Ganpatipule",
    district: "Ratnagiri",
    stateId: "maharashtra",
    themes: ["Beach", "Spiritual"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 17.145, lng: 73.269 },
    guide: {
      summary:
        "A 400-year-old Ganesh temple on a white-sand Konkan beach, where the deity faces west and pilgrims circumambulate the whole hill rather than the shrine. Quiet, clean and almost entirely domestic.",
      highlights: [
        "The pradakshina path around the hill, about a kilometre",
        "The beach itself, one of the cleanest on the Konkan coast",
        "Jaigad Fort and the Alphonso orchards inland",
      ],
      tip: "Come outside the Ganesh Chaturthi weeks unless the festival is the point. In May and in the festival season the village is packed; in December it is yours.",
    },
  },
  {
    slug: "murud-janjira",
    name: "Murud-Janjira",
    district: "Raigad",
    stateId: "maharashtra",
    themes: ["Heritage", "Beach"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 18.3, lng: 72.964 },
    guide: {
      summary:
        "An island fort in the Arabian Sea that the Marathas, the Mughals, the Portuguese and the British all failed to take — the only one on this coast never captured. Reached by sailboat from Rajpuri jetty.",
      highlights: [
        "The 12m cannons still on the bastions",
        "Freshwater tanks inside the fort, surrounded by sea",
        "Murud beach and the Nawab's palace on the mainland",
      ],
      tip: "Take the first boat of the morning. The fort has almost no shade, and by eleven the black stone is hot enough to end the visit early.",
    },
  },
  {
    slug: "velas-turtle-festival",
    name: "Velas Turtle Festival",
    district: "Ratnagiri",
    stateId: "maharashtra",
    themes: ["Wildlife", "Beach"],
    idealDays: 2,
    bestMonthsLabel: "Feb - Mar",
    bestMonths: [2, 3],
    hiddenGem: true,
    coord: { lat: 17.958, lng: 73.033 },
    guide: {
      summary:
        "A Konkan village that turned olive ridley poaching into a conservation programme. Hatchlings are released at dawn from a protected hatchery between February and April, and visitors stay in village homes rather than hotels.",
      highlights: [
        "Dawn hatchling releases on the beach",
        "Homestays run by the families who protect the nests",
        "Bankot Fort and the Savitri estuary nearby",
      ],
      tip: "Book the village homestay through the Kasav Mitra Mandal, not a tour operator. The whole model depends on the money landing in the village, and there is no picking up hatchlings — ever.",
    },
  },
  {
    slug: "chikhaldara",
    name: "Chikhaldara",
    district: "Amravati",
    stateId: "maharashtra",
    themes: ["Hills", "Wildlife"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 21.4, lng: 77.3333 },
    guide: {
      summary:
        "Vidarbha's only hill station, at 1,100m in the Satpuras on the edge of the Melghat Tiger Reserve — the first reserve declared under Project Tiger. Coffee grows here, which it does nowhere else in Maharashtra.",
      highlights: [
        "Melghat safaris from Semadoh, inside the reserve",
        "Bhimkund and Panchbol viewpoints over the Gawilgarh ridge",
        "Gawilgarh Fort, largely unrestored",
      ],
      tip: "Melghat is a hard park — dense forest, low sighting rates, superb birds. Come for the forest itself and treat a tiger as a bonus, or you will be disappointed for the wrong reason.",
    },
  },

  /* ---------- Gujarat ---------- */
  {
    slug: "shivrajpur-beach",
    name: "Shivrajpur Beach",
    district: "Devbhumi Dwarka",
    stateId: "gujarat",
    themes: ["Beach"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.33, lng: 68.96 },
    guide: {
      summary:
        "A Blue Flag beach 12 km from Dwarka, white sand and genuinely clear water, with the facilities that certification requires and a fraction of the crowd any comparable beach in Goa carries.",
      highlights: [
        "Clean shallow water, unusual on this stretch of coast",
        "Sunset over the Arabian Sea from the northern end",
        "Dwarka and Bet Dwarka, both within an hour",
      ],
      tip: "Gujarat is a dry state and that includes the beach. Come for a swim and a sunset, not for a beach-bar afternoon that does not exist here.",
    },
  },
  {
    slug: "lothal",
    name: "Lothal",
    district: "Ahmedabad",
    stateId: "gujarat",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.522, lng: 72.249 },
    guide: {
      summary:
        "A Harappan port of around 2400 BCE with what is very probably the world's earliest known dock — a brick basin connected to an old channel of the Sabarmati, plus a bead factory, a drainage grid and a warehouse.",
      highlights: [
        "The dock basin and its sluice",
        "The bead workshop and the kiln",
        "The site museum's seals, weights and the famous bead-drill",
      ],
      tip: "Do Lothal and Dholavira as a pair if you can. One is a port, the other a water-engineered city; together they say far more about the Indus civilisation than either alone.",
    },
  },
  {
    slug: "nalsarovar",
    name: "Nalsarovar Bird Sanctuary",
    district: "Ahmedabad",
    stateId: "gujarat",
    themes: ["Wildlife", "Lakes"],
    idealDays: 0.5,
    bestMonthsLabel: "Nov - Feb",
    bestMonths: [1, 2, 11, 12],
    coord: { lat: 22.82, lng: 72.05 },
    guide: {
      summary:
        "A shallow 120 sq km lake an hour from Ahmedabad that fills with around two hundred thousand birds each winter — flamingos, pelicans, cranes and ducks — and is worked by flat-bottomed boats poled by local fishermen.",
      highlights: [
        "Flamingo flocks at the far islands, in December and January",
        "Sunrise from a country boat, poled rather than motored",
        "The Padhar community who run the boats",
      ],
      tip: "Take the first boat at sunrise and insist on going to the far side. The near shore is a picnic spot; the birds are forty minutes out.",
    },
  },
  {
    slug: "jamnagar-lakhota",
    name: "Jamnagar — Lakhota & Marine Coast",
    district: "Jamnagar",
    stateId: "gujarat",
    themes: ["Heritage", "Cities"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.47, lng: 70.07 },
    guide: {
      summary:
        "The old Nawanagar capital, built around a lake with a fort-museum on an island in the middle of it, plus a brass-working bazaar, the Bala Hanuman temple with its continuous chant since 1964, and the Gulf of Kutch on its doorstep.",
      highlights: [
        "Lakhota Fort on its island, reached by a causeway",
        "Bala Hanuman temple's unbroken Ram dhun, a Guinness record",
        "Khijadiya wetland, a Ramsar site just outside town",
      ],
      tip: "Use it as the base for Marine National Park rather than staying at Dwarka. The coral and mangrove islands need a low-tide slot, and the boats leave from near here.",
    },
  },
  {
    slug: "bhujodi",
    name: "Bhujodi & the Kutch Craft Villages",
    district: "Kutch",
    stateId: "gujarat",
    themes: ["Culture"],
    idealDays: 1,
    bestMonthsLabel: "Nov - Feb",
    bestMonths: [1, 2, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.19, lng: 69.76 },
    guide: {
      summary:
        "A weaving village 8 km from Bhuj where the Vankar community works extra-weft on pit looms, and the gateway to a circuit of villages each holding one craft — Ajrakhpur for block printing, Nirona for rogan and copper bells, Hodka for embroidery.",
      highlights: [
        "Pit-loom weaving demonstrated in the weavers' own homes",
        "Ajrakhpur's natural-indigo block printing, sixteen stages deep",
        "Rogan painting at Nirona, practised now by one family",
      ],
      tip: "Buy directly from the artisan's house, not from the showroom on the highway. Ask what a piece took to make before you ask what it costs — it reframes the whole transaction.",
    },
  },

  /* ---------- Goa ---------- */
  {
    slug: "cabo-de-rama",
    name: "Cabo de Rama Fort",
    district: "South Goa",
    stateId: "goa",
    themes: ["Heritage", "Beach"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 15.09, lng: 73.92 },
    guide: {
      summary:
        "A pre-Portuguese fort on a headland in south Goa, taken over in 1763 and then largely forgotten. Ruined walls, a working chapel, and a cliff edge straight down to the sea with nobody selling anything.",
      highlights: [
        "The cliff-edge bastions and the drop to the water",
        "St Anthony's chapel, still in use",
        "Cabo de Rama beach below, reached on foot",
      ],
      tip: "Go at sunset, and bring your own water. This is one of the last places on the Goan coast where you can sit on a wall for an hour and be the only person there.",
    },
  },
  {
    slug: "tambdi-surla-mahadev",
    name: "Tambdi Surla Mahadev Temple",
    district: "North Goa",
    stateId: "goa",
    themes: ["Heritage", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 15.45, lng: 74.23 },
    guide: {
      summary:
        "The oldest building in Goa: a small 12th-century Kadamba temple in black basalt, deep in the Mollem forest, that survived the Portuguese destruction of temples because nobody could find it.",
      highlights: [
        "The carved basalt shikhara, the only complete Kadamba one left",
        "The stream and forest track it stands in",
        "Mollem National Park and Dudhsagar, on the same road",
      ],
      tip: "The stone was carried here from across the Ghats, which is the first question to ask about a temple this remote. Go early and you will share it with nobody but the priest.",
    },
  },
  {
    slug: "netravali-wildlife-sanctuary",
    name: "Netravali Wildlife Sanctuary",
    district: "South Goa",
    stateId: "goa",
    themes: ["Nature", "Wildlife"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 15.1, lng: 74.23 },
    guide: {
      summary:
        "Two hundred square kilometres of Western Ghats forest in Goa's far southeast, with the Budbudyanchi Tali — a pool that bubbles continuously and has never been fully explained — and Savari waterfall at the end of a forest walk.",
      highlights: [
        "Budbudyanchi Tali, the bubbling lake beside a Shiva temple",
        "Savari and Mainapi waterfalls, both a walk in",
        "The Ghat forest, with hornbills and giant squirrels",
      ],
      tip: "This is an hour and a half from the beaches and feels like a different state. Take a local guide from Netravali village; the trails are not signposted and the leeches in the shoulder season are real.",
    },
  },
  {
    slug: "chandor-braganza-house",
    name: "Chandor & Braganza House",
    district: "South Goa",
    stateId: "goa",
    themes: ["Heritage", "Culture"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 15.25, lng: 74.04 },
    guide: {
      summary:
        "A 17th-century Indo-Portuguese mansion with a 250-foot façade, still lived in by two branches of the same family who show their own halves separately. Rosewood furniture, Chinese porcelain, a private chapel with a relic, and a ballroom.",
      highlights: [
        "The great salon and its Belgian chandeliers",
        "The library, one of the oldest private collections in Goa",
        "The Menezes Braganza half and the Pereira Braganza half, both",
      ],
      tip: "There is no ticket counter — you knock, and a family member shows you round. Give generously, because the upkeep of a house that size comes out of exactly those donations.",
    },
  },
  {
    slug: "galgibaga-turtle-beach",
    name: "Galgibaga Turtle Beach",
    district: "South Goa",
    stateId: "goa",
    themes: ["Beach", "Wildlife"],
    idealDays: 1,
    bestMonthsLabel: "Nov - Feb",
    bestMonths: [1, 2, 11, 12],
    hiddenGem: true,
    coord: { lat: 14.96, lng: 74.05 },
    guide: {
      summary:
        "Goa's quietest beach, backed by casuarina and protected as an olive ridley nesting site, which is why there is no loud music, no beach shacks strung along it and very few people.",
      highlights: [
        "Olive ridley nesting and hatching between November and February",
        "The Talpona river mouth at the northern end",
        "Empty sand on the stretch towards Patnem",
      ],
      tip: "No lights on the sand after dark in nesting season, and that includes phone screens — hatchlings navigate by the horizon and a torch sends them inland to die.",
    },
  },
  {
    slug: "butterfly-beach-goa",
    name: "Butterfly Beach",
    district: "South Goa",
    stateId: "goa",
    themes: ["Beach"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    guide: {
      summary:
        "A small semicircle of sand between two headlands south of Palolem, reachable only by boat or by a rough forest path. Dolphins are regular in the bay and there is nothing built on it.",
      highlights: [
        "The cove itself, empty outside boat hours",
        "Dolphins offshore in the early morning",
        "The walk in from Palolem, through cashew scrub",
      ],
      tip: "Take the first boat out or walk in, and carry your rubbish back. There is no bin, no shop and no cleaning crew, and it stays this way only because most people never bother.",
    },
  },

  /* ---------- Dadra & Nagar Haveli and Daman & Diu ---------- */
  {
    slug: "khanvel",
    name: "Khanvel",
    district: "Dadra & Nagar Haveli",
    stateId: "dadra-nagar-haveli-and-daman-diu",
    themes: ["Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 20.1833, lng: 73.1 },
    guide: {
      summary:
        "Teak forest and the Sakartod river in the interior of Dadra & Nagar Haveli, away from the industrial belt around Silvassa. Warli villages, a riverside resort and little else.",
      highlights: [
        "The river and the forest road in from Silvassa",
        "Warli painting in the villages around",
        "Dudhni lake, half an hour further on",
      ],
      tip: "Ask in the villages about Warli painting rather than buying it in Silvassa. The wall paintings are made for ritual, not sale, and the difference is worth understanding before you buy a canvas.",
    },
  },
  {
    slug: "satmaliya-deer-park",
    name: "Satmaliya Deer Park",
    district: "Dadra & Nagar Haveli",
    stateId: "dadra-nagar-haveli-and-daman-diu",
    themes: ["Wildlife", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    guide: {
      summary:
        "A small enclosed forest park outside Silvassa with spotted deer, blackbuck and nilgai, plus a lake and a short safari loop. Modest, and the only wildlife of any kind in the territory.",
      highlights: [
        "The deer enclosure and its blackbuck",
        "The lake and the walking loop around it",
        "Vasona lion safari, nearby and run by the same administration",
      ],
      tip: "It is a half-hour stop, not a destination. Fold it into a Silvassa day rather than planning around it — and set expectations if you are coming from a real national park.",
    },
  },
];
