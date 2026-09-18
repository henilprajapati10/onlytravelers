/*
 * Exercises the modules the super app leans on — starter, today, search,
 * essentials, renown — against the real data, with no browser involved.
 *
 *   node tests/superapp-logic.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(root + "/package.json");
const { transform } = require("sucrase");

const MODULES = [
  "src/data/states.ts", "src/data/destinations.ts",
  "src/data/guides/north.ts", "src/data/guides/west.ts", "src/data/guides/south.ts",
  "src/data/guides/east.ts", "src/data/guides/central.ts", "src/data/guides/northeast.ts",
  "src/data/guides/index.ts", "src/data/circuits.ts", "src/data/renown.ts",
  "src/data/essentials.ts", "src/data/trips.ts",
  "src/lib/format.ts", "src/lib/scene.ts", "src/lib/trip.ts",
  "src/lib/starter.ts", "src/lib/today.ts", "src/lib/search.ts",
  "src/lib/storage.ts", "src/lib/wallet.ts", "src/lib/export.ts",
];

const id = (f) => {
  let i = "@/" + f.replace(/^src\//, "").replace(/\.tsx?$/, "");
  return i.endsWith("/index") ? i.slice(0, -6) : i;
};
const factories = {}, cache = {};
for (const file of MODULES) {
  const { code } = transform(fs.readFileSync(path.join(root, file), "utf8"), {
    transforms: ["typescript", "imports"], filePath: file,
  });
  const fixed = code.replace(/require\((['"])([^'"]+)\1\)/g, (m, q, spec) => {
    if (spec.startsWith("@/")) return `__req(${q}${spec}${q})`;
    if (spec.startsWith(".")) {
      const abs = path.normalize(path.join(path.dirname(file), spec));
      let x = "@/" + abs.replace(/^src\//, "");
      if (x.endsWith("/index")) x = x.slice(0, -6);
      return `__req(${q}${x}${q})`;
    }
    return m;
  });
  factories[id(file)] = new Function("exports", "module", "__req", fixed);
}
function __req(name) {
  if (cache[name]) return cache[name].exports;
  const m = { exports: {} };
  cache[name] = m;
  factories[name](m.exports, m, __req);
  return m.exports;
}

const D = __req("@/data/destinations");
const S = __req("@/data/states");
const E = __req("@/data/essentials");
const R = __req("@/data/renown");
const T = __req("@/lib/trip");
const St = __req("@/lib/starter");
const Td = __req("@/lib/today");
const Se = __req("@/lib/search");
const Ex = __req("@/lib/export");

let pass = 0, fail = 0;
const ok = (label, cond, extra = "") => {
  if (cond) pass++; else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? " — " + extra : ""}`);
};

/* ---------- starter: never overruns the budget, always returns something ---------- */
const THEMES = [[], ["Beach"], ["Hills", "Trekking"], ["Heritage", "Spiritual"], ["Wildlife"]];
const PACES = ["slow", "balanced", "packed"];
let over = 0, empty = 0, thin = 0, runs = 0;
for (const days of [4, 7, 10, 14, 21]) {
  for (const month of [1, 4, 7, 10]) {
    for (const interests of THEMES) {
      for (const pace of PACES) {
        runs++;
        const r = St.startTrip({ days, month, interests, pace });
        if (!r || !r.slugs.length) { empty++; continue; }
        if (r.plan.totalDays > days) {
          over++;
          console.log(`   over: ${days}d/${month}/${interests.join("+") || "any"}/${pace} -> ${r.plan.totalDays}d`);
        }
        // A 4-day budget legitimately fits one stop; a week that produces
        // one is the starter giving up.
        if (days >= 7 && r.slugs.length < 2) {
          thin++;
          console.log(`   thin: ${days}d/${month}/${interests.join("+") || "any"}/${pace} -> ${r.slugs.join(",")}`);
        }
        // Every stop must be in season for the month asked for, unless relaxed.
        const outOfSeason = r.plan.stops.filter((s) => !s.destination.bestMonths.includes(month));
        if (outOfSeason.length) {
          console.log(`   out of season: ${days}d/${month} -> ${outOfSeason.map((s) => s.destination.name).join(", ")}`);
        }
      }
    }
  }
}
ok(`starter never exceeds the day budget (${runs} combinations)`, over === 0, `${over} over`);
ok("starter always returns a trip", empty === 0, `${empty} empty`);
ok("a week or more never collapses to one stop", thin === 0, `${thin} thin`);

