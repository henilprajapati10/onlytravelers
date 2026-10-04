import { INDIA_BOUNDS, stateShapes } from "@/data/shapes";

/**
 * The state shapes are stored once, as SVG paths in a shared equirectangular
 * projection, because that is what the national map and the state pages
 * draw. A tile map wants the same boundary back in latitude and longitude.
 * Rather than ship the geometry twice, invert the projection here.
 *
 * The projection is linear in both axes, so the inverse is exact to the
 * precision the paths were written at (one decimal in a 1000-unit frame,
 * about 300 m on the ground) — more than enough for a boundary drawn over
 * street tiles at state zoom.
 */

export type LatLng = [number, number];

export function unprojectFromIndia(x: number, y: number): LatLng {
  const lon = x / (INDIA_BOUNDS.lonScale * INDIA_BOUNDS.scale) + INDIA_BOUNDS.minLon;
  const lat = INDIA_BOUNDS.maxLat - y / INDIA_BOUNDS.scale;
  return [Math.round(lat * 1e5) / 1e5, Math.round(lon * 1e5) / 1e5];
}

/**
 * An SVG path of the form "Mx,yLx,y…Z" (several subpaths for islands) as a
 * list of rings in [lat, lng] order, ready for a polygon layer.
 */
export function pathToRings(d: string): LatLng[][] {
  const rings: LatLng[][] = [];
  for (const sub of d.split("M")) {
    if (!sub.trim()) continue;
    const ring: LatLng[] = [];
    for (const pair of sub.replace(/Z/g, "").split("L")) {
      const [x, y] = pair.split(",").map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) ring.push(unprojectFromIndia(x, y));
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

const ringCache = new Map<string, LatLng[][]>();

/** The boundary of one state, in [lat, lng] rings. */
export function stateRings(stateId: string): LatLng[][] {
  const hit = ringCache.get(stateId);
  if (hit) return hit;
  const shape = stateShapes.find((s) => s.id === stateId);
  const rings = shape ? pathToRings(shape.d) : [];
  ringCache.set(stateId, rings);
  return rings;
}

/** [[south, west], [north, east]] for a state, for fitting a map to it. */
export function stateBounds(stateId: string): [LatLng, LatLng] | null {
  const shape = stateShapes.find((s) => s.id === stateId);
  if (!shape) return null;
  const [minX, minY, maxX, maxY] = shape.bbox;
  const [north, west] = unprojectFromIndia(minX, minY);
  const [south, east] = unprojectFromIndia(maxX, maxY);
  return [
    [south, west],
    [north, east],
  ];
}
