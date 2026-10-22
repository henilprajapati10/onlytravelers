# OnlyTravelers

**Be travelers, not tourists.** 568 destinations across all 36 states and
union territories of India — each with what it is, how long it deserves,
when to go and how to reach it — and the tools to plan, carry and live a
trip: itineraries with real travel time, prep lists, bookings hand-off,
spend, documents, live weather, nearby essentials, a phrasebook and a map
of where you have been.

## Live site

The site deploys itself to GitHub Pages on every push:
**https://henilprajapati10.github.io/onlytravelers/**
(one-time: Settings → Pages → Source: GitHub Actions, then re-run the
deploy workflow — a workflow cannot flip that switch itself).

For a domain of your own, the fastest route is Vercel (Next.js's native host):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhenilprajapati10%2Fonlytravelers&env=NEXT_PUBLIC_SITE_URL&envDescription=Your%20site%27s%20public%20URL%2C%20e.g.%20https%3A%2F%2Fonlytravelers.in&project-name=onlytravelers)

Set `NEXT_PUBLIC_SITE_URL` to the real domain when asked. Everything else
is optional — see `.env.example` and `DEPLOYMENT.md`.

## Develop

```
npm ci
npm run dev
```

Checks: `npm run lint`, `npx tsc --noEmit`, `node tests/superapp-logic.mjs`,
`node tests/trip-invariants.mjs`; browser suites in `tests/`.

## Rules the code enforces

No price is ever shown. No photograph without a licence. No partner link is
guessed. No invented local facts. See `DEPLOYMENT.md`.
