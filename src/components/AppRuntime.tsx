"use client";

import { useEffect, useState } from "react";

/**
 * Registers the service worker and shows the two states a travelling app
 * has to be honest about: you are offline, and there is a newer version.
 */
export default function AppRuntime() {
  const [offline, setOffline] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

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

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    let cancelled = false;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        if (cancelled) return;
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        // Offline support is a bonus, never a requirement for the app to run.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!offline && !updateReady) return null;

  return (
    <div className="fixed inset-x-0 bottom-14 z-[60] flex justify-center px-4 md:bottom-4 print:hidden">
      {offline ? (
        <p className="rounded-full bg-navy-800 px-4 py-2 text-xs font-semibold text-white shadow-card">
          Offline — your saved trips and the pages you have opened still work
        </p>
      ) : (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-coral-500 px-4 py-2 text-xs font-semibold text-white shadow-card"
        >
          A new version is ready — tap to reload
        </button>
      )}
    </div>
  );
}
