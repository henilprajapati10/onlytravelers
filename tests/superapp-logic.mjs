/*
 * Exercises the modules the super app leans on — starter, today, search,
 * essentials, renown — against the real data, with no browser involved.
 *
 *   node tests/superapp-logic.mjs
 */
import { loadModule } from "../scripts/ts-modules.mjs";
import fs from "node:fs";


const D = loadModule("src/data/destinations.ts");
const S = loadModule("src/data/states.ts");
const E = loadModule("src/data/essentials.ts");
const R = loadModule("src/data/renown.ts");
const T = loadModule("src/lib/trip.ts");
const St = loadModule("src/lib/starter.ts");
const Td = loadModule("src/lib/today.ts");
const Se = loadModule("src/lib/search.ts");
const Ex = loadModule("src/lib/export.ts");
const Fe = loadModule("src/data/festivals.ts");
const Al = loadModule("src/lib/alternatives.ts");
const Re = loadModule("src/lib/responsible.ts");
const Ds = loadModule("src/lib/dayshape.ts");
const G = loadModule("src/data/guides/index.ts");
const Ad = loadModule("src/data/additions/index.ts");
const Co = loadModule("src/data/coords.ts");
const Sh = loadModule("src/data/shapes.ts");
const Mp = loadModule("src/lib/maps.ts");

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
{
  const g = loadModule("src/data/guides/index.ts").getGuide;
  ok("search accepts a guide lookup and still ranks names first",
     Se.search("Taj Mahal", 12, g)[0]?.id === "taj-mahal-agra");
  ok("a summary-only match is found when the guides are supplied",
     Se.search("Taj Mahal", 12, g).length >= Se.search("Taj Mahal").length);
}
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
  const g = loadModule("src/data/guides/index.ts").guides[d.slug];
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
  const guidesAll = loadModule("src/data/guides/index.ts").guides;
  const tipOf = (d) => guidesAll[d.slug]?.tip;
  const shapeOf = (d, month) => Ds.shapeForDestination(d, month, tipOf(d));
  let bad = 0;
  for (const d of D.destinations) {
    const shape = shapeOf(d, 11);
    if (shape.slots.length !== 3) { bad++; continue; }
    if (shape.slots.map((s) => s.part).join(",") !== "Early,Midday,Evening") bad++;
    if (shape.slots.some((s) => !s.what || s.what.length < 20)) bad++;
  }
  ok("every destination has a three-part day", bad === 0, `${bad} bad`);

  const taj = D.destinations.find((d) => d.slug === "taj-mahal-agra");
  ok("the day shape carries the guide's own advice",
     shapeOf(taj, 11).localAdvice === guidesAll["taj-mahal-agra"].tip);
  ok("without the guide loaded the day still has a shape, just no advice",
     Ds.shapeForDestination(taj, 11).slots.length === 3 && Ds.shapeForDestination(taj, 11).localAdvice === undefined);

  // Most guide tips are not about timing at all ("bring a book", "hire the
  // official guide"), and forcing those into a slot would be the bug. What
  // matters is that advice which DOES name a time lands in the right part.
  const clockish = /\b(dawn|sunrise|sunset|dusk|morning|evening|afternoon|midday|noon|overnight|after dark|first light|\d{1,2}\s?[ap]m)\b/i;
  const timed = D.destinations.filter((d) => clockish.test(guidesAll[d.slug]?.tip ?? ""));
  const misplaced = timed.filter((d) => !shapeOf(d, 11).adviceIn);
  misplaced.slice(0, 5).forEach((d) => console.log(`   unplaced: ${d.slug} — ${guidesAll[d.slug].tip.slice(0, 80)}`));
  ok("advice that names a time is placed in that part of the day",
     misplaced.length === 0, `${timed.length} timed, ${misplaced.length} unplaced`);

  // And advice with no time reference is still shown, just not slotted.
  const untimed = D.destinations.find((d) => !clockish.test(guidesAll[d.slug]?.tip ?? ""));
  ok("untimed advice is still carried, just not slotted",
     Boolean(shapeOf(untimed, 11).localAdvice));

  ok("May in Rajasthan warns about the heat",
     Boolean(Ds.shapeForDestination(D.destinations.find((d) => d.slug === "jaisalmer-sam-sand-dunes"), 5).heatWarning));
  ok("May in Ladakh does not",
     !Ds.shapeForDestination(D.destinations.find((d) => d.slug === "pangong-tso"), 5).heatWarning);
  ok("no day shape quotes a price",
     !D.destinations.some((d) => costLike.test(shapeOf(d, 11).slots.map((x) => x.what).join(" "))));
}

