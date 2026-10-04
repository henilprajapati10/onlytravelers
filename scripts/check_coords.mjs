/**
 * Verifies every destination coordinate against the real boundary of the
 * state it claims to be in.
 *
 * A coordinate in the wrong state is not a rounding error — it sends someone
 * to the other end of the country. Point-in-polygon against the high-resolution
 * 2023 geometry catches transposed pairs, wrong signs and
 * copy-paste slips that eyeballing never would.
 *
 *   node scripts/check_coords.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { runInThisContext } from "node:vm";
import { loadModule } from "./ts-modules.mjs";

const root = process.cwd();
const require = createRequire(root + "/package.json");
const { transform } = require("sucrase");

const src = fs
  .readFileSync(path.join(root, "node_modules/@amcharts/amcharts4-geodata/india2023High.js"), "utf8")
  .replace(/export default map;?/, "globalThis.__indiaMap = map;");
runInThisContext(src);
const geo = globalThis.__indiaMap;

const ID_MAP = JSON.parse(
  fs
    .readFileSync(path.join(root, "scripts/gen_shapes.mjs"), "utf8")
    .match(/const ID_MAP = (\{[\s\S]*?\n\});/)[1]
    .replace(/(\w[\w-]*):/g, '"$1":')
    .replace(/"(IN-\w+)"/g, '"$1"')
    .replace(/'/g, '"')
    .replace(/,(\s*\})/g, "$1")
);

const { destinations } = loadModule("src/data/destinations.ts");
const { coords, DATASET_GAPS: GAP_LIST } = loadModule("src/data/coords.ts");

/** Ray casting on a single ring. */
function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** A polygon is its outer ring minus any holes. */
function inPolygon(lon, lat, poly) {
  if (!inRing(lon, lat, poly[0])) return false;
  for (let k = 1; k < poly.length; k++) if (inRing(lon, lat, poly[k])) return false;
  return true;
}

const polysByState = {};
for (const f of geo.features) {
  const id = ID_MAP[f.id];
  if (!id) continue;
  polysByState[id] =
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
}

/* Coastlines, river deltas and island groups are simplified in any dataset,
 * and a jetty or a beach legitimately sits a little outside the drawn line.
 * India also has real enclaves — Mahe is Puducherry inside Kerala, Yanam is
 * Puducherry inside Andhra Pradesh — so proximity, not strict containment,
 * is the honest test. Anything further than this is a genuine mistake. */
const TOLERANCE_KM = 25;

/* Places where the boundary dataset itself is incomplete, not where our
 * coordinate is wrong. The list itself lives in src/data/coords.ts, because
 * it is a limitation the traveller is shown on /map-data, not a private
 * exception list — one register, checked here and rendered there. */
const DATASET_GAPS = Object.fromEntries(GAP_LIST.map((g) => [g.slug, g.why]));

function haversineKm(aLat, aLon, bLat, bLon) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(toRad(aLat)) * Math.cos(toRad(bLat));
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance from a point to the nearest vertex of a state's boundary. */
function kmToState(lon, lat, polys) {
  let best = Infinity;
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [rLon, rLat] of ring) {
        const d = haversineKm(lat, lon, rLat, rLon);
        if (d < best) best = d;
      }
    }
  }
  return best;
}

/** Nearest state, to say where a stray coordinate actually landed. */
function whereIsIt(lon, lat) {
  for (const [id, polys] of Object.entries(polysByState)) {
    if (polys.some((p) => inPolygon(lon, lat, p))) return id;
  }
  return null;
}

const bySlug = new Map(destinations.map((d) => [d.slug, d]));

let checked = 0;
const wrongState = [];
const unknownSlug = [];
const outOfIndia = [];
const nearBoundary = [];
const gaps = [];

for (const [slug, c] of Object.entries(coords)) {
  const d = bySlug.get(slug);
  if (!d) {
    unknownSlug.push(slug);
    continue;
  }
  checked++;

  if (c.lat < 6 || c.lat > 37.5 || c.lng < 68 || c.lng > 97.5) {
    outOfIndia.push(`${slug} -> ${c.lat},${c.lng}`);
    continue;
  }

  const polys = polysByState[d.stateId];
  if (!polys) continue;
  if (polys.some((p) => inPolygon(c.lng, c.lat, p))) continue;

  // Not strictly inside — is it near enough to be a coast, an enclave or a
  // border, or is it genuinely somewhere else?
  const km = kmToState(c.lng, c.lat, polys);
  if (DATASET_GAPS[slug]) {
    gaps.push({ slug, why: DATASET_GAPS[slug] });
    continue;
  }
  if (km <= TOLERANCE_KM) {
    nearBoundary.push({ slug, state: d.stateId, km: Math.round(km) });
    continue;
  }

  const actual = whereIsIt(c.lng, c.lat);
  wrongState.push(
    `${slug}\n     claims ${d.stateId}, ${Math.round(km)} km outside it, falls in ${actual ?? "no state"} (${c.lat}, ${c.lng})`
  );
}

const placed = destinations.filter((d) => coords[d.slug]).length;

console.log(`checked ${checked} coordinates against real 2023 boundaries`);
console.log(`coverage: ${placed}/${destinations.length} destinations placed (${Math.round((placed / destinations.length) * 100)}%)\n`);

if (unknownSlug.length) {
  console.log(`UNKNOWN SLUGS (${unknownSlug.length}) — not in the catalogue:`);
  unknownSlug.forEach((s) => console.log("  •", s));
  console.log("");
}
if (outOfIndia.length) {
  console.log(`OUTSIDE INDIA (${outOfIndia.length}):`);
  outOfIndia.forEach((s) => console.log("  •", s));
  console.log("");
}
if (nearBoundary.length) {
  console.log(
    `NEAR THE LINE (${nearBoundary.length}) — coastal, island or enclave, within ${TOLERANCE_KM} km of the claimed state:`
  );
  nearBoundary
    .sort((a, b) => b.km - a.km)
    .forEach((n) => console.log(`  • ${n.slug} — ${n.km} km from ${n.state}`));
  console.log("");
}
if (gaps.length) {
  console.log(`DATASET GAPS (${gaps.length}) — coordinate correct, boundary missing:`);
  gaps.forEach((g) => console.log(`  • ${g.slug} — ${g.why}`));
  console.log("");
}
if (wrongState.length) {
  console.log(`WRONG STATE (${wrongState.length}):`);
  wrongState.forEach((s) => console.log("  •", s));
} else {
  console.log("every coordinate falls inside the state it claims");
}

process.exit(wrongState.length + unknownSlug.length + outOfIndia.length ? 1 : 0);
