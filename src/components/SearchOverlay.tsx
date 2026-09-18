"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search, SEARCH_SUGGESTIONS, type SearchResult } from "@/lib/search";
import { useCart } from "@/context/TripsContext";
import { readJson, writeJson } from "@/lib/storage";

const RECENT_KEY = "onlytravelers.recentSearches.v1";
const MAX_RECENT = 6;

const KIND_ICON: Record<SearchResult["kind"], string> = {
  destination: "📍",
  state: "🗺️",
  circuit: "🧭",
  theme: "🏷️",
  action: "⚡",
};

/**
 * One box that reaches the whole app. On a super app the alternative — pick a
 * section, then filter, then scroll — is the thing people give up on.
 */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { isInCart, toggleCart } = useCart();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    if (!open) return;
    setRecent(readJson<string[]>(RECENT_KEY, []));
    // The overlay is useless without focus, and focus has to wait for paint.
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Keep the highlighted row on screen when arrowing through a long list.
  useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const remember = useCallback((term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    const next = [trimmed, ...readJson<string[]>(RECENT_KEY, []).filter((r) => r !== trimmed)].slice(
      0,
      MAX_RECENT
    );
    writeJson(RECENT_KEY, next);
    setRecent(next);
  }, []);

  const go = useCallback(
    (result: SearchResult) => {
      remember(query);
      onClose();
      setQuery("");
      router.push(result.href);
    },
    [onClose, query, remember, router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[cursor];
      if (hit) go(hit);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy-800/40 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search OnlyTravelers"
        className="mx-auto mt-[8vh] w-[min(42rem,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-navy-100 px-4 py-3">
          <span aria-hidden="true" className="text-lg">
            🔎
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            type="search"
            placeholder="Search places, states, circuits — or type what you feel like"
            aria-label="Search"
            className="w-full bg-transparent text-base text-navy-800 outline-none placeholder:text-navy-300"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-navy-200 px-2 py-1 text-xs font-semibold text-navy-500 hover:border-navy-400"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-4">
              {recent.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
                    Recent
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setQuery(r)}
                        className="rounded-full border border-navy-200 px-3 py-1 text-sm text-navy-600 hover:border-coral-300 hover:text-coral-500"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
                Try
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full bg-sand-50 px-3 py-1 text-sm text-navy-600 hover:bg-coral-50 hover:text-coral-500"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-navy-500">
              Nothing matches “{query.trim()}”. Try a state, a district or a theme like Beach.
            </p>
          )}

          {results.length > 0 && (
            <ul ref={listRef} role="listbox" aria-label="Search results">
              {results.map((r, i) => (
                <li
                  key={`${r.kind}-${r.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  className={`flex items-center gap-3 border-b border-navy-50 px-4 py-3 last:border-0 ${
                    i === cursor ? "bg-sand-50" : "bg-white"
                  }`}
                  onMouseEnter={() => setCursor(i)}
                >
                  <span aria-hidden="true" className="text-lg">
                    {KIND_ICON[r.kind]}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(r)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-sm font-semibold text-navy-800">
                      {r.title}
                    </span>
                    <span className="block truncate text-xs text-navy-500">{r.subtitle}</span>
                  </button>
                  {r.slug && (
                    <button
                      type="button"
                      onClick={() => {
                        remember(query);
                        toggleCart(r.slug!);
                      }}
                      className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                        isInCart(r.slug)
                          ? "border-coral-300 bg-coral-50 text-coral-600"
                          : "border-navy-200 text-navy-600 hover:border-coral-300 hover:text-coral-500"
                      }`}
                      aria-label={
                        isInCart(r.slug) ? `Remove ${r.title} from trip` : `Add ${r.title} to trip`
                      }
                    >
                      {isInCart(r.slug) ? "In trip" : "+ Trip"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
