/**
 * Turns real boundary data into the SVG paths the site draws states with.
 *
 * Source: @amcharts/amcharts4-geodata, india2023Low — the 2023 division of
 * India, which is the one that matches this app's 36 states and union
 * territories exactly (Ladakh separate from Jammu & Kashmir, and Dadra &
 * Nagar Haveli merged with Daman & Diu).
 *
 * Everything is projected once into a single India-wide viewBox, so the same
 * coordinates serve both the national map and each state's own page — a page
 * just zooms its viewBox to that state's bounding box.
 *
 *   node scripts/gen_shapes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { runInThisContext } from "node:vm";

const root = process.cwd();
const SOURCE = "node_modules/@amcharts/amcharts4-geodata/india2023Low.js";

const src = fs
  .readFileSync(path.join(root, SOURCE), "utf8")
  .replace(/export default map;?/, "globalThis.__indiaMap = map;");
runInThisContext(src);
const geo = globalThis.__indiaMap;

/** amCharts ISO codes to this app's state ids. */
const ID_MAP = {
  "IN-AN": "andaman-nicobar-islands",
  "IN-AP": "andhra-pradesh",
  "IN-AR": "arunachal-pradesh",
  "IN-AS": "assam",
  "IN-BR": "bihar",
  "IN-CH": "chandigarh",
  "IN-CG": "chhattisgarh",
  "IN-DL": "delhi",
  "IN-DH": "dadra-nagar-haveli-and-daman-diu",
  "IN-GA": "goa",
  "IN-GJ": "gujarat",
  "IN-HP": "himachal-pradesh",
  "IN-HR": "haryana",
  "IN-JH": "jharkhand",
  "IN-JK": "jammu-kashmir",
  "IN-KA": "karnataka",
  "IN-KL": "kerala",
  "IN-LD": "lakshadweep",
  "IN-LK": "ladakh",
  "IN-MH": "maharashtra",
  "IN-ML": "meghalaya",
  "IN-MN": "manipur",
  "IN-MP": "madhya-pradesh",
  "IN-MZ": "mizoram",
  "IN-NL": "nagaland",
  "IN-OD": "odisha",
  "IN-PB": "punjab",
  "IN-PY": "puducherry",
  "IN-RJ": "rajasthan",
  "IN-SK": "sikkim",
  "IN-TN": "tamil-nadu",
  "IN-TR": "tripura",
  "IN-TS": "telangana",
  "IN-UK": "uttarakhand",
  "IN-UP": "uttar-pradesh",
  "IN-WB": "west-bengal",
};

/* ---------- projection ----------
   Equirectangular, with longitude squeezed by cos(mid-latitude) so the
   country is not stretched sideways. At India's scale this is accurate
   enough to be recognisable and cheap enough to run in the browser. */
const WIDTH = 1000;
const MID_LAT_RAD = (23 * Math.PI) / 180;
const LON_SCALE = Math.cos(MID_LAT_RAD);

let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const f of geo.features) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
}

const spanX = (maxLon - minLon) * LON_SCALE;
const spanY = maxLat - minLat;
const SCALE = WIDTH / spanX;
const HEIGHT = Math.round(spanY * SCALE);

const px = (lon) => ((lon - minLon) * LON_SCALE * SCALE);
const py = (lat) => ((maxLat - lat) * SCALE);
const r = (n) => Math.round(n * 10) / 10;

/** Drops rings too small to draw, which keeps the file honest about size. */
function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
}
const MIN_RING_AREA = 0.00002; // square degrees

function ringToPath(ring) {
  const pts = [];
  let lastX = null, lastY = null;
  for (const [lon, lat] of ring) {
    const x = r(px(lon));
    const y = r(py(lat));
    // Consecutive duplicates after rounding add bytes and nothing else.
    if (x === lastX && y === lastY) continue;
    pts.push(`${x},${y}`);
    lastX = x;
    lastY = y;
  }
  if (pts.length < 3) return "";
  return `M${pts.join("L")}Z`;
}

