"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { stateRings } from "@/lib/geo";
import { MAP_ATTRIBUTION } from "./IndiaMap";
import { getState } from "@/data/states";

export interface LivePin {
  lat: number;
  lng: number;
  label: string;
  href?: string;
}

export interface LiveMapProps {
  /** Whose boundary to draw. */
  stateId: string;
  pins: LivePin[];
  /** Centre on a single place instead of fitting the whole state. */
  center?: { lat: number; lng: number };
  zoom?: number;
  ariaLabel?: string;
  onReady?: () => void;
}

/**
 * Street tiles under the real state boundary, with every place pinned where
 * it actually is. No key: the tiles come from OpenStreetMap by default and
 * from whichever provider `NEXT_PUBLIC_MAP_TILES_URL` names when the site
 * outgrows the public servers' fair-use policy (see DEPLOYMENT.md).
 *
 * Markers are drawn as SVG circles rather than image icons so nothing here
 * depends on Leaflet's bundled PNGs resolving under a bundler.
 */
export const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILES_URL?.trim() || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION?.trim() ||
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export default function LiveMap({ stateId, pins, center, zoom = 11, ariaLabel, onReady }: LiveMapProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !el) return;
      map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
      map.attributionControl.setPrefix(false);
      L.tileLayer(TILE_URL, {
        maxZoom: 18,
        attribution: `${TILE_ATTRIBUTION} · ${MAP_ATTRIBUTION}`,
      }).addTo(map);

      const rings = stateRings(stateId);
      const boundary = rings.length
        ? L.polygon(rings, { color: "#e8492a", weight: 2, fillColor: "#e8492a", fillOpacity: 0.06 }).addTo(map)
        : null;

      for (const p of pins) {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: center ? 9 : 6,
          color: "#ffffff",
          weight: 2,
          fillColor: "#0b1b30",
          fillOpacity: 1,
        }).addTo(map);
        const safe = p.label.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
        marker.bindPopup(
          p.href
            ? `<a href="${p.href}" style="font-weight:600;color:#0b1b30">${safe} →</a>`
            : `<span style="font-weight:600">${safe}</span>`
        );
        marker.bindTooltip(p.label, { direction: "top", offset: [0, -6] });
      }

      if (center) {
        map.setView([center.lat, center.lng], zoom);
      } else {
        // Boundary and pins together: Diu sits far from Daman, Yanam far
        // from Puducherry, and the dataset lacks most of Lakshadweep, so
        // fitting the boundary alone would leave real places off-screen.
        const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
        if (boundary) bounds.extend(boundary.getBounds());
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [16, 16] });
      }
      onReady?.();
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
    // Pins are derived from the state/centre; re-running on their identity
    // would rebuild the map on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, center?.lat, center?.lng, zoom]);

  return (
    <div
      ref={box}
      role="region"
      aria-label={ariaLabel ?? `Map of ${getState(stateId)?.name ?? stateId}`}
      data-testid="live-map"
      className="h-full w-full rounded-lg bg-[#f4f8fc]"
    />
  );
}
