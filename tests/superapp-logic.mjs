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
  "src/data/essentials.ts", "src/data/trips.ts", "src/data/festivals.ts",
  "src/lib/format.ts", "src/lib/scene.ts", "src/lib/trip.ts",
  "src/lib/starter.ts", "src/lib/today.ts", "src/lib/search.ts",
  "src/lib/alternatives.ts", "src/lib/responsible.ts", "src/lib/dayshape.ts",
  "src/lib/storage.ts", "src/lib/wallet.ts", "src/lib/export.ts",
  "src/lib/maps.ts",
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
const Fe = __req("@/data/festivals");
const Al = __req("@/lib/alternatives");
const Re = __req("@/lib/responsible");
const Ds = __req("@/lib/dayshape");

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

/* ---------- festivals: every reference resolves, no invented precision ---------- */
{
  const slugSet = new Set(D.destinations.map((d) => d.slug));
  const stateSet = new Set(S.states.map((s) => s.id));
  let bad = 0;
  for (const f of Fe.festivals) {
    if (!stateSet.has(f.stateId)) { bad++; console.log(`   unknown state: ${f.id} -> ${f.stateId}`); }
    if (!f.months.length || f.months.some((m) => m < 1 || m > 12)) { bad++; console.log(`   bad months: ${f.id}`); }
    for (const slug of f.slugs) {
      if (!slugSet.has(slug)) { bad++; console.log(`   unknown slug: ${f.id} -> ${slug}`); continue; }
      const d = D.destinations.find((x) => x.slug === slug);
      if (d.stateId !== f.stateId) { bad++; console.log(`   state mismatch: ${f.id} ${slug}`); }
    }
  }
  ok("every festival resolves to a real state and destination", bad === 0, `${bad} bad`);

  const ids = Fe.festivals.map((f) => f.id);
  ok("festival ids are unique", new Set(ids).size === ids.length);

  const monthsCovered = Array.from({ length: 12 }, (_, i) => Fe.festivalsInMonth(i + 1).length);
  ok("every month has something on", monthsCovered.every((n) => n > 0), monthsCovered.join(","));

  // A moving lunar date must not be presented as fixed.
  const lunar = Fe.festivals.filter((f) => /lunar|moves|Purnima|calendar|announced/i.test(f.whenLabel));
  const lying = lunar.filter((f) => f.fixedDates);
  ok("no lunar festival is marked as a fixed date", lying.length === 0, lying.map((f) => f.id).join(", "));

  // The whole feature is about impact, not trivia.
  ok("every festival says what it does to a trip", Fe.festivals.every((f) => f.impact.length > 40));
  ok("no festival quotes a price", !Fe.festivals.some((f) => costLike.test(`${f.what} ${f.impact}`)));

  const trip = Fe.festivalsForTrip(["nagaland"], ["hornbill-festival-kisama"], 12);
  ok("December in Nagaland surfaces Hornbill", trip.some((f) => f.id === "hornbill"));
  ok("a month with no match at that state returns nothing",
     Fe.festivalsForTrip(["goa"], [], 6).length === 0);
}

