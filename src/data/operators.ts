/**
 * Booking hand-off.
 *
 * The directory is blunt about this: prices and opening hours "go stale
 * within a season and both are the fastest way to lose user trust. Pull them
 * from operators at booking time instead of hardcoding them into the
 * catalogue." So this app never quotes a price. It works out exactly what
 * needs booking for each leg and hands that over to whoever is selling it.
 *
 * CONFIGURING PARTNERS
 * Add your own affiliate or partner links in `PROVIDERS` below. Entries
 * without a `url` show the booking brief and let the traveller take it
 * wherever they like — that is the honest default until a real partnership
 * exists, and it is better than shipping a guessed link that 404s.
 */

export type BookingKind = "train" | "flight" | "ferry" | "road" | "stay" | "permit" | "activity";

export interface Provider {
  id: string;
  name: string;
  kinds: BookingKind[];
  /** Official site, only where it is beyond doubt. Otherwise leave unset. */
  url?: string;
  note: string;
  /** Set true for the state's own portal rather than a reseller. */
  official?: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: "irctc",
    name: "IRCTC",
    kinds: ["train"],
    url: "https://www.irctc.co.in",
    official: true,
    note: "Indian Railways' own booking system. Reserved classes open 60 days ahead and the good ones go the same day.",
  },
  {
    id: "state-permit-portal",
    name: "State permit portal",
    kinds: ["permit"],
    official: true,
    note: "Inner Line Permits are issued by the state, online or through a registered agent. Apply before you travel — they are not available at the checkpost.",
  },
  {
    id: "forest-department",
    name: "Forest department portal",
    kinds: ["activity"],
    official: true,
    note: "Core-zone safaris and capped treks are sold by the state forest department. Book the specific zone yourself; hotels resell at a markup and often get the zone you did not want.",
  },
  {
    id: "your-flight-partner",
    name: "Flight search",
    kinds: ["flight"],
    note: "Add your own flight partner link in src/data/operators.ts. Until then, take the route and dates below to whichever search you trust.",
  },
  {
    id: "your-stay-partner",
    name: "Stays",
    kinds: ["stay"],
    note: "Add your own stay partner link in src/data/operators.ts. Homestays in the hills and the Northeast are often not listed on the big platforms at all — ask locally.",
  },
  {
    id: "your-ferry-partner",
    name: "Ferry operators",
    kinds: ["ferry"],
    note: "Island sailings are sold by a handful of operators and by the state shipping service. Book these before anything else on the trip.",
  },
];

export function providersFor(kind: BookingKind): Provider[] {
  return PROVIDERS.filter((p) => p.kinds.includes(kind));
}

export interface BookingTask {
  id: string;
  kind: BookingKind;
  title: string;
  /** What to search for, in the words an operator's form wants. */
  brief: string;
  /** Day of the trip this is needed for. */
  day?: number;
  urgency: "first" | "early" | "normal";
  urgencyNote?: string;
}

const KIND_LABEL: Record<BookingKind, string> = {
  train: "Train",
  flight: "Flight",
  ferry: "Ferry",
  road: "Road transfer",
  stay: "Stay",
  permit: "Permit",
  activity: "Entry or safari",
};

export function kindLabel(kind: BookingKind): string {
  return KIND_LABEL[kind];
}
