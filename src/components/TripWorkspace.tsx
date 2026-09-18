"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { useProfile } from "@/context/ProfileContext";
import { destinations } from "@/data/destinations";
import { TRIP_STATUS, type TripStatus } from "@/data/trips";
import { buildTrip, formatMonths, monthFull } from "@/lib/trip";
import { formatDays, shortDays } from "@/lib/format";
import { buildPrepList, groupPrep } from "@/lib/prep";
import { buildBookingTasks } from "@/lib/bookings";
import { kindLabel, providersFor } from "@/data/operators";
import {
  EXPENSE_CATEGORIES,
  addExpense,
  formatRupees,
  loadExpenses,
  removeExpense,
  sumExpenses,
  totalsByCategory,
  type Expense,
  type ExpenseCategory,
} from "@/lib/expenses";
import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";
import TripItinerary from "./TripItinerary";

type Tab = "itinerary" | "prep" | "bookings" | "spend";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "itinerary", label: "Itinerary", icon: "🗓️" },
  { id: "prep", label: "Prep", icon: "✅" },
  { id: "bookings", label: "Bookings", icon: "🎫" },
  { id: "spend", label: "Spend", icon: "💸" },
];

type ChecklistStore = Record<string, string[]>;

export default function TripWorkspace() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { trips, updateTrip, setActiveTrip, isHydrated } = useTrips();
  const { profile } = useProfile();

  const tripId = params?.id ?? "";
  const trip = trips.find((t) => t.id === tripId) ?? null;

  const tabParam = search.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "itinerary"
  );
  const [ticked, setTicked] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    if (tripId) {
      setTicked(readJson<ChecklistStore>(STORAGE_KEYS.checklists, {})[tripId] ?? []);
      setExpenses(loadExpenses(tripId));
    }
  }, [tripId]);

  // Opening a trip makes it the one the Add buttons fill.
  useEffect(() => {
    if (trip) setActiveTrip(trip.id);
  }, [trip, setActiveTrip]);

  const items = useMemo(
    () =>
      (trip?.slugs ?? [])
        .map((s) => destinations.find((d) => d.slug === s))
        .filter((d): d is (typeof destinations)[number] => Boolean(d)),
    [trip]
  );

  const plan = useMemo(
    () =>
      buildTrip(items, {
        travelMonth: trip?.travelMonth,
        daysAvailable: trip?.daysAvailable,
      }),
    [items, trip?.travelMonth, trip?.daysAvailable]
  );

  const prep = useMemo(() => (plan ? buildPrepList(plan, profile) : []), [plan, profile]);
  const bookings = useMemo(
    () => (plan ? buildBookingTasks(plan, trip?.startDate) : []),
    [plan, trip?.startDate]
  );

  if (!isHydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-navy-400">Loading trip…</div>;
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-800">Trip not found</h1>
        <p className="mt-3 text-navy-500">
          Trips are saved on the device that made them, so a link to one won&apos;t open
          anywhere else. Share a trip with the share link on the itinerary instead.
        </p>
        <Link
          href="/trips"
          className="mt-6 inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          My trips
        </Link>
      </div>
    );
  }

  const setTabAndUrl = (next: Tab) => {
    setTab(next);
    router.replace(`/trips/${trip.id}${next === "itinerary" ? "" : `?tab=${next}`}`, { scroll: false });
  };

  const toggleTick = (id: string) => {
    setTicked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      const store = readJson<ChecklistStore>(STORAGE_KEYS.checklists, {});
      store[trip.id] = next;
      writeJson(STORAGE_KEYS.checklists, store);
      return next;
    });
  };

  const doneCount = prep.filter((p) => ticked.includes(p.id)).length;
  const criticalLeft = prep.filter((p) => p.critical && !ticked.includes(p.id)).length;
  const status = TRIP_STATUS.find((s) => s.id === trip.status) ?? TRIP_STATUS[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/trips" className="text-sm font-medium text-navy-400 hover:text-coral-500">
        ← My trips
      </Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {renaming ? (
            <input
              autoFocus
              defaultValue={trip.name}
              onBlur={(e) => {
                updateTrip(trip.id, { name: e.target.value.trim() || trip.name });
                setRenaming(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="w-full rounded-lg border border-coral-300 px-3 py-2 font-display text-2xl font-bold text-navy-800 focus:outline-none"
            />
          ) : (
            <h1
              className="font-display cursor-text text-3xl font-bold text-navy-800"
              onClick={() => setRenaming(true)}
              title="Click to rename"
            >
              {trip.name}
            </h1>
          )}
          <p className="mt-1 text-sm text-navy-400">
            {items.length} {items.length === 1 ? "stop" : "stops"}
            {plan ? ` · ${plan.totalDays} days · ${plan.statesCovered.length} states` : ""}
            {trip.travelMonth ? ` · ${monthFull(trip.travelMonth)}` : ""}
          </p>
        </div>

        <select
          value={trip.status}
          onChange={(e) => updateTrip(trip.id, { status: e.target.value as TripStatus })}
          aria-label="Trip status"
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.tone}`}
        >
          {TRIP_STATUS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-navy-100 pb-px">
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge =
            t.id === "prep" && criticalLeft > 0
              ? criticalLeft
              : t.id === "bookings" && bookings.length
                ? bookings.length
                : 0;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTabAndUrl(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-2.5 py-2.5 text-sm font-semibold transition sm:px-4 ${
                active
                  ? "border-b-2 border-coral-500 text-coral-600"
                  : "border-b-2 border-transparent text-navy-500 hover:text-navy-800"
              }`}
            >
              <span aria-hidden="true">{t.icon}</span>
              {t.label}
              {badge > 0 && (
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    t.id === "prep" ? "bg-coral-100 text-coral-700" : "bg-navy-100 text-navy-600"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
          <h2 className="font-display text-lg font-semibold text-navy-800">This trip is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-navy-500">
            Add destinations and everything else here fills in — the route, the prep list, what
            needs booking and in what order.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/destinations"
              className="rounded-lg bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
            >
              Add destinations
            </Link>
            <Link
              href="/circuits"
              className="rounded-lg border border-navy-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-500"
            >
              Load a circuit
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {tab === "itinerary" && plan && (
            <TripItinerary
              plan={plan}
              tripId={trip.id}
              travelMonth={trip.travelMonth ?? 0}
              daysAvailable={trip.daysAvailable ?? 0}
              startDate={trip.startDate ?? ""}
              onChange={(patch) => updateTrip(trip.id, patch)}
            />
          )}

          {/* ---------- Prep ---------- */}
          {tab === "prep" && (
            <div>
              <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display font-semibold text-navy-800">
                      {doneCount} of {prep.length} done
                    </h2>
                    <p className="text-sm text-navy-500">
                      {criticalLeft > 0
                        ? `${criticalLeft} of them will stop the trip if you skip them.`
                        : "Nothing critical outstanding."}
                    </p>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-navy-100">
                    <div
                      className="h-full bg-coral-500 transition-all"
                      style={{ width: `${prep.length ? (doneCount / prep.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-navy-400">
                  Built from what is actually in this trip — permits, ferries, altitude, season
                  and distance. Change the itinerary and this changes with it.
                </p>
              </div>

              {groupPrep(prep).map((group) => (
                <section key={group.category} className="mt-6">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-400">
                    {group.category}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {group.items.map((item) => {
                      const done = ticked.includes(item.id);
                      return (
                        <li key={item.id}>
                          <label
                            className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                              done
                                ? "border-navy-100 bg-sand-50"
                                : item.critical
                                  ? "border-coral-200 bg-white"
                                  : "border-navy-100 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => toggleTick(item.id)}
                              className="mt-0.5 h-5 w-5 shrink-0 accent-coral-500"
                            />
                            <span className="min-w-0">
                              <span
                                className={`font-display block font-semibold ${
                                  done ? "text-navy-400 line-through" : "text-navy-800"
                                }`}
                              >
                                {item.title}
                                {item.critical && !done && (
                                  <span className="ml-2 rounded bg-coral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-coral-700">
                                    Critical
                                  </span>
                                )}
                              </span>
                              <span className="mt-1 block text-sm text-navy-600">{item.detail}</span>
                              {item.because && item.because.length > 0 && (
                                <span className="mt-1.5 block text-xs text-navy-400">
                                  Because of: {item.because.join(", ")}
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {/* ---------- Bookings ---------- */}
          {tab === "bookings" && (
            <div>
              <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                <h2 className="font-display font-semibold text-navy-800">
                  {bookings.length} things to book, in this order
                </h2>
                <p className="mt-1 text-sm text-navy-500">
                  Permits first, then the transport everything hangs off, then park entry, then
                  rooms — the easiest thing to move.
                </p>
                <p className="mt-3 rounded-lg bg-sand-100 p-3 text-xs text-navy-500">
                  We never quote a price. Fares and availability change by the week, so take the
                  brief below to the operator and book at their live price.
                </p>
              </div>

              <label className="mt-4 flex flex-col gap-1 text-sm">
                <span className="font-semibold text-navy-700">Start date</span>
                <input
                  type="date"
                  value={trip.startDate ?? ""}
                  onChange={(e) => updateTrip(trip.id, { startDate: e.target.value })}
                  className="w-full max-w-xs rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
                />
                <span className="text-xs text-navy-400">
                  Set this and every booking below gets a real date instead of a day number.
                </span>
              </label>

              <ul className="mt-5 flex flex-col gap-3">
                {bookings.map((task) => {
                  const providers = providersFor(task.kind);
                  return (
                    <li
                      key={task.id}
                      className={`rounded-xl border bg-white p-4 shadow-card ${
                        task.urgency === "first" ? "border-l-4 border-coral-400" : "border-navy-100"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-500">
                            {kindLabel(task.kind)}
                          </span>
                          <h3 className="font-display mt-1.5 font-semibold text-navy-800">
                            {task.title}
                          </h3>
                          <p className="mt-1 text-sm text-navy-600">{task.brief}</p>
                          {task.urgencyNote && (
                            <p className="mt-1 text-xs font-medium text-coral-600">{task.urgencyNote}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(`${task.title}\n${task.brief}`)}
                          className="shrink-0 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-coral-300"
                        >
                          Copy details
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {providers.map((p) =>
                          p.url ? (
                            <a
                              key={p.id}
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700"
                              title={p.note}
                            >
                              {p.name} ↗{p.official ? " · official" : ""}
                            </a>
                          ) : (
                            <span
                              key={p.id}
                              className="rounded-lg border border-dashed border-navy-200 px-3 py-1.5 text-xs text-navy-400"
                              title={p.note}
                            >
                              {p.name} — add your partner link
                            </span>
                          )
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ---------- Spend ---------- */}
          {tab === "spend" && (
            <SpendTab
              tripId={trip.id}
              expenses={expenses}
              setExpenses={setExpenses}
              days={plan?.totalDays ?? 0}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SpendTab({
  tripId,
  expenses,
  setExpenses,
  days,
}: {
  tripId: string;
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  days: number;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");

  const total = sumExpenses(expenses);
  const byCategory = totalsByCategory(expenses);
  const perDay = days > 0 ? Math.round(total / days) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    setExpenses(addExpense(tripId, { category, label, amount: value }));
    setLabel("");
    setAmount("");
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-bold tabular-nums text-navy-800">
            {formatRupees(total)}
          </div>
          <div className="text-xs uppercase tracking-wide text-navy-400">total so far</div>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-bold tabular-nums text-navy-800">
            {days ? formatRupees(perDay) : "—"}
          </div>
          <div className="text-xs uppercase tracking-wide text-navy-400">per day</div>
        </div>
        <div className="col-span-2 rounded-xl border border-navy-100 bg-white p-4 text-center shadow-card sm:col-span-1">
          <div className="font-display text-2xl font-bold tabular-nums text-navy-800">
            {expenses.length}
          </div>
          <div className="text-xs uppercase tracking-wide text-navy-400">entries</div>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 rounded-xl border border-navy-100 bg-white p-4 shadow-card">
        <h2 className="font-display text-sm font-semibold text-navy-800">Add a spend</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What was it?"
            aria-label="What was it?"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800 focus:border-coral-400 focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            aria-label="Category"
            className="rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-700 focus:border-coral-400 focus:outline-none"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="₹"
            aria-label="Amount in rupees"
            className="w-24 rounded-lg border border-navy-200 px-3 py-2 text-sm tabular-nums text-navy-800 focus:border-coral-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Add
          </button>
        </div>
      </form>

      {byCategory.length > 0 && (
        <div className="mt-5 rounded-xl border border-navy-100 bg-white p-4 shadow-card">
          <h2 className="font-display text-sm font-semibold text-navy-800">Where it went</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {byCategory.map(({ category: c, total: t }) => (
              <li key={c} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 text-navy-600">{c}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-navy-50">
                  <span
                    className="block h-full bg-navy-600"
                    style={{ width: `${total ? (t / total) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-20 shrink-0 text-right font-semibold tabular-nums text-navy-800">
                  {formatRupees(t)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expenses.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {[...expenses].reverse().map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 text-sm shadow-card"
            >
              <span className="rounded bg-navy-50 px-2 py-0.5 text-[11px] text-navy-500">{e.category}</span>
              <span className="min-w-0 flex-1 truncate text-navy-800">{e.label}</span>
              <span className="font-semibold tabular-nums text-navy-800">{formatRupees(e.amount)}</span>
              <button
                type="button"
                onClick={() => setExpenses(removeExpense(tripId, e.id))}
                aria-label={`Remove ${e.label}`}
                className="rounded px-2 text-navy-300 hover:text-coral-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {expenses.length === 0 && (
        <p className="mt-5 rounded-xl border border-dashed border-navy-200 p-8 text-center text-sm text-navy-400">
          Nothing logged yet. We never fill this in for you — fares and room rates move too fast
          for a guess to be worth anything.
        </p>
      )}
    </div>
  );
}