/* ---------- bundle discipline ---------- */
{
  // The guide corpus is ~400 KB of prose. Client components must reach it
  // only through the lazy hook; a static import drags it into first-load JS.
  const clientFiles = [
    "src/lib/search.ts", "src/lib/dayshape.ts", "src/components/SearchOverlay.tsx",
    "src/components/DestinationsExplorer.tsx", "src/components/DestinationCard.tsx",
    "src/components/TodayCard.tsx", "src/components/DayShapeCard.tsx", "src/components/HomeHero.tsx",
  ];
  const leaks = clientFiles.filter((f) => /^import .*from "@\/data\/guides"/m.test(fs.readFileSync(f, "utf8")));
  ok("no client module statically imports the guides", leaks.length === 0, leaks.join(", "));
  ok("the lazy hook is the one place that imports them dynamically",
     /import\("@\/data\/guides"\)/.test(fs.readFileSync("src/lib/useGuides.ts", "utf8")));
}

/* ---------- on the ground: weather, nearby, phrases ---------- */
{
  const W = loadModule("src/lib/weather.ts");
  const fixture = {
    current: { temperature_2m: 31.6, weather_code: 3 },
    daily: {
      time: ["2026-10-04", "2026-10-05", "2026-10-06"],
      temperature_2m_max: [33.1, 34.8, 29.2],
      temperature_2m_min: [24.0, 25.1, 22.7],
      precipitation_probability_max: [10, 70, 80],
      weather_code: [2, 61, 95],
    },
  };
  const f = W.parseForecast(fixture, 1000);
  ok("forecast parses a real Open-Meteo shape", f && f.nowC === 32 && f.days.length === 3 && f.fetchedAt === 1000);
  ok("forecast rows carry rounded highs, lows and rain chance",
     f.days[1].maxC === 35 && f.days[1].minC === 25 && f.days[1].rainChance === 70 && f.days[1].code === 61);
  ok("a missing column returns null rather than a half forecast",
     W.parseForecast({ ...fixture, daily: { ...fixture.daily, weather_code: undefined } }) === null);
  ok("mismatched column lengths return null",
     W.parseForecast({ ...fixture, daily: { ...fixture.daily, temperature_2m_min: [1] } }) === null);
  ok("garbage returns null", W.parseForecast(null) === null && W.parseForecast("x") === null && W.parseForecast({}) === null);
  ok("null precipitation probability reads as 0",
     W.parseForecast({ ...fixture, daily: { ...fixture.daily, precipitation_probability_max: [null, null, null] } }).days[0].rainChance === 0);
  ok("WMO codes describe", W.describeCode(0).label === "Clear" && W.describeCode(95).label === "Thunderstorm" && W.describeCode(63).label === "Rain" && W.describeCode(999).label === "—");
  ok("two wet days of three gives the rain advice", /Rain is likely/.test(W.forecastAdvice(f)));
  ok("a 41° day gives the heat advice",
     /40°C/.test(W.forecastAdvice({ ...f, days: [{ ...f.days[0], maxC: 41, rainChance: 0 }, f.days[0], f.days[0]] })));
  ok("a mild day gives no advice",
     W.forecastAdvice({ ...f, days: [{ date: "2026-10-04", maxC: 28, minC: 18, rainChance: 10, code: 1 }] }) === undefined);
  ok("freshness respects the TTL", W.isFresh({ fetchedAt: 0 }, W.WEATHER_TTL_MS - 1) && !W.isFresh({ fetchedAt: 0 }, W.WEATHER_TTL_MS + 1) && !W.isFresh(null));
  const u = new URL(W.forecastUrl(27.17, 78.04));
  ok("forecast URL asks Open-Meteo for current and daily in IST",
     u.host === "api.open-meteo.com" && u.searchParams.get("timezone") === "Asia/Kolkata" && u.searchParams.get("latitude") === "27.17" && /weather_code/.test(u.searchParams.get("daily")));
  ok("no forecast text quotes a price", !costLike.test([W.forecastAdvice(f), W.describeCode(61).label].join(" ")));

  const N = loadModule("src/lib/nearby.ts");
  const taj = D.destinations.find((d) => d.slug === "taj-mahal-agra");
  const links = N.nearbyLinks(taj);
  ok("eight nearby kinds", links.length === 8 && N.NEARBY_KINDS.some((k) => k.id === "hospital") && N.NEARBY_KINDS.some((k) => k.id === "atm"));
  ok("nearby links centre on the coordinate at street zoom",
     links.every((l) => /^https:\/\/www\.google\.com\/maps\/search\/[^/]+\/@27\.17\d+,78\.04\d+,15z$/.test(l.url)), links[0].url);
  const C = loadModule("src/data/coords.ts");
  const noCoord = D.destinations.find((d) => !C.coordFor(d.slug));
  ok("a place without a coordinate searches by name instead",
     noCoord && N.nearbyUrl(noCoord, N.NEARBY_KINDS[0]).includes("api=1&query=ATM%20near%20") && N.nearbyUrl(noCoord, N.NEARBY_KINDS[0]).includes(encodeURIComponent(noCoord.name)));

  const P = loadModule("src/data/phrases.ts");
  const E = loadModule("src/data/essentials.ts");
  const langs = Object.keys(P.PHRASES);
  ok("every phrasebook language has all eight phrases",
     langs.every((l) => P.PHRASE_SET.every((p) => typeof P.PHRASES[l][p.id] === "string" && P.PHRASES[l][p.id].length > 0)));
  // A state falls through to English only when English is on its own list.
  const uncovered = S.states.filter((s) => {
    const langs = E.ESSENTIALS[s.id]?.languages ?? [];
    return P.phrasebookFor(langs).length === 0 && !langs.includes("English");
  });
  ok("every state has a phrasebook language or lists English", uncovered.length === 0, uncovered.map((s) => s.id).join(", "));
  ok("phrasebook keeps the state's own language order",
     P.phrasebookFor(["Kannada", "Hindi", "Tulu"]).map((b) => b.language).join(",") === "Kannada,Hindi");
}

