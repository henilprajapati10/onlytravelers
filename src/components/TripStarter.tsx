"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { themes, type Theme } from "@/data/destinations";
import { states } from "@/data/states";
import { useProfile } from "@/context/ProfileContext";
import { useTrips } from "@/context/TripsContext";
import { startTrip, type StarterResult } from "@/lib/starter";
import { monthFull, monthName, formatMonths } from "@/lib/trip";
import { shortDays, themeEmoji } from "@/lib/format";
import { sceneSvg } from "@/lib/scene";

const DAY_CHOICES = [3, 5, 7, 10, 14, 21];

export default function TripStarter() {
  const { profile } = useProfile();
  const { createTrip } = useTrips();
  const router = useRouter();

  const nextMonth = ((new Date().getMonth() + 1) % 12) + 1;
  const [days, setDays] = useState(7);
  const [month, setMonth] = useState(nextMonth);
  const [fromStateId, setFromStateId] = useState("");
  const [interests, setInterests] = useState<Theme[]>(profile.interests.slice(0, 3));
  const [result, setResult] = useState<StarterResult | null>(null);
  const [ran, setRan] = useState(false);

  const toggle = (t: Theme) =>
    setInterests((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const run = () => {
    setResult(
      startTrip({ days, month, fromStateId: fromStateId || undefined, interests, pace: profile.pace })
    );
    setRan(true);
  };

  const save = () => {
    if (!result) return;
    const trip = createTrip({ slugs: result.slugs, activate: true });
    router.push(`/trips/${trip.id}`);
  };

  const scene = useMemo(
    () => (result ? sceneSvg(result.slugs.join("-"), result.plan.stops[0].destination.themes, { width: 640, height: 200 }) : ""),
    [result]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Plan a trip</h1>
      <p className="mt-2 text-navy-500">
        Three questions. We check every stop against its season, add the travel between them,
        and give you something you can change.
      </p>

      <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <div>
          <span className="text-sm font-semibold text-navy-700">How many days do you have?</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAY_CHOICES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  days === d
                    ? "bg-navy-800 text-white"
                    : "border border-navy-200 text-navy-600 hover:border-coral-300"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold text-navy-700">Roughly when?</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonth(m)}
                aria-pressed={month === m}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  month === m
                    ? "bg-coral-500 text-white"
                    : "border border-navy-200 text-navy-600 hover:border-coral-300"
                }`}
              >
                {monthName(m)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold text-navy-700">
            What pulls you in?{" "}
            <span className="font-normal text-navy-400">Leave empty for anything</span>
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                aria-pressed={interests.includes(t)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  interests.includes(t)
                    ? "bg-navy-800 text-white"
                    : "border border-navy-200 text-navy-600 hover:border-coral-300"
                }`}
              >
                {themeEmoji[t]} {t}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-navy-700">
            Setting out from <span className="font-normal text-navy-400">optional</span>
          </span>
          <select
            id="from-state"
            value={fromStateId}
            onChange={(e) => setFromStateId(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            <option value="">Anywhere in India</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={run}
          className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Build me a trip
        </button>
        <p className="text-xs text-navy-400">
          Planning at a {profile.pace} pace, from your profile. Change it in{" "}
          <Link href="/profile" className="font-semibold text-coral-500">
            You
          </Link>
          .
        </p>
      </div>

      {ran && !result && (
        <div className="mt-6 rounded-2xl border border-coral-200 bg-coral-50 p-6">
          <h2 className="font-display font-semibold text-navy-800">Nothing fits that yet</h2>
          <p className="mt-2 text-sm text-navy-600">
            Nothing in the catalogue is in season in {monthFull(month)} for those themes. Try a
            different month, or clear the themes and let us pick.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          {result.relaxed === "interests" && (
            <div className="mb-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
              <h3 className="font-display text-sm font-semibold text-navy-800">
                Those themes are out of season in {monthFull(month)}
              </h3>
              <p className="mt-1 text-sm text-navy-600">
                {result.betterMonths && result.betterMonths.length
                  ? `They are at their best in ${formatMonths(result.betterMonths)}. Here is what ${monthFull(month)} is actually good for instead.`
                  : `Here is what ${monthFull(month)} is good for instead.`}
              </p>
            </div>
          )}

          <article className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
            <div className="relative aspect-[16/5]">
              <div className="absolute inset-0 h-full w-full" dangerouslySetInnerHTML={{ __html: scene }} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-2xl font-bold text-white">
                  {result.plan.totalDays} days, {result.plan.stops.length}{" "}
                  {result.plan.stops.length === 1 ? "stop" : "stops"}
                </h2>
                <p className="text-sm text-white/80">{result.plan.statesCovered.join(" · ")}</p>
              </div>
            </div>

            <div className="p-5">
              <ul className="flex flex-col gap-1.5">
                {result.reasons.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-navy-600">
                    <span className="text-coral-500" aria-hidden="true">
                      ✓
                    </span>
                    {r}
                  </li>
                ))}
              </ul>

              <ol className="mt-4 flex flex-wrap gap-1.5">
                {result.plan.stops.map((s, i) => (
                  <li key={s.destination.slug} className="flex items-center gap-1">
                    {i > 0 && <span className="text-navy-300">→</span>}
                    <Link
                      href={`/destinations/${s.destination.slug}`}
                      className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700 hover:text-coral-500"
                    >
                      {themeEmoji[s.destination.themes[0]]} {s.destination.name}
                    </Link>
                  </li>
                ))}
              </ol>

              <p className="mt-3 text-xs text-navy-400">
                {shortDays(result.plan.daysAtDestinations)} at the places ·{" "}
                {shortDays(result.plan.travelDays)} in transit ·{" "}
                {result.plan.approxKm.toLocaleString("en-IN")} km
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={save}
                  className="rounded-lg bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
                >
                  Save as my trip
                </button>
                <button
                  type="button"
                  onClick={run}
                  className="rounded-lg border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-coral-300"
                >
                  Try again
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
