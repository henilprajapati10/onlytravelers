/**
 * What you need on the ground, per state.
 *
 * Deliberately narrow: emergency numbers that are national and stable, the
 * languages actually spoken, and the practical notes that do not go stale in
 * a season. No prices, no opening hours, no phone numbers for individual
 * businesses — the directory is explicit that those are the fastest way to
 * lose a traveller's trust.
 */

export interface NationalNumber {
  label: string;
  number: string;
  note: string;
}

/** All-India, and stable. Verify anything else locally. */
export const NATIONAL_NUMBERS: NationalNumber[] = [
  {
    label: "Emergency (all services)",
    number: "112",
    note: "Single number for police, fire and ambulance across India. Works from any phone.",
  },
  {
    label: "Tourist helpline",
    number: "1363",
    note: "Ministry of Tourism helpline, multilingual, 24 hours.",
  },
];

export interface StateEssentials {
  /** Languages you will actually hear, most widely spoken first. */
  languages: string[];
  /** How people get around locally. */
  gettingAround: string;
  /** What to eat that the state is known for. */
  eat: string;
  /** One thing that catches visitors out. */
  watchFor: string;
}

export const ESSENTIALS: Record<string, StateEssentials> = {
  delhi: {
    languages: ["Hindi", "English", "Punjabi", "Urdu"],
    gettingAround: "The Metro is the fastest way across the city; buy a tourist card for unlimited days. Autos should use the meter — agree the fare first if they refuse.",
    eat: "Chaat and parathas in Chandni Chowk, kebabs around Jama Masjid, and the Bengali sweets of CR Park.",
    watchFor: "Winter fog from late December delays flights and trains for hours. Air quality is at its worst November to January.",
  },
  "uttar-pradesh": {
    languages: ["Hindi", "Urdu", "Awadhi", "Bhojpuri"],
    gettingAround: "Trains connect every city worth visiting; within them, cycle rickshaws and autos. Agra and Varanasi have restricted zones where you walk the last stretch.",
    eat: "Awadhi kebabs and biryani in Lucknow, kachori-sabzi and chaat in Varanasi, petha in Agra.",
    watchFor: "Touts at the Taj and the Varanasi ghats are persistent and convincing. Buy tickets only at official counters or online.",
  },
  uttarakhand: {
    languages: ["Hindi", "Garhwali", "Kumaoni"],
    gettingAround: "Shared jeeps are the backbone of the hills and leave when full, mostly in the morning. Roads are narrow and slow — halve whatever distance suggests.",
    eat: "Kafuli, bhatt ki churkani, and bal mithai in the Kumaon hills.",
    watchFor: "Char Dham routes need registration, and monsoon landslides close roads from July to September.",
  },
  "himachal-pradesh": {
    languages: ["Hindi", "Pahari", "Kangri"],
    gettingAround: "HRTC buses reach almost everywhere cheaply; shared taxis fill the gaps. High passes open and close with the snow.",
    eat: "Siddu, chana madra and the Himachali dham, a sit-down feast served on leaves.",
    watchFor: "Rohtang and the higher passes need permits and close in winter. Altitude comes on fast on the Manali-Leh road.",
  },
  punjab: {
    languages: ["Punjabi", "Hindi", "English"],
    gettingAround: "Good roads and frequent buses between the cities; Amritsar is compact enough to walk and cycle-rickshaw.",
    eat: "Amritsari kulcha, fish fry, and the free langar at the Golden Temple — which anyone may eat.",
    watchFor: "The Wagah ceremony fills up hours ahead and bags are not allowed. Leave early and carry only a phone.",
  },
  haryana: {
    languages: ["Hindi", "Haryanvi", "Punjabi"],
    gettingAround: "Best done as day trips by road from Delhi or Chandigarh — the sights are spread thin.",
    eat: "Roadside dhaba food on the highways: this is where the genre was invented.",
    watchFor: "Summer heat on the plains is severe from April to June, and most sites have little shade.",
  },
  rajasthan: {
    languages: ["Hindi", "Rajasthani", "Marwari"],
    gettingAround: "An overnight train or bus between cities, then autos within them. Distances look shorter than they drive.",
    eat: "Dal baati churma, laal maas, and Jodhpur's mirchi vada.",
    watchFor: "Gem and carpet scams around the tourist forts are organised and long-running. Never agree to carry goods for anyone.",
  },
  chandigarh: {
    languages: ["Hindi", "Punjabi", "English"],
    gettingAround: "Laid out in numbered sectors on a grid — cycle lanes are genuinely usable, and everything is signposted.",
    eat: "Sector 15 and 22 student cafés, and the Punjabi thalis in Sector 17.",
    watchFor: "The Capitol Complex is entry by free guided tour only, at fixed times, with ID.",
  },
  "jammu-kashmir": {
    languages: ["Kashmiri", "Urdu", "Dogri", "Hindi"],
    gettingAround: "Shared sumos between towns; shikaras on the lake. Mobile data can be restricted at short notice.",
    eat: "Wazwan — rogan josh, gushtaba — and the salt pink chai called noon chai.",
    watchFor: "Check current advisories before you fix dates, and book houseboats through established operators rather than at the ghat.",
  },
  ladakh: {
    languages: ["Ladakhi", "Hindi", "Urdu", "English"],
    gettingAround: "Hired taxis run to a fixed union rate card; shared taxis exist but are infrequent. Nothing moves fast at this altitude.",
    eat: "Thukpa, momos, skyu, and butter tea if you are brave.",
    watchFor: "Altitude sickness is the real risk. Two days in Leh before going higher, and do not fly in and drive straight to Pangong.",
  },
  maharashtra: {
    languages: ["Marathi", "Hindi", "English"],
    gettingAround: "Mumbai's local trains are the fastest thing in the city; elsewhere, state buses and trains between cities.",
    eat: "Vada pav and Bombay sandwiches, Malvani seafood on the coast, misal pav in Pune.",
    watchFor: "Mumbai monsoon flooding from June to September can stop the trains entirely for a day.",
  },
  gujarat: {
    languages: ["Gujarati", "Hindi"],
    gettingAround: "Good highways and frequent buses; the Kutch sights need a hired car as they are far apart.",
    eat: "Gujarati thali, dhokla, undhiyu in winter, and Surat's street food after dark.",
    watchFor: "Gujarat is a dry state — alcohol needs a permit, available to visitors through licensed shops and hotels.",
  },
  goa: {
    languages: ["Konkani", "Marathi", "English", "Hindi"],
    gettingAround: "A rented scooter is how Goa works. Carry a valid licence; police checks are routine.",
    eat: "Fish thali, xacuti, vindaloo as it is actually made, and bebinca.",
    watchFor: "Rip currents kill people every season. Swim where there are lifeguards and heed the flags.",
  },
  "dadra-nagar-haveli-and-daman-diu": {
    languages: ["Gujarati", "Hindi", "Marathi", "English"],
    gettingAround: "The three pockets are far apart and not connected to each other — route each one with its neighbouring Gujarat or Maharashtra coast.",
    eat: "Coastal Gujarati seafood, and Portuguese-influenced dishes in Diu.",
    watchFor: "Unlike Gujarat next door, alcohol is freely available here, which is most of why weekend crowds arrive.",
  },
  karnataka: {
    languages: ["Kannada", "Hindi", "English", "Tulu"],
    gettingAround: "Overnight buses and trains between the cities; Hampi is best on a bicycle.",
    eat: "Masala dosa and filter coffee in Bengaluru, Mangalorean fish curry on the coast, Coorg's pandi curry.",
    watchFor: "Hampi is a protected site with a ban on alcohol and loud music; the rules are enforced.",
  },
  kerala: {
    languages: ["Malayalam", "English", "Tamil"],
    gettingAround: "Buses reach everywhere and run on time; ferries and country boats are the real transport in the backwaters.",
    eat: "Sadya on a banana leaf, karimeen pollichathu, puttu and kadala, and everything with coconut.",
    watchFor: "Monsoon from June to August is spectacular but closes beaches and slows the hills to a crawl.",
  },
  "tamil-nadu": {
    languages: ["Tamil", "English"],
    gettingAround: "One of the best state bus networks in India, plus frequent trains between temple towns.",
    eat: "Idli, dosa and filter coffee everywhere; Chettinad food in the south; Madurai's late-night jigarthanda.",
    watchFor: "Temples have dress codes — covered shoulders and knees — and many inner sanctums admit Hindus only.",
  },
  "andhra-pradesh": {
    languages: ["Telugu", "Urdu", "English"],
    gettingAround: "APSRTC buses and trains; the Vizag-Araku railway is worth taking as a journey in itself.",
    eat: "Andhra meals, which run genuinely hot, and Vizag's coastal seafood.",
    watchFor: "Tirupati darshan needs an online slot booked well ahead — walk-ups can mean a very long wait.",
  },
  telangana: {
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    gettingAround: "Hyderabad's Metro covers the new city; the Old City is walkable but congested.",
    eat: "Hyderabadi biryani, haleem in Ramzan, and Irani chai with Osmania biscuits.",
    watchFor: "Old City traffic around Charminar is severe — go early, and park away from the lanes.",
  },
  puducherry: {
    languages: ["Tamil", "French", "English", "Malayalam", "Telugu"],
    gettingAround: "White Town is small and flat — a bicycle beats a car. The other districts are in different states entirely.",
    eat: "Creole and French-Tamil cooking, plus the bakeries the French left behind.",
    watchFor: "Alcohol is cheaper here than in Tamil Nadu, which is why weekends are busy; book ahead.",
  },
  lakshadweep: {
    languages: ["Malayalam", "Mahl (in Minicoy)", "English"],
    gettingAround: "Ships and small flights between islands, on limited schedules. Nothing here is spontaneous.",
    eat: "Tuna every way it can be cooked, and coconut in everything.",
    watchFor: "Entry permits are mandatory for all visitors and arranged before travel. Alcohol is prohibited except on Bangaram.",
  },
  "andaman-nicobar-islands": {
    languages: ["Hindi", "Bengali", "Tamil", "English"],
    gettingAround: "Government and private ferries between islands — book the moment your dates are fixed.",
    eat: "Grilled fish and crab, and coconut everything.",
    watchFor: "Photographing or approaching the Jarawa is a criminal offence. Mobile data is slow and patchy off Port Blair.",
  },
  "west-bengal": {
    languages: ["Bengali", "Hindi", "English", "Nepali"],
    gettingAround: "Kolkata has a Metro, trams and yellow taxis; the hills run on shared jeeps from Siliguri.",
    eat: "Fish in mustard, kathi rolls, and a sweet shop on every corner.",
    watchFor: "Durga Puja turns the whole city into a crowd for a week — wonderful, but book months ahead.",
  },
  bihar: {
    languages: ["Hindi", "Bhojpuri", "Maithili", "Urdu"],
    gettingAround: "Trains between the Buddhist sites; hired cars are easiest for the Nalanda and Rajgir loop.",
    eat: "Litti chokha, sattu, and Silao's khaja.",
    watchFor: "Bihar is a dry state; alcohol is prohibited outright and the law is enforced on visitors too.",
  },
  jharkhand: {
    languages: ["Hindi", "Santhali", "Nagpuri", "Bengali"],
    gettingAround: "A car is the practical option — the waterfalls and parks are spread across the plateau.",
    eat: "Dhuska, litti, and bamboo shoot dishes in the tribal belt.",
    watchFor: "Waterfall plunge pools drown people every season. Do not swim after rain.",
  },
  odisha: {
    languages: ["Odia", "Hindi", "English"],
    gettingAround: "The temple towns are close together and easy by road; Chilika needs a boat.",
    eat: "Dalma, chhena poda, and the temple mahaprasad at Puri.",
    watchFor: "Non-Hindus are not admitted inside the Jagannath temple. Cyclone season runs October to December on this coast.",
  },
  "madhya-pradesh": {
    languages: ["Hindi", "Bundeli", "Malvi"],
    gettingAround: "Long drives between parks and monuments; the state tourism lodges are reliable bases.",
    eat: "Poha-jalebi for breakfast in Indore, and Bhopal's kebabs.",
    watchFor: "Park safari permits sell out months ahead and the parks close for the monsoon.",
  },
  chhattisgarh: {
    languages: ["Hindi", "Chhattisgarhi", "Gondi", "Halbi"],
    gettingAround: "Bastar needs a car and a local guide; public transport is thin.",
    eat: "Chila, farra, and mahua-based dishes in the tribal belt.",
    watchFor: "Ask before photographing anyone at a tribal haat. Check local advice on which areas are open.",
  },
  assam: {
    languages: ["Assamese", "Bengali", "Bodo", "Hindi", "English"],
    gettingAround: "Guwahati is the hub for the whole Northeast; shared sumos beyond it.",
    eat: "Assam thali with khar and tenga, and the tea, obviously.",
    watchFor: "Brahmaputra flooding closes roads and parks from June to September.",
  },
  "arunachal-pradesh": {
    languages: ["Nyishi", "Adi", "Monpa", "Hindi", "English"],
    gettingAround: "Shared sumos on long mountain roads. Nothing is quick, and weather closes passes.",
    eat: "Thukpa, momos, bamboo shoot curries, and apong rice beer.",
    watchFor: "Inner Line Permit is mandatory and checked. Sela Pass can close without warning.",
  },
  meghalaya: {
    languages: ["Khasi", "Garo", "English", "Hindi"],
    gettingAround: "Shared sumos from Shillong; the root bridges are a long walk down and back up.",
    eat: "Jadoh, dohneiiong, and smoked pork.",
    watchFor: "Sundays are quiet — most of the state is Christian and shuts. Leeches on wet trails.",
  },
  manipur: {
    languages: ["Meitei", "English", "Hindi"],
    gettingAround: "Imphal is the base; Loktak is an hour away by road.",
    eat: "Eromba, chamthong, and black rice kheer.",
    watchFor: "Check the current security situation before planning any travel here.",
  },
  mizoram: {
    languages: ["Mizo", "English", "Hindi"],
    gettingAround: "Sumos on ridge roads out of Aizawl; the state is steep and slow.",
    eat: "Bai, sawhchiar, and smoked pork with bamboo shoot.",
    watchFor: "Inner Line Permit required. Almost everything closes on Sunday for church.",
  },
  nagaland: {
    languages: ["Nagamese", "English", "Ao", "Angami"],
    gettingAround: "Shared sumos from Dimapur and Kohima; book ahead in December.",
    eat: "Smoked pork with axone, bamboo shoot, and very hot raja mircha.",
    watchFor: "Inner Line Permit required. Hornbill Festival week fills every room in Kohima months ahead.",
  },
  tripura: {
    languages: ["Bengali", "Kokborok", "English"],
    gettingAround: "Agartala is small and walkable; the rest is an easy day's drive.",
    eat: "Mui borok, chakhwi, and berma-based dishes.",
    watchFor: "Unakoti involves a steep stair descent, slippery after rain.",
  },
  sikkim: {
    languages: ["Nepali", "Sikkimese", "Lepcha", "English", "Hindi"],
    gettingAround: "Shared jeeps from Siliguri and Gangtok; North Sikkim needs a registered vehicle and permit.",
    eat: "Momos, thukpa, gundruk, and fermented millet tongba.",
    watchFor: "Permits are needed for Tsomgo, Nathu La and all of North Sikkim, arranged a day or more ahead.",
  },
};

export function essentialsFor(stateId: string): StateEssentials | undefined {
  return ESSENTIALS[stateId];
}
