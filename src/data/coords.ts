/**
 * Where places actually are.
 *
 * Two rules keep this trustworthy:
 *
 * 1. Nothing is guessed. A destination appears here only when its position is
 *    genuinely known. Everything absent is located by name instead — Google
 *    resolves "Bhoramdeo Temple, Kabirdham, Chhattisgarh" more accurately
 *    than an invented coordinate ever would, so a missing entry costs the
 *    traveller nothing.
 * 2. Every entry is checked against the real boundary of the state it claims
 *    to be in (scripts/check_coords.mjs, and a test). A coordinate that falls
 *    outside its own state is a typo, and typos here send people to the wrong
 *    end of the country.
 */

import { addedCoords } from "./additions";

export interface Coord {
  lat: number;
  lng: number;
}

const directoryCoords: Record<string, Coord> = {
  /* ---------- Delhi ---------- */
  "red-fort": { lat: 28.6562, lng: 77.241 },
  "qutub-minar": { lat: 28.5245, lng: 77.1855 },
  "humayuns-tomb": { lat: 28.5933, lng: 77.2507 },
  "india-gate-kartavya-path": { lat: 28.6129, lng: 77.2295 },
  "jama-masjid-chandni-chowk": { lat: 28.6507, lng: 77.2334 },
  "akshardham-temple": { lat: 28.6127, lng: 77.2773 },
  "lotus-temple": { lat: 28.5535, lng: 77.2588 },
  "hauz-khas-village": { lat: 28.5535, lng: 77.1943 },
  "purana-qila": { lat: 28.6094, lng: 77.2432 },
  "national-museum": { lat: 28.6118, lng: 77.2195 },

  /* ---------- Uttar Pradesh ---------- */
  "taj-mahal-agra": { lat: 27.1751, lng: 78.0421 },
  "agra-fort": { lat: 27.1795, lng: 78.0211 },
  "fatehpur-sikri": { lat: 27.0937, lng: 77.6679 },
  "varanasi-ghats-kashi-vishwanath": { lat: 25.3109, lng: 83.0107 },
  sarnath: { lat: 25.3811, lng: 83.0244 },
  ayodhya: { lat: 26.7996, lng: 82.2044 },
  "mathura-vrindavan": { lat: 27.5806, lng: 77.7006 },
  "prayagraj-triveni-sangam": { lat: 25.4225, lng: 81.885 },
  "lucknow-bara-imambara-chowk": { lat: 26.8694, lng: 80.9128 },
  "dudhwa-national-park": { lat: 28.5063, lng: 80.6803 },
  chitrakoot: { lat: 25.2, lng: 80.8667 },
  "jhansi-fort": { lat: 25.4636, lng: 78.5751 },

  /* ---------- Uttarakhand ---------- */
  rishikesh: { lat: 30.0869, lng: 78.2676 },
  haridwar: { lat: 29.9457, lng: 78.1642 },
  mussoorie: { lat: 30.4598, lng: 78.0664 },
  nainital: { lat: 29.3919, lng: 79.4542 },
  "jim-corbett-national-park": { lat: 29.532, lng: 78.9469 },
  kedarnath: { lat: 30.7346, lng: 79.0669 },
  badrinath: { lat: 30.7433, lng: 79.4938 },
  "gangotri-yamunotri": { lat: 30.9947, lng: 78.9398 },
  auli: { lat: 30.5294, lng: 79.566 },
  "valley-of-flowers": { lat: 30.7283, lng: 79.605 },
  "chopta-tungnath": { lat: 30.4894, lng: 79.2183 },
  "almora-kausani": { lat: 29.5971, lng: 79.6591 },
  ranikhet: { lat: 29.6434, lng: 79.4322 },

  /* ---------- Himachal Pradesh ---------- */
  shimla: { lat: 31.1048, lng: 77.1734 },
  "manali-solang-valley": { lat: 32.2432, lng: 77.1892 },
  "dharamshala-mcleod-ganj": { lat: 32.2190, lng: 76.3234 },
  "spiti-valley-kaza-key-monastery": { lat: 32.2965, lng: 78.0119 },
  "kinnaur-kalpa-sangla-chitkul": { lat: 31.5383, lng: 78.2576 },
  "dalhousie-khajjiar": { lat: 32.5448, lng: 75.9618 },
  "kasol-parvati-valley": { lat: 32.0099, lng: 77.3152 },
  "bir-billing": { lat: 32.0424, lng: 76.7186 },
  "great-himalayan-national-park": { lat: 31.7333, lng: 77.5167 },
  chamba: { lat: 32.5533, lng: 76.1258 },
  "atal-tunnel-rohtang": { lat: 32.4353, lng: 77.1728 },
  "tirthan-valley": { lat: 31.6333, lng: 77.35 },

  /* ---------- Punjab, Haryana, Chandigarh ---------- */
  "golden-temple-amritsar": { lat: 31.62, lng: 74.8765 },
  "jallianwala-bagh": { lat: 31.6206, lng: 74.8802 },
  "wagah-border-ceremony": { lat: 31.6047, lng: 74.5729 },
  "anandpur-sahib-virasat-e-khalsa": { lat: 31.2389, lng: 76.5025 },
  "qila-mubarak-patiala": { lat: 30.3398, lng: 76.3869 },
  "kapurthala-jagatjit-palace": { lat: 31.38, lng: 75.3849 },
  "harike-wetland": { lat: 31.1667, lng: 75.2 },
  "kurukshetra-brahma-sarovar": { lat: 29.9695, lng: 76.8266 },
  "sultanpur-national-park": { lat: 28.4611, lng: 76.8931 },
  "morni-hills": { lat: 30.6889, lng: 77.0908 },
  "pinjore-gardens": { lat: 30.7958, lng: 76.9178 },
  surajkund: { lat: 28.4419, lng: 77.2847 },
  "damdama-lake": { lat: 28.3167, lng: 77.0833 },
  "rock-garden": { lat: 30.7525, lng: 76.8063 },
  "sukhna-lake": { lat: 30.742, lng: 76.8188 },
  "capitol-complex-unesco": { lat: 30.7591, lng: 76.8094 },
  "rose-garden": { lat: 30.7418, lng: 76.7845 },

  /* ---------- Rajasthan ---------- */
  "jaipur-amber-fort-hawa-mahal-city-palace": { lat: 26.9855, lng: 75.8513 },
  "udaipur-lake-pichola-city-palace": { lat: 24.5760, lng: 73.6833 },
  "jodhpur-mehrangarh-fort": { lat: 26.298, lng: 73.0183 },
  "jaisalmer-sam-sand-dunes": { lat: 26.9157, lng: 70.9083 },
  pushkar: { lat: 26.4899, lng: 74.5511 },
  "ranthambore-national-park": { lat: 26.0173, lng: 76.5026 },
  "mount-abu": { lat: 24.5926, lng: 72.7156 },
  "chittorgarh-fort": { lat: 24.8887, lng: 74.6269 },
  "bikaner-junagarh-fort-karni-mata": { lat: 28.0229, lng: 73.3119 },
  bundi: { lat: 25.4305, lng: 75.6499 },
  "ajmer-sharif-dargah": { lat: 26.4563, lng: 74.6277 },
  "kumbhalgarh-ranakpur": { lat: 25.1485, lng: 73.5872 },
  "keoladeo-national-park-bharatpur": { lat: 27.1592, lng: 77.5222 },
  "sariska-tiger-reserve": { lat: 27.3167, lng: 76.4333 },

  /* ---------- Jammu & Kashmir and Ladakh ---------- */
  "srinagar-dal-lake": { lat: 34.1218, lng: 74.8661 },
  gulmarg: { lat: 34.0484, lng: 74.3805 },
  pahalgam: { lat: 34.0161, lng: 75.3151 },
  sonmarg: { lat: 34.3049, lng: 75.2936 },
  "vaishno-devi-katra": { lat: 33.0306, lng: 74.9496 },
  yusmarg: { lat: 33.8333, lng: 74.6667 },
  doodhpathri: { lat: 33.8833, lng: 74.65 },
  "amarnath-yatra": { lat: 34.2158, lng: 75.5008 },
  "jammu-raghunath-temple-bahu-fort": { lat: 32.7266, lng: 74.8570 },
  "leh-shanti-stupa-leh-palace": { lat: 34.1642, lng: 77.5848 },
  "pangong-tso": { lat: 33.7628, lng: 78.6603 },
  "nubra-valley-diskit": { lat: 34.5539, lng: 77.5619 },
  "tso-moriri": { lat: 32.9167, lng: 78.3167 },
  "hemis-thiksey-monasteries": { lat: 33.9125, lng: 77.7028 },
  "khardung-la": { lat: 34.2786, lng: 77.6044 },
  "zanskar-chadar-trek": { lat: 33.4575, lng: 76.8886 },
  "kargil-drass": { lat: 34.5539, lng: 76.1349 },
  "magnetic-hill-sangam": { lat: 34.1667, lng: 77.35 },

  /* ---------- Maharashtra ---------- */
  "mumbai-gateway-of-india-marine-drive": { lat: 18.922, lng: 72.8347 },
  "elephanta-caves-unesco": { lat: 18.9633, lng: 72.9315 },
  "ajanta-caves-unesco": { lat: 20.5519, lng: 75.7033 },
  "ellora-caves-unesco": { lat: 20.0269, lng: 75.1791 },
  "lonavala-khandala": { lat: 18.7546, lng: 73.4062 },
  "mahabaleshwar-panchgani": { lat: 17.9307, lng: 73.6477 },
  matheran: { lat: 18.9866, lng: 73.2707 },
  shirdi: { lat: 19.7645, lng: 74.4762 },
  "nashik-trimbakeshwar-vineyards": { lat: 19.9975, lng: 73.7898 },
  "tadoba-andhari-tiger-reserve": { lat: 20.2167, lng: 79.3333 },
  "alibaug-kashid": { lat: 18.6414, lng: 72.8722 },
  "tarkarli-malvan": { lat: 16.0526, lng: 73.4679 },
  "kaas-plateau": { lat: 17.7189, lng: 73.8206 },
  "pune-shaniwar-wada-aga-khan-palace": { lat: 18.5195, lng: 73.8553 },
  "raigad-sinhagad-forts": { lat: 18.2341, lng: 73.4409 },

  /* ---------- Gujarat ---------- */
  "white-rann-dhordo": { lat: 23.8667, lng: 69.6667 },
  "bhuj-aina-mahal-prag-mahal": { lat: 23.2419, lng: 69.6669 },
  "dholavira-unesco": { lat: 23.8867, lng: 70.2133 },
  "mandvi-beach-vijay-vilas-palace": { lat: 22.8394, lng: 69.3528 },
  "little-rann-wild-ass-sanctuary": { lat: 23.2667, lng: 71.5 },
  "somnath-temple": { lat: 20.888, lng: 70.4012 },
  "dwarka-bet-dwarka": { lat: 22.2394, lng: 68.9678 },
  "gir-national-park": { lat: 21.1667, lng: 70.8 },
  "junagadh-girnar": { lat: 21.5222, lng: 70.4579 },
  "palitana-jain-temples": { lat: 21.4859, lng: 71.8069 },
  "velavadar-blackbuck-national-park": { lat: 22.0333, lng: 72.0333 },
  "marine-national-park": { lat: 22.4667, lng: 69.7 },
  "porbandar-kirti-mandir": { lat: 21.6417, lng: 69.6293 },
  "rani-ki-vav-patan-unesco": { lat: 23.8586, lng: 72.1017 },
  "modhera-sun-temple": { lat: 23.5831, lng: 72.1319 },
  ambaji: { lat: 24.3333, lng: 72.85 },
  vadnagar: { lat: 23.7864, lng: 72.6386 },
  "polo-forest": { lat: 23.9167, lng: 73.2333 },
  "ahmedabad-old-city-unesco": { lat: 23.0225, lng: 72.5714 },
  "adalaj-stepwell": { lat: 23.1667, lng: 72.5806 },
  "champaner-pavagadh-unesco": { lat: 22.4861, lng: 73.5322 },
  "vadodara-laxmi-vilas-palace": { lat: 22.2967, lng: 73.1917 },
  "chhota-udaipur-pithora-art": { lat: 22.3086, lng: 74.0119 },
  "statue-of-unity-kevadia": { lat: 21.8381, lng: 73.7191 },
  saputara: { lat: 20.5735, lng: 73.7521 },
  "surat-dumas-beach": { lat: 21.0846, lng: 72.7136 },

  /* ---------- Goa and the coastal UT ---------- */
  "baga-calangute-anjuna": { lat: 15.5553, lng: 73.7517 },
  "vagator-chapora-fort": { lat: 15.6008, lng: 73.7364 },
  "palolem-agonda": { lat: 15.01, lng: 74.0233 },
  "colva-benaulim": { lat: 15.2793, lng: 73.9117 },
  "old-goa-churches-unesco": { lat: 15.5009, lng: 73.9116 },
  "fontainhas-panaji": { lat: 15.4989, lng: 73.8311 },
  "dudhsagar-falls": { lat: 15.3144, lng: 74.3143 },
  "fort-aguada": { lat: 15.4925, lng: 73.7736 },
  "divar-chorao-islands": { lat: 15.5167, lng: 73.9 },
  "bhagwan-mahavir-wildlife-sanctuary": { lat: 15.3833, lng: 74.25 },
  "diu-fort-nagoa-beach": { lat: 20.7144, lng: 70.9836 },
  "ghoghla-beach": { lat: 20.7269, lng: 71.0222 },
  "devka-jampore-beaches": { lat: 20.4167, lng: 72.8333 },
  "moti-daman-fort": { lat: 20.4136, lng: 72.8397 },
  "silvassa-vanganga-lake": { lat: 20.2739, lng: 73.0169 },
  dudhni: { lat: 20.2167, lng: 73.2167 },

  /* ---------- Karnataka ---------- */
  "hampi-unesco": { lat: 15.335, lng: 76.46 },
  "mysuru-palace-chamundi-hill": { lat: 12.3052, lng: 76.6552 },
  "coorg-madikeri": { lat: 12.4244, lng: 75.7382 },
  chikmagalur: { lat: 13.3161, lng: 75.7720 },
  gokarna: { lat: 14.5479, lng: 74.3188 },
  "badami-aihole-pattadakal": { lat: 15.9149, lng: 75.6769 },
  "bandipur-national-park": { lat: 11.6854, lng: 76.6327 },
  "nagarhole-national-park": { lat: 12.0167, lng: 76.1 },
  "jog-falls": { lat: 14.2294, lng: 74.8124 },
  "belur-halebidu": { lat: 13.1623, lng: 75.8648 },
  "bengaluru-lalbagh-cubbon-park": { lat: 12.9507, lng: 77.5848 },
  murudeshwar: { lat: 14.0941, lng: 74.4846 },
  shravanabelagola: { lat: 12.8573, lng: 76.4885 },
  dandeli: { lat: 15.2667, lng: 74.6167 },
  "udupi-malpe-beach": { lat: 13.3409, lng: 74.7421 },

  /* ---------- Kerala ---------- */
  "alleppey-backwaters": { lat: 9.4981, lng: 76.3388 },
  munnar: { lat: 10.0889, lng: 77.0595 },
  "fort-kochi-mattancherry": { lat: 9.9658, lng: 76.2421 },
  "thekkady-periyar-reserve": { lat: 9.5939, lng: 77.1602 },
  "varkala-cliff": { lat: 8.7379, lng: 76.7066 },
  kovalam: { lat: 8.4004, lng: 76.9787 },
  wayanad: { lat: 11.6854, lng: 76.132 },
  kumarakom: { lat: 9.6178, lng: 76.4299 },
  "athirappilly-falls": { lat: 10.285, lng: 76.5697 },
  vagamon: { lat: 9.6867, lng: 76.9033 },
  "bekal-fort": { lat: 12.3927, lng: 75.0353 },
  "guruvayur-temple": { lat: 10.5949, lng: 76.0396 },
  "silent-valley-national-park": { lat: 11.0833, lng: 76.45 },
  poovar: { lat: 8.3167, lng: 77.0667 },

  /* ---------- Tamil Nadu ---------- */
  "meenakshi-temple-madurai": { lat: 9.9195, lng: 78.1193 },
  "ooty-udhagamandalam": { lat: 11.4102, lng: 76.6950 },
  kodaikanal: { lat: 10.2381, lng: 77.4892 },
  "mahabalipuram-unesco": { lat: 12.6208, lng: 80.1945 },
  "thanjavur-brihadeeswarar-temple": { lat: 10.7828, lng: 79.1318 },
  rameswaram: { lat: 9.2876, lng: 79.3129 },
  kanyakumari: { lat: 8.0883, lng: 77.5385 },
  "chennai-marina-kapaleeshwarar": { lat: 13.0339, lng: 80.2619 },
  coonoor: { lat: 11.3530, lng: 76.7959 },
  "chettinad-karaikudi": { lat: 10.0735, lng: 78.7809 },
  "mudumalai-tiger-reserve": { lat: 11.5704, lng: 76.5324 },
  yercaud: { lat: 11.7749, lng: 78.2098 },
  "kumbakonam-chidambaram": { lat: 10.9601, lng: 79.3788 },
  "hogenakkal-falls": { lat: 12.1167, lng: 77.7833 },
  valparai: { lat: 10.3271, lng: 76.9558 },

  /* ---------- Andhra Pradesh and Telangana ---------- */
  "tirumala-tirupati": { lat: 13.6833, lng: 79.3474 },
  "visakhapatnam-rk-beach-kailasagiri": { lat: 17.7215, lng: 83.3384 },
  "araku-valley": { lat: 18.3273, lng: 82.8785 },
  "borra-caves": { lat: 18.2833, lng: 83.0333 },
  lepakshi: { lat: 13.8053, lng: 77.6072 },
  gandikota: { lat: 14.8167, lng: 78.2833 },
  "undavalli-caves-amaravati": { lat: 16.4952, lng: 80.5776 },
  srisailam: { lat: 16.0739, lng: 78.8683 },
  papikondalu: { lat: 17.3333, lng: 81.5 },
  "horsley-hills": { lat: 13.6605, lng: 78.4003 },
  "hyderabad-charminar-old-city": { lat: 17.3616, lng: 78.4747 },
  "golconda-fort": { lat: 17.3833, lng: 78.4011 },
  "chowmahalla-falaknuma-palace": { lat: 17.3578, lng: 78.4717 },
  "ramoji-film-city": { lat: 17.2543, lng: 78.6808 },
  "warangal-fort-thousand-pillar-temple": { lat: 17.9563, lng: 79.6104 },
  "ramappa-temple-unesco": { lat: 18.2603, lng: 79.9447 },
  bhadrachalam: { lat: 17.6688, lng: 80.8936 },
  "nagarjuna-sagar-nagarjunakonda": { lat: 16.5725, lng: 79.3122 },
  "kuntala-pochera-falls": { lat: 19.2667, lng: 78.4833 },
  "ananthagiri-hills": { lat: 17.3667, lng: 77.9833 },

  /* ---------- Puducherry, Lakshadweep, Andaman ---------- */
  "white-town-french-quarter": { lat: 11.9338, lng: 79.8362 },
  auroville: { lat: 12.0052, lng: 79.8106 },
  "promenade-beach": { lat: 11.9333, lng: 79.8375 },
  "paradise-serenity-beach": { lat: 11.9989, lng: 79.8419 },
  "sri-aurobindo-ashram": { lat: 11.9356, lng: 79.8356 },
  karaikal: { lat: 10.9254, lng: 79.8380 },
  mahe: { lat: 11.7028, lng: 75.5364 },
  yanam: { lat: 16.7333, lng: 82.2167 },
  "agatti-island": { lat: 10.8572, lng: 72.1927 },
  "bangaram-island": { lat: 10.9333, lng: 72.2833 },
  kavaratti: { lat: 10.5669, lng: 72.6420 },
  minicoy: { lat: 8.2833, lng: 73.05 },
  "kadmat-island": { lat: 11.2167, lng: 72.7833 },
  thinnakara: { lat: 10.8833, lng: 72.2167 },
  "radhanagar-beach-havelock": { lat: 11.9832, lng: 92.9514 },
  "elephant-beach-scuba": { lat: 12.0167, lng: 92.9667 },
  "neil-island-shaheed-dweep": { lat: 11.8333, lng: 93.05 },
  "cellular-jail-port-blair": { lat: 11.6754, lng: 92.7486 },
  "ross-island-netaji-subhas-dweep": { lat: 11.6739, lng: 92.7628 },
  "north-bay-island": { lat: 11.7, lng: 92.75 },
  "baratang-limestone-caves": { lat: 12.1167, lng: 92.7833 },
  "diglipur-ross-smith-islands": { lat: 13.2667, lng: 93.0 },

  /* ---------- West Bengal, Bihar, Jharkhand, Odisha ---------- */
  "kolkata-victoria-memorial-park-street": { lat: 22.5448, lng: 88.3426 },
  "darjeeling-toy-train": { lat: 27.041, lng: 88.2663 },
  "sundarbans-national-park-unesco": { lat: 21.9497, lng: 88.9 },
  kalimpong: { lat: 27.0600, lng: 88.4700 },
  kurseong: { lat: 26.8806, lng: 88.2775 },
  digha: { lat: 21.6272, lng: 87.5089 },
  shantiniketan: { lat: 23.6793, lng: 87.6856 },
  "murshidabad-hazarduari": { lat: 24.1861, lng: 88.2675 },
  "bishnupur-terracotta-temples": { lat: 23.0731, lng: 87.3186 },
  "dooars-jaldapara-gorumara": { lat: 26.6833, lng: 89.3 },
  mirik: { lat: 26.8869, lng: 88.1869 },
  "sandakphu-trek": { lat: 27.1006, lng: 88.0022 },
  "mahabodhi-temple-bodh-gaya-unesco": { lat: 24.6961, lng: 84.9911 },
  "nalanda-mahavihara-unesco": { lat: 25.1358, lng: 85.4436 },
  "rajgir-vishwa-shanti-stupa": { lat: 25.0281, lng: 85.4194 },
  vaishali: { lat: 25.9925, lng: 85.1281 },
  "patna-golghar-takht-sri-patna-sahib": { lat: 25.6208, lng: 85.1414 },
  "valmiki-tiger-reserve": { lat: 27.3167, lng: 84.1 },
  "vikramshila-ruins": { lat: 25.3181, lng: 87.2864 },
  madhubani: { lat: 26.3536, lng: 86.0714 },
  "hundru-dassam-falls": { lat: 23.4275, lng: 85.6667 },
  netarhat: { lat: 23.4667, lng: 84.2667 },
  "baidyanath-dham-deoghar": { lat: 24.4925, lng: 86.7 },
  "betla-national-park": { lat: 23.8833, lng: 84.1917 },
  "parasnath-hill-shikharji": { lat: 23.9636, lng: 86.1358 },
  "jamshedpur-jubilee-park-dalma": { lat: 22.8046, lng: 86.2029 },
  "patratu-valley": { lat: 23.6333, lng: 85.2833 },
  "jagannath-temple-puri-beach": { lat: 19.8047, lng: 85.8179 },
  "konark-sun-temple-unesco": { lat: 19.8876, lng: 86.0945 },
  "bhubaneswar-lingaraj-mukteshwar": { lat: 20.2381, lng: 85.8339 },
  "chilika-lake": { lat: 19.7167, lng: 85.3167 },
  "udayagiri-khandagiri-caves": { lat: 20.2617, lng: 85.7856 },
  "simlipal-national-park": { lat: 21.8833, lng: 86.3667 },
  "gopalpur-on-sea": { lat: 19.2647, lng: 84.9147 },
  daringbadi: { lat: 19.9, lng: 84.1333 },
  "ratnagiri-lalitgiri": { lat: 20.6394, lng: 86.3336 },
  "bhitarkanika-national-park": { lat: 20.7167, lng: 86.9 },

  /* ---------- Madhya Pradesh and Chhattisgarh ---------- */
  "khajuraho-temples-unesco": { lat: 24.8318, lng: 79.9199 },
  "bandhavgarh-national-park": { lat: 23.6994, lng: 81.0289 },
  "kanha-national-park": { lat: 22.3345, lng: 80.6115 },
  "pench-national-park": { lat: 21.7167, lng: 79.3 },
  "satpura-national-park": { lat: 22.5, lng: 78.35 },
  "sanchi-stupa-unesco": { lat: 23.4794, lng: 77.7392 },
  "bhimbetka-rock-shelters-unesco": { lat: 22.9386, lng: 77.6125 },
  "gwalior-fort": { lat: 26.2303, lng: 78.1692 },
  orchha: { lat: 25.3519, lng: 78.6403 },
  "ujjain-mahakaleshwar": { lat: 23.1828, lng: 75.7683 },
  omkareshwar: { lat: 22.2447, lng: 76.1508 },
  pachmarhi: { lat: 22.4675, lng: 78.4331 },
  mandu: { lat: 22.3667, lng: 75.4 },
  "bhedaghat-marble-rocks": { lat: 23.1289, lng: 79.8014 },
  "indore-rajwada-sarafa-bazaar": { lat: 22.7179, lng: 75.8553 },
  "chitrakote-falls": { lat: 19.2, lng: 81.7 },
  "bastar-tribal-markets-dussehra": { lat: 19.0822, lng: 82.0306 },
  "kanger-valley-np-kutumsar-caves": { lat: 18.85, lng: 81.95 },
  "tirathgarh-falls": { lat: 18.8667, lng: 81.9 },
  sirpur: { lat: 21.35, lng: 82.1833 },
  "bhoramdeo-temple": { lat: 22.1667, lng: 81.15 },
  mainpat: { lat: 22.9, lng: 83.1 },
  "barnawapara-sanctuary": { lat: 21.35, lng: 82.4 },

  /* ---------- Northeast ---------- */
  "kaziranga-national-park-unesco": { lat: 26.5775, lng: 93.1711 },
  "kamakhya-temple-guwahati": { lat: 26.1664, lng: 91.7058 },
  "majuli-river-island": { lat: 26.9509, lng: 94.1683 },
  "manas-national-park-unesco": { lat: 26.7167, lng: 91.0 },
  "sivasagar-ahom-monuments": { lat: 26.9847, lng: 94.6378 },
  "jorhat-tea-estates": { lat: 26.7509, lng: 94.2037 },
  "pobitora-sanctuary": { lat: 26.2333, lng: 92.0667 },
  "nameri-national-park": { lat: 26.9167, lng: 92.8667 },
  haflong: { lat: 25.1667, lng: 93.0167 },
  "tawang-monastery": { lat: 27.5861, lng: 91.8594 },
  "sela-pass": { lat: 27.5042, lng: 92.1042 },
  "ziro-valley": { lat: 27.5448, lng: 93.8283 },
  bomdila: { lat: 27.2646, lng: 92.4159 },
  dirang: { lat: 27.3597, lng: 92.2419 },
  "mechuka-valley": { lat: 28.6, lng: 94.1333 },
  "namdapha-national-park": { lat: 27.5, lng: 96.4 },
  pasighat: { lat: 28.0667, lng: 95.3333 },
  "cherrapunji-sohra": { lat: 25.3, lng: 91.7 },
  "living-root-bridges-nongriat": { lat: 25.2464, lng: 91.7186 },
  "dawki-umngot-river": { lat: 25.1897, lng: 92.0169 },
  mawlynnong: { lat: 25.2022, lng: 91.9158 },
  "shillong-wards-lake-elephant-falls": { lat: 25.5788, lng: 91.8933 },
  "nohkalikai-falls": { lat: 25.2761, lng: 91.6856 },
  "laitlum-canyon": { lat: 25.4667, lng: 91.9833 },
  "mawsmai-krem-caves": { lat: 25.2478, lng: 91.7317 },
  mawsynram: { lat: 25.2975, lng: 91.5822 },
  "loktak-lake-phumdis": { lat: 24.5167, lng: 93.8167 },
  "keibul-lamjao-national-park": { lat: 24.4833, lng: 93.8 },
  "kangla-fort-imphal": { lat: 24.8081, lng: 93.9383 },
  "ima-keithel-mothers-market": { lat: 24.8064, lng: 93.9375 },
  "ina-memorial-moirang": { lat: 24.4956, lng: 93.7742 },
  "dzukou-valley": { lat: 25.5667, lng: 94.0833 },
  aizawl: { lat: 23.7271, lng: 92.7176 },
  "reiek-heritage-village": { lat: 23.6917, lng: 92.6056 },
  "vantawng-falls": { lat: 23.1833, lng: 92.9 },
  "phawngpui-blue-mountain-np": { lat: 22.6333, lng: 93.05 },
  champhai: { lat: 23.4564, lng: 93.3289 },
  "tamdil-lake": { lat: 23.7333, lng: 92.9667 },
  "hornbill-festival-kisama": { lat: 25.6167, lng: 94.1167 },
  "kohima-wwii-cemetery": { lat: 25.6747, lng: 94.1086 },
  "dzukou-valley-trek": { lat: 25.5667, lng: 94.0833 },
  "khonoma-green-village": { lat: 25.6539, lng: 94.0175 },
  "mon-konyak-villages": { lat: 26.7167, lng: 95.0667 },
  mokokchung: { lat: 26.3225, lng: 94.5225 },
  "ujjayanta-palace-agartala": { lat: 23.8375, lng: 91.2792 },
  "neermahal-water-palace": { lat: 23.4833, lng: 91.3167 },
  "unakoti-rock-carvings": { lat: 24.3217, lng: 92.0683 },
  "jampui-hills": { lat: 23.95, lng: 92.2833 },
  "sepahijala-wildlife-sanctuary": { lat: 23.6833, lng: 91.3167 },
  "tripura-sundari-temple-udaipur": { lat: 23.5272, lng: 91.4858 },
  "gangtok-mg-marg-rumtek": { lat: 27.3314, lng: 88.6138 },
  "tsomgo-lake-baba-mandir": { lat: 27.3753, lng: 88.7628 },
  "nathu-la-pass": { lat: 27.3867, lng: 88.8306 },
  "yumthang-valley": { lat: 27.8167, lng: 88.7 },
  "gurudongmar-lake": { lat: 28.0264, lng: 88.7111 },
  "pelling-kanchenjunga-views": { lat: 27.3, lng: 88.2333 },
  "ravangla-buddha-park": { lat: 27.3097, lng: 88.3653 },
  "lachung-lachen": { lat: 27.6892, lng: 88.7436 },
  "zuluk-silk-route": { lat: 27.25, lng: 88.7667 },
  yuksom: { lat: 27.3667, lng: 88.2167 },
};

