import type { Addition } from "./types";

/** Delhi, UP, Uttarakhand, Himachal, Punjab, Haryana, Rajasthan, J&K, Ladakh. */
export const northAdditions: Addition[] = [
  /* ---------- Delhi ---------- */
  {
    slug: "nizamuddin-dargah",
    name: "Hazrat Nizamuddin Dargah",
    district: "Nizamuddin",
    stateId: "delhi",
    themes: ["Spiritual", "Culture"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 28.5917, lng: 77.2425 },
    guide: {
      summary:
        "The shrine of the 14th-century Sufi saint Nizamuddin Auliya, at the centre of a dense living quarter rather than behind a ticket barrier. Amir Khusrau, who shaped the qawwali form, is buried a few metres away.",
      highlights: [
        "Thursday evening qawwali in the courtyard, sung as devotion rather than performance",
        "Amir Khusrau's tomb and the marble screens of the main chamber",
        "The lanes outside: bakeries, itr sellers and Nihari houses that open after prayers",
      ],
      tip: "Go on a Thursday around sunset and sit at the back on the floor. The front rows fill with regulars who know the verses; the back is where you can actually hear the whole thing.",
    },
  },
  {
    slug: "mehrauli-archaeological-park",
    name: "Mehrauli Archaeological Park",
    district: "Mehrauli",
    stateId: "delhi",
    themes: ["Heritage", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 28.5203, lng: 77.183 },
    guide: {
      summary:
        "Two hundred acres of ruins spanning a thousand years of Delhi, immediately next to the Qutub Minar and almost entirely ignored by the crowds queuing for it. Tombs, stepwells and a summer palace sit in scrub forest with no ropes and no queues.",
      highlights: [
        "Rajon ki Baoli, a three-storey stepwell you can walk down into",
        "Jamali Kamali mosque and its painted tomb chamber",
        "Balban's tomb, where the true arch first appears in India",
      ],
      tip: "Enter from the Qutub end and walk away from it. Within two minutes the noise stops completely — most visitors never learn the park is there.",
    },
  },
  {
    slug: "sunder-nursery",
    name: "Sunder Nursery",
    district: "Nizamuddin",
    stateId: "delhi",
    themes: ["Heritage", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 28.5933, lng: 77.25 },
    guide: {
      summary:
        "A 90-acre Mughal-era garden restored over a decade and reopened in 2018, sharing a wall with Humayun's Tomb. Six 16th-century monuments stand in formal water gardens, with a working plant nursery and a bird-rich micro-forest at the far end.",
      highlights: [
        "Sunder Burj and Lakkarwala Burj, restored tile by tile",
        "The central axis of pools, best in the first hour of light",
        "The bonsai house and the butterfly-friendly wilderness zone",
      ],
      tip: "Buy the combined ticket with Humayun's Tomb and do the nursery first, early. By the time the tomb fills up you will already have had the quieter and, for a lot of people, better half.",
    },
  },
  {
    slug: "agrasen-ki-baoli",
    name: "Agrasen ki Baoli",
    district: "Connaught Place",
    stateId: "delhi",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 28.6265, lng: 77.2246 },
    guide: {
      summary:
        "A 60-metre stepwell of 108 stone steps dropping into the ground between office towers off Connaught Place. Nobody is sure who built it; the current masonry is 14th or 15th century, on something older.",
      highlights: [
        "The descent itself — the city noise cuts out about a third of the way down",
        "Arched niches on the flanking walls, each a different depth of shade",
        "The small mosque on the western wall above the well",
      ],
      tip: "Come on a weekday morning. It is free, it takes twenty minutes, and it is the single best thing you can do with a gap between meetings in central Delhi.",
    },
  },
  {
    slug: "lodhi-garden",
    name: "Lodhi Garden",
    district: "Lodhi Road",
    stateId: "delhi",
    themes: ["Heritage", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 28.5933, lng: 77.2197 },
    guide: {
      summary:
        "Ninety acres of park built around the 15th-century tombs of the Sayyid and Lodhi sultans, and the place Delhi actually uses — walkers at dawn, families at dusk, and octagonal tombs in between.",
      highlights: [
        "Bara Gumbad and its mosque, with the ceiling plasterwork still intact",
        "Sheesh Gumbad, named for the blue tiles that once covered it",
        "Athpula, the 16th-century bridge at the northeast corner",
      ],
      tip: "Come at 6.30am with the walkers rather than at sunset with the photographers. The tombs are empty, the light is better, and you will see more parakeets than people.",
    },
  },

  /* ---------- Uttar Pradesh ---------- */
  {
    slug: "kushinagar",
    name: "Kushinagar",
    district: "Kushinagar",
    stateId: "uttar-pradesh",
    themes: ["Spiritual", "Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 26.7406, lng: 83.888 },
    guide: {
      summary:
        "Where the Buddha died and was cremated, and the last of the four great pilgrimage sites. A 6-metre reclining Buddha of the 5th century lies in the Mahaparinirvana Temple; the Ramabhar Stupa a kilometre away marks the cremation ground.",
      highlights: [
        "The reclining Buddha, whose expression reads differently from head, middle and foot",
        "Ramabhar Stupa, a bare brick mound circled by monks at dusk",
        "The Burmese, Thai, Japanese and Tibetan temples built by each tradition",
      ],
      tip: "Time it for the robe-changing of the reclining Buddha, or simply walk the Ramabhar Stupa at last light — there are no guides, no shops and usually nobody at all.",
    },
  },
  {
    slug: "sravasti",
    name: "Sravasti",
    district: "Shravasti",
    stateId: "uttar-pradesh",
    themes: ["Spiritual", "Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.5167, lng: 82.05 },
    guide: {
      summary:
        "The city where the Buddha spent twenty-four rainy seasons, more than anywhere else. The Jetavana monastery grounds hold the brick footprint of his hut and the Anandabodhi tree grown from a cutting of the Bodh Gaya original.",
      highlights: [
        "Gandhakuti, the raised platform where he actually lived",
        "The Anandabodhi tree, still the focus of the site",
        "Saheth and Maheth mounds — monastery and city, a kilometre apart",
      ],
      tip: "Most Buddhist circuit coaches give Sravasti ninety minutes. Stay the night instead: the grounds at dawn, before the tour buses arrive from Lucknow, are the whole point of coming.",
    },
  },
  {
    slug: "kalinjar-fort",
    name: "Kalinjar Fort",
    district: "Banda",
    stateId: "uttar-pradesh",
    themes: ["Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.0, lng: 80.4833 },
    guide: {
      summary:
        "A Chandela hill fort on the last spur of the Vindhyas, besieged by everyone from Mahmud of Ghazni to Sher Shah Suri — who died here when a rocket exploded against its wall. Almost nobody visits.",
      highlights: [
        "Seven gates climbing the scarp, each a different dynasty's work",
        "Neelkanth Temple, cut into the rock with a huge carved Shiva panel",
        "Rock-cut water tanks that still hold water through the dry season",
      ],
      tip: "Pair it with Khajuraho, 100 km south — same Chandela builders, opposite experience. One has the crowds, the other has a caretaker who may open things for you.",
    },
  },
  {
    slug: "bateshwar-temples",
    name: "Bateshwar Temples",
    district: "Agra",
    stateId: "uttar-pradesh",
    themes: ["Spiritual", "Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.9333, lng: 78.5333 },
    guide: {
      summary:
        "A chain of some hundred Shiva temples along a bend of the Yamuna, 70 km from the Taj and visited by a fraction of one per cent of the people who see it. In October and November a huge cattle fair takes over the riverbank.",
      highlights: [
        "The unbroken line of shikharas seen from the river side at sunrise",
        "The ghats, in daily use rather than restored for visitors",
        "The animal fair, if you are here in the Kartik month",
      ],
      tip: "Do it as a half-day from Agra in the other direction from Fatehpur Sikri. You will have the entire riverfront to yourself on any ordinary morning.",
    },
  },
  {
    slug: "deogarh-dashavatara-temple",
    name: "Deogarh Dashavatara Temple",
    district: "Lalitpur",
    stateId: "uttar-pradesh",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 24.526, lng: 78.24 },
    guide: {
      summary:
        "One of the earliest stone temples in India, built around 500 CE, and the point where the north Indian temple form starts. The Gupta relief of Vishnu asleep on the serpent Shesha on its south wall is in every art-history textbook and in front of almost no one.",
      highlights: [
        "The Anantasayana panel — the single most reproduced Gupta sculpture",
        "Nara-Narayana and Gajendramoksha reliefs on the other two walls",
        "Jain temples and rock carvings above the Betwa gorge nearby",
      ],
      tip: "It is a detour off the Jhansi–Lalitpur road and needs a car. Go in the afternoon: the famous panel faces south and only reads properly in angled light.",
    },
  },
  {
    slug: "chunar-fort",
    name: "Chunar Fort",
    district: "Mirzapur",
    stateId: "uttar-pradesh",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.1264, lng: 82.88 },
    guide: {
      summary:
        "A fort on a rock where the Ganga swings hard against the Vindhyas, held in turn by Sher Shah Suri, the Mughals and the East India Company. Forty kilometres from Varanasi and nothing like it.",
      highlights: [
        "The river bastion, straight down to the Ganga",
        "Sonwa Mandap and the well the local legends attach to",
        "The British cemetery outside the walls",
      ],
      tip: "Take the train from Varanasi rather than the road — it crosses the river right below the fort, which is the view the fort was built to command.",
    },
  },
  {
    slug: "gorakhnath-math",
    name: "Gorakhnath Math, Gorakhpur",
    district: "Gorakhpur",
    stateId: "uttar-pradesh",
    themes: ["Spiritual"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 26.7606, lng: 83.3732 },
    guide: {
      summary:
        "The head monastery of the Nath yogis, the order that gave hatha yoga its written form. The complex is large, busy and entirely un-touristed, and the city takes its name from it.",
      highlights: [
        "The main shrine and the perpetual dhuni fire",
        "The annual Khichdi Mela around Makar Sankranti in January",
        "The free kitchen, which feeds thousands daily",
      ],
      tip: "This is a working monastery, not a monument. Come for the evening aarti, keep your camera down, and it will be one of the more memorable hours of a trip through eastern UP.",
    },
  },
  {
    slug: "barsana-nandgaon",
    name: "Barsana & Nandgaon",
    district: "Mathura",
    stateId: "uttar-pradesh",
    themes: ["Spiritual", "Culture"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.645, lng: 77.38 },
    guide: {
      summary:
        "Radha's village and Krishna's, on facing hills in the Braj countryside. Ordinary for most of the year and extraordinary for a week before Holi, when the women of Barsana drive the men of Nandgaon out of town with staves in the Lathmar Holi.",
      highlights: [
        "Shriji Temple on Barsana hill, up a long flight of steps",
        "Nandgaon's Nand Bhavan across the fields",
        "Samaj gayan — the call-and-response devotional singing of Braj",
      ],
      tip: "If you come for Lathmar Holi, come for the day before as well. The singing contests in the temple courtyards are the part locals rate, and no film crew covers them.",
    },
  },

  /* ---------- Uttarakhand ---------- */
  {
    slug: "hemkund-sahib",
    name: "Hemkund Sahib",
    district: "Chamoli",
    stateId: "uttarakhand",
    themes: ["Spiritual", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Jun - Oct",
    bestMonths: [6, 7, 8, 9, 10],
    coord: { lat: 30.7053, lng: 79.61 },
    guide: {
      summary:
        "A gurdwara at 4,630m beside a glacial lake ringed by seven peaks, reached by a 6 km climb from Ghangaria. The tenth Sikh Guru is said to have meditated here in a previous life; the shrine is open only when the snow clears.",
      highlights: [
        "The lake itself, and the pilgrims who bathe in it at altitude",
        "The shared langar at the top, at nearly 4,600m",
        "The same trailhead serves the Valley of Flowers — a different day, a different world",
      ],
      tip: "Sleep at Ghangaria and start at first light. The weather closes in most afternoons, and the descent in rain on wet stone is where people actually get hurt.",
    },
  },
  {
    slug: "munsiyari",
    name: "Munsiyari",
    district: "Pithoragarh",
    stateId: "uttarakhand",
    themes: ["Hills", "Trekking"],
    idealDays: 3,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 30.0668, lng: 80.238 },
    guide: {
      summary:
        "A ridge town facing the five peaks of Panchachuli across a valley, at the far eastern end of Kumaon on the old salt road to Tibet. The drive in is long enough that the crowds that fill Nainital never arrive.",
      highlights: [
        "Panchachuli at sunrise, from anywhere in town",
        "Khaliya Top, a short acclimatising trek with a full Himalayan skyline",
        "Darkot village and its Shauka weaving",
      ],
      tip: "Two days minimum, because the mountains hide for hours at a time. People who come for one night and see cloud leave thinking Munsiyari is overrated; it just did not show up that afternoon.",
    },
  },
  {
    slug: "binsar-wildlife-sanctuary",
    name: "Binsar Wildlife Sanctuary",
    district: "Almora",
    stateId: "uttarakhand",
    themes: ["Nature", "Hills"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 29.7, lng: 79.7667 },
    guide: {
      summary:
        "Oak and rhododendron forest on a ridge above Almora, protected since 1988, with a 300 km sweep of the Himalaya from Zero Point. The old summer capital of the Chand kings; now mostly leopards, barking deer and silence.",
      highlights: [
        "Zero Point at dawn — Kedarnath to Nanda Devi to Panchachuli in one arc",
        "The forest trails, walkable without a guide",
        "Bineshwar Mahadev temple, 16th century, inside the sanctuary",
      ],
      tip: "Stay inside the sanctuary gate rather than in Almora. Vehicles stop at dusk, the generators go off, and the night sky is the reason to have made the effort.",
    },
  },
  {
    slug: "lansdowne",
    name: "Lansdowne",
    district: "Pauri Garhwal",
    stateId: "uttarakhand",
    themes: ["Hills", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 29.8377, lng: 78.68 },
    guide: {
      summary:
        "A cantonment town of the Garhwal Rifles, built in 1887 and still run by the army, which is exactly why it has no traffic, no hoardings and no hotel sprawl. Pine forest, a church, a regimental museum and very little else.",
      highlights: [
        "Tip-n-Top viewpoint for the Garhwal range at first light",
        "The Garhwal Rifles Regimental Museum",
        "St Mary's Church, 1896, above the parade ground",
      ],
      tip: "It is the closest genuine hill station to Delhi that is not Mussoorie, and it is quiet because nothing is allowed to be built. Bring a book; that is the point of the place.",
    },
  },
  {
    slug: "rajaji-national-park",
    name: "Rajaji National Park",
    district: "Haridwar",
    stateId: "uttarakhand",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Nov - Jun",
    bestMonths: [1, 2, 3, 4, 5, 6, 11, 12],
    coord: { lat: 30.03, lng: 78.2 },
    guide: {
      summary:
        "Eight hundred square kilometres of sal forest and riverbed where the Shivaliks meet the Gangetic plain, holding the northwestern-most population of Asian elephants. Half an hour from Haridwar and a fraction of Corbett's traffic.",
      highlights: [
        "Chilla range for elephant herds along the Ganga canal",
        "Motichur and the corridor that links the park to Corbett",
        "Over 400 bird species, including the great hornbill at the eastern end",
      ],
      tip: "Book Chilla, not the Haridwar-side gates, and take the first safari of the day. Rajaji is an elephant park before it is a tiger park — go expecting the right animal.",
    },
  },
  {
    slug: "har-ki-dun",
    name: "Har Ki Dun",
    district: "Uttarkashi",
    stateId: "uttarakhand",
    themes: ["Trekking", "Nature"],
    idealDays: 6,
    bestMonthsLabel: "Apr - Jun, Sep - Nov",
    bestMonths: [4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 31.07, lng: 78.46 },
    guide: {
      summary:
        "A cradle-shaped valley below Swargarohini, reached through villages in the Tons valley that kept their own architecture, deities and calendar long after the rest of Garhwal changed. Six days round trip from Sankri.",
      highlights: [
        "Osla and Gangad villages, with their carved wooden temples",
        "The valley floor below Swargarohini and Bandarpoonch",
        "Jaundhar Glacier as a day extension from the camp",
      ],
      tip: "Take the Osla route rather than the newer road-shortened one. The villages are the trek — the meadow at the end is what the photographs show, but not what people remember.",
    },
  },
  {
    slug: "tehri-lake",
    name: "Tehri Lake",
    district: "Tehri Garhwal",
    stateId: "uttarakhand",
    themes: ["Lakes", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 30.38, lng: 78.48 },
    guide: {
      summary:
        "A 42 sq km reservoir held back by Asia's tallest dam, filling the valley where the old town of Tehri stood until 2005. It is beautiful, and it drowned a town — both are true, and the second is rarely mentioned.",
      highlights: [
        "Kayaking and sailing from the Koti Colony jetty",
        "The drive along the rim from Chamba to Dobra-Chanti bridge",
        "New Tehri, the planned town built on the ridge above the water",
      ],
      tip: "Ask an older boatman where the old town was. The submergence displaced around a hundred thousand people, and hearing that on the water changes how the view lands.",
    },
  },
  {
    slug: "chaukori",
    name: "Chaukori",
    district: "Pithoragarh",
    stateId: "uttarakhand",
    themes: ["Hills"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 29.86, lng: 80.03 },
    guide: {
      summary:
        "Tea slopes on a ridge with an uninterrupted line of Nanda Devi, Nanda Kot and Panchachuli across the valley, and a total of about one street. Kumaon's quietest viewpoint, largely because there is nothing to do but look.",
      highlights: [
        "The sunrise line along the whole eastern Himalaya",
        "The colonial-era tea estate, still producing in small quantity",
        "Patal Bhuvaneshwar cave temple, an hour away",
      ],
      tip: "Break the Almora–Munsiyari drive here for a night rather than pushing through. It is the difference between a long day in a car and a trip through Kumaon.",
    },
  },

  /* ---------- Himachal Pradesh ---------- */
  {
    slug: "kasauli",
    name: "Kasauli",
    district: "Solan",
    stateId: "himachal-pradesh",
    themes: ["Hills"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    coord: { lat: 30.9, lng: 76.965 },
    guide: {
      summary:
        "A cantonment of cobbled lanes and chestnut trees an hour above Chandigarh, kept small because the army owns most of it. Kipling territory, and still the easiest hill escape from the plains that has not been ruined.",
      highlights: [
        "The Upper and Lower Mall circuit, walkable end to end in an hour",
        "Monkey Point, inside the air force station — carry ID",
        "Christ Church, 1853, and the Gilbert Trail through the pines",
      ],
      tip: "Come midweek. Kasauli is close enough to Chandigarh and Delhi that weekends undo everything that makes it worth the drive.",
    },
  },
  {
    slug: "narkanda",
    name: "Narkanda",
    district: "Shimla",
    stateId: "himachal-pradesh",
    themes: ["Hills", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Dec",
    bestMonths: [3, 4, 5, 6, 9, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 31.2545, lng: 77.455 },
    guide: {
      summary:
        "An apple town at 2,700m on the Hindustan–Tibet road, an hour and a half past Shimla and a world quieter. Hatu Peak above it carries a temple of dark deodar timber and a 270-degree view of the Greater Himalaya.",
      highlights: [
        "The Hatu Peak road and the Hatu Mata temple at the top",
        "Apple orchards through the September harvest",
        "A short ski season in January and February, on the slopes above town",
      ],
      tip: "Drive on past Shimla instead of stopping in it. The same road, ninety more minutes, and you swap the Mall Road crush for an orchard ridge at twice the altitude.",
    },
  },
  {
    slug: "jalori-pass-shoja",
    name: "Jalori Pass & Shoja",
    district: "Kullu",
    stateId: "himachal-pradesh",
    themes: ["Hills", "Trekking"],
    idealDays: 3,
    bestMonthsLabel: "Apr - Jun, Sep - Nov",
    bestMonths: [4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 31.5333, lng: 77.3667 },
    guide: {
      summary:
        "A 3,100m pass on the old Kullu–Shimla road, with the hamlet of Shoja on its forested side. Serolsar Lake is an easy 5 km walk from the top through some of the oldest oak forest left in Himachal.",
      highlights: [
        "Serolsar Lake and the Budhi Nagin temple beside it",
        "Raghupur Fort ridge, the other short walk from the pass",
        "The Great Himalayan National Park buffer, an hour down the valley",
      ],
      tip: "The pass closes with snow, usually January to March. Come in October: the oaks turn, the Tirthan valley below is empty after the season, and both walks are doable in one day.",
    },
  },
  {
    slug: "rewalsar-lake",
    name: "Rewalsar Lake",
    district: "Mandi",
    stateId: "himachal-pradesh",
    themes: ["Lakes", "Spiritual"],
    idealDays: 1,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 31.6333, lng: 76.8333 },
    guide: {
      summary:
        "A small square lake sacred to Hindus, Sikhs and Tibetan Buddhists at once — Padmasambhava is said to have left from here for Tibet, and a 37-metre statue of him stands on the hill above. Three traditions, one shoreline, no crowds.",
      highlights: [
        "The Padmasambhava statue and the Zigar and Drikung Kagyu gompas",
        "The Guru Gobind Singh gurdwara on the lake's edge",
        "Naina Devi temple and the caves a short climb above",
      ],
      tip: "An hour from Mandi, and almost every itinerary drives past it on the way to Manali. Stop for a night — the circumambulation of the lake at dusk, with three sets of prayers going at once, is not something you will see elsewhere.",
    },
  },
  {
    slug: "barot-valley",
    name: "Barot Valley",
    district: "Mandi",
    stateId: "himachal-pradesh",
    themes: ["Nature", "Hills"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    hiddenGem: true,
    coord: { lat: 32.0333, lng: 76.8333 },
    guide: {
      summary:
        "A trout valley on the Uhl river reached by a narrow road off the Mandi–Jogindernagar highway, with a 1920s haulage trolley still climbing the hillside to the hydro works above. Almost no hotels and almost no one.",
      highlights: [
        "The Shanan hydel haulage trolley, running since 1925",
        "Trout hatchery and the river below it",
        "Nargu Wildlife Sanctuary on the far bank",
      ],
      tip: "The last 30 km take as long as the first hundred. That road is the only reason Barot is still like this, so do not begrudge it.",
    },
  },
  {
    slug: "pin-valley-national-park",
    name: "Pin Valley National Park",
    district: "Lahaul & Spiti",
    stateId: "himachal-pradesh",
    themes: ["Wildlife", "Trekking"],
    idealDays: 3,
    bestMonthsLabel: "Jun - Sep",
    bestMonths: [6, 7, 8, 9],
    hiddenGem: true,
    coord: { lat: 31.95, lng: 78.05 },
    guide: {
      summary:
        "Cold desert above 3,500m branching south off Spiti, protected as snow leopard habitat and home to ibex, blue sheep and the Nyingma monastery at Kungri. The colours in the rock here are unlike anywhere else in the Himalaya.",
      highlights: [
        "Kungri Monastery, the oldest in Spiti, and its devil dances",
        "Mudh village at the road head, and the Pin–Parvati trailhead beyond",
        "Ibex on the scree in the early morning",
      ],
      tip: "Snow leopard sightings are a February–March proposition with a local tracker, not a summer one. Come in summer for the valley; come in deep winter, properly equipped, for the cat.",
    },
  },
  {
    slug: "manikaran",
    name: "Manikaran",
    district: "Kullu",
    stateId: "himachal-pradesh",
    themes: ["Spiritual", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    coord: { lat: 32.027, lng: 77.345 },
    guide: {
      summary:
        "Hot springs on the Parvati river hot enough to cook rice in, with a Sikh gurdwara and a Shiva temple sharing the same steam. The langar here is cooked in the spring water itself.",
      highlights: [
        "The gurdwara's hot-spring kitchen and the free meal from it",
        "Sulphur baths, separate for men and women",
        "The riverside walk upstream towards Kasol",
      ],
      tip: "Stay in the gurdwara's guest rooms rather than in Kasol. It costs almost nothing, the 4am prayers are extraordinary, and you are two hours' walk from the valley's quieter side.",
    },
  },
  {
    slug: "palampur",
    name: "Palampur",
    district: "Kangra",
    stateId: "himachal-pradesh",
    themes: ["Hills", "Nature", "Food & Drink"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Nov",
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    coord: { lat: 32.11, lng: 76.536 },
    guide: {
      summary:
        "Tea gardens running right up to the base of the Dhauladhar, planted by the British in the 1850s and still producing a light Kangra green. The mountains stand closer here than at any other tea town in India.",
      highlights: [
        "Working tea estates and the co-operative factory tour",
        "Neugal Khad, the gorge with the Dhauladhar behind it",
        "Andretta, the artists' colony with Sobha Singh's gallery and a pottery",
      ],
      tip: "Buy Kangra tea at the factory, not on the road. It is a small, delicate green tea that the market undervalues, and the estate price is a fraction of what Delhi charges.",
    },
  },
  {
    slug: "kufri",
    name: "Kufri",
    district: "Shimla",
    stateId: "himachal-pradesh",
    themes: ["Hills"],
    idealDays: 0.5,
    bestMonthsLabel: "Mar - Jun, Sep - Jan",
    bestMonths: [1, 3, 4, 5, 6, 9, 10, 11, 12],
    coord: { lat: 31.097, lng: 77.265 },
    guide: {
      summary:
        "A ridge 16 km from Shimla at 2,600m, with the Himalayan Nature Park and a short winter snow season. It is the closest snow to Shimla, which is both its appeal and its problem.",
      highlights: [
        "Himalayan Nature Park, with monal, musk deer and snow leopard enclosures",
        "Mahasu Peak, on foot rather than on a pony",
        "Fagu and the apple slopes just past it, much quieter",
      ],
      tip: "Walk up to Mahasu Peak instead of taking a pony ride. The horse trail in season is churned mud and animal welfare here is a fair question to ask before you get on one.",
    },
  },

  /* ---------- Punjab ---------- */
  {
    slug: "sultanpur-lodhi",
    name: "Sultanpur Lodhi",
    district: "Kapurthala",
    stateId: "punjab",
    themes: ["Spiritual", "Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 31.2167, lng: 75.2 },
    guide: {
      summary:
        "The town where Guru Nanak lived for fourteen years and where, after disappearing into the Kali Bein river for three days, he began the teaching that became Sikhism. Rebuilt heavily for the 550th anniversary in 2019.",
      highlights: [
        "Gurdwara Ber Sahib, on the bank of the Bein",
        "The restored Kali Bein rivulet, cleaned by a decades-long volunteer effort",
        "Gurdwara Hatt Sahib, the storehouse where Nanak worked",
      ],
      tip: "Pair it with Amritsar rather than treating it as a stop on the way. The Bein restoration is one of the more remarkable civic stories in Punjab and worth asking about.",
    },
  },
  {
    slug: "pul-kanjari",
    name: "Pul Kanjari",
    district: "Amritsar",
    stateId: "punjab",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 31.6, lng: 74.5833 },
    guide: {
      summary:
        "A small walled complex Maharaja Ranjit Singh built beside a canal on the road to Lahore — a baradari, a bathing tank, a temple, a mosque and a gurdwara in one compound. It was a battlefield in 1971 and still carries the marks.",
      highlights: [
        "The Sikh-era baoli and bathing tank",
        "Temple, mosque and gurdwara sharing one small enclosure",
        "The 1971 war memorial on the site",
      ],
      tip: "It is on the way to the Wagah ceremony and takes twenty minutes. Going here first turns the border show from a spectacle into something with a history attached.",
    },
  },
  {
    slug: "kila-raipur-rural-olympics",
    name: "Kila Raipur Rural Olympics",
    district: "Ludhiana",
    stateId: "punjab",
    themes: ["Culture"],
    idealDays: 1,
    bestMonthsLabel: "Feb",
    bestMonths: [2],
    hiddenGem: true,
    guide: {
      summary:
        "A village sports meet running since 1933, where bullock-cart races, tractor stunts and tug-of-war share a ground with athletics, and the whole of rural Ludhiana turns up. Three days, usually in early February.",
      highlights: [
        "Bullock-cart racing, the event the meet is known for",
        "Kabaddi and tug-of-war between village teams",
        "The crowd — this is a Punjabi village fair before it is a sports event",
      ],
      tip: "Dates move year to year and are announced locally. Check with the organisers before booking anything; there is no national calendar that carries it reliably.",
    },
  },

  /* ---------- Haryana ---------- */
  {
    slug: "panipat-battlefields",
    name: "Panipat Battlefields & Museum",
    district: "Panipat",
    stateId: "haryana",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 29.3909, lng: 76.9635 },
    guide: {
      summary:
        "Three battles decided who ruled north India — 1526, 1556 and 1761 — and all of them were fought on this plain. The museum and Kabuli Bagh mosque are what is left to see of it.",
      highlights: [
        "Panipat Museum's battle galleries and terrain models",
        "Kabuli Bagh mosque, built by Babur after the first battle",
        "The tomb of Bu Ali Shah Qalandar in the old town",
      ],
      tip: "Read the 1761 account before you come. The third battle is the one that broke the Maratha empire and reshaped the subcontinent, and the site tells it far better if you already know the shape of it.",
    },
  },
  {
    slug: "bhindawas-bird-sanctuary",
    name: "Bhindawas Bird Sanctuary",
    district: "Jhajjar",
    stateId: "haryana",
    themes: ["Wildlife", "Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Nov - Mar",
    bestMonths: [1, 2, 3, 11, 12],
    hiddenGem: true,
    coord: { lat: 28.5333, lng: 76.5333 },
    guide: {
      summary:
        "A man-made wetland on the Jawahar Lal Nehru canal, declared a Ramsar site in 2021, holding more than 250 bird species in winter. Ninety minutes from Gurugram and visited by almost nobody who is not carrying a lens.",
      highlights: [
        "Greater flamingo, bar-headed goose and painted stork in December and January",
        "The 12 km bund walk around the lake",
        "Sultanpur, the better-known sister site, 50 km away",
      ],
      tip: "Do Bhindawas and Sultanpur on the same winter day, Bhindawas first at dawn. Sultanpur has the facilities; Bhindawas has the birds and the quiet.",
    },
  },
  {
    slug: "farrukhnagar-sheesh-mahal",
    name: "Farrukhnagar & Sheesh Mahal",
    district: "Gurugram",
    stateId: "haryana",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 28.445, lng: 76.82 },
    guide: {
      summary:
        "A walled town founded in 1732 by a Mughal governor, once rich on salt, with an octagonal Sheesh Mahal, a grand baoli and five surviving gates. Forty kilometres from Gurugram's towers and a couple of centuries away.",
      highlights: [
        "Sheesh Mahal, the governor's octagonal palace",
        "Ghaus Ali Shah ki Baoli, a deep octagonal stepwell",
        "Delhi Gate and the remains of the town wall",
      ],
      tip: "Half a day by car from Delhi, and empty on a weekday. Go with someone who can read Persian inscriptions if you can — there is no signage worth the name.",
    },
  },

  /* ---------- Rajasthan ---------- */
  {
    slug: "shekhawati-mandawa-nawalgarh",
    name: "Shekhawati — Mandawa & Nawalgarh",
    district: "Jhunjhunu",
    stateId: "rajasthan",
    themes: ["Heritage", "Culture"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 28.0553, lng: 75.145 },
    guide: {
      summary:
        "The largest open-air gallery of painted architecture anywhere: several hundred merchant havelis across a dozen small towns, their walls covered inside and out in frescoes from the 1830s to the 1930s. Marwari trading families built them, then left for Bombay and Calcutta.",
      highlights: [
        "Podar and Morarka havelis in Nawalgarh, properly restored",
        "The painted lanes of Mandawa and Fatehpur",
        "Dundlod and Mukundgarh, where the decay is unretouched",
      ],
      tip: "Hire a bicycle in Nawalgarh. The havelis are scattered through residential lanes no car can use, and half of them are still lived in — knocking politely gets you further than a ticket does.",
    },
  },
  {
    slug: "alwar-bala-quila",
    name: "Alwar & Bala Quila",
    district: "Alwar",
    stateId: "rajasthan",
    themes: ["Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 27.553, lng: 76.6346 },
    guide: {
      summary:
        "A hill fort with 5 km of wall above a city palace, a cenotaph on a water tank and one of India's better small museums. The natural stop between Delhi and Jaipur that everyone drives past.",
      highlights: [
        "Bala Quila, reached by a steep 8 km track above the city",
        "Moosi Maharani ki Chhatri on the palace tank",
        "The government museum's manuscript and miniature collection",
      ],
      tip: "Sariska is 35 km away. Do the fort in the afternoon and the park at dawn the next morning — most people do only one and drive four hours for it.",
    },
  },
  {
    slug: "bhangarh-fort",
    name: "Bhangarh Fort",
    district: "Alwar",
    stateId: "rajasthan",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.096, lng: 76.289 },
    guide: {
      summary:
        "A complete abandoned 17th-century town at the foot of the Aravallis — bazaar street, temples, havelis and palace, laid out on a grid and emptied. It is famous now for a ghost story, which rather buries the fact that it is a remarkable piece of urban archaeology.",
      highlights: [
        "The main bazaar street, with shop fronts still legible",
        "Somewhere between five and seven temples, the Gopinath the finest",
        "The palace at the back of the site, against the hill",
      ],
      tip: "The gates close at sunset and staying after dark is genuinely prohibited. Come at opening instead: you get the same site with morning light and without the weekend ghost-hunting crowd.",
    },
  },
  {
    slug: "osian",
    name: "Osian",
    district: "Jodhpur",
    stateId: "rajasthan",
    themes: ["Heritage", "Desert"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 26.7167, lng: 72.9167 },
    guide: {
      summary:
        "A cluster of 8th- to 12th-century Hindu and Jain temples in the Thar, 65 km from Jodhpur — the oldest surviving temple group in the region, and the closest thing Rajasthan has to Khajuraho without the queues.",
      highlights: [
        "Mahavira Jain temple, in continuous worship since the 8th century",
        "Sachiya Mata temple on the hill above the town",
        "The Surya and Harihara temple ruins on the approach",
      ],
      tip: "It is also a far better desert-camp base than Sam. Same dunes, actual temples, and a fraction of the camel-safari traffic that Jaisalmer's dunes now carry.",
    },
  },
  {
    slug: "jawai-leopard-hills",
    name: "Jawai Leopard Hills",
    district: "Pali",
    stateId: "rajasthan",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.1, lng: 73.15 },
    guide: {
      summary:
        "Granite outcrops around the Jawai dam where around fifty leopards live alongside Rabari herders and their livestock, with no fence and, remarkably, almost no conflict. One of the strongest co-existence stories in India.",
      highlights: [
        "Leopards on the rocks at dawn and dusk, often in the open",
        "Rabari shepherd settlements and their view of the cats",
        "Flamingos and crocodiles on the Jawai reservoir",
      ],
      tip: "Ask your guide to explain why the herders tolerate the leopards. The answer involves a temple, a long memory and a compensation arrangement, and it is more interesting than the sighting.",
    },
  },
  {
    slug: "tal-chhapar-blackbuck",
    name: "Tal Chhapar Blackbuck Sanctuary",
    district: "Churu",
    stateId: "rajasthan",
    themes: ["Wildlife"],
    idealDays: 1,
    bestMonthsLabel: "Sep - Mar",
    bestMonths: [1, 2, 3, 9, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.8167, lng: 74.4333 },
    guide: {
      summary:
        "A flat grassland island in the Thar holding several thousand blackbuck, plus harriers, eagles and, in some winters, the demoiselle cranes. Open country, so the animals are visible in a way forest parks never allow.",
      highlights: [
        "Blackbuck herds at close range across open grass",
        "One of India's best raptor roosts in winter",
        "Gaushala at Chhapar and the Bishnoi villages around",
      ],
      tip: "Come in the last week of monsoon, September, when the grass is green and the males are black. By March the grass is gone and so is half the reason to be there.",
    },
  },
  {
    slug: "deeg-palace",
    name: "Deeg Palace",
    district: "Bharatpur",
    stateId: "rajasthan",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 27.47, lng: 77.32 },
    guide: {
      summary:
        "The Jat rulers of Bharatpur built a water palace here in the 1760s with two thousand fountains fed by gravity from rooftop tanks, and a swing hall designed so the monsoon could be heard as music. Thirty kilometres from Bharatpur and almost entirely empty.",
      highlights: [
        "Gopal Bhavan between two tanks, with its original furniture",
        "Keshav Bhavan, the monsoon pavilion with its rain-mimicking channels",
        "The marble swing looted from the Mughals at Delhi",
      ],
      tip: "The fountains run on two days a year, around Holi and the Jal Mahotsav. If those dates fall in your trip, reorganise around them — very few people have seen the system work.",
    },
  },
  {
    slug: "dungarpur-juna-mahal",
    name: "Dungarpur & Juna Mahal",
    district: "Dungarpur",
    stateId: "rajasthan",
    themes: ["Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.843, lng: 73.714 },
    guide: {
      summary:
        "A 13th-century seven-storey palace in southern Rajasthan whose interiors are covered floor to ceiling in murals, mirror work and glass inlay — small rooms, extremely dense decoration, and hardly any visitors at all.",
      highlights: [
        "The painted chambers of Juna Mahal, especially the top floors",
        "Udai Bilas Palace on Gaib Sagar lake",
        "The Vijay Rajrajeshwar temple on the water's edge",
      ],
      tip: "Keys to Juna Mahal are held at Udai Bilas and you need to ask there first. Do that on arrival, not at four in the afternoon when the light in the upper rooms has gone.",
    },
  },

  /* ---------- Jammu & Kashmir ---------- */
  {
    slug: "gurez-valley",
    name: "Gurez Valley",
    district: "Bandipora",
    stateId: "jammu-kashmir",
    themes: ["Hills", "Nature", "Culture"],
    idealDays: 3,
    bestMonthsLabel: "May - Oct",
    bestMonths: [5, 6, 7, 8, 9, 10],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 34.6333, lng: 74.8333 },
    guide: {
      summary:
        "A Dard-Shina valley on the Kishanganga, north of the Razdan Pass and a few kilometres from the Line of Control. Log houses, a river the colour of glacier melt, and the Habba Khatoon peak standing over all of it.",
      highlights: [
        "Dawar village and the wooden Dardic architecture",
        "Habba Khatoon peak and the river meadows below it",
        "Tulail valley, further up and quieter still",
      ],
      tip: "Carry ID and expect checkposts; the road over Razdan closes with snow from about November to April. Go in September, when the road is open, the crowds are gone and the poplars turn.",
    },
  },
  {
    slug: "aru-betaab-valley",
    name: "Aru & Betaab Valley",
    district: "Anantnag",
    stateId: "jammu-kashmir",
    themes: ["Nature", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Apr - Oct",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    coord: { lat: 34.08, lng: 75.26 },
    guide: {
      summary:
        "Two meadow valleys above Pahalgam on the Lidder. Betaab is the one the cars reach; Aru, 12 km further, is the trailhead for Kolahoi Glacier and the Tarsar–Marsar lakes, and is where the valley stops performing.",
      highlights: [
        "Aru village and the meadow above it",
        "The Lidder river walk between the two valleys",
        "Trailheads for Kolahoi and Tarsar Marsar",
      ],
      tip: "Stay a night at Aru rather than day-tripping from Pahalgam. The ponywallahs pack up in the late afternoon and the valley becomes something entirely different.",
    },
  },
  {
    slug: "tulip-garden-srinagar",
    name: "Indira Gandhi Tulip Garden",
    district: "Srinagar",
    stateId: "jammu-kashmir",
    themes: ["Nature"],
    idealDays: 0.5,
    bestMonthsLabel: "Apr",
    bestMonths: [4],
    coord: { lat: 34.08, lng: 74.86 },
    guide: {
      summary:
        "Asia's largest tulip garden, terraced up the Zabarwan slope between Dal Lake and the Mughal gardens, with well over a million bulbs. It is open for roughly three weeks a year and nothing else.",
      highlights: [
        "The terraces at opening time, with the lake below and snow behind",
        "Around seventy varieties, staggered so the bloom lasts",
        "Cheshma Shahi and Nishat Bagh, immediately adjacent",
      ],
      tip: "The exact opening depends on the season and is announced only days ahead. If tulips are the reason you are going to Kashmir in April, keep the flights flexible.",
    },
  },
  {
    slug: "patnitop",
    name: "Patnitop",
    district: "Udhampur",
    stateId: "jammu-kashmir",
    themes: ["Hills", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Mar - Jun, Sep - Dec",
    bestMonths: [3, 4, 5, 6, 9, 10, 11, 12],
    coord: { lat: 33.08, lng: 75.33 },
    guide: {
      summary:
        "A deodar plateau at 2,000m on the Jammu–Srinagar highway, with paragliding, a long ridge walk and the Naag temple. The stop that makes the drive to the valley a journey rather than an ordeal.",
      highlights: [
        "The deodar forest walks along the ridge",
        "Paragliding, and the Skyview gondola from Sanget",
        "Sudhmahadev and Mantalai, an hour away",
      ],
      tip: "Break the Jammu–Srinagar road here rather than driving it in one go. The highway through the Chenani–Nashri tunnel now bypasses the town, which has made it much quieter than it was.",
    },
  },
  {
    slug: "bangus-valley",
    name: "Bangus Valley",
    district: "Kupwara",
    stateId: "jammu-kashmir",
    themes: ["Nature", "Trekking"],
    idealDays: 2,
    bestMonthsLabel: "Jun - Sep",
    bestMonths: [6, 7, 8, 9],
    hiddenGem: true,
    permitRequired: true,
    guide: {
      summary:
        "A high bowl of grassland ringed by conifer ridges in northern Kashmir, used by Gujjar and Bakarwal herders in summer and effectively closed the rest of the year. No hotels, no shops, no road worth the name.",
      highlights: [
        "The open meadow floor, some 300 sq km of it",
        "Bakarwal summer camps and their herds",
        "Chowkibal and the drive in over the ridge",
      ],
      tip: "This needs local permission and a local driver, arranged in Kupwara, not online. Treat it as a guided two-day trip rather than a destination you turn up at.",
    },
  },
  {
    slug: "lolab-valley",
    name: "Lolab Valley",
    district: "Kupwara",
    stateId: "jammu-kashmir",
    themes: ["Nature", "Hills"],
    idealDays: 2,
    bestMonthsLabel: "Apr - Oct",
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    hiddenGem: true,
    guide: {
      summary:
        "An oval valley of rice fields, walnut groves and dense forest in Kupwara, with the Lahwal stream running its length. Kalaroos caves at the head of it have a local legend of a tunnel to Central Asia.",
      highlights: [
        "The paddy terraces around Sogam and Lalpora",
        "Kalaroos caves and the Satbarran stone",
        "Walnut and apple orchards through the September harvest",
      ],
      tip: "Kupwara is far less set up for visitors than the Srinagar circuit, so arrange a stay before you drive up. Going as a day trip from Srinagar wastes most of it in the car.",
    },
  },

  /* ---------- Ladakh ---------- */
  {
    slug: "turtuk",
    name: "Turtuk",
    district: "Leh",
    stateId: "ladakh",
    themes: ["Culture", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "May - Sep",
    bestMonths: [5, 6, 7, 8, 9],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 34.848, lng: 76.828 },
    guide: {
      summary:
        "A Balti village on the Shyok, part of Pakistan until 1971 and open to visitors only since 2010. Apricot terraces, a Muslim Ladakh that looks and sounds nothing like Leh, and the last settlement before the Line of Control.",
      highlights: [
        "The old village above the river, and its underground cold stores",
        "Balti Heritage House, run by the family who still live in it",
        "Apricot harvest in late July and August",
      ],
      tip: "Stay two nights. Turtuk is eight hours from Leh and the people who drive it as a day trip from Nubra see a car park and a footbridge.",
    },
  },
  {
    slug: "hanle",
    name: "Hanle & the Dark Sky Reserve",
    district: "Leh",
    stateId: "ladakh",
    themes: ["Nature", "Desert"],
    idealDays: 2,
    bestMonthsLabel: "May - Sep",
    bestMonths: [5, 6, 7, 8, 9],
    hiddenGem: true,
    permitRequired: true,
    coord: { lat: 32.78, lng: 78.96 },
    guide: {
      summary:
        "India's first dark sky reserve, at 4,500m in the Changthang, with an astronomical observatory on the hill and a 17th-century monastery below it. The village runs its outdoor lighting to a protocol so the sky stays black.",
      highlights: [
        "The night sky, which is the whole reason to make the journey",
        "Hanle Monastery on the ridge above the plain",
        "Kiangs and, with luck, Tibetan wolf on the Changthang drive in",
      ],
      tip: "Go on a new moon and give yourself two clear nights. Also respect the lighting protocol — headlights and phone torches in the village undo what the community agreed to.",
    },
  },
  {
    slug: "lamayuru-alchi",
    name: "Lamayuru & Alchi",
    district: "Leh",
    stateId: "ladakh",
    themes: ["Spiritual", "Heritage"],
    idealDays: 2,
    bestMonthsLabel: "May - Oct",
    bestMonths: [5, 6, 7, 8, 9, 10],
    coord: { lat: 34.2833, lng: 76.7833 },
    guide: {
      summary:
        "The oldest monastery in Ladakh, on eroded badlands the guides call moonland, and 60 km down the road the 11th-century murals of Alchi — Kashmiri painting of a kind that survives almost nowhere else.",
      highlights: [
        "Alchi's Dukhang and Sumtsek murals, unrestored and unlit",
        "Lamayuru gompa above the moonland formations",
        "Wanla and Rizong, on the same road and rarely visited",
      ],
      tip: "Alchi allows no photography inside and the chambers are dark on purpose — pigment this old does not survive light. Take ten minutes to let your eyes adjust instead of reaching for a torch.",
    },
  },
  {
    slug: "tso-kar",
    name: "Tso Kar",
    district: "Leh",
    stateId: "ladakh",
    themes: ["Lakes", "Wildlife"],
    idealDays: 1,
    bestMonthsLabel: "Jun - Sep",
    bestMonths: [6, 7, 8, 9],
    hiddenGem: true,
    coord: { lat: 33.32, lng: 78.02 },
    guide: {
      summary:
        "A salt lake in the Rupshu plateau at 4,500m, a Ramsar site and the main Indian breeding ground of the black-necked crane. On the Leh–Manali road and passed by almost everybody who drives it.",
      highlights: [
        "Black-necked cranes on the marsh in summer",
        "Kiang herds on the plain, often in the dozens",
        "The salt crust on the western shore that gives the lake its name",
      ],
      tip: "Keep well back from nesting cranes — the breeding population in India is small enough that disturbance matters. Binoculars, not a closer approach.",
    },
  },
  {
    slug: "markha-valley-trek",
    name: "Markha Valley Trek",
    district: "Leh",
    stateId: "ladakh",
    themes: ["Trekking", "Culture"],
    idealDays: 7,
    bestMonthsLabel: "Jun - Sep",
    bestMonths: [6, 7, 8, 9],
    guide: {
      summary:
        "Ladakh's best-known trek and still a serious one: a week through the Hemis National Park over two passes above 4,800m, staying in village homestays rather than tents, with Kang Yatse standing over the upper valley.",
      highlights: [
        "Ganda La and Kongmaru La, the two high crossings",
        "Village homestays at Skiu, Markha and Hankar",
        "Tacha monastery, perched on the cliff above the river",
      ],
      tip: "Use the village homestay network rather than a full camping crew. It is cheaper, the money stays in the valley, and the community set it up precisely so trekking would benefit the people living along the route.",
    },
  },
];