/* ---------- starter: an out-of-season interest relaxes rather than failing ---------- */
const snow = St.startTrip({ days: 8, month: 7, interests: ["Beach"], pace: "balanced" });
ok("July beach request still produces a trip", snow.slugs.length > 0);
if (snow.relaxed) {
  ok("relaxed result explains itself", Array.isArray(snow.reasons) && snow.reasons.length > 0);
  ok("relaxed result offers better months", Array.isArray(snow.betterMonths));
}

/* ---------- starter: pace changes stop count in the expected direction ---------- */
const slow = St.startTrip({ days: 14, month: 11, interests: [], pace: "slow" });
const packed = St.startTrip({ days: 14, month: 11, interests: [], pace: "packed" });
ok("packed pace visits at least as many places as slow", packed.slugs.length >= slow.slugs.length,
   `${packed.slugs.length} vs ${slow.slugs.length}`);

/* ---------- today: phases line up with the plan ---------- */
const items = ["taj-mahal-agra", "agra-fort", "jaipur-amber-fort-hawa-mahal-city-palace"]
  .map((s) => D.destinations.find((d) => d.slug === s));
const plan = T.buildTrip(items);
const start = new Date("2026-11-10T00:00:00");
const trip = { id: "t_x", name: "Test", slugs: items.map((d) => d.slug), status: "planning",
               startDate: "2026-11-10", createdAt: "", updatedAt: "" };

ok("no start date means no today", Td.todayFor({ ...trip, startDate: undefined }, plan) === null);

const before = Td.todayFor(trip, plan, new Date("2026-11-07T09:00:00"));
ok("before departure reads as 'before'", before.phase === "before" && before.daysUntil === 3,
   `${before.phase}/${before.daysUntil}`);
ok("before departure points at the first stop", before.next?.destination.slug === items[0].slug);

const during = Td.todayFor(trip, plan, new Date("2026-11-10T09:00:00"));
ok("departure day is day 1", during.phase === "during" && during.dayNumber === 1, `day ${during.dayNumber}`);
ok("day 1 knows where you are", Boolean(during.current));

const after = Td.todayFor(trip, plan, new Date("2027-01-01T09:00:00"));
ok("past the end reads as 'after'", after.phase === "after");

// Every day of the plan must resolve to a stop.
let gaps = 0;
for (let d = 0; d < plan.totalDays; d++) {
  const at = new Date(start.getTime() + d * 86400000);
  const st = Td.todayFor(trip, plan, at);
  if (st.phase !== "during") gaps++;
  else if (!st.current && !st.todayLeg) gaps++;
}
ok("every day of the trip resolves to a stop or a move", gaps === 0, `${gaps} gaps`);

/* ---------- search ---------- */
const cases = [
  ["taj", "taj-mahal-agra"],
  ["Taj Mahal", "taj-mahal-agra"],
  ["pangong", "pangong-tso"],
  ["alleppey", "alleppey-backwaters"],
  ["munnar", "munnar"],
];
for (const [q, slug] of cases) {
  const top = Se.search(q)[0];
  ok(`search "${q}" finds ${slug} first`, top && top.id === slug, top ? top.id : "no results");
}
ok("search finds a state", Se.search("Kerala").some((r) => r.kind === "state" && r.id === "kerala"));
ok("search finds a theme", Se.search("beach").some((r) => r.kind === "theme"));
ok("search finds a circuit", Se.search("golden triangle").some((r) => r.kind === "circuit"));
ok("search finds an action", Se.search("plan a new trip").some((r) => r.kind === "action"));
ok("empty query returns nothing", Se.search("   ").length === 0);
ok("nonsense returns nothing", Se.search("zzzqqxnothing").length === 0);
ok("search is accent and punctuation tolerant", Se.search("mysuru palace").length > 0);
ok("search respects the limit", Se.search("a", 5).length <= 5);
ok("multi-word narrows rather than widens",
   Se.search("kerala backwaters").length <= Se.search("kerala").length + Se.search("backwaters").length);

