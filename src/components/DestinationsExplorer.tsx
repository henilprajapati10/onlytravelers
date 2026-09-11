"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { destinations, regions, categories, type Region, type Category } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

export default function DestinationsExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [category, setCategory] = useState<Category | "All">(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      if (region !== "All" && d.region !== region) return false;
      if (category !== "All" && !d.categories.includes(category)) return false;
      if (
        q &&
        !`${d.name} ${d.state} ${d.tagline} ${d.description}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, region, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">All Destinations</h1>
      <p className="mt-2 text-navy-500">
        {destinations.length} places across India. Filter by region or theme,
        or search for a place, state, or vibe.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, states, vibes..."
          className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm text-navy-800 placeholder:text-navy-300 focus:border-coral-400 focus:outline-none sm:max-w-sm"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as Region | "All")}
          className="rounded-lg border border-navy-200 px-3 py-2.5 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
        >
          <option value="All">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "All")}
          className="rounded-lg border border-navy-200 px-3 py-2.5 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
        >
          <option value="All">All Themes</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(query || region !== "All" || category !== "All") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setRegion("All");
              setCategory("All");
            }}
            className="text-sm font-semibold text-coral-500"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-navy-400">
        Showing {filtered.length} of {destinations.length} destinations
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-navy-200 p-10 text-center text-navy-400">
          No destinations match those filters yet. Try clearing a filter.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
