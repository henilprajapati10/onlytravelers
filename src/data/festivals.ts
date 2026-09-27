/**
 * What is actually happening while you are there.
 *
 * India's travel year is organised around festivals far more than around
 * weather, and a generic "best time to visit" hides that completely. This is
 * the layer that answers the real question: if I go in November, what will I
 * walk into?
 *
 * HONESTY ABOUT DATES
 * Most of these follow lunar or regional calendars, so the Gregorian date
 * moves every year — Holi is March, but which day in March changes. Storing a
 * fake exact date would be the same mistake the directory warns about with
 * prices: it looks precise, goes stale, and costs trust. So every entry keeps
 * the months it falls in plus a `whenLabel` that says honestly how it is
 * reckoned, and `fixedDates` is set only where the date genuinely does not
 * move.
 */

export type FestivalScale =
  /** Draws visitors from outside India; plan the whole trip around it. */
  | "international"
  /** A major national or state draw; book months out. */
  | "major"
  /** Local and largely for the community itself — the best kind to witness. */
  | "local";

export interface Festival {
  id: string;
  name: string;
  /** Where it happens. */
  stateId: string;
  /** Destination slugs this festival belongs to, if any. */
  slugs: string[];
  /** 1-12. Several when it straddles months or moves year to year. */
  months: number[];
  /** How the date is actually reckoned, in plain language. */
  whenLabel: string;
  /** True only when the date is fixed in the Gregorian calendar. */
  fixedDates: boolean;
  scale: FestivalScale;
  what: string;
  /** What it does to the trip: crowds, closures, price pressure, access. */
  impact: string;
}

