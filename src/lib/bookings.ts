import type { TripPlan } from "@/lib/trip";
import type { BookingTask } from "@/data/operators";

/**
 * Turns an itinerary into the list of things that actually have to be
 * booked, in the order they should be booked. No prices — those come from
 * the operator at the time, per the directory's own rule.
 */
export function buildBookingTasks(plan: TripPlan, startDate?: string): BookingTask[] {
  const tasks: BookingTask[] = [];

  const dateFor = (day: number): string => {
    if (!startDate) return `day ${day} of the trip`;
    const d = new Date(startDate);
    if (Number.isNaN(d.getTime())) return `day ${day} of the trip`;
    d.setDate(d.getDate() + day - 1);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Permits first — nothing else is worth booking if these do not come through.
  plan.stops
    .filter((s) => s.destination.permitRequired)
    .forEach((s) => {
      tasks.push({
        id: `permit-${s.destination.slug}`,
        kind: "permit",
        title: `Permit for ${s.destination.name}`,
        brief: `Inner Line Permit, ${s.state.name}, for ${dateFor(s.startDay)}. Applicant details and photo ID required.`,
        day: s.startDay,
        urgency: "first",
        urgencyNote: "Apply before booking anything else on this leg.",
      });
    });

  // Then the transport that everything else hangs off.
  plan.stops.forEach((s, i) => {
    const leg = s.arrivalLeg;
    if (!leg || leg.days === 0) return;

    const kind =
      leg.mode === "Flight"
        ? "flight"
        : leg.mode === "Ferry or flight"
          ? "ferry"
          : leg.mode === "Train or road"
            ? "train"
            : "road";

    const from = plan.stops[i - 1];
    const route =
      kind === "flight"
        ? `${from?.state.airports[0] ?? from?.state.capital} → ${s.state.airports[0] ?? s.state.capital}`
        : kind === "train"
          ? `${(from?.state.railhead ?? "").split(",")[0]} → ${s.state.railhead.split(",")[0]}`
          : `${leg.fromName} → ${leg.toName}`;

    tasks.push({
      id: `leg-${s.destination.slug}`,
      kind,
      title: `${leg.mode}: ${leg.fromName} → ${leg.toName}`,
      brief: `${route}, ${dateFor(Math.max(1, s.startDay - 1))}. About ${leg.approxKm} km, ${leg.approxHours} hrs door to door.`,
      day: Math.max(1, s.startDay - 1),
      urgency: kind === "ferry" ? "first" : kind === "train" ? "early" : "normal",
      urgencyNote:
        kind === "ferry"
          ? "Sailings are limited — book this before accommodation."
          : kind === "train"
            ? "Reserved classes open 60 days ahead and fill quickly."
            : undefined,
    });
  });

  // Park and trek entry, which sells out separately from everything else.
  plan.stops
    .filter((s) => s.destination.themes.includes("Wildlife") || s.destination.themes.includes("Trekking"))
    .forEach((s) => {
      tasks.push({
        id: `entry-${s.destination.slug}`,
        kind: "activity",
        title: `${s.destination.themes.includes("Wildlife") ? "Safari" : "Trek permit"}: ${s.destination.name}`,
        brief: `${s.destination.name}, ${s.state.name}, for ${dateFor(s.startDay)}. Book the specific zone or slot, with the ID you will carry.`,
        day: s.startDay,
        urgency: "early",
        urgencyNote: "Daily numbers are capped; these open months ahead.",
      });
    });

  // Stays last, because they are the easiest thing to move.
  plan.stops.forEach((s) => {
    const nights = s.endDay - s.startDay + 1;
    tasks.push({
      id: `stay-${s.destination.slug}`,
      kind: "stay",
      title: `Stay near ${s.destination.name}`,
      brief: `${s.destination.district}, ${s.state.name}. ${nights} night${nights === 1 ? "" : "s"} from ${dateFor(s.startDay)}.`,
      day: s.startDay,
      urgency: "normal",
    });
  });

  const urgencyRank = { first: 0, early: 1, normal: 2 };
  // Permits outrank everything, including the ferries that are otherwise
  // booked first: there is no point holding a sailing you cannot travel to.
  const kindRank = (kind: BookingTask["kind"]) => (kind === "permit" ? 0 : 1);

  return tasks.sort(
    (a, b) =>
      urgencyRank[a.urgency] - urgencyRank[b.urgency] ||
      kindRank(a.kind) - kindRank(b.kind) ||
      (a.day ?? 0) - (b.day ?? 0)
  );
}
