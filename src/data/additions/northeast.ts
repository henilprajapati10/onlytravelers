import type { Addition } from "./types";

/** Assam, Arunachal, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim. */
export const northeastAdditions: Addition[] = [
  /* ---------- Assam ---------- */
  {
    slug: "dibru-saikhowa-national-park",
    name: "Dibru-Saikhowa National Park",
    district: "Tinsukia",
    stateId: "assam",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Nov - Mar",
    bestMonths: [1, 2, 3, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.6, lng: 95.38 },
    guide: {
      summary:
        "A river island biosphere between the Brahmaputra and the Lohit in upper Assam, with feral horses descended from wartime army stock, Gangetic dolphins in the channels, and one of the best winter bird lists in India.",
      highlights: [
        "Feral horses on the grasslands at Kolomi",
        "Gangetic dolphins from a country boat on the Maguri Beel",
        "White-winged wood duck and Bengal florican in winter",
      ],
      tip: "Stay on a boat or at Guijan and go out at first light. Maguri Beel, just outside the park, was badly hit by the 2020 Baghjan blowout — ask the boatmen about it, they will tell you what changed.",
    },
  },
  {
    slug: "hajo",
    name: "Hajo",
    district: "Kamrup",
    stateId: "assam",
    themes: ["Spiritual", "Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.25, lng: 91.53 },
    guide: {
      summary:
        "A small town 25 km from Guwahati sacred to Hindus, Buddhists and Muslims at once — the Hayagriva Madhava temple, which some Buddhists hold to be where the Buddha attained nirvana, and the Poa Mecca dargah on the hill opposite.",
      highlights: [
        "Hayagriva Madhava temple, 10th century on older foundations",
        "Poa Mecca, said to hold a quarter of the sanctity of Mecca",
        "Kedareswara temple and the brass-working village of Sarthebari nearby",
      ],
      tip: "Do both hills in one morning and notice that the same families visit each. Assam's religious syncretism is not a slogan here, it is the weekly routine.",
    },
  },
  {
    slug: "umananda-island",
    name: "Umananda Island",
    district: "Kamrup Metropolitan",
    stateId: "assam",
    themes: ["Spiritual", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.197, lng: 91.745 },
    guide: {
      summary:
        "The smallest inhabited river island in the world, in the middle of the Brahmaputra at Guwahati, with a 17th-century Shiva temple on it and a surviving population of golden langurs — one of the rarest primates in India.",
      highlights: [
        "The ferry across the Brahmaputra, ten minutes and a different city",
        "The Ahom-period temple and its rock carvings",
        "Golden langurs in the trees around the shrine",
      ],
      tip: "Take the government ferry rather than a private boat, and go late afternoon. The langurs come down as it cools, and the river at sunset from the island is Guwahati's best half hour.",
    },
  },
  {
    slug: "tezpur-agnigarh",
    name: "Tezpur & Agnigarh",
    district: "Sonitpur",
    stateId: "assam",
    themes: ["Heritage", "Cities"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.63, lng: 92.8 },
    guide: {
      summary:
        "The oldest town in Assam, on the north bank of the Brahmaputra, with 6th-century stone door frames at Da Parbatia, the Agnigarh hill of the Usha–Aniruddha legend, and the gateway road to Tawang.",
      highlights: [
        "Da Parbatia's Gupta-period carved doorway, the oldest in Assam",
        "Agnigarh hill above the river",
        "Mahabhairab temple and Chitralekha Udyan",
      ],
      tip: "Most people sleep here on the way to Tawang and see none of it. Give it a morning — the Da Parbatia doorway is one of the oldest pieces of sculpture in the entire northeast.",
    },
  },
  {
    slug: "sualkuchi",
    name: "Sualkuchi",
    district: "Kamrup",
    stateId: "assam",
    themes: ["Culture"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.17, lng: 91.57 },
    guide: {
      summary:
        "A weaving town on the north bank of the Brahmaputra where the whole population works silk — muga, the golden silk found nowhere else on Earth, along with eri and pat. Thousands of looms in private houses.",
      highlights: [
        "Muga silk on the loom, from a thread that needs no dye",
        "Eri, the peace silk, where the moth is not killed",
        "The riverbank and the ferry to Hajo",
      ],
      tip: "Ask for muga specifically and ask where the cocoons came from. Real muga is expensive, gets more golden with washing, and is widely faked in Guwahati's shops.",
    },
  },
  {
    slug: "orang-national-park",
    name: "Orang National Park",
    district: "Darrang",
    stateId: "assam",
    themes: ["Wildlife", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Nov - Apr",
    bestMonths: [1, 2, 3, 4, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.57, lng: 92.32 },
    guide: {
      summary:
        "A small park on the north bank of the Brahmaputra, often called mini-Kaziranga, with rhino, tiger, wild buffalo and pygmy hog in seventy-odd square kilometres of grassland and swamp.",
      highlights: [
        "Rhino on open grassland, with far fewer vehicles than Kaziranga",
        "Pelicans and storks on the beels in winter",
        "The Brahmaputra channels along the southern boundary",
      ],
      tip: "Do Orang instead of a second Kaziranga safari, not as well as. Same landscape, a fraction of the traffic, and the drive up is part of the point.",
    },
  },
  {
    slug: "digboi",
    name: "Digboi",
    district: "Tinsukia",
    stateId: "assam",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.39, lng: 95.62 },
    guide: {
      summary:
        "Asia's first oil refinery, running since 1901 and still producing, with the original well, a company town of bungalows and golf, and a war cemetery for the men who died building the Stilwell Road.",
      highlights: [
        "Digboi Centenary Oil Museum and Well No. 1",
        "The 1888 company town and its clubhouse",
        "Digboi War Cemetery, immaculately kept",
      ],
      tip: "Combine it with the Stilwell Road at Ledo, 15 km on. The Burma campaign's supply line started here, and the logic of the whole industrial town follows from it.",
    },
  },

  /* ---------- Arunachal Pradesh ---------- */
  {
    slug: "sangti-valley",
    name: "Sangti Valley",
    district: "West Kameng",
    stateId: "arunachal-pradesh",
    themes: ["Nature", "Hills"],
    idealDays: 1,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 27.42, lng: 92.23 },
    guide: {
      summary:
        "A wide flat valley of apple orchards and kiwi beside a braided river, half an hour from Dirang, where black-necked cranes used to winter and occasionally still appear. Monpa villages and almost no traffic.",
      highlights: [
        "The riverbed and orchards, walkable end to end",
        "Monpa hamlets and their water-driven prayer wheels",
        "Dirang dzong and the hot springs, nearby",
      ],
      tip: "Stay a night in a Monpa homestay rather than at a Dirang hotel. The valley at dawn, with mist off the river, is the reason to have made the detour.",
    },
  },
  {
    slug: "aalo-along",
    name: "Aalo (Along)",
    district: "West Siang",
    stateId: "arunachal-pradesh",
    themes: ["Culture", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 28.16, lng: 94.8 },
    guide: {
      summary:
        "The Galo heartland at the meeting of the Siyom and Sipu rivers, with hanging cane bridges across the gorges and the Mopin harvest festival in April. A genuinely untouristed part of a lightly touristed state.",
      highlights: [
        "The cane suspension bridges, rebuilt by hand each year",
        "Mopin festival in early April",
        "Kabu and Patum villages, and the Galo longhouses",
      ],
      tip: "Time it for Mopin if you can. It is a community festival rather than a performance, and visitors who come for it are treated as guests rather than spectators.",
    },
  },
  {
    slug: "roing-mehao",
    name: "Roing & Mehao Lake",
    district: "Lower Dibang Valley",
    stateId: "arunachal-pradesh",
    themes: ["Lakes", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 28.14, lng: 95.84 },
    guide: {
      summary:
        "The Idu Mishmi town below the Dibang valley, with a wildlife sanctuary, a high forest lake reached on foot, and the ruins of Bhismaknagar — a 10th-century brick fort in the foothills that nobody can fully explain.",
      highlights: [
        "Mehao Lake, a 14 km forest walk in",
        "Bhismaknagar fort ruins on the foothill spur",
        "Sally Lake and the Deopani river",
      ],
      tip: "Roing is the gateway to Dibang, one of the least-visited valleys in India. If you have the days, keep going to Anini rather than turning back here.",
    },
  },
  {
    slug: "anini",
    name: "Anini & the Dibang Valley",
    district: "Dibang Valley",
    stateId: "arunachal-pradesh",
    themes: ["Nature", "Hills", "Culture"],
    idealDays: 3,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 28.8, lng: 95.9 },
    guide: {
      summary:
        "The headquarters of India's least densely populated district — under two people per square kilometre — at the end of a long road in the Mishmi hills. Dense forest, clear rivers, and the Mishmi takin somewhere above.",
      highlights: [
        "The drive in from Roing over Mayodia Pass",
        "Idu Mishmi villages and their shamanic tradition",
        "Mishmi Hills birding — this is a global hotspot",
      ],
      tip: "Roads here close for landslides for days at a time, particularly outside the dry season. Build slack into the plan and go with a driver who knows the valley, not one from Itanagar.",
    },
  },
  {
    slug: "parshuram-kund",
    name: "Parshuram Kund",
    district: "Lohit",
    stateId: "arunachal-pradesh",
    themes: ["Spiritual"],
    idealDays: 0.5,
    bestMonthsLabel: "Nov - Mar",
    bestMonths: [1, 2, 3, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 27.88, lng: 96.34 },
    guide: {
      summary:
        "A pool on the Lohit river where Parshurama is said to have washed off the sin of killing his mother. Tens of thousands bathe here at Makar Sankranti in January, from across the northeast and Nepal.",
      highlights: [
        "The kund and the Lohit gorge around it",
        "The Makar Sankranti mela in mid-January",
        "The Mishmi hills rising immediately behind",
      ],
      tip: "The current is strong and people drown here most years. If you bathe, do it in the designated area with the ropes, not where the river looks calmer.",
    },
  },
  {
    slug: "talle-valley",
    name: "Talle Valley",
    district: "Lower Subansiri",
    stateId: "arunachal-pradesh",
    themes: ["Trekking", "Nature"],
    idealDays: 3,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 27.52, lng: 93.9 },
    guide: {
      summary:
        "A plateau of silver fir, bamboo and orchid above the Ziro valley, protected as a wildlife sanctuary, reached by a two-day trek through some of the wettest forest in the eastern Himalaya.",
      highlights: [
        "The fir forest on the plateau, unlike anything lower down",
        "Pine Grove and the Pange river camps",
        "Clouded leopard and Himalayan black bear country, if rarely seen",
      ],
      tip: "It rains here even in the dry season. Waterproof everything, take a guide from Ziro, and expect leeches on the lower sections regardless of month.",
    },
  },

  /* ---------- Meghalaya ---------- */
  {
    slug: "krang-suri-falls",
    name: "Krang Suri Falls",
    district: "West Jaintia Hills",
    stateId: "meghalaya",
    themes: ["Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.4, lng: 92.28 },
    guide: {
      summary:
        "A wide fall into a turquoise pool in the Jaintia hills, managed by the local village council, with steps cut down to a swimming platform. Blue in a way that photographs badly overstate and reality mostly matches.",
      highlights: [
        "Swimming in the pool below the fall",
        "The stepped descent through the forest",
        "Jaintia monoliths and Nartiang, an hour away",
      ],
      tip: "The entry fee goes to the village that maintains the site, and the rules — life jackets, no alcohol — are theirs. The Jaintia hills are administered by village councils, and this is what that looks like in practice.",
    },
  },
  {
    slug: "mawphlang-sacred-forest",
    name: "Mawphlang Sacred Forest",
    district: "East Khasi Hills",
    stateId: "meghalaya",
    themes: ["Nature", "Culture"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.45, lng: 91.75 },
    guide: {
      summary:
        "A grove protected by Khasi custom for centuries, where nothing — not a leaf, not a stone — may be taken out. The result is old-growth forest in the middle of grassland, with the soil metres deep in humus and orchids on every trunk.",
      highlights: [
        "The grove itself, guided by a Khasi interpreter",
        "Monoliths at the entrance, marking clan ritual sites",
        "The David Scott Trail, which starts nearby",
      ],
      tip: "Take nothing out, and mean it — not a leaf as a souvenir. The rule is the only reason the forest survived, and the guides will tell you the stories of people who ignored it.",
    },
  },
  {
    slug: "nartiang-monoliths",
    name: "Nartiang Monoliths",
    district: "West Jaintia Hills",
    stateId: "meghalaya",
    themes: ["Heritage", "Culture"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.59, lng: 92.21 },
    guide: {
      summary:
        "The largest collection of standing stones in Meghalaya — menhirs up to eight metres high and dolmens laid flat, raised by Jaintia clans between the 16th and 19th centuries to mark ancestors and victories.",
      highlights: [
        "The monolith field, dense and unfenced",
        "Nartiang Durga temple, one of the 51 Shakti Peethas",
        "The old Jaintia summer capital site",
      ],
      tip: "Upright stones are male and flat ones female in Khasi and Jaintia practice, and they were raised in pairs for specific people. Ask a local guide whose stone is whose; the field is a genealogy.",
    },
  },
  {
    slug: "balpakram-national-park",
    name: "Balpakram National Park",
    district: "South Garo Hills",
    stateId: "meghalaya",
    themes: ["Nature", "Wildlife"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.25, lng: 90.85 },
    guide: {
      summary:
        "A plateau ending in a 1,000m canyon above the Simsang river, which the Garo hold to be where souls rest before departing. Red panda, elephant, and the pitcher plant that grows only in these hills.",
      highlights: [
        "The canyon rim, and the drop into the gorge",
        "Nepenthes khasiana, the Indian pitcher plant",
        "Siju bat cave and the Simsang river on the way in",
      ],
      tip: "This is the Garo Hills, not the Khasi Hills, and nothing about the visitor circuit reaches here. Arrange it from Tura with a local guide and give it two days minimum.",
    },
  },
  {
    slug: "tura-garo-hills",
    name: "Tura & the Garo Hills",
    district: "West Garo Hills",
    stateId: "meghalaya",
    themes: ["Hills", "Culture", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.51, lng: 90.22 },
    guide: {
      summary:
        "Meghalaya's western third, matrilineal like the Khasi hills but a different people, language and landscape — lower, hotter, and forested, with Tura Peak above the town and the Wangala drum festival in November.",
      highlights: [
        "Tura Peak, a two-hour climb from town",
        "Wangala, the hundred-drums harvest festival, in November",
        "Nokrek Biosphere Reserve and its wild citrus",
      ],
      tip: "Nokrek holds the wild ancestor of every cultivated orange on Earth. Ask about the citrus gene sanctuary — it is a piece of global agricultural heritage sitting in a district almost nobody visits.",
    },
  },

  /* ---------- Manipur ---------- */
  {
    slug: "shirui-ukhrul",
    name: "Shirui & Ukhrul",
    district: "Ukhrul",
    stateId: "manipur",
    themes: ["Hills", "Nature", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.1, lng: 94.36 },
    guide: {
      summary:
        "The Tangkhul Naga hills east of Imphal, where the Shirui lily grows on one ridge and nowhere else in the world. It flowers for a few weeks in May and June and every attempt to transplant it has failed.",
      highlights: [
        "Shirui Kashong peak and the lily, in season",
        "Khayang waterfall, the highest in Manipur",
        "Tangkhul villages and their weaving",
      ],
      tip: "The lily is critically endangered and picking one is both illegal and the end of a plant that exists on a single hillside. Look, photograph, walk on.",
    },
  },
  {
    slug: "andro-village",
    name: "Andro Village",
    district: "Imphal East",
    stateId: "manipur",
    themes: ["Culture", "Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 24.76, lng: 94.06 },
    guide: {
      summary:
        "A Scheduled Caste Meitei village east of Imphal that kept the pre-Vaishnavite Sanamahi religion, with a perpetual sacred fire, a potters' tradition thrown without a wheel, and a village museum of the old Manipur.",
      highlights: [
        "The eternal fire at the Panam Ningthou shrine",
        "Pottery made by hand without a wheel, by women only",
        "The Mutua Museum's cultural complex",
      ],
      tip: "Buy a pot. The technique here is genuinely unusual — coil-built and beaten, no wheel at all — and the craft is down to a handful of practitioners.",
    },
  },
  {
    slug: "tamenglong-zeilad",
    name: "Tamenglong & Zeilad Lake",
    district: "Tamenglong",
    stateId: "manipur",
    themes: ["Nature", "Lakes"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 24.99, lng: 93.5 },
    guide: {
      summary:
        "The Zeliangrong hills in western Manipur — orange country, with waterfalls, a sanctuary lake holding turtles and pythons, and the Amur falcon roosts that made this district internationally known.",
      highlights: [
        "Zeilad Lake and its sanctuary",
        "Barak waterfall, a series of seven drops",
        "Amur falcon roosts in October and November",
      ],
      tip: "The Amur falcon story here is a conservation landmark: villages that hunted them in tens of thousands now protect them. Go in the roosting season and meet the people who turned it round.",
    },
  },

  /* ---------- Mizoram ---------- */
  {
    slug: "dampa-tiger-reserve",
    name: "Dampa Tiger Reserve",
    district: "Mamit",
    stateId: "mizoram",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Nov - Mar",
    bestMonths: [1, 2, 3, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.7, lng: 92.4 },
    guide: {
      summary:
        "Mizoram's largest protected area, on the Bangladesh border, holding clouded leopard, hoolock gibbon and a bird list that draws researchers rather than tourists. Thick tropical forest with no road through it.",
      highlights: [
        "Hoolock gibbon calls at dawn, the sound of the place",
        "Clouded leopard and marbled cat on camera traps",
        "Teirei and Phuldungsei forest camps",
      ],
      tip: "Sightings of the big cats are effectively nil and the guides will say so. Come for the gibbons, the birds and a forest almost no visitor has walked in.",
    },
  },
  {
    slug: "hmuifang",
    name: "Hmuifang",
    district: "Aizawl",
    stateId: "mizoram",
    themes: ["Hills", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.41, lng: 92.73 },
    guide: {
      summary:
        "A forested ridge 50 km south of Aizawl, kept uncut by the Mizo chiefs and still intact, with a tourist lodge on top and the Thalfavang Kut harvest festival held below it in November.",
      highlights: [
        "The old-growth ridge forest, protected by custom since chiefdom days",
        "Sunrise over the ranges towards Myanmar",
        "Traditional Mizo village architecture nearby at Chalfilh",
      ],
      tip: "Mizoram is dry, quiet on Sundays and one of the safest states in India to travel in. Plan around Sunday closures rather than being caught out by them.",
    },
  },
  {
    slug: "murlen-national-park",
    name: "Murlen National Park",
    district: "Champhai",
    stateId: "mizoram",
    themes: ["Nature", "Wildlife"],
    idealDays: 2,
    bestMonthsLabel: "Nov - Mar",
    bestMonths: [1, 2, 3, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.64, lng: 93.3 },
    guide: {
      summary:
        "Semi-evergreen and montane forest on the Myanmar border, adjacent to the Chin Hills, with over a hundred species of orchid, serow, hoolock gibbon and a forest structure that has barely been studied.",
      highlights: [
        "The orchid diversity, at its best in spring",
        "Rih Dil and the Champhai plain nearby",
        "Birding along the boundary ridges",
      ],
      tip: "Access is through Champhai and needs forest department permission arranged locally. Allow a day either side; nothing here runs to a schedule you can book from outside the state.",
    },
  },

  /* ---------- Nagaland ---------- */
  {
    slug: "longwa-village",
    name: "Longwa Village",
    district: "Mon",
    stateId: "nagaland",
    themes: ["Culture"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.78, lng: 95.16 },
    guide: {
      summary:
        "A Konyak village on the ridge that is the India–Myanmar border, with the Angh's longhouse straddling the line — he sleeps in one country and eats in the other. The last generation of tattooed headhunters lives here.",
      highlights: [
        "The Angh's house on the international boundary",
        "Konyak elders with facial tattoos, the last of the tradition",
        "The opium and gunsmithing that the village has lived with",
      ],
      tip: "Ask permission before photographing anybody, every time, and pay what is asked. These are people, not a living museum, and the way they are photographed by visitors is a real grievance in Mon.",
    },
  },
  {
    slug: "japfu-peak",
    name: "Japfu Peak",
    district: "Kohima",
    stateId: "nagaland",
    themes: ["Trekking", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.6078, lng: 94.0678 },
    guide: {
      summary:
        "Nagaland's second-highest peak at 3,048m, above Kohima, with the tallest rhododendron tree in the world on its flank — over 30 metres, recorded in the Guinness book in 1993.",
      highlights: [
        "The summit sunrise over the Naga hills",
        "The record rhododendron, in bloom around March",
        "The Dzukou valley traverse from the same ridge",
      ],
      tip: "Start at 3am from Jakhama to make sunrise. It is a steep four hours and the top is cold in any month — this is not a casual morning walk.",
    },
  },
  {
    slug: "doyang-amur-falcon",
    name: "Doyang — Amur Falcon Roost",
    district: "Wokha",
    stateId: "nagaland",
    themes: ["Wildlife"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Nov",
    bestMonths: [10, 11],
    hiddenGem: true,
    coord: { lat: 26.1, lng: 94.2 },
    guide: {
      summary:
        "The Doyang reservoir is the largest known roost of the Amur falcon on its migration from Siberia to southern Africa — around a million birds. Until 2012 the village trapped and sold them in tens of thousands; it now guards them.",
      highlights: [
        "The evening arrival, an hour of birds filling the sky",
        "Pangti, Ashaa and Sungro villages, who run the protection",
        "Satellite-tagged birds, tracked from here to Somalia",
      ],
      tip: "Stay in a Pangti homestay. The turnaround here happened because hunting stopped paying and guarding started, and the homestay money is literally that mechanism.",
    },
  },
  {
    slug: "tuophema",
    name: "Tuophema Village",
    district: "Kohima",
    stateId: "nagaland",
    themes: ["Culture", "Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.8, lng: 94.16 },
    guide: {
      summary:
        "An Angami village 41 km from Kohima that built and runs its own tourist village — traditional huts, community-owned, with the profits going into a village fund. One of India's earliest community tourism projects, started in 2001.",
      highlights: [
        "Staying in a replica Angami morung",
        "The village museum and the rice beer",
        "Sekrenyi festival in February",
      ],
      tip: "Book direct with the village council rather than through Kohima agents. The point of the project is that the money stays in Tuophema.",
    },
  },
  {
    slug: "shilloi-lake",
    name: "Shilloi Lake",
    district: "Phek",
    stateId: "nagaland",
    themes: ["Lakes", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Apr",
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    hiddenGem: true,
    guide: {
      summary:
        "A foot-shaped lake in the hills of Phek district near the Myanmar border, sacred to the Pochury, who hold that the water carries a spirit and do not fish it. Untouched, and reached on a long road.",
      highlights: [
        "The lake, undisturbed and unfished",
        "Pochury villages and their terraced fields",
        "The drive in through Meluri",
      ],
      tip: "Local custom governs what happens at the lake, including swimming. Ask in the village first rather than assuming a public lake works the way one does elsewhere.",
    },
  },

  /* ---------- Tripura ---------- */
  {
    slug: "chabimura",
    name: "Chabimura",
    district: "Gomati",
    stateId: "tripura",
    themes: ["Heritage", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.51, lng: 91.55 },
    guide: {
      summary:
        "A cliff face on the Gomati river carved with enormous images of Shiva, Vishnu, Kartikeya and Durga, dated to somewhere between the 15th and 16th centuries and reachable only by boat.",
      highlights: [
        "The Mahisasurmardini panel, the largest of the carvings",
        "The boat journey up the gorge to reach them",
        "The forest on both banks, dense and unbroken",
      ],
      tip: "The river level decides how much you can see — too high and the lower carvings are underwater, too low and the boat cannot get close. December and January are the usual window.",
    },
  },
  {
    slug: "dumboor-lake",
    name: "Dumboor Lake",
    district: "Dhalai",
    stateId: "tripura",
    themes: ["Lakes", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.52, lng: 91.8 },
    guide: {
      summary:
        "A reservoir holding forty-eight islands at the confluence of the Raima and Sarma, with migratory birds in winter and the Narikel Kunja island in the middle. The dam that made it displaced thousands of tribal families in the 1970s.",
      highlights: [
        "Boating between the islands",
        "Narikel Kunja, the coconut island",
        "Migratory waterfowl from November to February",
      ],
      tip: "The displacement is a live political issue in Tripura and the lake is beautiful and contested at the same time. Ask about it rather than photographing past it.",
    },
  },
  {
    slug: "pilak",
    name: "Pilak",
    district: "South Tripura",
    stateId: "tripura",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.2, lng: 91.65 },
    guide: {
      summary:
        "A scatter of Buddhist and Hindu sculpture across paddy fields in southern Tripura, 8th to 12th century, showing Pala and Arakanese influence together — evidence of a trade and pilgrimage route that ran between Bengal and Burma.",
      highlights: [
        "The Avalokiteshvara and Narasimha images",
        "The terracotta plaques recovered from the mounds",
        "The site museum's small but significant collection",
      ],
      tip: "Much of Pilak is still unexcavated and pieces turn up in village fields. Go with the ASI caretaker if one is present — the outlying finds are not marked in any way.",
    },
  },

  /* ---------- Sikkim ---------- */
  {
    slug: "namchi-char-dham",
    name: "Namchi & Char Dham",
    district: "Namchi",
    stateId: "sikkim",
    themes: ["Spiritual", "Hills"],
    idealDays: 1,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    coord: { lat: 27.17, lng: 88.36 },
    guide: {
      summary:
        "South Sikkim's main town, with a 108-foot Shiva statue at Solophok surrounded by replicas of the four dhams, and a 135-foot Padmasambhava on Samdruptse hill facing it across the valley.",
      highlights: [
        "The Char Dham complex at Solophok",
        "Samdruptse's Guru Rinpoche statue",
        "Temi Tea Garden, twenty minutes away",
      ],
      tip: "Namchi is an easy base for south Sikkim and much cheaper than Gangtok. Do the two statues in a morning and spend the afternoon at Temi instead of driving back north.",
    },
  },
  {
    slug: "temi-tea-garden",
    name: "Temi Tea Garden",
    district: "Namchi",
    stateId: "sikkim",
    themes: ["Nature", "Food & Drink"],
    idealDays: 1,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.27, lng: 88.42 },
    guide: {
      summary:
        "Sikkim's only tea estate, planted in 1969 on a single slope facing Kanchenjunga, and fully organic — as is the entire state, which became the first 100% organic state in the world in 2016.",
      highlights: [
        "The estate slope with Kanchenjunga behind it",
        "The factory, which takes visitors through the process",
        "Cherry blossom along the garden road in November",
      ],
      tip: "Buy at the factory and ask for the second flush. Temi is a small production that mostly goes to auction, and the estate price is the only sensible way to get it.",
    },
  },
  {
    slug: "barsey-rhododendron-sanctuary",
    name: "Barsey Rhododendron Sanctuary",
    district: "Gyalshing",
    stateId: "sikkim",
    themes: ["Nature", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Mar - May, Oct - Nov",
    bestMonths: [3, 4, 5, 10, 11],
    hiddenGem: true,
    coord: { lat: 27.2, lng: 88.13 },
    guide: {
      summary:
        "A ridge sanctuary on the Singalila range at the Nepal border, with some six hundred hectares of rhododendron forest that flowers from late March, and Kanchenjunga across the valley the whole way.",
      highlights: [
        "The rhododendron bloom, at its peak in April",
        "The 4 km walk in from Hilley to Barsey",
        "The Singalila ridge and the Nepal side of the border",
      ],
      tip: "Stay in the trekkers' hut at Barsey rather than walking back down the same day. Dawn on the ridge with the range clear is worth an uncomfortable night.",
    },
  },
  {
    slug: "rabdentse-ruins",
    name: "Rabdentse Ruins",
    district: "Gyalshing",
    stateId: "sikkim",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.3, lng: 88.25 },
    guide: {
      summary:
        "The second capital of Sikkim, from 1670 until the Nepalese destroyed it in 1814, on a spur above Pelling — the royal courtyard, throne dais and stone thrones still in place, reached through a short forest walk.",
      highlights: [
        "The three standing stones where the king and his advisors sat",
        "The Kanchenjunga view the capital was sited for",
        "Pemayangtse monastery, ten minutes away",
      ],
      tip: "Almost everyone in Pelling goes to the monastery and the skywalk and not to the ruins, which are a ten-minute walk away and empty. Go at the end of the afternoon.",
    },
  },
  {
    slug: "dzongu",
    name: "Dzongu",
    district: "Mangan",
    stateId: "sikkim",
    themes: ["Culture", "Nature"],
    idealDays: 3,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 27.5, lng: 88.55 },
    guide: {
      summary:
        "A reserve in north Sikkim set aside for the Lepcha, the state's indigenous people, where outsiders need a permit and stay in Lepcha homestays. Cardamom terraces, hot springs and the Teesta below.",
      highlights: [
        "Lepcha homestays and their food, which is unlike the rest of Sikkim",
        "Tholung monastery, a day's walk up the valley",
        "The hot springs at Lingthem and the cardamom slopes",
      ],
      tip: "The permit system exists because the Lepcha asked for it, after a long campaign against hydel dams on the Teesta. Ask your hosts about that campaign; it is the recent history of the place.",
    },
  },
  {
    slug: "goecha-la-trek",
    name: "Goecha La Trek",
    district: "Gyalshing",
    stateId: "sikkim",
    themes: ["Trekking", "Nature"],
    idealDays: 9,
    bestMonthsLabel: "Apr - May, Oct - Nov",
    bestMonths: [4, 5, 10, 11],
    coord: { lat: 27.54, lng: 88.2 },
    guide: {
      summary:
        "Nine days from Yuksom to a 4,900m pass with the southeast face of Kanchenjunga directly in front of you — the closest legal approach to the world's third-highest mountain from India, through the Kanchenjunga National Park.",
      highlights: [
        "Dzongri and the ridge at Dzongri Top",
        "Samiti Lake, and the dawn walk to View Point 1",
        "Rhododendron forest below Tshoka, in April and May",
      ],
      tip: "The pass itself has been closed to trekkers for years; View Point 1 is the turnaround and it is the better view anyway. Any operator promising the pass is either out of date or not telling the truth.",
    },
  },
  {
    slug: "aritar-lake",
    name: "Aritar & Lampokhari",
    district: "Pakyong",
    stateId: "sikkim",
    themes: ["Lakes", "Hills"],
    idealDays: 1,
    bestMonthsLabel: "Mar - May, Oct - Dec",
    bestMonths: [3, 4, 5, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.19, lng: 88.7 },
    guide: {
      summary:
        "One of Sikkim's oldest natural lakes, boat-shaped, in the east district near the old Silk Route, with a 19th-century British-era bungalow and the Lingsey and Mankhim ridges above it.",
      highlights: [
        "Boating on Lampokhari, which few Sikkim lakes allow",
        "Aritar Gumpa, an old Nyingma monastery",
        "The Zuluk Silk Route loop, which starts from here",
      ],
      tip: "Aritar is the natural first or last night of the Silk Route loop, and almost every operator instead runs it from Gangtok. Starting here halves the driving.",
    },
  },
];
