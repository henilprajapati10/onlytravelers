"use client";

import { useEffect, useState } from "react";
import type { Guide } from "@/data/guides";

/**
 * The guides are the heaviest thing in the catalogue — roughly 400 KB of
 * prose for 568 places — and only a handful of them are ever on screen at
 * once. Server-rendered pages read them directly at build time; client
 * components use this hook so the prose arrives as one shared, immutable
 * chunk after first paint instead of inside every page's first-load bundle.
 *
 * The lookup is `undefined` until the chunk lands, and everything that uses
 * it must render completely without it.
 */
export type GuideLookup = (slug: string) => Guide | undefined;

let pending: Promise<GuideLookup> | null = null;

function loadGuides(): Promise<GuideLookup> {
  if (!pending) {
    pending = import("@/data/guides").then((m) => m.getGuide);
  }
  return pending;
}

export function useGuides(enabled = true): GuideLookup | undefined {
  const [lookup, setLookup] = useState<GuideLookup | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    loadGuides().then((fn) => {
      // setState with a function would be treated as an updater.
      if (live) setLookup(() => fn);
    });
    return () => {
      live = false;
    };
  }, [enabled]);
  return lookup;
}
