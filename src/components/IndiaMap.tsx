import Link from "next/link";
import { INDIA_VIEWBOX, projectToIndia, shapeFor, stateShapes } from "@/data/shapes";
import { getState } from "@/data/states";

/**
 * Real boundaries, not a dot on a blob.
 *
 * Every state is drawn from the 2023 administrative geometry, in one shared
 * projection — so the national map and a single state's page are the same
 * coordinates at different zooms, and a place pinned on one lands in exactly
 * the same spot on the other.
 */

export interface MapPin {
  lat: number;
  lng: number;
  label: string;
  href?: string;
  /** Approximate coordinates are drawn hollow, so the map never over-claims. */
  approximate?: boolean;
}

export const MAP_ATTRIBUTION = "Boundaries: amCharts geodata (2023 divisions)";

/* ---------- the whole country ---------- */

export function IndiaMap({
  activeStateId,
  linkStates = false,
  className = "",
}: {
  activeStateId?: string;
  /** Make every state a link to its page. */
  linkStates?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={
          activeStateId
            ? `Map of India with ${getState(activeStateId)?.name ?? activeStateId} highlighted`
            : "Map of India by state and union territory"
        }
      >
        {stateShapes.map((shape) => {
          const active = shape.id === activeStateId;
          const state = getState(shape.id);
          const path = (
            <path
              d={shape.d}
              fill={active ? "#e8492a" : "#dbe3ee"}
              stroke={active ? "#c73820" : "#ffffff"}
              strokeWidth={active ? 1.6 : 1}
              strokeLinejoin="round"
              className={linkStates ? "transition-[fill] hover:fill-[#b0c1d9]" : undefined}
            />
          );

          if (!linkStates || !state) {
            return (
              <g key={shape.id}>
                {path}
                <title>{state?.name ?? shape.sourceName}</title>
              </g>
            );
          }

          return (
            <Link key={shape.id} href={`/states/${shape.id}`} aria-label={state.name}>
              <g>
                {path}
                <title>{state.name}</title>
              </g>
            </Link>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-navy-400">
        {MAP_ATTRIBUTION}
      </figcaption>
    </figure>
  );
}

/* ---------- one state, filling the frame ---------- */

export function StateOutline({
  stateId,
  pins = [],
  showContext = true,
  className = "",
}: {
  stateId: string;
  pins?: MapPin[];
  /** Draw neighbouring states faintly behind, so the shape has a place. */
  showContext?: boolean;
  className?: string;
}) {
  const shape = shapeFor(stateId);
  const state = getState(stateId);
  if (!shape) return null;

  // The frame has to hold the pins as well as the outline. Coastal places sit
  // just outside the drawn coastline, and Lakshadweep's boundary data is a
  // single atoll out of thirty-six — using the shape alone would crop real
  // destinations off the edge of their own state's map.
  let [x0, y0, x1, y1] = shape.bbox;
  for (const pin of pins) {
    const { x, y } = projectToIndia(pin.lng, pin.lat);
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  // An island unit drawn at its own zoom is pins floating in nothing: the
  // mainland is hundreds of kilometres outside the frame, so there is no
  // coastline to read the position against. Rather than zoom out until the
  // destinations are specks, keep the useful zoom and add a locator inset.
  const others = stateShapes.filter((s) => s.id !== stateId);
  const reaches = (b: readonly [number, number, number, number]) =>
    b[0] < x1 && b[2] > x0 && b[1] < y1 && b[3] > y0;
  const needsLocator = showContext && !others.some((s) => reaches(s.bbox));

  let w = Math.max(x1 - x0, 1);
  let h = Math.max(y1 - y0, 1);

  // An SVG scaled to the column width renders as tall as its own aspect ratio
  // demands. Lakshadweep's destinations span four degrees of latitude and less
  // than two of longitude, so the honest bounding box would render a column of
  // map two and a half screens tall. Widen or heighten the frame — around the
  // same centre, never by moving the geometry — until it is a shape a page can
  // hold. Nothing is cropped; the extra frame shows neighbouring coastline.
  const MIN_ASPECT = 0.85;
  const MAX_ASPECT = 1.6;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  if (w / h < MIN_ASPECT) w = h * MIN_ASPECT;
  else if (w / h > MAX_ASPECT) h = w / MAX_ASPECT;
  x0 = cx - w / 2;
  y0 = cy - h / 2;

  // Small units would otherwise fill the frame edge to edge; give every
  // state the same proportional breathing room.
  const pad = Math.max(w, h) * 0.12;
  const vb = `${x0 - pad} ${y0 - pad} ${w + pad * 2} ${h + pad * 2}`;

  // Marker sizes are in viewBox units, so they must scale with the zoom or a
  // small state gets pins the size of the state.
  const unit = Math.max(w, h) / 100;

  return (
    <figure className={className}>
      <div className="relative">
        <svg
          viewBox={vb}
          className="h-auto w-full"
          role="img"
          aria-label={`Map of ${state?.name ?? stateId}${pins.length ? ` with ${pins.length} destinations` : ""}`}
        >
        {/* Anything not drawn is sea or another country; tinting it says so
            rather than leaving an island unit looking like a failed render. */}
        <rect
          x={x0 - pad}
          y={y0 - pad}
          width={w + pad * 2}
          height={h + pad * 2}
          fill="#f4f8fc"
        />
        {showContext &&
          others.map((s) => (
              <path key={s.id} d={s.d} fill="#eef2f7" stroke="#dbe3ee" strokeWidth={unit * 0.4} />
            ))}

        <path
          d={shape.d}
          fill="#fdece8"
          stroke="#e8492a"
          strokeWidth={unit * 0.9}
          strokeLinejoin="round"
        />

        {pins.map((pin, i) => {
          const { x, y } = projectToIndia(pin.lng, pin.lat);
          const marker = (
            <>
              <circle
                cx={x}
                cy={y}
                r={unit * 2.4}
                fill={pin.approximate ? "#ffffff" : "#0b1b30"}
                stroke="#0b1b30"
                strokeWidth={unit * 0.7}
                strokeDasharray={pin.approximate ? `${unit},${unit}` : undefined}
              />
              <title>
                {pin.label}
                {pin.approximate ? " (approximate location)" : ""}
              </title>
            </>
          );
          return pin.href ? (
            <Link key={`${pin.label}-${i}`} href={pin.href}>
              <g>{marker}</g>
            </Link>
          ) : (
            <g key={`${pin.label}-${i}`}>{marker}</g>
          );
        })}
        </svg>

        {/* Nothing else is in frame, so the map alone cannot say where in
            India this is. The inset answers that without zooming the
            destinations down to specks. */}
        {needsLocator && (
          <svg
            viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`}
            className="absolute bottom-2 left-2 h-[38%] w-auto rounded border border-navy-100 bg-white/90"
            role="img"
            aria-label={`Where ${state?.name ?? stateId} is within India`}
          >
            {stateShapes.map((s) => (
              <path
                key={s.id}
                d={s.d}
                fill={s.id === stateId ? "#e8492a" : "#dbe3ee"}
                stroke="#ffffff"
                strokeWidth={1}
              />
            ))}
            <circle
              cx={(shape.bbox[0] + shape.bbox[2]) / 2}
              cy={(shape.bbox[1] + shape.bbox[3]) / 2}
              r={34}
              fill="none"
              stroke="#e8492a"
              strokeWidth={9}
            />
          </svg>
        )}
      </div>
      <figcaption className="mt-2 text-center text-[11px] text-navy-400">
        {MAP_ATTRIBUTION}
      </figcaption>
    </figure>
  );
}
