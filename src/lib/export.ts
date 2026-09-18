import type { TripPlan } from "@/lib/trip";
import { formatDays } from "@/lib/format";

/** A trip is shareable as a link: the bag travels in the query string. */
export function tripShareUrl(slugs: string[], origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/trip?bag=${slugs.join(",")}`;
}

export function parseBagParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Plain-text itinerary — the version people paste into a message or email. */
export function tripToText(plan: TripPlan): string {
  const lines: string[] = [];
  lines.push("YOUR TRIP — OnlyTravelers");
  lines.push("Be travelers, not tourists.");
  lines.push("");
  lines.push(
    `${plan.stops.length} destinations · ${plan.statesCovered.length} states · ${plan.totalDays} days`
  );
  lines.push(
    `${formatDays(plan.daysAtDestinations)} at the places, ${formatDays(plan.travelDays)} in transit, about ${plan.approxKm.toLocaleString("en-IN")} km`
  );
  if (plan.commonMonths.length) {
    lines.push(`Best months for this whole trip: ${plan.commonMonths.map(monthShort).join(", ")}`);
  }
  lines.push("");
  lines.push("ROUTE");
  lines.push(
    [`Fly into ${plan.arrivalAirports[0] ?? "—"}`, ...plan.stops.map((s) => s.destination.name), `Out of ${plan.departureAirports[0] ?? "—"}`].join(
      " -> "
    )
  );
  lines.push("");
  lines.push("DAY BY DAY");
  plan.stops.forEach((stop, i) => {
    if (stop.arrivalLeg && stop.arrivalLeg.days > 0) {
      lines.push(
        `   ~ ${stop.arrivalLeg.mode}: ${stop.arrivalLeg.fromName} to ${stop.arrivalLeg.toName}, about ${stop.arrivalLeg.approxKm} km / ${stop.arrivalLeg.approxHours} hrs`
      );
    }
    const range = stop.endDay > stop.startDay ? `Days ${stop.startDay}-${stop.endDay}` : `Day ${stop.startDay}`;
    lines.push(`${i + 1}. ${range}: ${stop.destination.name}`);
    lines.push(`   ${stop.destination.district}, ${stop.state.name} · ${stop.destination.rawTheme}`);
    lines.push(`   Best months: ${stop.destination.bestMonthsLabel}`);
    lines.push(
      `   Airports: ${stop.state.airports.join(", ")} · Railhead: ${stop.state.railhead.split(",")[0]}`
    );
    if (stop.destination.permitRequired) lines.push("   PERMIT REQUIRED — arrange in advance.");
    lines.push("");
  });
  if (plan.warnings.length) {
    lines.push("BEFORE YOU BOOK");
    plan.warnings.forEach((w) => {
      lines.push(`- ${w.title}: ${w.detail}`);
    });
  }
  return lines.join("\n");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function monthShort(m: number) {
  return MONTHS[m - 1] ?? "";
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** RFC 5545 wants lines folded at 75 octets. */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length) {
    parts.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  return parts.join("\r\n");
}

function icsDate(start: Date, offsetDays: number): string {
  const d = new Date(start.getTime());
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/**
 * All-day calendar events, one per stop plus one per travel leg, so the trip
 * lands in a real calendar instead of staying on a web page.
 */
export function tripToIcs(plan: TripPlan, startDate: Date): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const out: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OnlyTravelers//Trip Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:OnlyTravelers itinerary",
  ];

  const event = (uid: string, startOffset: number, endOffsetExclusive: number, title: string, desc: string) => {
    out.push("BEGIN:VEVENT");
    out.push(`UID:${uid}@onlytravelers`);
    out.push(`DTSTAMP:${stamp}`);
    out.push(`DTSTART;VALUE=DATE:${icsDate(startDate, startOffset)}`);
    out.push(`DTEND;VALUE=DATE:${icsDate(startDate, endOffsetExclusive)}`);
    out.push(fold(`SUMMARY:${icsEscape(title)}`));
    out.push(fold(`DESCRIPTION:${icsEscape(desc)}`));
    out.push("END:VEVENT");
  };

  plan.stops.forEach((stop, i) => {
    if (stop.arrivalLeg && stop.arrivalLeg.days > 0) {
      const legDay = stop.startDay - 1;
      event(
        `leg-${i}-${stop.destination.slug}`,
        legDay - 1,
        legDay,
        `Travel: ${stop.arrivalLeg.fromName} → ${stop.arrivalLeg.toName}`,
        `${stop.arrivalLeg.mode}, about ${stop.arrivalLeg.approxKm} km / ${stop.arrivalLeg.approxHours} hrs. ${stop.arrivalLeg.note}`
      );
    }
    const desc = [
      `${stop.destination.district}, ${stop.state.name}`,
      `Theme: ${stop.destination.rawTheme}`,
      `Best months: ${stop.destination.bestMonthsLabel}`,
      `Airports: ${stop.state.airports.join(", ")}`,
      `Railhead: ${stop.state.railhead}`,
      stop.destination.permitRequired ? "PERMIT REQUIRED — arrange in advance." : "",
    ]
      .filter(Boolean)
      .join("\n");
    event(
      `stop-${i}-${stop.destination.slug}`,
      stop.startDay - 1,
      stop.endDay,
      stop.destination.name,
      desc
    );
  });

  out.push("END:VCALENDAR");
  return out.join("\r\n");
}

export function downloadFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
