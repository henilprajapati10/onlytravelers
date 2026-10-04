"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import type { LiveMapProps } from "./LiveMap";

// Leaflet is browser-only and ~40 KB; it arrives as its own chunk on the
// pages that draw a map and nowhere else.
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

/**
 * The accurate map, with the hand-drawn outline underneath it until the
 * tiles can take over. Server render, no JavaScript, a slow connection — the
 * outline is what shows, and it is correct, just not pannable.
 */
export default function LiveMapLoader({
  fallback,
  className = "",
  ...props
}: LiveMapProps & { fallback: ReactNode; className?: string }) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {!ready && <div className="absolute inset-0 flex items-start justify-center">{fallback}</div>}
      <div className={`absolute inset-0 transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
        <LiveMap {...props} onReady={() => setReady(true)} />
      </div>
    </div>
  );
}
