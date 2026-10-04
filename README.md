# OnlyTravelers

Plan and carry India trips: 359 destinations across 36 states and union
territories, itineraries with real travel time, prep lists, bookings, spend,
festivals, and Google Maps for every place and every trip.

It ships three ways from one codebase:

| | What it is | Built from |
|---|---|---|
| Website | Next.js site, installable as a PWA | `src/` |
| Android and iOS app | Native app (Capacitor) with every web feature | `scripts/demo-app.js` over the same `src/` modules |
| Demo | The same app as one self-contained HTML file | same as the app |

The app and the demo compile the site's own data and logic modules
(`src/data`, `src/lib`), so a trip planned in either is planned by the same
code as the website.

## Website

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Android and iOS app

Prerequisites: Android Studio for Android, Xcode on a Mac for iOS.

```bash
npm install
npm run app:android  # builds the app bundle, syncs it, opens Android Studio
npm run app:ios      # same, opens Xcode
```

In Android Studio, Run puts it on a device or emulator, and
Build > Generate Signed Bundle / APK makes a release. `npm run build:app`
alone rebuilds the bundle into `mobile/www` and copies it into `android/`
and `ios/`.

Optional build settings:

- `SITE_URL` is your deployed website. The app's share links then open
  that site's trip page. Without it, sharing hands over the itinerary as text.
- `GOOGLE_MAPS_API_KEY` switches embedded maps to the Maps Embed API (see below).

```bash
SITE_URL=https://your-domain GOOGLE_MAPS_API_KEY=... npm run build:app
```

Inside the app, downloads and printing are replaced by copyable text,
because a mobile WebView drops both silently. Map and directions links open
the Google Maps app. App icons and splash screens are drawn from
`src/lib/appIcon.tsx`; rerun `npm run app:icons` after changing it.

## Google Maps

Works with no setup. Every destination, state and trip uses Google Maps:

- An embedded map on every destination and state page.
- **Explore on the map** (`/map`), to browse any state or place on Google Maps.
- A **Map** tab in every trip. It draws the route in parts, links each leg to
  directions, or to Google Flights when the leg flies or sails, and finds
  ATMs, hospitals, fuel, food and stays near each stop.
- **Navigate** on the Today screen during a trip.

Places are sent to Google by name ("Hampi, Vijayanagara, Karnataka, India"),
never by invented coordinates. Route links hold at most five stops, the limit
Google Maps accepts on a phone.

To use the supported embed endpoint, create a key with the **Maps Embed API**
enabled (Google does not bill it) and restrict it to your domain and app:

```bash
# website
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... npm run build
# app or demo
GOOGLE_MAPS_API_KEY=... npm run build:app
```

## Tests

```bash
npm test                 # trip builder invariants across all destinations
npm run test:logic       # super-app logic, including Google Maps links
npm run build:demo && npm run test:demo   # the single-file demo in a browser
npm run test:app         # the native app bundle at phone size
# with the site running on :3000
npm run test:super && npm run test:browser
```

The browser suites need Playwright with Chromium.
