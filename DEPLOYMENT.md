# Running OnlyTravelers at scale

The app is built so that the expensive work happens once, at build time, and
the cheap work happens on the device. Almost nothing happens on a server per
request. That is what lets it take a traffic spike — a festival weekend, a
viral reel — without anyone being paged.

## What the build produces

`next build` prerenders every page as static HTML:

| Route | How it is served | Notes |
| --- | --- | --- |
| `/`, `/destinations`, `/states`, `/circuits`, `/festivals`, `/start`, `/trips`, `/profile`, `/campaign`, `/map-data`, `/image-rights`, `/offline` | Static HTML + JS | Built once per deploy |
| `/destinations/[slug]` × 568 | Static HTML | `generateStaticParams` emits every place |
| `/states/[id]` × 36 | Static HTML | Same |
| `/trips/[id]` | Dynamic shell | The trip itself lives on the device; the server returns the same shell for every id |

First Load JS after the bundle work in this branch: home 199 kB, destinations
181 kB, a destination page 176 kB, a trip page 221 kB (87 kB of that is the
shared framework). The 400 KB guide corpus is **not** in any of those: client
components reach it through `src/lib/useGuides.ts`, which imports it as one
shared chunk after first paint, cached immutably. Server-rendered pages read
the guides at build time and ship only the prose they show.

## Where the state lives

Everything a traveller creates — trips, expenses, documents wallet, profile,
checklists, the My India map, the streak — is in `localStorage` on their
device, through `src/lib/storage.ts`. There is no database to shard and no
session to look up. The cost of a user is zero until accounts arrive.

That is also the honest limit of this release: **no sync between devices, no
recovery if the browser data is cleared, no reviews or social features.**
Those need a backend. `storage.ts` is the single seam where one goes in; keep
new persistence behind it.

## Hosting

Any static host plus a Node (or edge) runtime for `/trips/[id]` works. The
checked-in defaults assume Vercel or an equivalent that honours
`next.config.mjs` headers:

- `/_next/static/*` — `public, max-age=31536000, immutable` (content hashed)
- `/sw.js` — `max-age=0, must-revalidate` so a deploy replaces the shell
- Every page — `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy` (geolocation self only)

Put a CDN in front of all of it. Prerendered pages are safe to cache at the
edge for as long as the deploy lives; the service worker (`public/sw.js`)
caches visited pages on the device for the hills and the islands.

## Third parties, and what they cost

| Service | Used for | Key? | Cost at scale |
| --- | --- | --- | --- |
| Google Maps URLs (`/maps/search`, `/maps/dir`) | Open in Maps, directions, route, nearby ATM/pharmacy/hospital… | No | Free; user's device talks to Google |
| Google Maps Embed API | Inline map on a destination page and the route on a trip | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Free tier; restrict the key by referrer (see `.env.example`) |
| Open-Meteo | Live weather on a destination page and the Today card | No | Free for non-commercial; commercial plans exist. Device fetches directly, cached per place for an hour |
| amCharts geodata | State boundaries | No | Free with attribution (shown on every map) |
| OpenStreetMap tiles (Leaflet) | The pannable map on state and destination pages | No | Public servers are for light use only — set `NEXT_PUBLIC_MAP_TILES_URL` to a tile provider before heavy traffic (see `.env.example`); Leaflet itself is a 40 KB chunk loaded only on map pages |

Nothing is proxied through our servers, so none of it adds to our request
load. If a service is down the page is complete without it: weather says so,
maps fall back to our own outline, links still open Google.

## Environment

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=      # optional; enables embedded Google maps
NEXT_PUBLIC_MAP_TILES_URL=            # optional; tile provider for the live maps (default: OpenStreetMap)
NEXT_PUBLIC_MAP_TILES_ATTRIBUTION=    # required by most providers when the URL is set
```

## Checks before a deploy

```
npm run lint
npx tsc --noEmit
node tests/superapp-logic.mjs          # pure logic, no browser
node tests/trip-invariants.mjs         # every trip the builder can make
npx next build
BASE_URL=http://localhost:3000 PLAYWRIGHT_PATH=... node tests/superapp.mjs   # browser
node scripts/build-demo.mjs && node tests/demo.mjs                           # the single-file demo
```

## Rules the code enforces

Tests fail if any of these are broken, because they are what the product is:

- **No price is ever shown.** Fares and room rates come from the operator at
  booking time. The budget on the Spend tab is the traveller's own number.
- **No photograph without a licence.** Generated artwork fills photo slots
  until a licensed image is registered in `src/data/images.ts`.
- **No partner link is guessed.** Only verified official URLs ship; the rest
  show "add your partner link".
- **No invented local facts.** Nearby places, phone numbers and addresses
  are Google Maps queries, not a list of ours.