export const festivals: Festival[] = [
  /* ---------- North ---------- */
  {
    id: "holi-braj",
    name: "Holi in Mathura & Vrindavan",
    stateId: "uttar-pradesh",
    slugs: ["mathura-vrindavan"],
    months: [3],
    whenLabel: "March, on Phalguna Purnima — the date moves each year",
    fixedDates: false,
    scale: "international",
    what: "The most exuberant Holi in India, spread over more than a week across Barsana, Nandgaon, Mathura and Vrindavan, each with its own day and its own form.",
    impact: "Rooms in Vrindavan book out months ahead and the temples become impassable. If you want the temples rather than the festival, come any other week.",
  },
  {
    id: "kumbh-prayagraj",
    name: "Magh Mela & Kumbh, Prayagraj",
    stateId: "uttar-pradesh",
    slugs: ["prayagraj-triveni-sangam"],
    months: [1, 2],
    whenLabel: "January–February; the full Kumbh only every 12 years, Ardh Kumbh every 6",
    fixedDates: false,
    scale: "international",
    what: "Bathing at the confluence on auspicious days. In a Kumbh year this is periodically the largest human gathering on the planet; in other years the annual Magh Mela is a far smaller version of the same thing.",
    impact: "In a Kumbh year, every system in the city is past capacity and a tented city goes up on the sands. Check which year you are looking at before planning anything around it.",
  },
  {
    id: "pushkar-camel-fair",
    name: "Pushkar Camel Fair",
    stateId: "rajasthan",
    slugs: ["pushkar"],
    months: [10, 11],
    whenLabel: "Kartik Purnima, so late October or November depending on the year",
    fixedDates: false,
    scale: "international",
    what: "One of the largest livestock gatherings anywhere, with trading, racing and a full fairground alongside the pilgrimage to the Brahma temple.",
    impact: "The town's population multiplies and room rates move accordingly. Arrive for the trading days at the start rather than the tourist-facing days at the end.",
  },
  {
    id: "hola-mohalla",
    name: "Hola Mohalla, Anandpur Sahib",
    stateId: "punjab",
    slugs: ["anandpur-sahib-virasat-e-khalsa"],
    months: [3],
    whenLabel: "March, the day after Holi",
    fixedDates: false,
    scale: "major",
    what: "A three-day Nihang Sikh gathering of martial display — horsemanship, gatka and mock battles — established as the counterpoint to Holi.",
    impact: "Langar feeds enormous numbers and the town is full. It is one of the few festivals where a visitor is straightforwardly welcome to eat and sit in.",
  },
  {
    id: "hemis-tsechu",
    name: "Hemis Tsechu",
    stateId: "ladakh",
    slugs: ["hemis-thiksey-monasteries"],
    months: [6, 7],
    whenLabel: "The 10th day of the Tibetan lunar month, usually June or July",
    fixedDates: false,
    scale: "major",
    what: "Masked cham dances in the courtyard of Ladakh's wealthiest monastery, marking Padmasambhava's birth.",
    impact: "It lands inside the short Ladakh season, so Leh is at its fullest. Book the Leh leg early and keep acclimatisation days even if it squeezes the schedule.",
  },
  {
    id: "surajkund-mela",
    name: "Surajkund Crafts Mela",
    stateId: "haryana",
    slugs: ["surajkund"],
    months: [2],
    whenLabel: "The first two weeks of February",
    fixedDates: true,
    scale: "major",
    what: "Craftspeople from every Indian state and a rotating list of partner countries, with regional food courts and folk performance.",
    impact: "This is the only reason to route through Surajkund; outside these two weeks the site is quiet. Weekdays are far easier to browse than weekends.",
  },
  {
    id: "amarnath-yatra-season",
    name: "Amarnath Yatra",
    stateId: "jammu-kashmir",
    slugs: ["amarnath-yatra"],
    months: [7, 8],
    whenLabel: "A roughly 45-day window in July and August, fixed annually",
    fixedDates: false,
    scale: "major",
    what: "Pilgrimage to the ice lingam at 3,888m, on two routes from Pahalgam and Baltal.",
    impact: "Registration, a health certificate and a dated slot are compulsory, and the yatra traffic fills Pahalgam and the Srinagar road for the whole window.",
  },

  /* ---------- West ---------- */
  {
    id: "rann-utsav",
    name: "Rann Utsav",
    stateId: "gujarat",
    slugs: ["white-rann-dhordo", "bhuj-aina-mahal-prag-mahal"],
    months: [11, 12, 1, 2],
    whenLabel: "November to February, with the tented city opening and closing on announced dates",
    fixedDates: false,
    scale: "international",
    what: "A tented city on the edge of the salt desert with a craft bazaar and folk performance, built around full-moon nights on the white Rann.",
    impact: "Full-moon dates sell out first and are worth planning the trip around. Outside the Utsav window the Rann is still there, and empty.",
  },
  {
    id: "navratri-gujarat",
    name: "Navratri garba, Gujarat",
    stateId: "gujarat",
    slugs: ["ahmedabad-old-city-unesco", "vadodara-laxmi-vilas-palace"],
    months: [9, 10],
    whenLabel: "Nine nights in September or October, on the lunar calendar",
    fixedDates: false,
    scale: "major",
    what: "Nine nights of garba and dandiya danced across the whole state, in grounds that take tens of thousands of people.",
    impact: "The biggest commercial grounds ticket and sell out; neighbourhood garbas are free, better and how it is actually meant to be done. Book travel well ahead.",
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi, Mumbai & Pune",
    stateId: "maharashtra",
    slugs: ["mumbai-gateway-of-india-marine-drive", "pune-shaniwar-wada-aga-khan-palace"],
    months: [8, 9],
    whenLabel: "Ten days in August or September, on the lunar calendar",
    fixedDates: false,
    scale: "major",
    what: "Neighbourhood pandals across both cities, ending in immersion processions that close roads for a full day and night.",
    impact: "Traffic in Mumbai on the final day is genuinely impassable in large parts of the city. Plan not to move that day, and go and watch instead.",
  },
  {
    id: "saputara-monsoon-festival",
    name: "Saputara Monsoon Festival",
    stateId: "gujarat",
    slugs: ["saputara"],
    months: [7, 8, 9],
    whenLabel: "Through the monsoon, roughly late July to September",
    fixedDates: false,
    scale: "local",
    what: "Dangi tribal dance, food and craft, deliberately programmed for the season when the rest of Gujarat's catalogue shuts down.",
    impact: "The one time this hill station is worth the drive. Weekends draw the Surat and Mumbai crowd; weekdays are calm.",
  },
  {
    id: "goa-carnival",
    name: "Goa Carnival & Shigmo",
    stateId: "goa",
    slugs: ["fontainhas-panaji", "old-goa-churches-unesco"],
    months: [2, 3],
    whenLabel: "Carnival before Lent in February or March; Shigmo follows in March",
    fixedDates: false,
    scale: "major",
    what: "A Portuguese-era pre-Lenten carnival with float parades in Panaji, followed by Shigmo, the Konkani spring festival, in the villages.",
    impact: "Shigmo in the villages is the more interesting half and almost nobody routes for it. Carnival weekend fills North Goa completely.",
  },

  /* ---------- South ---------- */
  {
    id: "onam",
    name: "Onam, Kerala",
    stateId: "kerala",
    slugs: ["alleppey-backwaters", "fort-kochi-mattancherry", "guruvayur-temple"],
    months: [8, 9],
    whenLabel: "Ten days in August or September, on the Malayalam calendar",
    fixedDates: false,
    scale: "major",
    what: "Kerala's harvest festival: floral kolams, the Onasadya feast served on a banana leaf, and snake-boat racing on the backwaters.",
    impact: "Much of the state slows down and some businesses close for the main days. The sadya alone is worth timing a trip around.",
  },
  {
    id: "nehru-trophy",
    name: "Nehru Trophy Boat Race",
    stateId: "kerala",
    slugs: ["alleppey-backwaters"],
    months: [8],
    whenLabel: "The second Saturday of August",
    fixedDates: true,
    scale: "major",
    what: "Hundred-foot snake boats crewed by a hundred rowers racing on Punnamada Lake, the biggest of Kerala's boat races.",
    impact: "Alleppey is full and houseboats are booked well ahead. Buy a seat in a pavilion rather than trying to watch from the bank.",
  },
  {
    id: "mysuru-dasara",
    name: "Mysuru Dasara",
    stateId: "karnataka",
    slugs: ["mysuru-palace-chamundi-hill"],
    months: [9, 10],
    whenLabel: "Ten days in September or October, on the lunar calendar",
    fixedDates: false,
    scale: "international",
    what: "The Wadiyar state festival: the palace lit every night, and a caparisoned elephant procession through the city on the final day.",
    impact: "The single busiest period in Mysuru. Rooms go months ahead and the procession route is ticketed — plan it as the centre of the trip, not an add-on.",
  },
  {
    id: "hampi-utsav",
    name: "Hampi Utsav",
    stateId: "karnataka",
    slugs: ["hampi-unesco"],
    months: [1, 11],
    whenLabel: "Usually late in the year or in January; the dates are announced annually",
    fixedDates: false,
    scale: "major",
    what: "Music, dance and light staged among the Vijayanagara ruins over three days.",
    impact: "Confirm the dates before building a trip around it — they have moved repeatedly. Accommodation on the Hampi side fills before Anegundi does.",
  },
  {
    id: "margazhi-chennai",
    name: "Margazhi music season, Chennai",
    stateId: "tamil-nadu",
    slugs: ["chennai-marina-kapaleeshwarar"],
    months: [12, 1],
    whenLabel: "Mid-December to mid-January, every year",
    fixedDates: true,
    scale: "international",
    what: "Hundreds of Carnatic music and Bharatanatyam concerts across the city's sabhas, many free or nearly so, over about six weeks.",
    impact: "The best cultural value in India and the city is at its coolest. Sabha canteens are half the draw — eat at them.",
  },
  {
    id: "thrissur-pooram",
    name: "Thrissur Pooram",
    stateId: "kerala",
    slugs: ["guruvayur-temple"],
    months: [4, 5],
    whenLabel: "April or May, on the Malayalam calendar",
    fixedDates: false,
    scale: "major",
    what: "Caparisoned elephants, percussion ensembles of hundreds of drummers, and a competitive parasol exchange that runs into the night.",
    impact: "It is loud, extremely crowded and very hot. Worth it, but not a first introduction to Kerala for anyone travelling with small children.",
  },
  {
    id: "konark-dance",
    name: "Konark Dance Festival",
    stateId: "odisha",
    slugs: ["konark-sun-temple-unesco"],
    months: [12],
    whenLabel: "Early December, on announced dates",
    fixedDates: false,
    scale: "major",
    what: "Classical Indian dance performed on an open-air stage with the Sun Temple lit behind it.",
    impact: "Pairs naturally with Puri and Bhubaneswar in the same week, which is already the best season for that whole coast.",
  },

  /* ---------- East ---------- */
  {
    id: "durga-puja",
    name: "Durga Puja, Kolkata",
    stateId: "west-bengal",
    slugs: ["kolkata-victoria-memorial-park-street"],
    months: [9, 10],
    whenLabel: "Five days in September or October, on the lunar calendar",
    fixedDates: false,
    scale: "international",
    what: "UNESCO-listed, and effectively a citywide open-air art exhibition: hundreds of commissioned pandals, each a temporary building, visited on foot through the night.",
    impact: "The city does not sleep for five days and moving across it is slow. Go to Kumartuli in the weeks before to watch the idols being built — free, and almost no visitor knows to.",
  },
  {
    id: "rath-yatra-puri",
    name: "Rath Yatra, Puri",
    stateId: "odisha",
    slugs: ["jagannath-temple-puri-beach"],
    months: [6, 7],
    whenLabel: "June or July, on the lunar calendar",
    fixedDates: false,
    scale: "international",
    what: "Three enormous wooden chariots pulled through Puri by hand, carrying the deities out of the temple — one of the few days non-Hindus can see them.",
    impact: "Hundreds of thousands of pilgrims in a small town, in the monsoon. Book far ahead and expect to walk everywhere.",
  },
  {
    id: "shravani-mela",
    name: "Shravani Mela, Deoghar",
    stateId: "jharkhand",
    slugs: ["baidyanath-dham-deoghar"],
    months: [7, 8],
    whenLabel: "Through the month of Shravan, July into August",
    fixedDates: false,
    scale: "major",
    what: "Millions of kanwariyas walking 105km from Sultanganj carrying Ganga water on foot to the jyotirlinga.",
    impact: "Queues at the temple run many hours and the whole road corridor is given over to walkers. Outside Shravan, Deoghar is an easy half-day.",
  },
  {
    id: "sonepur-mela",
    name: "Sonepur Mela",
    stateId: "bihar",
    slugs: ["patna-golghar-takht-sri-patna-sahib"],
    months: [11, 12],
    whenLabel: "From Kartik Purnima, November into December",
    fixedDates: false,
    scale: "major",
    what: "Asia's largest cattle fair, held at the Gandak–Ganga confluence for a fortnight, with a fairground that has run for centuries.",
    impact: "An easy add-on to a Patna or Buddhist-circuit leg, and almost entirely free of foreign visitors.",
  },
  {
    id: "poush-mela",
    name: "Poush Mela, Shantiniketan",
    stateId: "west-bengal",
    slugs: ["shantiniketan"],
    months: [12],
    whenLabel: "Late December, around Poush Sankranti",
    fixedDates: false,
    scale: "major",
    what: "Tagore's winter fair: Baul singers, Santhal dance and craft from across Birbhum, on the Visva-Bharati grounds.",
    impact: "The town fills and rooms are scarce. The Saturday khoai haat runs all year and gives a quieter version of the same thing.",
  },

  /* ---------- Central ---------- */
  {
    id: "bastar-dussehra",
    name: "Bastar Dussehra",
    stateId: "chhattisgarh",
    slugs: ["bastar-tribal-markets-dussehra"],
    months: [8, 9, 10],
    whenLabel: "Seventy-five days, ending around October",
    fixedDates: false,
    scale: "local",
    what: "A 75-day festival with nothing to do with the Ramayana: chariot rituals centred on the local goddess Danteshwari, run by and for the Bastar communities.",
    impact: "Go with a guide from the community and treat it as a religious event rather than a spectacle. The final fortnight is the most active.",
  },
  {
    id: "khajuraho-dance",
    name: "Khajuraho Dance Festival",
    stateId: "madhya-pradesh",
    slugs: ["khajuraho-temples-unesco"],
    months: [2],
    whenLabel: "A week in February, on announced dates",
    fixedDates: false,
    scale: "major",
    what: "Classical dance staged in front of the western group of temples, at the best time of year for central India.",
    impact: "A good anchor for a Khajuraho–Orchha–Gwalior week. Book rooms in Khajuraho early; the town is small.",
  },
  {
    id: "ujjain-simhastha",
    name: "Simhastha Kumbh, Ujjain",
    stateId: "madhya-pradesh",
    slugs: ["ujjain-mahakaleshwar"],
    months: [4, 5],
    whenLabel: "Once every 12 years, April into May",
    fixedDates: false,
    scale: "international",
    what: "Ujjain's turn in the twelve-year Kumbh cycle, on the banks of the Shipra.",
    impact: "Only relevant in a Simhastha year — check before planning. In every other year the 4am Bhasma Aarti is the reason to come, and needs booking weeks ahead.",
  },

  /* ---------- Northeast ---------- */
  {
    id: "hornbill",
    name: "Hornbill Festival, Kisama",
    stateId: "nagaland",
    slugs: ["hornbill-festival-kisama", "kohima-wwii-cemetery"],
    months: [12],
    whenLabel: "1–10 December, every year",
    fixedDates: true,
    scale: "international",
    what: "All of Nagaland's major tribes gathered in one heritage village for ten days of dance, log drums, wrestling, food and craft — plus a night music festival.",
    impact: "Kohima fills completely and rooms go months ahead. Days 1–3 and 8–10 have the same programme with a thinner crowd.",
  },
  {
    id: "ziro-music",
    name: "Ziro Festival of Music",
    stateId: "arunachal-pradesh",
    slugs: ["ziro-valley"],
    months: [9],
    whenLabel: "Four days in late September",
    fixedDates: false,
    scale: "major",
    what: "An outdoor independent-music festival in the Apatani rice valley, camped in the fields.",
    impact: "Needs an Inner Line Permit like the rest of Arunachal, and tickets and homestays both go early. Camping is the point; there are few rooms.",
  },
  {
    id: "ambubachi",
    name: "Ambubachi Mela, Kamakhya",
    stateId: "assam",
    slugs: ["kamakhya-temple-guwahati"],
    months: [6],
    whenLabel: "Four days in June",
    fixedDates: false,
    scale: "major",
    what: "The temple closes for three days to mark the goddess's menstruation, then reopens to enormous queues — a Shakta gathering with tantric practitioners from across India.",
    impact: "The sanctum is shut for most of it. If you want to see the temple rather than the gathering, avoid this week entirely.",
  },
  {
    id: "moatsu",
    name: "Moatsu, Mokokchung",
    stateId: "nagaland",
    slugs: ["mokokchung"],
    months: [5],
    whenLabel: "The first week of May",
    fixedDates: true,
    scale: "local",
    what: "An Ao Naga festival after the sowing is done — singing, feasting and Sangpangtu fires, held for the village rather than for visitors.",
    impact: "Small, unticketed and genuinely local. Go through a homestay and ask before joining anything.",
  },
  {
    id: "aoleang",
    name: "Aoleang, Mon",
    stateId: "nagaland",
    slugs: ["mon-konyak-villages"],
    months: [4],
    whenLabel: "The first week of April",
    fixedDates: true,
    scale: "local",
    what: "The Konyak spring festival, marking the new planting year, in the villages near the Myanmar border.",
    impact: "Mon is a long, rough drive and beds are few. This is the week the Konyak villages are most alive, and it needs a permit and a community guide.",
  },
  {
    id: "losar-tawang",
    name: "Losar & Torgya, Tawang",
    stateId: "arunachal-pradesh",
    slugs: ["tawang-monastery"],
    months: [1, 2],
    whenLabel: "Torgya in January; Losar on the Tibetan new year, January or February",
    fixedDates: false,
    scale: "local",
    what: "Masked monastic dances at Tawang monastery, followed by the Monpa new year in the villages around it.",
    impact: "Deep winter at 3,000m, and Sela Pass closes without warning. Build spare days in or plan to fly to Tezpur and drive.",
  },
  {
    id: "anthurium",
    name: "Anthurium Festival, Reiek",
    stateId: "mizoram",
    slugs: ["reiek-heritage-village"],
    months: [9],
    whenLabel: "September, on announced dates",
    fixedDates: false,
    scale: "local",
    what: "Mizo dance, food and the anthurium flower trade at the heritage village below Reiek peak.",
    impact: "One of the few times Mizoram programmes anything for visitors. You still need an Inner Line Permit.",
  },
  {
    id: "jampui-orange",
    name: "Orange & Tourism Festival, Jampui",
    stateId: "tripura",
    slugs: ["jampui-hills"],
    months: [11],
    whenLabel: "November, at the orange harvest",
    fixedDates: false,
    scale: "local",
    what: "Lushai and Reang dance and the orange harvest on Tripura's highest ridge.",
    impact: "The only month the long drive up to Jampui really pays off. Homestays are the only accommodation.",
  },
  {
    id: "losar-sikkim",
    name: "Pang Lhabsol, Sikkim",
    stateId: "sikkim",
    slugs: ["ravangla-buddha-park", "gangtok-mg-marg-rumtek"],
    months: [8, 9],
    whenLabel: "August or September, on the Tibetan lunar calendar",
    fixedDates: false,
    scale: "local",
    what: "Masked warrior dances honouring Kanchenjunga as Sikkim's guardian deity — unique to Sikkim, and performed at Ralang and Rumtek.",
    impact: "Falls at the tail of the monsoon when views are poor but the monasteries are at their most active. A reason to accept cloud.",
  },
];

