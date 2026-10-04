import type { Destination } from "@/data/destinations";
import { nearbyLinks } from "@/lib/nearby";

/**
 * The street-corner questions, each one tap into Google Maps centred on the
 * place. We keep no list of our own — it would be stale within a season —
 * so nothing here is an address, a name or a phone number we made up.
 */
export default function NearbyLinks({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  const links = nearbyLinks(destination);
  return (
    <div data-testid="nearby" className={compact ? "" : "rounded-2xl border border-navy-100 bg-white p-4 shadow-card"}>
      <p className="font-display text-xs font-semibold uppercase tracking-wide text-navy-500">
        Near {destination.name}
      </p>
      <ul className={`mt-2 grid gap-1.5 ${compact ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-4"}`}>
        {links.map(({ kind, url }) => (
          <li key={kind.id}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 rounded-lg border border-navy-100 bg-sand-50 px-1 py-2 text-center text-[11px] font-medium text-navy-700 hover:border-coral-300 hover:bg-coral-50"
              title={`${kind.label} near ${destination.name} — opens Google Maps`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {kind.icon}
              </span>
              <span className="leading-tight">{kind.label}</span>
            </a>
          </li>
        ))}
      </ul>
      {!compact && (
        <p className="mt-2 text-[11px] text-navy-400">
          Opens Google Maps with live results. We never list addresses or numbers ourselves — they go stale.
        </p>
      )}
    </div>
  );
}
