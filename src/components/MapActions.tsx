import { NEARBY_KINDS, directionsFromHereUrl, mapsSearchUrl, nearbyUrl } from "@/lib/maps";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** "Open in Google Maps" and "Directions from here" for one place. */
export function MapButtons({ query, compact = false }: { query: string; compact?: boolean }) {
  const size = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div className="flex flex-wrap gap-2">
      <a
        {...external}
        href={directionsFromHereUrl(query)}
        data-maps-directions
        className={`rounded-lg bg-coral-500 font-semibold text-white hover:bg-coral-600 ${size}`}
      >
        🧭 Directions
      </a>
      <a
        {...external}
        href={mapsSearchUrl(query)}
        data-maps-open
        className={`rounded-lg border border-navy-200 bg-white font-semibold text-navy-700 hover:border-coral-300 ${size}`}
      >
        📍 Open in Google Maps
      </a>
    </div>
  );
}

/** One tap to the things people look for on the ground, searched around the place. */
export function NearbyChips({ place }: { place: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={`Find near ${place}`}>
      {NEARBY_KINDS.map((k) => (
        <li key={k.id}>
          <a
            {...external}
            href={nearbyUrl(k, place)}
            data-nearby={k.id}
            className="inline-flex items-center gap-1 rounded-full border border-navy-100 bg-white px-2.5 py-1 text-xs font-medium text-navy-600 hover:border-coral-300 hover:text-coral-600"
          >
            <span aria-hidden="true">{k.icon}</span>
            {k.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
