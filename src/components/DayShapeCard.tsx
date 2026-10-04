import type { Destination } from "@/data/destinations";
import { shapeForDestination, type DayPart } from "@/lib/dayshape";

const PART_ICON: Record<DayPart, string> = {
  Early: "🌅",
  Midday: "☀️",
  Evening: "🌇",
};

const PART_TIME: Record<DayPart, string> = {
  Early: "before 9am",
  Midday: "11am – 4pm",
  Evening: "after 5pm",
};

/**
 * "Day 4: Varanasi" is not a plan. This is the shape of the day the place
 * itself rewards — which for most of India is an early start, a real break,
 * and going back out for the light.
 */
export default function DayShapeCard({
  destination,
  month,
  tip,
  compact = false,
  showAdvice = true,
}: {
  destination: Destination;
  month?: number;
  /** The guide tip for this place, if the caller has it loaded. */
  tip?: string;
  compact?: boolean;
  /** Off where the page already prints the tip in its own box. */
  showAdvice?: boolean;
}) {
  const shape = shapeForDestination(destination, month, tip);

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
      {!compact && (
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
          How a day here works
        </h3>
      )}

      {shape.heatWarning && (
        <p className="mt-2 rounded-lg border-l-4 border-coral-400 bg-coral-50 p-3 text-xs text-navy-700">
          {shape.heatWarning}
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-3">
        {shape.slots.map((slot) => (
          <li key={slot.part} className="flex gap-3">
            <span className="text-lg leading-none" aria-hidden="true">
              {PART_ICON[slot.part]}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                {slot.part} <span className="font-normal normal-case">· {PART_TIME[slot.part]}</span>
              </p>
              <p className="mt-0.5 text-sm text-navy-600">{slot.what}</p>
              {showAdvice && shape.adviceIn === slot.part && shape.localAdvice && (
                <p className="mt-1.5 rounded-lg bg-sand-50 p-2.5 text-xs text-navy-700">
                  <span className="font-semibold">Here specifically: </span>
                  {shape.localAdvice}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Advice we could not confidently place still belongs on the page. */}
      {showAdvice && shape.localAdvice && !shape.adviceIn && (
        <p className="mt-3 rounded-lg bg-sand-50 p-3 text-xs text-navy-700">
          <span className="font-semibold">Here specifically: </span>
          {shape.localAdvice}
        </p>
      )}
    </div>
  );
}
