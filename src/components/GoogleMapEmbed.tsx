"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * An embedded Google Map that is honest about signal. Offline, an iframe is a
 * grey box; this shows what still works instead — the open-in-Maps link, which
 * the Google Maps app can serve from a downloaded offline area.
 */
export default function GoogleMapEmbed({
  src,
  title,
  openUrl,
  className = "aspect-square",
  fallback,
}: {
  src: string;
  title: string;
  /** Where the "open in Google Maps" link goes when the embed cannot load. */
  openUrl: string;
  className?: string;
  /** Shown instead of the map with no signal, e.g. the offline locator. */
  fallback?: ReactNode;
}) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (offline) {
    return (
      <div className={`flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg bg-sand-100 p-4 text-center ${className}`}>
        {fallback}
        <p className="text-xs text-navy-500">
          No signal, so no live map. The Google Maps app still works if you saved this area offline.
        </p>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700"
        >
          Open in Google Maps
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      data-google-map
      className={`w-full rounded-lg border-0 bg-sand-100 ${className}`}
    />
  );
}