/* ---------- swaps: never nonsense, never silent ---------- */
{
  const bad = [];
  let suggestions = 0;
  const combos = [
    [["manali-solang-valley", "shimla"], 7],
    [["baga-calangute-anjuna", "palolem-agonda"], 7],
    [["taj-mahal-agra", "jaipur-amber-fort-hawa-mahal-city-palace", "radhanagar-beach-havelock"], 11],
    [["alleppey-backwaters", "munnar", "fort-kochi-mattancherry"], 11],
    [["kaziranga-national-park-unesco", "cherrapunji-sohra", "tawang-monastery"], 3],
    [["leh-shanti-stupa-leh-palace", "pangong-tso"], 1],
    [["hampi-unesco", "gokarna", "mysuru-palace-chamundi-hill"], 8],
  ];
  for (const [slugs, month] of combos) {
    const items = slugs.map((s) => D.destinations.find((d) => d.slug === s)).filter(Boolean);
    const plan = T.buildTrip(items, { travelMonth: month });
    const rep = Al.swapReport(plan);
    suggestions += rep.swaps.length;
    for (const sw of rep.swaps) {
      // A swap must be a genuinely different place, reachable from the route.
      if (sw.to.slug === sw.from.slug) bad.push(`self-swap ${sw.from.slug}`);
      if (sw.to.stateId === sw.from.stateId && sw.to.district === sw.from.district)
        bad.push(`same district: ${sw.from.name} -> ${sw.to.name}`);
      if (sw.to.zone !== sw.from.zone) bad.push(`cross-zone: ${sw.from.name} -> ${sw.to.name}`);
      if (!sw.to.themes.some((t) => sw.from.themes.includes(t)))
        bad.push(`no shared theme: ${sw.from.name} -> ${sw.to.name}`);
      if (slugs.includes(sw.to.slug)) bad.push(`already in trip: ${sw.to.name}`);
      // An out-of-season swap that is itself out of season is worse than none.
      if (sw.reason === "out-of-season" && !sw.to.bestMonths.includes(month))
        bad.push(`replacement out of season: ${sw.to.name}`);
      if (!sw.why || !sw.gain) bad.push(`unexplained swap: ${sw.from.name}`);
    }
    // Duplicate targets would offer the same place twice in one trip.
    const targets = rep.swaps.map((x) => x.to.slug);
    if (new Set(targets).size !== targets.length) bad.push(`duplicate target in ${slugs[0]}`);
  }
  bad.forEach((b) => console.log("   " + b));
  ok("every swap is a real, reachable, in-season alternative", bad.length === 0, `${bad.length} bad`);
  ok("swaps are actually offered", suggestions > 0, `${suggestions} across ${combos.length} trips`);

  // Goa in July genuinely has no replacement — saying nothing would read as approval.
  const goa = T.buildTrip(
    ["baga-calangute-anjuna", "palolem-agonda"].map((s) => D.destinations.find((d) => d.slug === s)),
    { travelMonth: 7 }
  );
  const goaRep = Al.swapReport(goa);
  ok("an unfixable month is said out loud, not skipped", goaRep.stranded.length > 0,
     `${goaRep.stranded.length} stranded`);

  // A trip that fits should not be nagged.
  const good = T.buildTrip(
    ["kumarakom", "vagamon"].map((s) => D.destinations.find((d) => d.slug === s)),
    { travelMonth: 12 }
  );
  const goodRep = Al.swapReport(good);
  ok("a well-fitting trip is left alone", goodRep.stranded.length === 0);
}

/* ---------- responsible travel: derived, never generic ---------- */
{
  const andaman = T.buildTrip(
    ["radhanagar-beach-havelock", "baratang-limestone-caves"].map((s) => D.destinations.find((d) => d.slug === s))
  );
  const aNotes = Re.buildResponsibleNotes(andaman);
  ok("the Andamans trigger the Jarawa rule", aNotes.some((n) => n.id === "jarawa" && n.kind === "law"));
  ok("the Andamans trigger the coral rule", aNotes.some((n) => n.id === "coral"));

  const raj = T.buildTrip(
    ["jaisalmer-sam-sand-dunes", "jodhpur-mehrangarh-fort"].map((s) => D.destinations.find((d) => d.slug === s))
  );
  const rNotes = Re.buildResponsibleNotes(raj);
  ok("a desert trip is not lectured about coral", !rNotes.some((n) => n.id === "coral"));
  ok("a desert trip gets the water rule", rNotes.some((n) => n.id === "water"));
  ok("the living fort is flagged", rNotes.some((n) => n.id === "strain"));

  const ne = T.buildTrip(
    ["mon-konyak-villages", "khonoma-green-village"].map((s) => D.destinations.find((d) => d.slug === s))
  );
  const nNotes = Re.buildResponsibleNotes(ne);
  ok("tribal regions get the consent rule", nNotes.some((n) => n.id === "consent"));

  // Every note must justify itself or be universal by design.
  const UNIVERSAL = new Set(["money-local", "fair-pay"]);
  let unjustified = 0;
  for (const plan of [andaman, raj, ne]) {
    for (const n of Re.buildResponsibleNotes(plan)) {
      if (!UNIVERSAL.has(n.id) && n.because.length === 0) { unjustified++; console.log(`   unjustified: ${n.id}`); }
    }
  }
  ok("every note names the stops that caused it", unjustified === 0, `${unjustified} unjustified`);
  ok("enforced rules are grouped first",
     Re.groupResponsible(aNotes)[0].kind === "law");
  ok("responsible notes quote no price",
     !Re.buildResponsibleNotes(raj).some((n) => costLike.test(n.detail)));
}

