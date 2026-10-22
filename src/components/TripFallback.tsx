"use client";

import { Suspense, useEffect, useState } from "react";
import { basePath } from "@/lib/basePath";
import TripWorkspace from "./TripWorkspace";

/**
 * On a static host there is no server to answer /trips/<id> — the trip
 * exists only on this device — so the host serves the 404 page, and this
 * notices the URL and renders the trip anyway. On a Node host the real
 * route answers first and this never runs.
 */
export default function TripFallback({ children }: { children: React.ReactNode }) {
  const [tripId, setTripId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.replace(new RegExp(`^${basePath}`), "");
    const m = path.match(/^\/trips\/([^/]+)\/?$/);
    setTripId(m ? decodeURIComponent(m[1]) : null);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!tripId) return <>{children}</>;
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading trip…</div>}>
      <TripWorkspace tripId={tripId} />
    </Suspense>
  );
}
