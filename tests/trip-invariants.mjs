/* Loads the app's real modules and probes the trip builder for broken invariants. */
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
  "src/data/guides/index.ts", "src/lib/format.ts", "src/lib/scene.ts", "src/lib/trip.ts",
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
const T = __req("@/lib/trip");
const F = __req("@/lib/format");

const problems = [];
const note = (tag, msg) => problems.push(`[${tag}] ${msg}`);
const pick = (...slugs) => slugs.map((s) => D.destinations.find((d) => d.slug === s)).filter(Boolean);

/* ---- 1. half-day handling ---- */
const delhi = D.destinations.filter((d) => d.stateId === "delhi"); // 10 x 0.5 day
const tDelhi = T.buildTrip(delhi);
const rawDelhi = delhi.reduce((s, d) => s + d.idealDays, 0);
console.log(`Delhi: ${delhi.length} stops, catalogue says ${rawDelhi} days, builder says ${tDelhi.totalDays} days (${tDelhi.daysAtDestinations} at places)`);
if (tDelhi.totalDays > rawDelhi + 1) {
  note("HALF-DAY", `all-Delhi trip inflates ${rawDelhi} catalogue days into ${tDelhi.totalDays} days — half-day stops each consume a whole day`);
}

/* ---- 2. sub-day travel legs are free ---- */
const raj = D.destinations.filter((d) => d.stateId === "rajasthan").slice(0, 6);
const tRaj = T.buildTrip(raj);
const roadLegs = tRaj.stops.filter((s) => s.arrivalLeg && s.arrivalLeg.days > 0 && s.arrivalLeg.days < 1);
const hoursIgnored = roadLegs.reduce((s, x) => s + x.arrivalLeg.approxHours, 0);
console.log(`Rajasthan 6 stops: ${tRaj.totalDays} days, travelDays=${tRaj.travelDays}, sub-day legs=${roadLegs.length} (${hoursIgnored} hrs)`);
if (roadLegs.length && tRaj.travelDays === 0) {
  note("TRAVEL", `${roadLegs.length} road legs totalling ${hoursIgnored} hrs add 0 days to the plan — half-day legs are silently free`);
}

/* ---- 3. totalDays must equal the day list ---- */
for (const items of [delhi, raj, pick("taj-mahal-agra", "pangong-tso", "radhanagar-beach-havelock")]) {
  const t = T.buildTrip(items);
  const maxDay = Math.max(...t.days.map((d) => d.day));
  if (maxDay !== t.totalDays) note("COUNT", `totalDays=${t.totalDays} but last day in list is ${maxDay}`);
  const seen = new Set();
  for (const d of t.days) {
    const key = `${d.day}`;
    if (d.kind === "travel" && seen.has(key)) note("COUNT", `day ${d.day} appears twice`);
    seen.add(key);
  }
  const sumStay = items.reduce((s, x) => s + x.idealDays, 0);
  if (sumStay !== t.daysAtDestinations) note("COUNT", `daysAtDestinations mismatch ${sumStay} vs ${t.daysAtDestinations}`);
}

/* ---- 4. cart total vs trip total (two different "days" numbers shown to users) ---- */
const sample = pick("red-fort", "qutub-minar", "lotus-temple");
const cartDays = sample.reduce((s, d) => s + d.idealDays, 0);
const tripDays = T.buildTrip(sample).daysAtDestinations;
console.log(`3 Delhi half-days: cart shows ${cartDays}, trip shows ${tripDays} at places`);
if (cartDays !== tripDays) note("UI", `cart says "${F.formatDays(cartDays)} at the places" but trip says ${tripDays} — same label, two numbers`);

/* ---- 5. single destination ---- */
const one = T.buildTrip(pick("hampi-unesco"));
if (one.travelDays !== 0 || one.approxKm !== 0) note("SINGLE", `single-stop trip reports ${one.travelDays} travel days / ${one.approxKm} km`);
if (one.stops[0].startDay !== 1) note("SINGLE", "single trip does not start on day 1");

/* ---- 6. formatMonths round-trip ---- */
const cases = [[[10,11,12,1,2,3],"Oct-Mar"],[[6],"Jun"],[[1,2,3,4,5,6,7,8,9,10,11,12],"Year round"],[[3,4,5,10,11,12],null],[[12,1],"Dec-Jan"],[[],"No overlapping window"]];
for (const [m, expect] of cases) {
  const got = T.formatMonths(m);
  if (expect && got !== expect) note("MONTHS", `formatMonths(${JSON.stringify(m)}) = "${got}", expected "${expect}"`);
}
console.log('formatMonths([3,4,5,10,11,12]) =', T.formatMonths([3,4,5,10,11,12]));

/* ---- 7. every destination survives a solo trip ---- */
let solo = 0;
for (const d of D.destinations) {
  try {
    const t = T.buildTrip([d]);
    if (!t || !t.stops.length || !t.days.length) { note("SOLO", `${d.slug} produced an empty plan`); solo++; }
  } catch (e) { note("SOLO", `${d.slug} threw: ${e.message}`); solo++; }
}
console.log(`solo-trip failures: ${solo}/${D.destinations.length}`);

/* ---- 8. big bag: all 359 ---- */
try {
  const all = T.buildTrip(D.destinations);
  console.log(`all 359: ${all.totalDays} days, ${all.approxKm.toLocaleString()} km, warnings=${all.warnings.length}`);
  if (all.stops.length !== D.destinations.length) note("BIG", `dropped stops: ${D.destinations.length - all.stops.length}`);
} catch (e) { note("BIG", `all-359 trip threw: ${e.message}`); }

/* ---- 9. route sanity: does sequencing zigzag between states? ---- */
const mixed = pick("taj-mahal-agra","hampi-unesco","varanasi-ghats-kashi-vishwanath","mysuru-palace-chamundi-hill","agra-fort","gokarna");
const seq = T.buildTrip(mixed).stops.map((s) => s.destination.stateName);
let flips = 0;
for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i-2] && seq[i] !== seq[i-1]) flips++;
console.log("sequence:", seq.join(" → "));
if (flips) note("ROUTE", `route revisits a state it already left (${flips} time(s)): ${seq.join(" → ")}`);

/* ---- 10. state data integrity ---- */
for (const s of S.states) {
  if (!s.airports.length) note("DATA", `${s.name} has no airports`);
  if (!s.peakMonths.length) note("DATA", `${s.name} has no parsed peak months`);
  if (s.lat < 6 || s.lat > 37 || s.lng < 67 || s.lng > 98) note("DATA", `${s.name} hub coords out of India bounds`);
}
const ids = new Set(S.states.map((s) => s.id));
for (const d of D.destinations) if (!ids.has(d.stateId)) note("DATA", `${d.slug} points at unknown state ${d.stateId}`);

console.log("\n=== PROBLEMS (" + problems.length + ") ===");
problems.forEach((p) => console.log(" •", p));