// Every result must point somewhere real.
let badHref = 0;
for (const q of ["goa", "hills", "delhi", "trek", "north"]) {
  for (const r of Se.search(q, 20)) {
    if (!r.href.startsWith("/")) badHref++;
    if (r.kind === "destination" && !D.destinations.some((d) => d.slug === r.id)) badHref++;
    if (r.kind === "state" && !S.states.some((s) => s.id === r.id)) badHref++;
  }
}
ok("every search result resolves to a real route", badHref === 0, `${badHref} bad`);

/* ---------- essentials: one entry per state, nothing empty ---------- */
let missing = 0;
for (const s of S.states) {
  const e = E.essentialsFor(s.id);
  if (!e || !e.languages?.length || !e.gettingAround || !e.eat || !e.watchFor) missing++;
}
ok("every state has on-the-ground essentials", missing === 0, `${missing} missing`);
ok("national numbers are present", Boolean(E.NATIONAL_NUMBERS?.length));

/* ---------- renown: tiers are disjoint and point at real destinations ---------- */
const slugs = new Set(D.destinations.map((d) => d.slug));
const heroUnknown = [...R.HERO_SLUGS].filter((s) => !slugs.has(s));
const strongUnknown = [...R.STRONG_SLUGS].filter((s) => !slugs.has(s));
const overlap = [...R.HERO_SLUGS].filter((s) => R.STRONG_SLUGS.has(s));
ok("every hero slug exists", heroUnknown.length === 0, heroUnknown.join(", "));
ok("every strong slug exists", strongUnknown.length === 0, strongUnknown.join(", "));
ok("tiers do not overlap", overlap.length === 0, overlap.join(", "));
ok("renown scores rank hero above strong above the rest",
   R.renownScore([...R.HERO_SLUGS][0]) > R.renownScore([...R.STRONG_SLUGS][0]) &&
   R.renownScore([...R.STRONG_SLUGS][0]) > R.renownScore("not-a-slug"));

/* ---------- export: no price is ever quoted ---------- */
const text = Ex.tripToText(plan);
const enquiry = Ex.tripEnquiry(plan, "2026-11-10");
const ics = Ex.tripToIcs(plan, start);
const priceLike = /(₹|Rs\.?\s?\d|INR\s?\d|\$\d)/;
ok("itinerary text quotes no price", !priceLike.test(text));
ok("operator enquiry quotes no price", !priceLike.test(enquiry));
ok("calendar file quotes no price", !priceLike.test(ics));
ok("calendar file is well formed", ics.startsWith("BEGIN:VCALENDAR") && ics.trimEnd().endsWith("END:VCALENDAR"));
const events = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
ok("calendar has an event per stop", events >= plan.stops.length, `${events} events, ${plan.stops.length} stops`);
ok("every ics line folds under 75 octets",
   ics.split("\r\n").every((l) => Buffer.byteLength(l) <= 75));

/* ---------- the whole catalogue must be free of prices too ----------
 * The directory is explicit that prices go stale within a season and are the
 * fastest way to lose trust, so nothing here may quote one. A currency symbol
 * alone is not a price — "the viewpoint on the Rs 20 note" is a landmark —
 * so this looks for an amount used as a cost.
 */
const costLike =
  /(₹|Rs\.?\s?|INR\s?|\$)\s?\d[\d,]*\s*(?!note\b)(per|each|onwards|entry|ticket|fee|pp\b|\/)|\b(costs?|price[ds]?|fare|entry fee|ticket price|charges?)\b[^.]{0,20}(₹|Rs\.?\s?\d|INR\s?\d|\$\d)/i;
let priced = 0;
for (const d of D.destinations) {
  const g = __req("@/data/guides").guides[d.slug];
  const blob = `${d.name} ${d.rawTheme} ${g?.summary ?? ""} ${(g?.highlights ?? []).join(" ")} ${g?.tip ?? ""}`;
  if (costLike.test(blob)) { priced++; console.log(`   priced: ${d.slug}`); }
}
ok("no destination guide quotes a price", priced === 0, `${priced} found`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