/**
 * The directory's places and our own additions, in one lookup. Each addition
 * carries its coordinate next to its guide, so a place added without knowing
 * where it is simply has no entry here — which is the intended behaviour.
 */
export const coords: Record<string, Coord> = { ...directoryCoords, ...addedCoords };

export function coordFor(slug: string): Coord | undefined {
  return coords[slug];
}

/** How many of the catalogue's destinations we can place on a map. */
export function coordCoverage(slugs: string[]): { placed: number; total: number } {
  return { placed: slugs.filter((s) => coords[s]).length, total: slugs.length };
}

/**
 * Gaps in the boundary dataset, not in the coordinates.
 *
 * `scripts/check_coords.mjs` asserts that every coordinate falls inside the
 * state it claims. These six cannot be checked that way because the polygon
 * to check them against does not exist: india2023 carries one Lakshadweep
 * atoll out of thirty-six, and Puducherry without its Mahe enclave. The
 * coordinates are right; the outline behind them is short. Listing them here
 * keeps the check strict for everything else, and puts the limitation in
 * front of the traveller rather than in a comment only we read.
 */
export const DATASET_GAPS: { slug: string; name: string; why: string }[] = [
  {
    slug: "mahe",
    name: "Mahé, Puducherry",
    why: "a Puducherry enclave inside Kerala; the dataset has Karaikal and Yanam but not Mahé",
  },
  {
    slug: "agatti-island",
    name: "Agatti Island, Lakshadweep",
    why: "the dataset draws a single Lakshadweep atoll; Agatti is not one of them",
  },
  {
    slug: "bangaram-island",
    name: "Bangaram Island, Lakshadweep",
    why: "atoll absent from the boundary dataset",
  },
  {
    slug: "kavaratti",
    name: "Kavaratti, Lakshadweep",
    why: "the capital of the territory, and still absent from the boundary dataset",
  },
  {
    slug: "minicoy",
    name: "Minicoy, Lakshadweep",
    why: "atoll absent from the boundary dataset",
  },
  {
    slug: "thinnakara",
    name: "Thinnakara, Lakshadweep",
    why: "atoll absent from the boundary dataset",
  },
];
