"use client";

import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { useTrips } from "@/context/TripsContext";
import { COMPANY_OPTIONS, PACE_OPTIONS, STAY_OPTIONS } from "@/data/profile";
import { themes } from "@/data/destinations";
import { themeEmoji } from "@/lib/format";
import { STORAGE_KEYS } from "@/lib/storage";

export default function ProfileEditor() {
  const { profile, updateProfile, resetProfile, isHydrated } = useProfile();
  const { trips } = useTrips();

  if (!isHydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-navy-400">Loading…</div>;
  }

  const toggleInterest = (theme: (typeof themes)[number]) => {
    const has = profile.interests.includes(theme);
    updateProfile({
      interests: has ? profile.interests.filter((t) => t !== theme) : [...profile.interests, theme],
    });
  };

  const completed = trips.filter((t) => t.status === "completed").length;
  const statesVisited = new Set(
    trips.filter((t) => t.status === "completed").flatMap((t) => t.slugs)
  ).size;

  const card = "rounded-2xl border border-navy-100 bg-white p-5 shadow-card";
  const chip = (on: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      on ? "bg-navy-800 text-white" : "border border-navy-200 bg-white text-navy-600 hover:border-coral-300"
    }`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">You</h1>
      <p className="mt-2 text-navy-500">
        How you travel, so the app plans the way you would. All of it stays on this device —
        there is no account, and nothing here is sent anywhere.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          [String(trips.length), "trips saved"],
          [String(completed), "completed"],
          [String(statesVisited), "places seen"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
            <div className="font-display text-2xl font-bold tabular-nums text-navy-800">{v}</div>
            <div className="text-xs uppercase tracking-wide text-navy-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <section className={card}>
          <h2 className="font-display font-semibold text-navy-800">The basics</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-navy-600">Name</span>
              <input
                id="profile-name"
                value={profile.name ?? ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="What should we call you?"
                className="rounded-lg border border-navy-200 px-3 py-2 text-navy-800 focus:border-coral-400 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-navy-600">Home city</span>
              <input
                id="profile-home"
                value={profile.homeCity ?? ""}
                onChange={(e) => updateProfile({ homeCity: e.target.value })}
                placeholder="Where do trips start?"
                className="rounded-lg border border-navy-200 px-3 py-2 text-navy-800 focus:border-coral-400 focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display font-semibold text-navy-800">Your pace</h2>
          <p className="mt-1 text-sm text-navy-500">
            We warn you when a trip is faster than this.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {PACE_OPTIONS.map((p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  profile.pace === p.id ? "border-coral-300 bg-coral-50" : "border-navy-100"
                }`}
              >
                <input
                  type="radio"
                  name="pace"
                  checked={profile.pace === p.id}
                  onChange={() => updateProfile({ pace: p.id })}
                  className="mt-1 accent-coral-500"
                />
                <span>
                  <span className="block font-semibold text-navy-800">{p.label}</span>
                  <span className="block text-sm text-navy-500">{p.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display font-semibold text-navy-800">What pulls you in</h2>
          <p className="mt-1 text-sm text-navy-500">
            Used to sort what you see first. Pick as many as you like.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleInterest(t)}
                aria-pressed={profile.interests.includes(t)}
                className={chip(profile.interests.includes(t))}
              >
                {themeEmoji[t]} {t}
              </button>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display font-semibold text-navy-800">How you travel</h2>
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <span className="text-sm font-medium text-navy-600">Usually with</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {COMPANY_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateProfile({ company: c.id })}
                    aria-pressed={profile.company === c.id}
                    className={chip(profile.company === c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-navy-600">Where you stay</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {STAY_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateProfile({ stayStyle: s.id })}
                    aria-pressed={profile.stayStyle === s.id}
                    title={s.detail}
                    className={chip(profile.stayStyle === s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={profile.vegetarian}
                onChange={(e) => updateProfile({ vegetarian: e.target.checked })}
                className="h-5 w-5 accent-coral-500"
              />
              <span className="text-navy-700">Vegetarian — add food notes to the prep list</span>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-navy-600">Access needs</span>
              <textarea
                id="profile-access"
                value={profile.accessibilityNotes ?? ""}
                onChange={(e) => updateProfile({ accessibilityNotes: e.target.value })}
                rows={2}
                placeholder="Step-free access, limited walking, anything we should keep in mind"
                className="rounded-lg border border-navy-200 px-3 py-2 text-navy-800 focus:border-coral-400 focus:outline-none"
              />
              <span className="text-xs text-navy-400">
                Many sites in this catalogue involve long stair climbs — we flag the worst of
                them in the traveler tips.
              </span>
            </label>
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display font-semibold text-navy-800">Your data</h2>
          <p className="mt-1 text-sm text-navy-500">
            Trips, preferences, checklists and spend are stored in this browser under{" "}
            <code className="rounded bg-sand-100 px-1 text-xs text-navy-600">
              {STORAGE_KEYS.trips.split(".")[0]}.*
            </code>
            . Clearing site data removes them, and they do not follow you to another device.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/trips"
              className="rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:border-coral-300"
            >
              My trips
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset your travel preferences? Saved trips are not affected.")) {
                  resetProfile();
                }
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-navy-400 hover:text-coral-500"
            >
              Reset preferences
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