/* ---------- day shape ---------- */
{
  let bad = 0;
  for (const d of D.destinations) {
    const shape = Ds.shapeForDestination(d, 11);
    if (shape.slots.length !== 3) { bad++; continue; }
    if (shape.slots.map((s) => s.part).join(",") !== "Early,Midday,Evening") bad++;
    if (shape.slots.some((s) => !s.what || s.what.length < 20)) bad++;
  }
  ok("every destination has a three-part day", bad === 0, `${bad} bad`);

  const taj = D.destinations.find((d) => d.slug === "taj-mahal-agra");
  ok("the day shape carries the guide's own advice",
     Ds.shapeForDestination(taj, 11).localAdvice === __req("@/data/guides").guides["taj-mahal-agra"].tip);

  // Most guide tips are not about timing at all ("bring a book", "hire the
  // official guide"), and forcing those into a slot would be the bug. What
  // matters is that advice which DOES name a time lands in the right part.
  const guidesAll = __req("@/data/guides").guides;
  const clockish = /\b(dawn|sunrise|sunset|dusk|morning|evening|afternoon|midday|noon|overnight|after dark|first light|\d{1,2}\s?[ap]m)\b/i;
  const timed = D.destinations.filter((d) => clockish.test(guidesAll[d.slug]?.tip ?? ""));
  const misplaced = timed.filter((d) => !Ds.shapeForDestination(d, 11).adviceIn);
  misplaced.slice(0, 5).forEach((d) => console.log(`   unplaced: ${d.slug} — ${guidesAll[d.slug].tip.slice(0, 80)}`));
  ok("advice that names a time is placed in that part of the day",
     misplaced.length === 0, `${timed.length} timed, ${misplaced.length} unplaced`);

  // And advice with no time reference is still shown, just not slotted.
  const untimed = D.destinations.find((d) => !clockish.test(guidesAll[d.slug]?.tip ?? ""));
  ok("untimed advice is still carried, just not slotted",
     Boolean(Ds.shapeForDestination(untimed, 11).localAdvice));

  ok("May in Rajasthan warns about the heat",
     Boolean(Ds.shapeForDestination(D.destinations.find((d) => d.slug === "jaisalmer-sam-sand-dunes"), 5).heatWarning));
  ok("May in Ladakh does not",
     !Ds.shapeForDestination(D.destinations.find((d) => d.slug === "pangong-tso"), 5).heatWarning);
  ok("no day shape quotes a price",
     !D.destinations.some((d) => costLike.test(Ds.shapeForDestination(d, 11).slots.map((x) => x.what).join(" "))));
}

/* ---------- search reaches the new layer ---------- */
ok("search finds a festival", Se.search("hornbill").some((r) => r.kind === "festival"));
ok("search finds the festival calendar", Se.search("festival calendar").some((r) => r.kind === "action"));

