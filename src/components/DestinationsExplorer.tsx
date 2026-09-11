"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { destinations, themes, type Theme } from "@/data/destinations";
import { states, zones, type Zone } from "@/data/states";
import { guides } from "@/data/guides";
import { monthName } from "@/lib/trip";
import DestinationCard from "./DestinationCard";

const PAGE_SIZE = 24;

export default function DestinationsExplorer() {
  const params = useSearchParams();
  const initialTheme = params.get("theme");
  const initialZone = params.get("zone");
  const initialState = params.get("state");

  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<Zone | "All">(
    initialZone && zones.includes(initialZone as Zone) ? (initialZone as Zone) : "All"
  );
  const [stateId, setStateId] = useState<string>(
    initialState && states.some((s) => s.id === initialState) ? initialState : "All"
  );
  const [theme, setTheme] = useState<Theme | "All">(
    initialTheme && themes.includes(initialTheme as Theme) ? (initialTheme as Theme) : "All"
  );
  const [month, setMonth] = useState<number | 0>(0);
  const [maxDays, setMaxDays] = useState<number | 0>(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      if (zone !== "All" && d.zone !== zone) return false;
      if (stateId !== "All" && d.stateId !== stateId) return false;
      if (theme !== "All" && !d.themes.includes(theme)) return false;
      if (month && !d.bestMonths.includes(month)) return false;
      if (maxDays && d.idealDays > maxDays) return false;
      if (q) {
        const guide = guides[d.slug];
        const hay = `${d.name} ${d.district} ${d.stateName} ${d.rawTheme} ${guide?.summary ?? ""}`;
        if (!hay.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, zone, stateId, theme, month, maxDays]);

  const stateOptions = useMemo(
    () => states.filter((s) => zone === "All" || s.zone === zone),
    [zone]
  );

  const hasFilters =
    Boolean(query) || zone !== "All" || stateId !== "All" || theme !== "All" || month !== 0 || maxDays !== 0;

  const reset = () => {
    setQuery("");
    setZone("All");
    setStateId("All");
    setTheme("All");
    setMonth(0);
    setMaxDays(0);
    setVisible(PAGE_SIZE);
  };

  const selectClass =
    "rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-700 focus:border-coral-400 focus:outline-none";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">All destinations</h1>
      <p className="mt-2 max-w-2xl text-navy-500">
        {destinations.length} places across all 36 states and union territories. Filter by
        where you are going, what you like, when you can travel, or how much time you have.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="text"
          id="dest-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Search a place, district or state…"
          className="rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-800 placeholder:text-navy-300 focus:border-coral-400 focus:outline-none lg:col-span-3"
        />

        <select
          id="filter-zone"
          value={zone}
          onChange={(e) => {
            setZone(e.target.value as Zone | "All");
            setStateId("All");
            setVisible(PAGE_SIZE);
          }}
          className={selectClass}
        >
          <option value="All">All zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <select
          id="filter-state"
          value={stateId}
          onChange={(e) => {
            setStateId(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          className={selectClass}
        >
          <option value="All">All states &amp; UTs</option>
          {stateOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          id="filter-theme"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value as Theme | "All");
            setVisible(PAGE_SIZE);
          }}
          className={selectClass}
        >
          <option value="All">All themes</option>
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          id="filter-month"
          value={month}
          onChange={(e) => {
            setMonth(Number(e.target.value));
            setVisible(PAGE_SIZE);
          }}
          className={selectClass}
        >
          <option value={0}>Any month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              Good in {monthName(m)}
            </option>
          ))}
        </select>

        <select
          id="filter-days"
          value={maxDays}
          onChange={(e) => {
            setMaxDays(Number(e.target.value));
            setVisible(PAGE_SIZE);
          }}
          className={selectClass}
        >
          <option value={0}>Any length</option>
          <option value={0.5}>Half a day</option>
          <option value={1}>Up to 1 day</option>
          <option value={2}>Up to 2 days</option>
          <option value={3}>Up to 3 days</option>
          <option value={5}>Up to 5 days</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-navy-200 px-3 py-2.5 text-sm font-semibold text-coral-500 hover:border-coral-300"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-navy-400">
        Showing {Math.min(visible, filtered.length)} of {filtered.length} destinations
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-navy-200 p-10 text-center text-navy-400">
          Nothing matches those filters. Try widening the month or the length.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
