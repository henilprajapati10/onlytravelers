export type Region =
  | "North India"
  | "South India"
  | "West India"
  | "East India"
  | "Northeast India"
  | "Central India"
  | "Islands";

export type Category =
  | "Heritage"
  | "Hill Station"
  | "Beach"
  | "Spiritual"
  | "Wildlife"
  | "Adventure"
  | "Backwaters"
  | "Desert"
  | "Island"
  | "Village & Culture";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  region: Region;
  categories: Category[];
  tagline: string;
  description: string;
  highlights: string[];
  recommendedDays: number;
  bestTime: string;
  travelerTip: string;
}

export const destinations: Destination[] = [
  {
    id: "agra",
    slug: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    region: "North India",
    categories: ["Heritage"],
    tagline: "Home of the Taj Mahal",
    description:
      "Agra sits on the banks of the Yamuna and holds three UNESCO World Heritage Sites within a few kilometres of each other. Beyond the Taj Mahal's marble silhouette at sunrise, the red sandstone ramparts of Agra Fort and the abandoned Mughal capital of Fitatpur Sikri reveal centuries of empire, craft and everyday life along the river.",
    highlights: [
      "Taj Mahal at sunrise before the crowds arrive",
      "Agra Fort's palaces and audience halls",
      "Fatehpur Sikri, Akbar's deserted red-sandstone city",
      "Marble inlay (pietra dura) workshops run by artisan families",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Skip the tour-bus rush: book the earliest entry slot and walk the Mehtab Bagh gardens across the river for the classic reverse view without the crowds.",
  },
  {
    id: "jaipur",
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    region: "North India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "The Pink City of forts and bazaars",
    description:
      "Jaipur is a living lesson in 18th-century city planning, laid out on a grid by Maharaja Jai Singh II around astronomy, trade and defence. Amber Fort and City Palace show royal life at scale, while the old city's bazaars still trade in the same block-printed textiles, gemstones and blue pottery they always have.",
    highlights: [
      "Amber Fort and the Jal Mahal water palace",
      "Hawa Mahal's honeycomb sandstone facade",
      "Jantar Mantar's giant stone astronomical instruments",
      "Johari Bazaar for gems and Bapu Bazaar for textiles",
    ],
    recommendedDays: 3,
    bestTime: "November to February",
    travelerTip:
      "Base yourself in the old city walls for one night — the call of vendors closing shop and temple bells at dusk tell you more about Jaipur than any monument.",
  },
  {
    id: "udaipur",
    slug: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    region: "North India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "The City of Lakes",
    description:
      "Udaipur is built around a chain of artificial lakes ringed by the Aravalli hills, with the City Palace complex rising directly from Lake Pichola's edge. Its scale is gentler than Jaipur or Jodhpur, which makes it easy to slow down, watch the light change on the water, and wander the ghats and havelis on foot.",
    highlights: [
      "City Palace museum overlooking Lake Pichola",
      "Boat ride past Jag Mandir island palace",
      "Sajjangarh (Monsoon Palace) at sunset",
      "Bagore ki Haveli's evening folk dance performance",
    ],
    recommendedDays: 2,
    bestTime: "September to March",
    travelerTip:
      "Rooftop cafés overlooking the lake are touristy for a reason — pick one for sunset, then eat dinner somewhere on a back lane away from the water.",
  },
  {
    id: "jodhpur",
    slug: "jodhpur",
    name: "Jodhpur",
    state: "Rajasthan",
    region: "North India",
    categories: ["Heritage", "Desert"],
    tagline: "The Blue City on the Thar's edge",
    description:
      "Jodhpur's old town is a maze of indigo-washed houses beneath the sandstone bulk of Mehrangarh Fort, one of the best-preserved forts in India. It's also a practical gateway into the Thar Desert, with camel safaris and rural Bishnoi villages a short drive from the city walls.",
    highlights: [
      "Mehrangarh Fort's museum and ramparts",
      "Blue-washed lanes of the old city from the fort walls",
      "Jaswant Thada marble cenotaph",
      "Day trips to Bishnoi villages and the Thar's edge",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Climb to the fort's ramparts right at opening time for the best light over the blue rooftops before the haze sets in.",
  },
  {
    id: "jaisalmer",
    slug: "jaisalmer",
    name: "Jaisalmer",
    state: "Rajasthan",
    region: "North India",
    categories: ["Desert", "Heritage"],
    tagline: "A sandstone fort city in the Thar Desert",
    description:
      "Jaisalmer's golden fort still houses a living town of temples, homes and shops inside its walls — a rare thing among Indian forts. Beyond the city, the Thar Desert stretches to the Pakistan border, and the Sam and Khuri dunes offer camel treks and desert camps under exceptionally clear night skies.",
    highlights: [
      "Jaisalmer Fort, one of the few 'living forts' in the world",
      "Patwon ki Haveli's carved sandstone facades",
      "Camel safari and overnight desert camp at Sam Dunes",
      "Stargazing far from city light pollution",
    ],
    recommendedDays: 2,
    bestTime: "October to February",
    travelerTip:
      "Choose a smaller desert camp over the large tourist ones near Sam — quieter, darker skies, and a much more honest safari experience.",
  },
  {
    id: "rishikesh",
    slug: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    region: "North India",
    categories: ["Spiritual", "Adventure"],
    tagline: "Yoga capital on the Ganges",
    description:
      "Rishikesh sits where the Ganges rushes out of the Himalayan foothills, and it wears two identities well: a serious centre for yoga and meditation, and a base for whitewater rafting, cliff jumping and trekking. Evening Ganga aarti at Triveni Ghat draws both pilgrims and travelers into the same ritual.",
    highlights: [
      "Ganga aarti at Triveni Ghat or Parmarth Niketan",
      "Whitewater rafting on the Ganges",
      "Laxman Jhula and Ram Jhula suspension bridges",
      "Drop-in yoga and meditation courses along the riverside",
    ],
    recommendedDays: 2,
    bestTime: "September to April",
    travelerTip:
      "Stay on the quieter Tapovan side of the river rather than the main bazaar — a five-minute walk buys you a lot of calm.",
  },
  {
    id: "varanasi",
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    categories: ["Spiritual", "Heritage"],
    tagline: "One of the world's oldest living cities",
    description:
      "Varanasi has been a pilgrimage centre on the Ganges for over 3,000 years, and its ghats are where the city's entire spiritual and daily life plays out — cremation rites, morning bathing, boat sellers, silk weavers and evening aarti, all within view of each other. It rewards slow, unhurried mornings on the water.",
    highlights: [
      "Sunrise boat ride past the ghats",
      "Ganga aarti ceremony at Dashashwamedh Ghat",
      "Old city lanes around Kashi Vishwanath Temple",
      "Sarnath, where the Buddha gave his first sermon, a short ride away",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Go out on the water twice — once at dawn for the bathing ghats, once at dusk for the aarti — they show you two different cities.",
  },
  {
    id: "amritsar",
    slug: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    region: "North India",
    categories: ["Spiritual", "Heritage"],
    tagline: "Home of the Golden Temple",
    description:
      "The Golden Temple (Harmandir Sahib) is the spiritual centre of Sikhism and, regardless of faith, one of the most moving places to visit in India — its communal kitchen feeds over 50,000 people a day, free, to anyone who sits down. The city is also home to the Partition Museum and the nightly flag ceremony at the Wagah border.",
    highlights: [
      "Golden Temple by day and lit up at night",
      "Volunteering an hour in the langar (community kitchen)",
      "Partition Museum",
      "Wagah border retreat ceremony at sunset",
    ],
    recommendedDays: 1,
    bestTime: "October to March",
    travelerTip:
      "Cover your head, remove your shoes, and give an hour to the langar kitchen — chopping vegetables or washing dishes alongside strangers says more than a quick walk-through.",
  },
  {
    id: "shimla",
    slug: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    region: "North India",
    categories: ["Hill Station"],
    tagline: "The former summer capital of British India",
    description:
      "Shimla was built as the summer capital of the Raj and still carries that colonial layout — Mall Road, the Ridge, timbered Tudor buildings — now wrapped in deodar forest and Himalayan views. It's an easy, walkable hill station and a common gateway further into Himachal.",
    highlights: [
      "Mall Road and the Ridge at sunset",
      "The toy train from Kalka (a UNESCO heritage railway)",
      "Jakhoo Temple and its hilltop views",
      "Day trip to Kufri for pine forest walks",
    ],
    recommendedDays: 2,
    bestTime: "March to June, December for snow",
    travelerTip:
      "Take the Kalka–Shimla toy train one-way instead of flying or driving — the five-hour climb through 100+ tunnels is the actual experience, not a means to it.",
  },
  {
    id: "manali",
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    region: "North India",
    categories: ["Hill Station", "Adventure"],
    tagline: "Gateway to the high Himalaya",
    description:
      "Manali sits in the Kullu Valley on the Beas River and works as a base for both easy valley walks and serious high-altitude adventure — the Rohtang Pass, Solang Valley's paragliding, and the road onward to Spiti and Ladakh all start here. Old Manali retains a quieter, cafe-lined village feel apart from the main bazaar.",
    highlights: [
      "Old Manali's cafes and riverside walks",
      "Solang Valley for paragliding and skiing (winter)",
      "Rohtang Pass or Atal Tunnel toward Lahaul",
      "Hidimba Devi Temple in its cedar forest",
    ],
    recommendedDays: 3,
    bestTime: "March to June, October to February for snow",
    travelerTip:
      "Base in Old Manali rather than the main bazaar, and use it as a launchpad for at least one full-day trip up toward Solang or Rohtang.",
  },
  {
    id: "spiti-valley",
    slug: "spiti-valley",
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    region: "North India",
    categories: ["Adventure", "Village & Culture", "Spiritual"],
    tagline: "A cold desert of monasteries and moonscapes",
    description:
      "Spiti is high-altitude desert — barren mountains, mud-brick villages, and some of the oldest Buddhist monasteries in India, including Key Monastery clinging to a cliffside. It's remote by design: roads close in winter, phone signal is patchy, and that isolation is exactly what draws people who want distance from the usual circuit.",
    highlights: [
      "Key Monastery and Kibber, one of the world's highest motorable villages",
      "Chandratal Lake (accessible in summer)",
      "Dhankar Monastery perched on a cliff edge",
      "Homestays in Langza, Komic or Demul villages",
    ],
    recommendedDays: 5,
    bestTime: "May to October (roads closed in winter)",
    travelerTip:
      "Slow down and stay in village homestays rather than racing between monasteries — Spiti's altitude and roads punish a rushed itinerary.",
  },
  {
    id: "leh-ladakh",
    slug: "leh-ladakh",
    name: "Leh-Ladakh",
    state: "Ladakh",
    region: "North India",
    categories: ["Adventure", "Spiritual", "Village & Culture"],
    tagline: "High-altitude desert between two Himalayan ranges",
    description:
      "Ladakh sits at over 3,500m between the Great Himalayan and Karakoram ranges, a Buddhist high-desert landscape of monasteries, turquoise lakes and passes over 5,000m. Leh town is the base for acclimatisation before heading out to Pangong Tso, Nubra Valley's sand dunes, or the Markha Valley trek.",
    highlights: [
      "Pangong Tso's changing-colour waters",
      "Nubra Valley's sand dunes and double-humped camels",
      "Thiksey and Hemis monasteries",
      "Khardung La, among the world's highest motorable passes",
    ],
    recommendedDays: 6,
    bestTime: "June to September",
    travelerTip:
      "Spend two full days in Leh acclimatising before going anywhere higher — altitude sickness, not distance, is what actually ends Ladakh trips early.",
  },
  {
    id: "srinagar",
    slug: "srinagar",
    name: "Srinagar & the Kashmir Valley",
    state: "Jammu & Kashmir",
    region: "North India",
    categories: ["Hill Station", "Village & Culture"],
    tagline: "Houseboats on Dal Lake and Mughal gardens",
    description:
      "Srinagar's Dal Lake, its shikara boats and terraced Mughal gardens (Shalimar Bagh, Nishat Bagh) have drawn travelers for centuries. Beyond the lake, Gulmarg's meadows and Pahalgam's valleys extend the same alpine, garden-and-water landscape further into the mountains.",
    highlights: [
      "A night on a houseboat on Dal Lake",
      "Shikara ride at sunrise through the floating vegetable market",
      "Mughal gardens: Shalimar Bagh and Nishat Bagh",
      "Day trips to Gulmarg or Pahalgam",
    ],
    recommendedDays: 4,
    bestTime: "April to June, and September to October",
    travelerTip:
      "Check the current regional advisories before travel and book through an established local houseboat/shikara operator rather than a lakeside tout.",
  },
  {
    id: "darjeeling",
    slug: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    region: "East India",
    categories: ["Hill Station"],
    tagline: "Tea gardens with a view of Kanchenjunga",
    description:
      "Darjeeling terraces its way up a Himalayan ridge, its slopes covered in the tea estates that gave the town its name, with Kanchenjunga — the world's third-highest peak — visible from Tiger Hill on a clear morning. The narrow-gauge 'toy train' is a UNESCO World Heritage railway in its own right.",
    highlights: [
      "Sunrise over Kanchenjunga from Tiger Hill",
      "A tea estate tour and tasting",
      "The Darjeeling Himalayan Railway toy train",
      "Padmaja Naidu Himalayan Zoological Park (red pandas, snow leopards)",
    ],
    recommendedDays: 2,
    bestTime: "March to May, October to December",
    travelerTip:
      "Book the Tiger Hill sunrise trip the night before through your homestay — the clearest views come on cold, early winter mornings, not the busiest season.",
  },
  {
    id: "gangtok",
    slug: "gangtok",
    name: "Gangtok & Sikkim",
    state: "Sikkim",
    region: "Northeast India",
    categories: ["Hill Station", "Adventure", "Spiritual"],
    tagline: "India's cleanest, most organised Himalayan state",
    description:
      "Sikkim is small, mountainous and unusually well organised — plastic-free by policy, with permits required for its more remote corners. Gangtok is the base for exploring Buddhist monasteries, high-altitude lakes like Tsomgo, and the road toward Nathu La on the Tibet border.",
    highlights: [
      "Rumtek Monastery, one of the largest in Sikkim",
      "Tsomgo (Changu) Lake at altitude",
      "MG Marg's pedestrian-only evening buzz",
      "Yumthang Valley's 'Valley of Flowers' in season",
    ],
    recommendedDays: 4,
    bestTime: "March to May, October to mid-December",
    travelerTip:
      "Arrange inner-line permits (needed for Tsomgo Lake, Nathu La and North Sikkim) through a registered local agent a few days ahead — it isn't done on arrival.",
  },
  {
    id: "shillong",
    slug: "shillong",
    name: "Shillong & Meghalaya",
    state: "Meghalaya",
    region: "Northeast India",
    categories: ["Hill Station", "Adventure", "Village & Culture"],
    tagline: "Living root bridges and the wettest place on Earth",
    description:
      "Meghalaya means 'abode of clouds', and its Khasi and Jaintia hills hold some of India's most distinctive landscapes: root bridges grown by hand over generations in Cherrapunji and Mawlynnong, and a caving network largely unexplored outside specialist circles. Shillong itself is a relaxed hill town with a strong live-music culture.",
    highlights: [
      "Double-decker living root bridge trek near Nongriat",
      "Mawlynnong village, often called Asia's cleanest",
      "Cherrapunji's waterfalls and limestone caves",
      "Shillong's live-music cafes",
    ],
    recommendedDays: 4,
    bestTime: "October to April (dry season)",
    travelerTip:
      "The root bridge trek to Nongriat is 2,000+ steps down and back up — start early, carry water, and treat it as a full-day trek, not an afternoon stroll.",
  },
  {
    id: "kaziranga",
    slug: "kaziranga",
    name: "Kaziranga National Park",
    state: "Assam",
    region: "Northeast India",
    categories: ["Wildlife"],
    tagline: "The one-horned rhino's last great stronghold",
    description:
      "Kaziranga holds roughly two-thirds of the world's greater one-horned rhinoceroses, spread across Brahmaputra floodplain grasslands that also support tigers, elephants and wild water buffalo. Jeep and elephant-back safaris cover different zones of the park at dawn and mid-morning.",
    highlights: [
      "Dawn jeep safari through the central range",
      "Elephant-back safari through tall grasslands",
      "Birdwatching for Bengal floricans and migratory species",
      "Brahmaputra river cruises nearby",
    ],
    recommendedDays: 2,
    bestTime: "November to April (park closed in monsoon)",
    travelerTip:
      "Book both a jeep safari in the central range and one in a quieter range like Agoratoli — the crowds concentrate in the same easy zone.",
  },
  {
    id: "mumbai",
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    region: "West India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "India's financial capital and cultural engine",
    description:
      "Mumbai runs at a different pace to the rest of India — a peninsula city of colonial architecture, Bollywood, a 150-year-old dabbawala lunch-delivery network, and some of the country's best street food. The Gateway of India and Elephanta Caves sit a short ferry ride apart from Dharavi's dense informal economy.",
    highlights: [
      "Gateway of India and a ferry to Elephanta Caves",
      "Colaba Causeway and the Kala Ghoda art district",
      "Marine Drive at sunset",
      "A responsible, locally-guided Dharavi walking tour",
    ],
    recommendedDays: 2,
    bestTime: "November to February",
    travelerTip:
      "Eat where the queue is Mumbai locals, not tourists — the city's best food (vada pav, Bombay sandwiches, Parsi cafes) is at street stalls, not hotel restaurants.",
  },
  {
    id: "goa",
    slug: "goa",
    name: "Goa",
    state: "Goa",
    region: "West India",
    categories: ["Beach", "Heritage"],
    tagline: "Portuguese heritage and the Konkan coast",
    description:
      "Goa's identity is split evenly between its beaches and 450 years of Portuguese colonial history — whitewashed churches in Old Goa, spice plantations inland, and a coastline that ranges from the party beaches of the north to the quiet fishing villages of the south. It's small enough to cover both sides in one trip.",
    highlights: [
      "Basilica of Bom Jesus and Se Cathedral in Old Goa",
      "South Goa's quieter beaches: Agonda, Palolem",
      "A spice plantation tour inland",
      "Wednesday flea market at Anjuna",
    ],
    recommendedDays: 3,
    bestTime: "November to February",
    travelerTip:
      "Split your stay between a north beach for nightlife and a south beach for quiet — doing both shows you why people disagree so much about what 'Goa' even is.",
  },
  {
    id: "kerala-backwaters",
    slug: "kerala-backwaters",
    name: "Alleppey & the Kerala Backwaters",
    state: "Kerala",
    region: "South India",
    categories: ["Backwaters"],
    tagline: "A network of lagoons, canals and rice paddies",
    description:
      "Alleppey (Alappuzha) is the gateway to Kerala's backwaters, over 900km of interconnected lakes, rivers and canals where houseboats drift past rice paddies below sea level, coconut groves and villages that still move by boat. An overnight houseboat stay is the classic way to experience it, but day canoe trips reach narrower canals the big boats can't.",
    highlights: [
      "Overnight houseboat cruise through Vembanad Lake",
      "A narrow-canal canoe trip through village backwaters",
      "Kerala seafood cooked fresh onboard",
      "Kumarakom Bird Sanctuary nearby",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Pair one night on a houseboat with one day on a small canoe — the canoe reaches the narrow village canals the houseboats are too big for.",
  },
  {
    id: "munnar",
    slug: "munnar",
    name: "Munnar",
    state: "Kerala",
    region: "South India",
    categories: ["Hill Station"],
    tagline: "Rolling tea hills in the Western Ghats",
    description:
      "Munnar's hills are terraced almost entirely in tea, planted by British planters in the 1870s and still worked today, giving the landscape its distinctive close-cropped green contours. It sits inside the Western Ghats, a UNESCO biodiversity hotspot, with Eravikulam National Park protecting the endangered Nilgiri tahr close by.",
    highlights: [
      "Tea Museum and an active tea estate walk",
      "Eravikulam National Park's Nilgiri tahr",
      "Top Station's Western Ghats viewpoint",
      "Mattupetty Dam and the Kundala Lake boating area",
    ],
    recommendedDays: 2,
    bestTime: "September to March",
    travelerTip:
      "Go early to Eravikulam — the shuttle bus queues get long by mid-morning and the tahr are more visible in cooler hours.",
  },
  {
    id: "wayanad",
    slug: "wayanad",
    name: "Wayanad",
    state: "Kerala",
    region: "South India",
    categories: ["Wildlife", "Hill Station", "Adventure"],
    tagline: "Forested plateau on the Kerala-Karnataka border",
    description:
      "Wayanad is Kerala's least crowded major hill region, a forested plateau of wildlife sanctuaries, waterfalls, and Edakkal Caves with rock engravings estimated at several thousand years old. It also connects directly into the larger Nilgiri Biosphere Reserve, so wildlife sightings extend well beyond park boundaries.",
    highlights: [
      "Wayanad Wildlife Sanctuary jeep safari",
      "Edakkal Caves' prehistoric petroglyphs",
      "Chembra Peak's heart-shaped lake trek",
      "Soochipara and Meenmutty waterfalls",
    ],
    recommendedDays: 3,
    bestTime: "October to May",
    travelerTip:
      "Book the Chembra Peak trek permit a day ahead through the forest department counter — daily numbers are capped.",
  },
  {
    id: "hampi",
    slug: "hampi",
    name: "Hampi",
    state: "Karnataka",
    region: "South India",
    categories: ["Heritage"],
    tagline: "Ruins of the Vijayanagara Empire among granite boulders",
    description:
      "Hampi was the capital of the Vijayanagara Empire, one of the richest cities in the medieval world, and its ruins now sit scattered across a surreal landscape of giant granite boulders along the Tungabhadra River. Temples, market streets and royal enclosures spread over several kilometres, best explored slowly by bicycle.",
    highlights: [
      "Virupaksha Temple, still an active place of worship",
      "Vittala Temple's stone chariot and musical pillars",
      "Sunset from Matanga Hill over the boulder landscape",
      "Cycling between ruins on rented bicycles",
    ],
    recommendedDays: 2,
    bestTime: "October to February",
    travelerTip:
      "Rent a bicycle rather than hiring a tuk-tuk for the day — Hampi's ruins are spread out enough to need transport, but close enough to enjoy at your own pace.",
  },
  {
    id: "mysore",
    slug: "mysore",
    name: "Mysore",
    state: "Karnataka",
    region: "South India",
    categories: ["Heritage"],
    tagline: "Palaces, silk and sandalwood",
    description:
      "Mysore's Indo-Saracenic palace, home to the Wadiyar royal family for centuries, is lit with nearly 100,000 bulbs every Sunday evening — one of the most striking sights in South India. The city is also known for its silk sarees, sandalwood, and the Devaraja Market's spice and flower trade.",
    highlights: [
      "Mysore Palace, especially lit on Sunday evenings",
      "Devaraja Market's spices and flower stalls",
      "Chamundi Hill temple and viewpoint",
      "Silk and sandalwood workshops",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Time your visit for a Sunday to catch the palace's evening illumination — it's a completely different building after dark.",
  },
  {
    id: "coorg",
    slug: "coorg",
    name: "Coorg (Kodagu)",
    state: "Karnataka",
    region: "South India",
    categories: ["Hill Station", "Adventure"],
    tagline: "Coffee estates in the Western Ghats",
    description:
      "Coorg is Karnataka's coffee country, a misty plateau of coffee and spice plantations run largely by the local Kodava community, with waterfalls and the Brahmagiri hills for trekking. It's quieter and greener than the bigger hill stations, with homestays on working estates giving a closer look at how the coffee actually gets grown.",
    highlights: [
      "A working coffee estate tour and tasting",
      "Abbey Falls",
      "Talakaveri, the source of the Kaveri River",
      "Trekking in the Brahmagiri hills",
    ],
    recommendedDays: 3,
    bestTime: "October to March",
    travelerTip:
      "Stay on a working plantation homestay rather than a resort — most run their own estate tours and cook meals with what's grown on-site.",
  },
  {
    id: "gokarna",
    slug: "gokarna",
    name: "Gokarna",
    state: "Karnataka",
    region: "South India",
    categories: ["Beach", "Spiritual"],
    tagline: "A pilgrimage town with quiet beaches",
    description:
      "Gokarna is both a Hindu pilgrimage town, home to the Mahabaleshwar Temple, and a string of small, cliff-separated beaches reached mostly on foot — Om, Kudle, Half Moon and Paradise. It has stayed noticeably lower-key than Goa a few hours north, with cliffside beach shacks rather than large resorts.",
    highlights: [
      "Mahabaleshwar Temple in the old town",
      "The beach trek from Om Beach to Paradise Beach",
      "Sunset at Kudle Beach",
      "Simple beach-shack stays over resorts",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Walk the cliff trail between the beaches instead of taking a boat — it's how most long-term travelers still get between Om, Kudle and Half Moon.",
  },
  {
    id: "pondicherry",
    slug: "pondicherry",
    name: "Pondicherry (Puducherry)",
    state: "Puducherry",
    region: "South India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "French colonial streets on the Coromandel Coast",
    description:
      "Pondicherry's French Quarter (White Town) still keeps its colonial street grid, mustard-and-white villas and bilingual street signs, a legacy of over two centuries as a French colony until 1954. Auroville, the experimental international township nearby, adds a very different, utopian-community layer to a visit.",
    highlights: [
      "French Quarter's colonial villas and cafes",
      "Promenade Beach at sunrise",
      "Auroville and the Matrimandir",
      "Sri Aurobindo Ashram",
    ],
    recommendedDays: 2,
    bestTime: "November to February",
    travelerTip:
      "Rent a bicycle in White Town — the French Quarter's grid is small, flat and far more atmospheric without a car or auto-rickshaw.",
  },
  {
    id: "mahabalipuram",
    slug: "mahabalipuram",
    name: "Mahabalipuram",
    state: "Tamil Nadu",
    region: "South India",
    categories: ["Heritage", "Beach"],
    tagline: "Shore temples carved by the Pallava dynasty",
    description:
      "Mahabalipuram's Shore Temple and rock-cut monuments were carved directly from granite outcrops by the Pallava dynasty over 1,300 years ago, right at the water's edge on the Bay of Bengal. It's a compact, walkable site — most of the major monuments sit within a couple of kilometres of each other.",
    highlights: [
      "Shore Temple at sunrise against the Bay of Bengal",
      "Arjuna's Penance rock relief",
      "The Five Rathas, monolithic temple chariots",
      "Krishna's Butterball, a giant balanced boulder",
    ],
    recommendedDays: 1,
    bestTime: "November to February",
    travelerTip:
      "Combine it with Pondicherry as a coastal add-on — they're about two hours apart along the same stretch of coast.",
  },
  {
    id: "andaman",
    slug: "andaman",
    name: "Andaman Islands",
    state: "Andaman & Nicobar Islands",
    region: "Islands",
    categories: ["Island", "Beach", "Adventure"],
    tagline: "Coral reefs and white-sand islands in the Bay of Bengal",
    description:
      "The Andamans sit far out in the Bay of Bengal, closer to Myanmar than mainland India, with some of the country's clearest water for diving and snorkelling. Havelock (Swaraj Dweep) and Neil (Shaheed Dweep) islands hold the best-known beaches, while Port Blair carries the region's colonial and independence history at Cellular Jail.",
    highlights: [
      "Radhanagar Beach on Havelock Island",
      "Diving or snorkelling on coral reefs off Havelock",
      "Cellular Jail's light-and-sound show in Port Blair",
      "Neil Island's quieter beaches and natural rock bridge",
    ],
    recommendedDays: 5,
    bestTime: "October to May",
    travelerTip:
      "Fly into Port Blair but spend most of your time island-hopping to Havelock and Neil by ferry — the capital itself is a short stop, not the destination.",
  },
  {
    id: "rann-of-kutch",
    slug: "rann-of-kutch",
    name: "Rann of Kutch",
    state: "Gujarat",
    region: "West India",
    categories: ["Desert", "Village & Culture"],
    tagline: "A white salt desert that hosts a season-long festival",
    description:
      "The Great Rann of Kutch turns into a blinding white salt desert stretching to the horizon after the monsoon dries it out, and every winter it hosts the Rann Utsav, a months-long tented festival of Gujarati music, crafts and full-moon nights on the salt flats. The surrounding villages are known for embroidery, block printing and pottery.",
    highlights: [
      "Full-moon night on the white salt desert",
      "Rann Utsav tented festival (winter season)",
      "Craft villages around Bhuj for embroidery and block printing",
      "Kalo Dungar (Black Hill) viewpoint over the Rann",
    ],
    recommendedDays: 2,
    bestTime: "November to February",
    travelerTip:
      "Time your trip around the full moon during Rann Utsav season — the salt flats under moonlight are the entire point of the visit.",
  },
  {
    id: "khajuraho",
    slug: "khajuraho",
    name: "Khajuraho",
    state: "Madhya Pradesh",
    region: "Central India",
    categories: ["Heritage"],
    tagline: "Intricately carved temples of the Chandela dynasty",
    description:
      "Khajuraho's temple complex, built by the Chandela dynasty over a thousand years ago, is known worldwide for its dense, intricate stone carvings covering everything from deities to daily life. Of the original 85 temples, 25 survive, grouped into western, eastern and southern clusters.",
    highlights: [
      "Western Group temples, the largest and best preserved",
      "Kandariya Mahadeva Temple's carvings",
      "Evening light-and-sound show among the western temples",
      "Eastern Group's Jain temples",
    ],
    recommendedDays: 1,
    bestTime: "October to March",
    travelerTip:
      "Hire an official ASI-licensed guide at the western group entrance — the carvings' detail and symbolism are easy to miss walking through alone.",
  },
  {
    id: "ranthambore",
    slug: "ranthambore",
    name: "Ranthambore National Park",
    state: "Rajasthan",
    region: "North India",
    categories: ["Wildlife"],
    tagline: "One of India's best places to see a wild tiger",
    description:
      "Ranthambore combines a former Mughal and Rajput hunting ground with some of India's most reliable wild tiger sightings, its ruined 10th-century fort overlooking lakes where tigers are regularly seen crossing open ground in daylight. Safaris are run in numbered zones on a rotation system to manage sightings fairly.",
    highlights: [
      "Morning or evening jeep safari through core zones",
      "Ranthambore Fort overlooking Padam Lake",
      "Padam Lake and Rajbagh Lake, favoured tiger territory",
      "Birdwatching alongside larger wildlife",
    ],
    recommendedDays: 2,
    bestTime: "October to April (park closed in monsoon)",
    travelerTip:
      "Book a specific zone number in advance through the official portal rather than leaving it to your hotel — zones 2, 3 and 5 have historically had the most sightings.",
  },
  {
    id: "jim-corbett",
    slug: "jim-corbett",
    name: "Jim Corbett National Park",
    state: "Uttarakhand",
    region: "North India",
    categories: ["Wildlife"],
    tagline: "India's oldest national park",
    description:
      "Established in 1936, Jim Corbett is India's oldest national park, a mix of Sal forest, grassland and the Ramganga River that supports tigers, elephants and over 600 bird species. Its size and multiple zones (Dhikala, Bijrani, Jhirna) spread visitors out more than some smaller reserves.",
    highlights: [
      "Jeep safari in the Dhikala or Bijrani zones",
      "Riverside birdwatching along the Ramganga",
      "Corbett Museum on the park's naturalist namesake",
      "Elephant sightings along the grasslands",
    ],
    recommendedDays: 2,
    bestTime: "November to June (Dhikala zone closed in monsoon)",
    travelerTip:
      "Book Dhikala zone well ahead if you can — it's the park's core and richest-sighting area, but access is limited and fills up fastest.",
  },
  {
    id: "auli",
    slug: "auli",
    name: "Auli",
    state: "Uttarakhand",
    region: "North India",
    categories: ["Hill Station", "Adventure"],
    tagline: "Himalayan skiing with Nanda Devi views",
    description:
      "Auli is India's best-developed ski destination, a ridge of coniferous forest and open slopes facing Nanda Devi, the country's second-highest peak. Outside the winter ski season, the same slopes and a cable car (one of Asia's longest) make it a quieter, high-view alternative to the busier hill stations nearby.",
    highlights: [
      "Skiing on Himalayan slopes (winter season)",
      "Auli–Joshimath cable car ride",
      "Views of Nanda Devi and the Garhwal Himalaya",
      "Gorson Bugyal meadow trek",
    ],
    recommendedDays: 2,
    bestTime: "December to March for skiing, April to June for meadows",
    travelerTip:
      "Visit in shoulder season (April–June) if skiing isn't the goal — you get the same views and meadow treks without the winter crowds.",
  },
  {
    id: "hyderabad",
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    region: "South India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "Nizams, pearls and biryani",
    description:
      "Hyderabad carries the layered history of Qutb Shahi sultans and Nizam rulers in the Charminar, Golconda Fort and Chowmahalla Palace, alongside a food culture built around its signature Hyderabadi biryani and Old City's pearl and bangle trade. It's also grown into a major tech hub, giving it an unusually sharp old-city/new-city contrast.",
    highlights: [
      "Charminar and the Laad Bazaar bangle market",
      "Golconda Fort's acoustic engineering and sound-and-light show",
      "Chowmahalla Palace",
      "Hyderabadi biryani at an old-city institution",
    ],
    recommendedDays: 2,
    bestTime: "October to February",
    travelerTip:
      "Eat biryani in the Old City near Charminar, not in the newer business districts — the dish's home institutions are all within walking distance of each other there.",
  },
  {
    id: "delhi",
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    region: "North India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "Seven cities of history layered into one",
    description:
      "Delhi has been built and rebuilt as a capital at least seven times, and Old Delhi's Mughal-era lanes around Chandni Chowk sit a short metro ride from New Delhi's colonial-era government boulevards — two very different cities that happen to share a name. It's most travelers' entry point into North India and rewards a couple of unhurried days before moving on.",
    highlights: [
      "Red Fort and Chandni Chowk's street food lanes",
      "Humayun's Tomb, a precursor to the Taj Mahal's design",
      "Qutub Minar and its 12th-century complex",
      "India Gate and the government boulevards of New Delhi",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Use the Metro, not just taxis — it's the fastest way to feel the actual distance and contrast between Old and New Delhi in one day.",
  },
  {
    id: "kolkata",
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    region: "East India",
    categories: ["Heritage", "Village & Culture"],
    tagline: "India's former colonial capital and cultural heart",
    description:
      "Kolkata was the capital of British India until 1911, and its colonial architecture, tram network (South Asia's oldest) and deep literary and artistic tradition still shape daily life. It's known equally for sweets like rasgulla and mishti doi, and for the collective energy of Durga Puja, its biggest annual festival.",
    highlights: [
      "Victoria Memorial and the Maidan",
      "A ride on Kolkata's heritage tram network",
      "College Street's secondhand book market",
      "Sweet shops in North Kolkata for rasgulla and mishti doi",
    ],
    recommendedDays: 2,
    bestTime: "October to March",
    travelerTip:
      "Visit during Durga Puja (September/October) if your dates allow — the pandals and street energy turn the whole city into the attraction.",
  },
  {
    id: "ooty",
    slug: "ooty",
    name: "Ooty (Udhagamandalam)",
    state: "Tamil Nadu",
    region: "South India",
    categories: ["Hill Station"],
    tagline: "The 'Queen of Hill Stations' in the Nilgiris",
    description:
      "Ooty was the British Madras Presidency's summer retreat, and it kept the botanical gardens, lake and narrow-gauge Nilgiri Mountain Railway that came with that history. Surrounded by tea plantations and the Nilgiri hills, it's a cooler, greener counterpoint to the plains of Tamil Nadu below.",
    highlights: [
      "Nilgiri Mountain Railway, a UNESCO World Heritage toy train",
      "Government Botanical Garden",
      "Ooty Lake boating",
      "Doddabetta Peak, the Nilgiris' highest point",
    ],
    recommendedDays: 2,
    bestTime: "October to June",
    travelerTip:
      "Take the toy train from Mettupalayam or Coonoor rather than driving up — it's slow on purpose, and that's the appeal.",
  },
  {
    id: "sundarbans",
    slug: "sundarbans",
    name: "Sundarbans",
    state: "West Bengal",
    region: "East India",
    categories: ["Wildlife"],
    tagline: "The world's largest mangrove forest and tiger habitat",
    description:
      "The Sundarbans is a vast delta of mangrove forest straddling India and Bangladesh, the only place where tigers are adapted to swim between islands and hunt in tidal water. Exploration happens almost entirely by boat, drifting narrow creeks where sightings of tigers, saltwater crocodiles and hundreds of bird species are possible but never guaranteed.",
    highlights: [
      "Boat safari through mangrove creeks",
      "Sudhanyakhali watchtower for wildlife spotting",
      "Local fishing villages within the buffer zone",
      "Birdwatching for kingfishers and migratory waders",
    ],
    recommendedDays: 3,
    bestTime: "November to February",
    travelerTip:
      "Set expectations before you go — tiger sightings are rare here; the mangrove ecosystem and boat journey itself are the real reward.",
  },
];

export const regions: Region[] = [
  "North India",
  "South India",
  "West India",
  "East India",
  "Northeast India",
  "Central India",
  "Islands",
];

export const categories: Category[] = [
  "Heritage",
  "Hill Station",
  "Beach",
  "Spiritual",
  "Wildlife",
  "Adventure",
  "Backwaters",
  "Desert",
  "Island",
  "Village & Culture",
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