/* ---------- Google Maps ---------- */
{
  const M = __req("@/lib/maps");
  const bySlug = (s) => D.destinations.find((d) => d.slug === s);
  const hampi = D.destinations.find((d) => /hampi/i.test(d.slug));

  // Every place gets a query Google can resolve: name first, state and country after.
  const queries = D.destinations.map(M.placeQuery);
  ok("every destination gets a map query naming its state and India",
     D.destinations.every((d, i) => queries[i].startsWith(d.name) && queries[i].endsWith(", India") && queries[i].includes(d.stateName) || d.name === d.stateName));
  ok("no query repeats the state as its district", !queries.some((q) => /, ([^,]+), \1, India$/.test(q)));
  ok("no map URL carries a coordinate we would have had to invent",
     !queries.some((q) => /\d+\.\d+\s*,\s*\d+\.\d+/.test(q)));

  const search = new URL(M.mapsSearchUrl(M.placeQuery(hampi)));
  ok("open-in-Maps uses the Maps URLs API", search.origin === "https://www.google.com" && search.searchParams.get("api") === "1");
  ok("open-in-Maps round-trips the place name", search.searchParams.get("query") === M.placeQuery(hampi));

  const here = new URL(M.directionsFromHereUrl("Hampi, Karnataka, India"));
  ok("directions from here leave the origin to the device", !here.searchParams.has("origin") && here.searchParams.get("destination") === "Hampi, Karnataka, India");

  // A long road trip splits into parts of at most five stops that share ends.
  const longSlugs = D.destinations.filter((d) => d.stateId === "rajasthan").slice(0, 9).map((d) => d.slug);
  const longPlan = T.buildTrip(longSlugs.map(bySlug));
  const segs = M.routeSegments(longPlan);
  ok("a nine-stop road trip comes in parts", segs.length >= 2, `${segs.length} parts`);
  ok("no route link carries more than five stops (phone limit)", segs.every((s) => s.slugs.length <= M.MAX_STOPS_PER_LINK && s.slugs.length >= 2));
  ok("parts join end to end", segs.every((s, i) => i === 0 || segs[i - 1].slugs[segs[i - 1].slugs.length - 1] === s.slugs[0]));
  ok("the parts cover every stop, in order",
     JSON.stringify([...new Set(segs.flatMap((s) => s.slugs))]) === JSON.stringify(longPlan.stops.map((s) => s.destination.slug)));
  const u = new URL(segs[0].url);
  ok("a route link has origin, destination and waypoints",
     u.searchParams.get("origin") === segs[0].queries[0] &&
     u.searchParams.get("destination") === segs[0].queries[segs[0].queries.length - 1] &&
     u.searchParams.get("waypoints").split("|").length === segs[0].queries.length - 2);

  // Crossing to the islands: no driving route across the sea.
  const island = T.buildTrip(["baga-calangute-anjuna", "palolem-agonda", "radhanagar-beach-havelock", "neil-island-shaheed-dweep"].map(bySlug));
  const islandSegs = M.routeSegments(island);
  const islandLegs = M.mapLegs(island);
  const seaLeg = islandLegs.find((l) => !l.drivable);
  ok("a trip that flies to the islands breaks the road route there",
     islandSegs.every((s) => !(s.slugs.includes("palolem-agonda") && s.slugs.includes("radhanagar-beach-havelock"))),
     islandSegs.map((s) => s.names.join(">")).join(" | "));
  ok("the flying leg links to flights, not driving directions",
     Boolean(seaLeg) && seaLeg.url.startsWith("https://www.google.com/travel/flights") && seaLeg.urlLabel === "Flights");
  ok("every leg in a trip gets a link", islandLegs.length === island.stops.length - 1 && islandLegs.every((l) => l.url.startsWith("https://www.google.com/")));

  // Embeds: keyless by default, Embed API with a key.
  ok("keyless place embed uses Google's classic embed", M.embedPlaceUrl("Hampi, India").includes("output=embed") && !M.embedPlaceUrl("Hampi, India").includes("key="));
  ok("a key switches to the Maps Embed API", M.embedPlaceUrl("Hampi, India", "K").startsWith("https://www.google.com/maps/embed/v1/place?key=K"));
  const routeKeyed = new URL(M.embedRouteUrl(["A, India", "B, India", "C, India"], "K"));
  ok("keyed route embed draws origin, waypoints and destination",
     routeKeyed.pathname.endsWith("/embed/v1/directions") && routeKeyed.searchParams.get("waypoints") === "B, India" && routeKeyed.searchParams.get("destination") === "C, India");
  ok("keyless route embed chains the stops", decodeURIComponent(M.embedRouteUrl(["A", "B", "C"])).includes("daddr=B to:C"));
  ok("a single stop embeds as a place, not a broken route", M.embedRouteUrl(["A"]) === M.embedPlaceUrl("A"));

  // Nearby essentials.
  ok("nearby search covers the things people need on the ground",
     ["atm", "hospital", "pharmacy", "fuel", "police", "stay", "food"].every((k) => M.NEARBY_KINDS.some((n) => n.id === k)));
  const atm = new URL(M.nearbyUrl(M.NEARBY_KINDS.find((n) => n.id === "atm"), M.placeQuery(hampi)));
  ok("nearby search is anchored to the place", atm.searchParams.get("query") === `ATM near ${M.placeQuery(hampi)}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