/** Festivals happening in a given month. */
export function festivalsInMonth(month: number): Festival[] {
  return festivals.filter((f) => f.months.includes(month));
}

/** Everything tied to one destination. */
export function festivalsForSlug(slug: string): Festival[] {
  return festivals.filter((f) => f.slugs.includes(slug));
}

export function festivalsForState(stateId: string): Festival[] {
  return festivals.filter((f) => f.stateId === stateId);
}

const SCALE_RANK: Record<FestivalScale, number> = {
  international: 0,
  major: 1,
  local: 2,
};

/**
 * What a traveller would actually walk into on this trip: festivals in the
 * chosen month, at the states and stops they are visiting, biggest first.
 */
export function festivalsForTrip(
  stateIds: string[],
  slugs: string[],
  month?: number
): Festival[] {
  const states = new Set(stateIds);
  const stops = new Set(slugs);
  return festivals
    .filter((f) => {
      if (month && !f.months.includes(month)) return false;
      return states.has(f.stateId) || f.slugs.some((s) => stops.has(s));
    })
    .sort(
      (a, b) =>
        // A festival at a stop you are actually visiting outranks one merely
        // in the same state.
        Number(b.slugs.some((s) => stops.has(s))) - Number(a.slugs.some((s) => stops.has(s))) ||
        SCALE_RANK[a.scale] - SCALE_RANK[b.scale] ||
        a.name.localeCompare(b.name)
    );
}

export const SCALE_LABEL: Record<FestivalScale, string> = {
  international: "Draws the world",
  major: "Major draw",
  local: "Local and quiet",
};