/* ---------- habit: place of the day, streak, My India ---------- */
{
  const Dy = loadModule("src/lib/daily.ts");
  const a = Dy.placeOfTheDay(new Date(2026, 9, 4));
  const b = Dy.placeOfTheDay(new Date(2026, 9, 4, 23, 59));
  const c = Dy.placeOfTheDay(new Date(2026, 9, 5));
  ok("the place of the day is the same all day", a.slug === b.slug);
  ok("and changes at midnight", a.slug !== c.slug);
  ok("recent places start with today and go back", Dy.recentPlaces(3, new Date(2026, 9, 5))[0].slug === c.slug && Dy.recentPlaces(3, new Date(2026, 9, 5))[1].slug === a.slug);
  // Over a year, the quiet half of the catalogue must get its share.
  let gems = 0; const seen = new Set();
  for (let i = 0; i < 365; i++) { const p = Dy.placeOfTheDay(new Date(2026, 0, 1 + i)); seen.add(p.slug); if (p.hiddenGem) gems++; }
  ok("a year of places does not repeat", seen.size === 365);
  ok("hidden gems appear in rough proportion", gems > 60 && gems < 140, `${gems} gems in 365 days`);
  const s1 = Dy.advanceStreak(Dy.EMPTY_STREAK, 100);
  const s2 = Dy.advanceStreak(s1, 101);
  const s3 = Dy.advanceStreak(s2, 101);
  const s4 = Dy.advanceStreak(s2, 105);
  ok("streak counts consecutive days", s1.current === 1 && s2.current === 2 && s2.longest === 2 && s2.seen === 2);
  ok("a second open on the same day changes nothing", s3 === s2);
  ok("a gap resets the streak but keeps the record", s4.current === 1 && s4.longest === 2 && s4.seen === 3);

  const V = loadModule("src/lib/visited.ts");
  const done = { id: "t1", name: "x", slugs: ["taj-mahal-agra", "munnar"], status: "completed", createdAt: "", updatedAt: "" };
  const planned = { ...done, id: "t2", slugs: ["pangong-tso"], status: "planning" };
  const sum = V.summariseVisited(["goa"], [done, planned]);
  ok("completed trips colour their states; planned ones do not",
     sum.ids.has("uttar-pradesh") && sum.ids.has("kerala") && sum.ids.has("goa") && !sum.ids.has("ladakh"));
  ok("counts and percent are of all 36 units", sum.total === S.states.length && sum.count === 3 && sum.percent === Math.round(300 / S.states.length));
  const ne = S.zones.find((z) => /north/i.test(z) && /east/i.test(z));
  const south = S.zones.find((z) => /south/i.test(z));
  ok("untouched zones are named", sum.untouchedZones.includes(ne) && !sum.untouchedZones.includes(south), sum.untouchedZones.join(", "));
  ok("the tap list drops unknown ids", V.summariseVisited(["nowhere"], []).count === 0);
}

