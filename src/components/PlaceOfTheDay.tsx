"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getState } from "@/data/states";
import { advanceStreak, dayIndex, EMPTY_STREAK, placeOfTheDay, type Streak } from "@/lib/daily";
import { readJson, writeJson } from "@/lib/storage";
import { themeEmoji } from "@/lib/format";
import { useGuides } from "@/lib/useGuides";
import DestinationImage from "./DestinationImage";

export const STREAK_KEY = "onlytravelers.streak.v1";

/**
 * One place a day, the same for everyone, and a quiet count of how many
 * days in a row you have opened the app. The place is chosen by the date
 * alone, so this renders identically on the server and the client; only the
 * streak waits for the device.
 */
export default function PlaceOfTheDay() {
  const place = placeOfTheDay();
  const state = getState(place.stateId);
  const guide = useGuides();
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    const prev = readJson<Streak>(STREAK_KEY, EMPTY_STREAK);
    const safe: Streak =
      typeof prev?.current === "number" && typeof prev?.lastDay === "number" ? prev : EMPTY_STREAK;
    const next = advanceStreak(safe, dayIndex());
    if (next !== safe) writeJson(STREAK_KEY, next);
    setStreak(next);
  }, []);

  const summary = guide?.(place.slug)?.summary;

  return (
    <section data-testid="place-of-the-day" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card sm:grid-cols-[2fr_3fr]">
        <Link href={`/destinations/${place.slug}`} className="block">
          <DestinationImage destination={place} ratio="card" />
        </Link>
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral-600">
              Today&apos;s place
            </p>
            {streak && streak.current > 1 && (
              <p
                data-testid="streak"
                className="rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold text-navy-700"
                title={`Longest run: ${streak.longest} days · ${streak.seen} places seen`}
              >
                🔥 {streak.current}-day streak
              </p>
            )}
          </div>
          <h2 className="font-display mt-1 text-2xl font-bold text-navy-800">
            <Link href={`/destinations/${place.slug}`} className="hover:text-coral-600">
              {place.name}
            </Link>
          </h2>
          <p className="text-sm text-navy-500">
            {place.district}, {state?.name ?? place.stateName}
            {place.hiddenGem ? " · ◆ Hidden gem" : ""}
          </p>
          <p className="mt-3 line-clamp-4 text-sm text-navy-600">
            {summary ?? `${place.themes.join(", ")} · ${place.idealDays} ${place.idealDays === 1 ? "day" : "days"} · best ${place.bestMonthsLabel}`}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
            {place.themes.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] text-navy-600">
                {themeEmoji[t]} {t}
              </span>
            ))}
            <Link
              href={`/destinations/${place.slug}`}
              className="ml-auto text-sm font-semibold text-coral-500"
            >
              Read the guide →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
