import type { Metadata } from "next";
import Link from "next/link";
import { festivals, festivalsInMonth } from "@/data/festivals";
import { getState } from "@/data/states";
import { monthFull } from "@/lib/trip";
import FestivalList from "@/components/FestivalList";

export const metadata: Metadata = {
  title: "India's festival calendar — OnlyTravelers",
  description:
    "What is actually happening, month by month, across all of India: festivals, melas and gatherings, with what each one does to a trip. Dates move with the lunar calendar, and we say so.",
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function FestivalsPage() {
  const byMonth = MONTHS.map((m) => ({ month: m, list: festivalsInMonth(m) }));
  const states = new Set(festivals.map((f) => f.stateId));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">
        India&apos;s festival calendar
      </h1>
      <p className="mt-3 max-w-2xl text-navy-600">
        Most travel sites reduce a whole country to &ldquo;best time to visit: October to
        March&rdquo;. India does not work like that. The year is organised around festivals, and
        walking into one unprepared — or missing one by a week — changes the trip completely.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          [String(festivals.length), "festivals"],
          [String(states.size), "states & UTs"],
          ["12", "months covered"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card"
          >
            <div className="font-display text-2xl font-bold text-navy-800">{value}</div>
            <div className="text-xs uppercase tracking-wide text-navy-400">{label}</div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-navy-700">
        <span className="font-semibold">About the dates.</span> Most of these follow lunar or
        regional calendars, so the Gregorian date moves every year — Holi is in March, but which
        day in March changes. We give you the months and say how the date is reckoned, rather than
        inventing a precise date that would be wrong by next year. Confirm the exact days before
        you book around one.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Jump to month">
        {byMonth.map(({ month, list }) => (
          <a
            key={month}
            href={`#month-${month}`}
            className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700 transition hover:border-coral-300 hover:text-coral-500"
          >
            {monthFull(month)}
            <span className="ml-1.5 text-xs font-normal text-navy-400">{list.length}</span>
          </a>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-12">
        {byMonth.map(({ month, list }) => (
          <section key={month} id={`month-${month}`} className="scroll-mt-24">
            <div className="border-b border-navy-100 pb-3">
              <h2 className="font-display text-xl font-semibold text-navy-800">
                {monthFull(month)}
              </h2>
              <p className="mt-1 text-sm text-navy-500">
                {list.length} {list.length === 1 ? "gathering" : "gatherings"} across{" "}
                {new Set(list.map((f) => f.stateId)).size}{" "}
                {new Set(list.map((f) => f.stateId)).size === 1 ? "state" : "states"}
                {list.length > 0 && " · "}
                {list.length > 0 &&
                  [...new Set(list.map((f) => getState(f.stateId)?.name))].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="mt-5">
              <FestivalList festivals={list} showState />
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-navy-800 p-8 text-center text-white">
        <h2 className="font-display text-2xl font-semibold">Plan a trip around one</h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">
          Tell us the month and we will build the itinerary around what is in season — and tell you
          what is on while you are there.
        </p>
        <Link
          href="/start"
          className="mt-6 inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          Plan my trip
        </Link>
      </div>
    </div>
  );
}