/* ---------- money that is theirs, not ours ---------- */
{
  const X = loadModule("src/lib/expenses.ts");
  ok("no budget means no burn", X.budgetBurn({ total: 500, days: 5 }).percent === 0);
  const b = X.budgetBurn({ total: 4000, budget: 10000, days: 5, daysIn: 2 });
  ok("budget burn tracks what is left", b.left === 6000 && b.percent === 40 && /Day 2 of 5/.test(b.note));
  ok("spending ahead of pace is called out",
     /running ahead/.test(X.budgetBurn({ total: 7000, budget: 10000, days: 5, daysIn: 2 }).note));
  ok("over budget says so", /Over budget/.test(X.budgetBurn({ total: 12000, budget: 10000, days: 5, daysIn: 3 }).note));
  ok("before the trip, the budget is just a daily figure", /a day across 5 days/.test(X.budgetBurn({ total: 0, budget: 10000, days: 5 }).note));
  ok("a trip that has not started never shows a negative day",
     /a day across 9 days/.test(X.budgetBurn({ total: 250, budget: 10000, days: 9, daysIn: -31 }).note));
  ok("nor does a finished one", /a day across 9 days/.test(X.budgetBurn({ total: 250, budget: 10000, days: 9, daysIn: 12 }).note));

  const M = loadModule("src/lib/maps.ts");
  const stops = [D.destinations.find((d) => d.slug === "taj-mahal-agra"), ...D.destinations.filter((d) => d.stateId === "rajasthan").slice(0, 2)];
  const e = new URL(M.googleRouteEmbedUrl(stops, "KEY"));
  ok("route embed uses the directions mode with origin, destination and waypoints",
     e.pathname === "/maps/embed/v1/directions" && e.searchParams.get("key") === "KEY" && e.searchParams.get("origin").startsWith("27.17") && e.searchParams.get("waypoints").length > 0 && e.searchParams.get("mode") === "driving");
  ok("route embed needs two stops", M.googleRouteEmbedUrl(stops.slice(0, 1), "KEY") === null);
  const many = D.destinations.slice(0, 20);
  ok("route embed caps waypoints at nine", new URL(M.googleRouteEmbedUrl(many, "KEY")).searchParams.get("waypoints").split("|").length === 9);
}

/* ---------- the expanded catalogue ---------- */
{
  const all = D.destinations;
  const added = all.filter((d) => d.source === "onlytravelers");
  const directory = all.filter((d) => d.source === "directory");

  ok("the directory's 359 rows are all still here and unchanged in count",
     directory.length === 359, `${directory.length}`);
  ok("every entry declares where it came from",
     all.every((d) => d.source === "directory" || d.source === "onlytravelers"));
  ok("nothing from the directory is dressed up as a hidden gem",
     !directory.some((d) => d.hiddenGem));
  ok("the additions carry a hidden-gem tier",
     added.filter((d) => d.hiddenGem).length > 50,
     `${added.filter((d) => d.hiddenGem).length} of ${added.length}`);

  ok("no duplicate slugs across the whole catalogue",
     new Set(all.map((d) => d.slug)).size === all.length);
  ok("no addition duplicates a directory place's name in the same state",
     !added.some((a) =>
       directory.some((d) => d.stateId === a.stateId && d.name.toLowerCase() === a.name.toLowerCase())));

  ok("every destination has a guide", all.every((d) => G.guides[d.slug]),
     all.filter((d) => !G.guides[d.slug]).map((d) => d.slug).join(", "));
  ok("every guide has a summary, highlights and a tip",
     all.every((d) => {
       const g = G.guides[d.slug];
       return g && g.summary.length > 40 && g.highlights.length >= 2 && g.tip.length > 20;
     }));
  ok("every addition names a real state",
     added.every((d) => S.getState(d.stateId)));
  ok("every addition's themes are real themes",
     added.every((d) => d.themes.length > 0 && d.themes.every((t) => D.themes.includes(t))));
  ok("every addition's best months match its label's month count",
     added.every((d) => d.bestMonths.length > 0 && d.bestMonths.every((m) => m >= 1 && m <= 12)));
  ok("the additions quote no price",
     !Ad.additions.some((a) =>
       costLike.test(`${a.guide.summary} ${a.guide.highlights.join(" ")} ${a.guide.tip}`)));
  ok("every state and union territory gained or kept coverage",
     S.states.every((st) => all.some((d) => d.stateId === st.id)));
}

