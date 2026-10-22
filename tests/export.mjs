/**
 * Smoke-tests the static export (STATIC_EXPORT=1 next build) served the way
 * GitHub Pages serves it, under a base path:
 *
 *   node scripts/serve-export.mjs out /onlytravelers 3300 &
 *   BASE_URL=http://localhost:3300/onlytravelers node tests/export.mjs
 */
const { chromium } = await import("playwright").catch(() =>
  import(process.env.PLAYWRIGHT_PATH ?? "/opt/pw-browsers/../node_modules/playwright/index.mjs")
);
const B = (process.env.BASE_URL ?? "http://localhost:3300/onlytravelers").replace(/\/$/, "");
const ORIGIN = new URL(B).origin;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 160)));
page.on("console", (m) => { if (m.type() === "error" && !/ERR_TUNNEL|open-meteo|tile\.openstreetmap|favicon/.test(m.text())) errs.push("CONSOLE " + m.text().slice(0, 160)); });
const missing = new Set();
page.on("response", (r) => { if (r.status() === 404) missing.add(new URL(r.url()).pathname); });
let pass = 0, fail = 0;
const ok = (l, c, x = "") => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"}  ${l}${x ? " — " + x : ""}`); };

await page.goto(B + "/", { waitUntil: "networkidle" });
ok("home renders", /Before life gets too busy/.test(await page.locator("h1").first().innerText()));
await page.locator("a[href='/onlytravelers/destinations']").first().click();
await page.waitForURL("**/onlytravelers/destinations", { timeout: 10000 });
await page.waitForTimeout(500);
ok("client navigation keeps the base path", page.url().includes("/onlytravelers/destinations") && (await page.locator("article").count()) >= 20);
await page.goto(B + "/destinations/taj-mahal-agra", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok("a destination page renders with the live map and quick answers", (await page.locator("[data-testid=live-map] .leaflet-interactive").count()) >= 1 && (await page.locator("[data-testid=quick-answers] dt").count()) >= 4);
const popup = await page.locator("[data-testid=live-map]").count();
ok("map present", popup === 1);
await page.goto(B + "/states/kerala", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok("a state page renders with pins", (await page.locator("[data-testid=live-map] .leaflet-interactive").count()) >= 11);
await page.locator("[data-testid=live-map] path.leaflet-interactive").nth(1).dispatchEvent("click");
await page.waitForTimeout(300);
const href = await page.locator(".leaflet-popup a").first().getAttribute("href");
ok("map popup links carry the base path", /^\/onlytravelers\/destinations\//.test(href ?? ""), href ?? "none");
for (const p of ["/themes/beach", "/best-time/july", "/zones/northeast", "/circuits", "/festivals", "/profile", "/map-data"]) {
  const r = await page.goto(B + p, { waitUntil: "networkidle" });
  ok(`${p} is served`, r.status() === 200 && (await page.locator("h1").count()) >= 1, String(r.status()));
}
// The trip fallback: a trip id the host has never heard of.
await page.goto(B + "/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.setItem("onlytravelers.cart.v2", JSON.stringify(["taj-mahal-agra", "munnar"])));
await page.goto(B + "/trips", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const open = page.locator("text=Open trip").first();
const tripHref = await open.getAttribute("href");
ok("trips hub lists the migrated trip", /\/onlytravelers\/trips\/trip_/.test(tripHref ?? ""), tripHref ?? "none");
const r404 = await page.goto(ORIGIN + tripHref, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok("a static host answers 404 for the trip URL…", r404.status() === 404);
ok("…and the fallback renders the trip anyway", (await page.locator("button:has-text('Prep')").count()) > 0 && (await page.locator("h1").first().innerText()).length > 0, await page.locator("h1").first().innerText());
await page.locator("button:has-text('Spend')").first().click();
await page.waitForTimeout(300);
ok("tabs work inside the fallback", (await page.locator("[data-testid=budget]").count()) === 1);
const sw = await page.goto(B + "/sw.js");
ok("service worker is served under the base path", sw.status() === 200 && /BASE \+/.test(await sw.text()));
const man = await (await page.goto(B + "/manifest.webmanifest")).json();
ok("manifest start_url carries the base path", man.start_url === "/onlytravelers/" && man.icons[0].src.startsWith("/onlytravelers/"));
const og = await page.goto(B + "/destinations/taj-mahal-agra/opengraph-image.png");
ok("social image is a .png with the right type", og.status() === 200 && /image\/png/.test(og.headers()["content-type"]));
const html = await (await page.goto(B + "/destinations/taj-mahal-agra")).text();
ok("og:image points at the .png", /og:image" content="[^"]*opengraph-image\.png"/.test(html));
const sm = await (await page.goto(B + "/sitemap.xml")).text();
ok("sitemap uses the Pages URL", /https:\/\/henilprajapati10\.github\.io\/onlytravelers\/destinations\//.test(sm));
console.log(`\n${pass} passed, ${fail} failed`);
console.log("404s:", [...missing].slice(0, 20).join("\n      ") || "none");
console.log("errors:", errs.filter((e) => !/404|Failed to fetch RSC/.test(e)).join("\n") || "none (ignoring 404 noise and aborted RSC prefetches)");
await browser.close();
process.exit(fail ? 1 : 0);
