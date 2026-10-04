import type { Addition } from "./types";

/** Madhya Pradesh and Chhattisgarh. */
export const centralAdditions: Addition[] = [
  /* ---------- Madhya Pradesh ---------- */
  {
    slug: "maheshwar",
    name: "Maheshwar",
    district: "Khargone",
    stateId: "madhya-pradesh",
    themes: ["Heritage", "Spiritual", "Culture"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    coord: { lat: 22.176, lng: 75.588 },
    guide: {
      summary:
        "Ahilyabai Holkar's capital on the north bank of the Narmada, with a fort above a kilometre of ghats and a weaving tradition — the Maheshwari sari — that she established and that still employs the town.",
      highlights: [
        "The ghats at dawn, from a boat on the Narmada",
        "Ahilya Fort and her modest palace inside it",
        "The Rehwa Society looms, where the weaving revival is based",
      ],
      tip: "Take the boat across to Baneshwar, the small temple on a mid-river island, and ask why it is aligned the way it is. Ahilyabai is one of the most interesting rulers in Indian history and this town is her argument.",
    },
  },
  {
    slug: "chanderi",
    name: "Chanderi",
    district: "Ashoknagar",
    stateId: "madhya-pradesh",
    themes: ["Heritage", "Culture"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 24.72, lng: 78.14 },
    guide: {
      summary:
        "A small town under a Bundela fort, ringed by Jain rock carvings and Malwa-era tombs, and the source of the Chanderi sari — cotton-silk woven so fine it is effectively transparent. Two hours from Orchha and visited by a fraction as many.",
      highlights: [
        "Koshak Mahal, an unfinished seven-storey palace of 1445",
        "Badal Mahal Gate, a ceremonial arch leading nowhere",
        "Handloom workshops, where a sari takes weeks",
      ],
      tip: "Visit the looms in the morning when the weavers are working, not in the afternoon showroom hours. Watching the zari go in explains the price better than any shopkeeper will.",
    },
  },
  {
    slug: "panna-national-park",
    name: "Panna National Park",
    district: "Panna",
    stateId: "madhya-pradesh",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Jun",
    bestMonths: [1, 2, 3, 4, 5, 6, 10, 11, 12],
    coord: { lat: 24.66, lng: 80.0 },
    guide: {
      summary:
        "A tiger reserve on the Ken river with gorges, waterfalls and table-top plateaus, and the site of one of conservation's genuine comeback stories: every tiger was lost to poaching by 2009, and the reintroduced population now numbers dozens.",
      highlights: [
        "Boat rides on the Ken below the Raneh Falls gorge",
        "The Pandav Falls and the plateau viewpoints",
        "Vultures — Panna holds an unusually strong population",
      ],
      tip: "Thirty minutes from Khajuraho, so it pairs naturally. Ask your guide about the 2009 reintroduction; the people who did it still work here.",
    },
  },
  {
    slug: "bhojpur-temple",
    name: "Bhojpur Temple",
    district: "Raisen",
    stateId: "madhya-pradesh",
    themes: ["Heritage", "Spiritual"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 23.09, lng: 77.61 },
    guide: {
      summary:
        "An 11th-century Shiva temple abandoned mid-construction, holding one of the largest single-stone lingams in India. The earthen ramp used to haul the roof stones is still there, and so are the architects' plans engraved on the rock around it.",
      highlights: [
        "The 7.5m lingam and its single-stone platform",
        "The construction ramp, unique survival of a medieval building site",
        "Master plans incised into the surrounding rock floor",
      ],
      tip: "Walk the rock apron and look for the engraved drawings. This is the only place in India where you can see how a temple of this period was planned, and there is no sign pointing at them.",
    },
  },
  {
    slug: "amarkantak",
    name: "Amarkantak",
    district: "Anuppur",
    stateId: "madhya-pradesh",
    themes: ["Spiritual", "Nature", "Hills"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.67, lng: 81.75 },
    guide: {
      summary:
        "The source of the Narmada and the Son, on the meeting point of the Vindhya and Satpura ranges at 1,000m. A temple complex around the source tank, waterfalls in the sal forest, and a pilgrimage that is quiet by Indian standards.",
      highlights: [
        "Narmada Kund, the source tank and its ring of temples",
        "Kapildhara falls, a walk down through the forest",
        "The Kalachuri-period temples, 10th and 11th century",
      ],
      tip: "The Narmada Parikrama — a 2,600 km circumambulation of the whole river — starts and finishes here. Talk to a parikramavasi if you meet one; it reframes what a pilgrimage can mean.",
    },
  },
  {
    slug: "kuno-national-park",
    name: "Kuno National Park",
    district: "Sheopur",
    stateId: "madhya-pradesh",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Jun",
    bestMonths: [1, 2, 3, 4, 5, 6, 10, 11, 12],
    coord: { lat: 25.5, lng: 77.15 },
    guide: {
      summary:
        "Dry forest and grassland on the Kuno river, prepared for decades as a second home for Asiatic lions and used instead, from 2022, for the reintroduction of cheetah to India — the first intercontinental translocation of a large carnivore.",
      highlights: [
        "The grassland and the chital and nilgai densities that made it a candidate",
        "Safaris in the buffer and the zones opened to visitors",
        "The Kuno river gorge and the Palpur ruins",
      ],
      tip: "Cheetah sightings are not guaranteed and the project is genuinely contested among biologists. Go for the grassland and the story; anyone promising you a cheetah is selling something.",
    },
  },
  {
    slug: "burhanpur",
    name: "Burhanpur",
    district: "Burhanpur",
    stateId: "madhya-pradesh",
    themes: ["Heritage"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 21.31, lng: 76.23 },
    guide: {
      summary:
        "The Mughals' southern capital for the Deccan campaigns, on the Tapti. Mumtaz Mahal died here in 1631, and the first design for her tomb was to have stood on this riverbank before the court moved the project to Agra.",
      highlights: [
        "Shahi Qila and the hammam with its surviving painted ceiling",
        "Ahukhana, the riverside garden where Mumtaz was first buried",
        "The Khuni Bhandara, a 400-year-old working underground water system",
      ],
      tip: "Go down into the Khuni Bhandara if the guide can arrange it. A Persian-style qanat still supplying water after four centuries is a more remarkable survival than most monuments.",
    },
  },
  {
    slug: "datia-palace",
    name: "Datia Palace",
    district: "Datia",
    stateId: "madhya-pradesh",
    themes: ["Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 25.67, lng: 78.46 },
    guide: {
      summary:
        "A seven-storey Bundela palace built in 1620 entirely of stone and brick — no wood anywhere in it — arranged around a central tower linked by flying bridges. It was built for a visit by Jahangir and has never been lived in.",
      highlights: [
        "The central tower and the suspended connecting bridges",
        "Surviving Bundela murals in the upper chambers",
        "The view over Datia town and its lakes from the roof",
      ],
      tip: "Half an hour from Gwalior on the Jhansi road, and usually empty. Climb to the top; the geometry of the plan only makes sense looking down into the light wells.",
    },
  },

  /* ---------- Chhattisgarh ---------- */
  {
    slug: "achanakmar-tiger-reserve",
    name: "Achanakmar Tiger Reserve",
    district: "Mungeli",
    stateId: "chhattisgarh",
    themes: ["Wildlife", "Nature"],
    idealDays: 2,
    bestMonthsLabel: "Nov - Jun",
    bestMonths: [1, 2, 3, 4, 5, 6, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.4, lng: 81.8 },
    guide: {
      summary:
        "Sal and bamboo forest in the Maikal hills, part of the corridor that links Kanha to Bandhavgarh, with tiger, leopard, bison and a Baiga population living in and around the reserve.",
      highlights: [
        "The Maniyari river and the forest rest houses along it",
        "Bison and sambar in the meadows at dawn",
        "Baiga villages in the buffer, and their forest knowledge",
      ],
      tip: "Sightings are low and the forest is thick — this is a quiet park for people who like forests rather than tiger counts. Book through the Chhattisgarh forest department directly; there is very little private infrastructure.",
    },
  },
  {
    slug: "rajim",
    name: "Rajim",
    district: "Gariaband",
    stateId: "chhattisgarh",
    themes: ["Spiritual", "Heritage"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 20.96, lng: 81.88 },
    guide: {
      summary:
        "The confluence of three rivers with an 8th-century Rajivlochan temple beside it, and a Kumbh-style fortnight-long fair in February and March. Chhattisgarh's oldest continuously worshipped temple complex.",
      highlights: [
        "Rajivlochan temple and its carved pillars",
        "Kuleshwar Mahadev on an island in the riverbed",
        "The Rajim Kumbh, at Magh Purnima",
      ],
      tip: "Walk out to the island temple when the river is low. It is marooned in the monsoon and reachable on foot the rest of the year, which is a large part of its appeal.",
    },
  },
  {
    slug: "gangrel-dam",
    name: "Gangrel Dam",
    district: "Dhamtari",
    stateId: "chhattisgarh",
    themes: ["Lakes", "Nature"],
    idealDays: 1,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 20.64, lng: 81.5 },
    guide: {
      summary:
        "The largest reservoir in Chhattisgarh, on the Mahanadi, with a long earthen bund and the state's only real watersports set-up — plus an island resort and forest on the far shore.",
      highlights: [
        "Kayaking, jet skis and boating from the tourism jetty",
        "The bund walk at sunset",
        "Sihawa, the Mahanadi's source, an hour away",
      ],
      tip: "It works as the first or last night of a Bastar trip, when you want a soft day either side of long forest drives. Do not plan a journey around it on its own.",
    },
  },
  {
    slug: "jashpur",
    name: "Jashpur",
    district: "Jashpur",
    stateId: "chhattisgarh",
    themes: ["Nature", "Hills", "Culture"],
    idealDays: 2,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 22.88, lng: 84.14 },
    guide: {
      summary:
        "A plateau district in Chhattisgarh's northeast with waterfalls, sal forest and one of the highest densities of snakes in India — so much so that the state runs a snake research and rescue programme from here.",
      highlights: [
        "Rajpuri and Danpuri falls",
        "The snake park and rescue centre at Jashpur",
        "Mainpat, the Tibetan settlement plateau nearby",
      ],
      tip: "The snake-rescue work here has genuinely reduced deaths from bites, and the team will talk to visitors. It is a much better use of an afternoon than another waterfall.",
    },
  },
  {
    slug: "dongargarh-bamleshwari",
    name: "Dongargarh — Bamleshwari Temple",
    district: "Rajnandgaon",
    stateId: "chhattisgarh",
    themes: ["Spiritual", "Hills"],
    idealDays: 0.5,
    bestMonthsLabel: "Oct - Mar",
    bestMonths: [1, 2, 3, 10, 11, 12],
    hiddenGem: true,
    coord: { lat: 21.19, lng: 80.75 },
    guide: {
      summary:
        "A hill temple 1,600 steps above the plain, with a ropeway for those who would rather not, and a Buddhist site at Pragyagiri on the ridge opposite — Chhattisgarh's most visited shrine and almost unknown outside the state.",
      highlights: [
        "The climb, and the plain opening up behind you",
        "Chaitra and Kunwar Navratri, when the steps fill",
        "Pragyagiri's standing Buddha on the facing hill",
      ],
      tip: "Take the steps up and the ropeway down. It is on the main Mumbai–Howrah line, so it works as a half-day break in a long train journey.",
    },
  },
];
