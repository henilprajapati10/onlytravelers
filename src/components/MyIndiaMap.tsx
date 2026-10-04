"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTrips } from "@/context/TripsContext";
import { states } from "@/data/states";
import { loadManualVisited, saveManualVisited, summariseVisited } from "@/lib/visited";
import { downloadFile } from "@/lib/export";
import { IndiaMap, MAP_ATTRIBUTION } from "./IndiaMap";

const VISITED_FILL = "#e8492a";
const TRIP_FILL = "#c73820";
const SVG_ID = "my-india-svg";

/**
 * The map of where you have been. Completed trips colour their states in by
 * themselves; everything else is one tap. The count at the top is the
 * number people compare, and the download is the thing they post.
 */
export default function MyIndiaMap() {
  const { trips, isHydrated } = useTrips();
  const [manual, setManual] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setManual(loadManualVisited());
    setReady(true);
  }, []);

  const summary = useMemo(() => summariseVisited(manual, trips), [manual, trips]);

  const fills = useMemo(() => {
    const out: Record<string, string> = {};
    for (const id of summary.ids) out[id] = summary.fromTrips.has(id) ? TRIP_FILL : VISITED_FILL;
    return out;
  }, [summary]);

  const toggle = (id: string) => {
    // A state earned by a completed trip stays; the tap is for the rest.
    if (summary.fromTrips.has(id)) return;
    const next = manual.includes(id) ? manual.filter((x) => x !== id) : [...manual, id];
    setManual(next);
    saveManualVisited(next);
  };

  const download = () => {
    const svg = document.getElementById(SVG_ID);
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute("class");
    clone.setAttribute("width", "1000");
    clone.setAttribute("height", "1200");
    const label = `${summary.count} of ${summary.total} states & UTs`;
    const text = `<text x="500" y="1170" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="700" fill="#0b1b30">My India · ${label}</text><text x="500" y="1196" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="#7a8ba3">onlytravelers · ${MAP_ATTRIBUTION}</text>`;
    clone.setAttribute("viewBox", "0 0 1000 1210");
    clone.insertAdjacentHTML("beforeend", text);
    downloadFile("my-india.svg", clone.outerHTML, "image/svg+xml");
  };

  const nextUp = summary.untouchedZones[0];
  const nextState = nextUp ? states.find((s) => s.zone === nextUp) : undefined;

  return (
    <section
      data-testid="my-india"
      className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold text-navy-800">My India</h2>
          <p className="text-sm text-navy-500">Tap a state you have been to. Completed trips fill in on their own.</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold tabular-nums text-navy-800" data-testid="my-india-count">
            {ready && isHydrated ? summary.count : "–"}
            <span className="text-base font-semibold text-navy-400"> / {summary.total}</span>
          </div>
          <div className="text-xs uppercase tracking-wide text-navy-400">states & UTs · {summary.percent}%</div>
        </div>
      </div>

      <IndiaMap
        fills={fills}
        onSelect={toggle}
        svgId={SVG_ID}
        caption={false}
        className="mx-auto mt-4 w-full max-w-sm"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-navy-500">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: VISITED_FILL }} /> been
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: TRIP_FILL }} /> from a completed trip
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#dbe3ee]" /> not yet
        </span>
        <span className="ml-auto text-[11px] text-navy-400">{MAP_ATTRIBUTION}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={download}
          className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
        >
          Download my map
        </button>
        {nextState && summary.count > 0 && (
          <Link
            href={`/destinations?zone=${encodeURIComponent(nextUp!)}`}
            className="rounded-lg bg-coral-50 px-3 py-2 text-sm font-semibold text-coral-700 hover:bg-coral-100"
          >
            Nothing in the {nextUp} yet → start there
          </Link>
        )}
        {summary.count === 0 && ready && (
          <Link href="/start" className="rounded-lg bg-coral-50 px-3 py-2 text-sm font-semibold text-coral-700 hover:bg-coral-100">
            Blank map. Plan the first trip →
          </Link>
        )}
      </div>
    </section>
  );
}
