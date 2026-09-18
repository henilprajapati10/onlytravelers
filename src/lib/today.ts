import type { SavedTrip } from "@/data/trips";
import type { TripPlan, TripStop, TravelLeg } from "@/lib/trip";

/**
 * Where the traveller is right now, and what happens next.
 *
 * Everything keys off the trip's start date: without one there is no "today",
 * only a plan.
 */

export interface TodayState {
  /** 1-based day of the trip. */
  dayNumber: number;
  /** Before it starts, during, or after. */
  phase: "before" | "during" | "after";
  /** Days until departure, when it has not started. */
  daysUntil: number;
  /** Where you are today. */
  current?: TripStop;
  /** The move that happens today, if any. */
  todayLeg?: TravelLeg;
  /** What comes next after today. */
  next?: TripStop;
  /** The leg that gets you to `next`. */
  nextLeg?: TravelLeg;
  /** Last day at the current stop. */
  lastDayHere: boolean;
  date: Date;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function todayFor(trip: SavedTrip, plan: TripPlan, now = new Date()): TodayState | null {
  if (!trip.startDate) return null;
  const start = startOfDay(new Date(trip.startDate));
  if (Number.isNaN(start.getTime())) return null;

  const today = startOfDay(now);
  const msPerDay = 24 * 60 * 60 * 1000;
  const offset = Math.round((today.getTime() - start.getTime()) / msPerDay);
  const dayNumber = offset + 1;

  if (dayNumber < 1) {
    return {
      dayNumber,
      phase: "before",
      daysUntil: -offset,
      lastDayHere: false,
      date: today,
      next: plan.stops[0],
    };
  }

  if (dayNumber > plan.totalDays) {
    return { dayNumber, phase: "after", daysUntil: 0, lastDayHere: false, date: today };
  }

  const current = plan.stops.find((s) => dayNumber >= s.startDay && dayNumber <= s.endDay);
  const index = current ? plan.stops.indexOf(current) : -1;

  // A leg lands on the day before its stop begins.
  const arriving = plan.stops.find((s) => s.arrivalLeg && s.arrivalLeg.days > 0 && s.startDay - 1 === dayNumber);
  const next = index >= 0 ? plan.stops[index + 1] : plan.stops.find((s) => s.startDay > dayNumber);

  return {
    dayNumber,
    phase: "during",
    daysUntil: 0,
    current,
    todayLeg: arriving?.arrivalLeg,
    next,
    nextLeg: next?.arrivalLeg,
    lastDayHere: Boolean(current && current.endDay === dayNumber),
    date: today,
  };
}

export function formatTripDate(startDate: string | undefined, dayNumber: number): string {
  if (!startDate) return `Day ${dayNumber}`;
  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return `Day ${dayNumber}`;
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