const shapes = [];
for (const f of geo.features) {
  const id = ID_MAP[f.id];
  if (!id) {
    console.warn(`  unmapped feature: ${f.id} (${f.properties?.name})`);
    continue;
  }
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;

  const rings = [];
  for (const poly of polys) for (const ring of poly) rings.push(ring);
  rings.sort((a, b) => ringArea(b) - ringArea(a));

  let d = "";
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  let kept = 0, dropped = 0;

  rings.forEach((ring, i) => {
    // Lakshadweep's atolls are each smaller than the threshold, so a state
    // must never lose its largest ring to it — that would erase the state.
    if (i > 0 && ringArea(ring) < MIN_RING_AREA) { dropped++; return; }
    const seg = ringToPath(ring);
    if (!seg) { dropped++; return; }
    d += seg;
    kept++;
    for (const [lon, lat] of ring) {
      const x = px(lon), y = py(lat);
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  });

  if (!d) {
    console.warn(`  no drawable geometry for ${id}`);
    continue;
  }

  shapes.push({
    id,
    name: f.properties?.name ?? id,
    d,
    bbox: [r(x0), r(y0), r(x1), r(y1)],
    dropped,
    parts: kept,
  });
}

shapes.sort((a, b) => a.id.localeCompare(b.id));

const out = `// Generated by scripts/gen_shapes.mjs — do not edit by hand.
//
// Boundary geometry derived from @amcharts/amcharts4-geodata (india2023Low),
// used under the amCharts linkware licence, which permits commercial use with
// attribution. The attribution is rendered on the map itself; see
// src/components/IndiaMap.tsx and /map-data.
//
// One shared projection for the whole country, so the national map and each
// state page draw from the same coordinates — a state page simply zooms its
// viewBox to that state's bounding box.

export interface StateShape {
  id: string;
  /** Name as it appears in the source data, for cross-checking. */
  sourceName: string;
  /** SVG path in the shared India viewBox below. */
  d: string;
  /** [minX, minY, maxX, maxY] within the same viewBox. */
  bbox: [number, number, number, number];
}

export const INDIA_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT} };

/** The geographic window the projection covers, for placing point markers. */
export const INDIA_BOUNDS = {
  minLon: ${r(minLon)},
  maxLon: ${r(maxLon)},
  minLat: ${r(minLat)},
  maxLat: ${r(maxLat)},
  lonScale: ${Math.round(LON_SCALE * 1e6) / 1e6},
  scale: ${Math.round(SCALE * 1e4) / 1e4},
};

/** Projects a coordinate into the same viewBox the shapes are drawn in. */
export function projectToIndia(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon - INDIA_BOUNDS.minLon) * INDIA_BOUNDS.lonScale * INDIA_BOUNDS.scale,
    y: (INDIA_BOUNDS.maxLat - lat) * INDIA_BOUNDS.scale,
  };
}

export const stateShapes: StateShape[] = ${JSON.stringify(
  shapes.map((s) => ({ id: s.id, sourceName: s.name, d: s.d, bbox: s.bbox })),
  null,
  0
).replace(/\},\{/g, "},\n  {").replace(/^\[/, "[\n  ").replace(/\]$/, ",\n]")};

const BY_ID = new Map(stateShapes.map((s) => [s.id, s]));

export function shapeFor(stateId: string): StateShape | undefined {
  return BY_ID.get(stateId);
}
`;

const outFile = path.join(root, "src/data/shapes.ts");
fs.writeFileSync(outFile, out);

const bytes = fs.statSync(outFile).size;
console.log(`wrote ${outFile}`);
console.log(`  ${shapes.length} states · viewBox ${WIDTH}x${HEIGHT} · ${(bytes / 1024).toFixed(0)} KB`);
const totalDropped = shapes.reduce((s, x) => s + x.dropped, 0);
console.log(`  ${shapes.reduce((s, x) => s + x.parts, 0)} rings kept, ${totalDropped} sub-threshold rings dropped`);
