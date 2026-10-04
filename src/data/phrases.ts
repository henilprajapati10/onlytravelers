/**
 * Eight phrases, in the languages the state actually speaks.
 *
 * Not a language course. These are the words that change how a transaction
 * goes — a greeting, a thank-you, a price question, a direction question —
 * in the Latin-script form a visitor can say on the spot. Where a language
 * has a polite and a casual register, the polite one is given.
 *
 * Scope is deliberately narrow: only languages where these eight can be
 * stated with confidence. A state whose first language is not here falls
 * through to the next one in its list, and English is always available.
 */

export interface Phrase {
  id: string;
  english: string;
}

export const PHRASE_SET: Phrase[] = [
  { id: "hello", english: "Hello" },
  { id: "thanks", english: "Thank you" },
  { id: "howmuch", english: "How much?" },
  { id: "where", english: "Where is…?" },
  { id: "water", english: "Water" },
  { id: "food", english: "Food" },
  { id: "no", english: "No, thank you" },
  { id: "help", english: "Help!" },
];

/** Transliterated, as a visitor would say it. */
export const PHRASES: Record<string, Record<string, string>> = {
  Hindi: {
    hello: "Namaste",
    thanks: "Dhanyavaad",
    howmuch: "Kitne ka hai?",
    where: "… kahaan hai?",
    water: "Paani",
    food: "Khaana",
    no: "Nahin, shukriya",
    help: "Madad!",
  },
  Tamil: {
    hello: "Vanakkam",
    thanks: "Nandri",
    howmuch: "Evvalavu?",
    where: "… enge irukku?",
    water: "Thanni",
    food: "Saapaadu",
    no: "Vendaam, nandri",
    help: "Udhavi!",
  },
  Malayalam: {
    hello: "Namaskaram",
    thanks: "Nanni",
    howmuch: "Ethra?",
    where: "… evide?",
    water: "Vellam",
    food: "Bhakshanam",
    no: "Venda, nanni",
    help: "Sahayikku!",
  },
  Kannada: {
    hello: "Namaskara",
    thanks: "Dhanyavaada",
    howmuch: "Eshtu?",
    where: "… elli ide?",
    water: "Neeru",
    food: "Oota",
    no: "Beda, dhanyavaada",
    help: "Sahaaya!",
  },
  Telugu: {
    hello: "Namaskaram",
    thanks: "Dhanyavaadaalu",
    howmuch: "Entha?",
    where: "… ekkada undi?",
    water: "Neellu",
    food: "Bhojanam",
    no: "Vaddu, dhanyavaadaalu",
    help: "Sahaayam!",
  },
  Bengali: {
    hello: "Nomoshkar",
    thanks: "Dhonnobad",
    howmuch: "Koto?",
    where: "… kothay?",
    water: "Jol",
    food: "Khabar",
    no: "Na, dhonnobad",
    help: "Bachao!",
  },
  Marathi: {
    hello: "Namaskar",
    thanks: "Dhanyavaad",
    howmuch: "Kiti?",
    where: "… kuthe aahe?",
    water: "Paani",
    food: "Jevan",
    no: "Nako, dhanyavaad",
    help: "Madat!",
  },
  Gujarati: {
    hello: "Kem chho",
    thanks: "Aabhar",
    howmuch: "Ketla?",
    where: "… kyaan chhe?",
    water: "Paani",
    food: "Jamvanu",
    no: "Na, aabhar",
    help: "Madad!",
  },
  Punjabi: {
    hello: "Sat sri akaal",
    thanks: "Dhannvaad",
    howmuch: "Kinne da?",
    where: "… kithe hai?",
    water: "Paani",
    food: "Khaana",
    no: "Nahin, shukriya",
    help: "Madad!",
  },
  Odia: {
    hello: "Namaskar",
    thanks: "Dhanyabad",
    howmuch: "Kete?",
    where: "… kouthi?",
    water: "Paani",
    food: "Khaadya",
    no: "Naa, dhanyabad",
    help: "Sahajya!",
  },
  Assamese: {
    hello: "Nomoskar",
    thanks: "Dhonyobad",
    howmuch: "Kiman?",
    where: "… kot?",
    water: "Paani",
    food: "Khadyo",
    no: "Nalage, dhonyobad",
    help: "Sahay!",
  },
  Nepali: {
    hello: "Namaste",
    thanks: "Dhanyabad",
    howmuch: "Kati ho?",
    where: "… kahaan chha?",
    water: "Paani",
    food: "Khaana",
    no: "Pardaina, dhanyabad",
    help: "Guhaar!",
  },
  Urdu: {
    hello: "Assalamu alaikum",
    thanks: "Shukriya",
    howmuch: "Kitne ka hai?",
    where: "… kahaan hai?",
    water: "Paani",
    food: "Khaana",
    no: "Nahin, shukriya",
    help: "Madad!",
  },
  Kashmiri: {
    hello: "Adaab",
    thanks: "Shukriya",
    howmuch: "Kyah chhu qeemath?",
    where: "… kati chhu?",
    water: "Aab",
    food: "Batta",
    no: "Na, shukriya",
    help: "Madad!",
  },
};

/**
 * The languages worth carrying for a state: the ones on its essentials list
 * that this phrasebook actually covers, in the state's own order.
 */
export function phrasebookFor(languages: string[]): { language: string; phrases: Record<string, string> }[] {
  return languages
    .filter((l) => PHRASES[l])
    .map((language) => ({ language, phrases: PHRASES[language] }));
}
