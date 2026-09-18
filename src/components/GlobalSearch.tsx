"use client";

import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";

export const SEARCH_EVENT = "onlytravelers:search";

/** Anything on the page can open search without threading props through. */
export function openSearch() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SEARCH_EVENT));
}

/**
 * Mounted once, at the root, so the overlay is genuinely global: the same box
 * whether you are reading a destination or halfway through a trip.
 */
export default function GlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(SEARCH_EVENT, onOpen);

    const onKey = (e: KeyboardEvent) => {
      // Escape has to work from anywhere inside the overlay, not just the
      // input — after adding a stop, focus sits on a button.
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      // "/" is the web's search shortcut, but only when not already typing.
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return <SearchOverlay open={open} onClose={() => setOpen(false)} />;
}
