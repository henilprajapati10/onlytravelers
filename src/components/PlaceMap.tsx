import type { Destination } from "@/data/destinations";
import { coordFor } from "@/data/coords";
import { getState } from "@/data/states";
import {
  googleDirectionsUrl,
  googleEmbedUrl,
  googleMapsPinUrl,
  googleMapsUrl,
  mapsApiKey,
} from "@/lib/maps";
import { StateOutline } from "./IndiaMap";
import LiveMapLoader from "./LiveMapLoader";

/**
 * Where this place is, and how to get to it.
 *
 * The embedded Google map appears when the site is configured with a Maps
 * key. Without one — which is the default, because a key is billable and
 * belongs to whoever runs the site — this still shows the real location on
 * our own map and hands off to Google for navigation. Nothing here degrades
 * into a dead panel.
 */
export default function PlaceMap({ destination }: { destination: Destination }) {
  const state = getState(destination.stateId);
  const coord = coordFor(destination.slug);
  const apiKey = mapsApiKey();
  const pinUrl = googleMapsPinUrl(destination);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
      <h3 className="font-display mb-3 text-xs font-semibold uppercase tracking-wide text-navy-500">
        Where it is
      </h3>

      {apiKey ? (
        <iframe
          title={`Map of ${destination.name}`}
          src={googleEmbedUrl(destination, apiKey)}
          className="aspect-square w-full rounded-lg border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        // No key: the accurate map is still the accurate map — street tiles
        // under the state boundary, centred on the exact coordinate.
        <LiveMapLoader
          stateId={destination.stateId}
          pins={coord ? [{ lat: coord.lat, lng: coord.lng, label: destination.name }] : []}
          center={coord ?? undefined}
          zoom={12}
          ariaLabel={`Map of ${destination.name}`}
          className="aspect-square w-full"
          fallback={
            <StateOutline
              stateId={destination.stateId}
              pins={coord ? [{ lat: coord.lat, lng: coord.lng, label: destination.name }] : []}
              className="w-full"
            />
          }
        />
      )}

      <p className="mt-2 text-xs text-navy-400">
        {destination.district}, {state?.name}
        {coord && (
          <>
            {" · "}
            <span className="tabular-nums">
              {coord.lat.toFixed(4)}°N, {coord.lng.toFixed(4)}°E
            </span>
          </>
        )}
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <a
          href={googleMapsUrl(destination)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-navy-800 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-navy-700"
        >
          Open in Google Maps ↗
        </a>
        <a
          href={googleDirectionsUrl(destination)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-navy-200 px-4 py-2 text-center text-sm font-semibold text-navy-700 hover:border-coral-300 hover:text-coral-500"
        >
          Directions from where I am ↗
        </a>
        {pinUrl && (
          <a
            href={pinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-xs font-semibold text-navy-400 hover:text-coral-500"
          >
            Drop a pin on the exact coordinate ↗
          </a>
        )}
      </div>
    </div>
  );
}