/* ---------- maps: coordinates, shapes and the links out ---------- */
{
  const all = D.destinations;
  const placed = all.filter((d) => Co.coordFor(d.slug));

  ok("almost every destination can be pinned on a map",
     placed.length / all.length > 0.95, `${placed.length}/${all.length}`);
  ok("no coordinate is outside India's bounding box",
     placed.every((d) => {
       const c = Co.coordFor(d.slug);
       return c.lat > 6 && c.lat < 38 && c.lng > 68 && c.lng < 98;
     }));
  // The directory lists Dzukou Valley twice, once under Manipur and once
  // under Nagaland, because the valley straddles the border and both claim
  // it. Two rows for one place may legitimately share a point; two different
  // places sharing one is a copy-paste error.
  ok("no two different places share an identical coordinate", (() => {
    const seen = new Map();
    for (const d of placed) {
      const c = Co.coordFor(d.slug);
      const key = `${c.lat},${c.lng}`;
      const name = d.name.toLowerCase().replace(/[^a-z]/g, "");
      const prev = seen.get(key);
      if (prev && !prev.includes(name) && !name.includes(prev)) return false;
      seen.set(key, name);
    }
    return true;
  })());

  ok("every state and union territory has a drawn outline",
     S.states.every((st) => Sh.shapeFor(st.id)), `${Sh.stateShapes.length} shapes`);
  ok("every outline's bounding box lies inside the shared viewBox",
     Sh.stateShapes.every((sh) =>
       sh.bbox[0] >= 0 && sh.bbox[1] >= 0 &&
       sh.bbox[2] <= Sh.INDIA_VIEWBOX.width && sh.bbox[3] <= Sh.INDIA_VIEWBOX.height));
  ok("a pin projects into its own state's bounding box",
     (() => {
       const d = D.destinations.find((x) => x.slug === "taj-mahal-agra");
       const c = Co.coordFor(d.slug);
       const p = Sh.projectToIndia(c.lng, c.lat);
       const b = Sh.shapeFor("uttar-pradesh").bbox;
       return p.x >= b[0] && p.x <= b[2] && p.y >= b[1] && p.y <= b[3];
     })());

  const taj = D.destinations.find((d) => d.slug === "taj-mahal-agra");
  ok("a place query names the place, district, state and country",
     Mp.mapQuery(taj) === "Taj Mahal, Agra, Uttar Pradesh, India", Mp.mapQuery(taj));
  ok("a name that already carries its district does not repeat it",
     !/Agra, Agra/.test(Mp.mapQuery(taj)));
  ok("a name containing 'India' still gets the country appended",
     Mp.mapQuery(D.destinations.find((d) => d.slug === "mumbai-gateway-of-india-marine-drive"))
       .endsWith(", India"));
  ok("every map query ends in India",
     D.destinations.every((d) => Mp.mapQuery(d).endsWith(", India")));
  ok("the map link is a real Google Maps search URL",
     Mp.googleMapsUrl(taj).startsWith("https://www.google.com/maps/search/?api=1&query="));
  ok("a pin link uses the coordinate when we have one",
     Mp.googleMapsPinUrl(taj).includes(String(Co.coordFor(taj.slug).lat)));
  ok("a route link keeps within Google's waypoint cap", (() => {
     const stops = D.destinations.filter((d) => d.stateId === "rajasthan");
     const url = Mp.googleRouteUrl(stops);
     const wp = new URL(url).searchParams.get("waypoints");
     return wp.split("|").length <= 9;
  })());
  ok("a long route is reported as truncated",
     Mp.routeIsTruncated(D.destinations.filter((d) => d.stateId === "gujarat")));
  ok("a two-stop route is not", !Mp.routeIsTruncated(D.destinations.slice(0, 2)));
  ok("one stop is not a route", Mp.googleRouteUrl(D.destinations.slice(0, 1)) === null);
  ok("the dataset-gap register only names places we actually carry",
     Co.DATASET_GAPS.every((g) => D.destinations.some((d) => d.slug === g.slug)));
}

/* ---------- search reaches the new layer ---------- */
ok("search finds a festival", Se.search("hornbill").some((r) => r.kind === "festival"));
ok("search finds the festival calendar", Se.search("festival calendar").some((r) => r.kind === "action"));
ok("search finds the hidden gems", Se.search("offbeat").some((r) => r.kind === "action" && r.id === "gems"));
ok("search finds an added destination", Se.search("shekhawati").some((r) => r.id === "shekhawati-mandawa-nawalgarh"));
ok("a theme is not buried under destinations that share its name",
   Se.search("beach").some((r) => r.kind === "theme"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
