/*
 * The native app's web bundle (npm run build:app → mobile/www), driven at
 * phone size. The app is the demo UI with the preview framing removed and
 * the three things a WebView cannot do — download, print, share its own
 * address — replaced with things it can.
 *
 *   node tests/app.mjs
 */
const { chromium } = await import("playwright").catch(() =>
  import(process.env.PLAYWRIGHT_PATH ?? "/opt/pw-browsers/../node_modules/playwright/index.mjs")
);
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ot-app-"));
const build = (out, env = {}) =>
  execFileSync(process.execPath, ["scripts/build-demo.mjs", "--app", out], {
    env: { ...process.env, SITE_URL: "", NEXT_PUBLIC_SITE_URL: "", GOOGLE_MAPS_API_KEY: "", ...env },
    stdio: ["ignore", "ignore", "inherit"],
  });
const plain = path.join(tmp, "plain.html");
const linked = path.join(tmp, "linked.html");
const keyed = path.join(tmp, "keyed.html");
build(plain);
build(linked, { SITE_URL: "https://onlytravelers.in/" });
build(keyed, { GOOGLE_MAPS_API_KEY: "TEST_KEY" });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => {
  window.__copied = [];
  Object.defineProperty(navigator, "clipboard", { value: { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } } });
});
const page = await ctx.newPage();

const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !/404|favicon|ERR_CERT_AUTHORITY_INVALID|ERR_TUNNEL|ERR_NAME/.test(m.text())) errs.push("CONSOLE: " + m.text());
});

let pass = 0, fail = 0;
const ok = (label, cond, extra = "") => {
  if (cond) pass++; else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? " — " + extra : ""}`);
};
const open = async (file, hash = "#/") => {
  await page.goto("file://" + file + hash, { waitUntil: "load" });
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(500);
};

const html = fs.readFileSync(plain, "utf8");
ok("the bundle is a complete document", html.startsWith("<!doctype html>") && html.includes("</html>"));
ok("it sets a viewport that reaches under notches", /viewport-fit=cover/.test(html));
ok("no preview framing in the app", !/Interactive preview|OnlyTravelers demo/.test(html));
ok("no API key baked in unless one is given", html.includes('"googleMapsKey":""'));

await open(plain);
ok("the app boots", (await page.locator("h1").first().innerText()).length > 0);
ok("five tabs, all features one tap away", (await page.locator("#tabbar a").count()) === 5);
ok("Map is in the app's navigation", (await page.locator("a.nav-link[href='#/map']").count()) === 1);

// Every web feature is a route in the app.
for (const [hash, sel] of [
  ["#/destinations", "#f-q"], ["#/states", "h1"], ["#/circuits", "h1"], ["#/festivals", "h1"],
  ["#/start", "[data-start-run]"], ["#/trips", "h1"], ["#/profile", "h1"], ["#/map", "#map-state"],
  ["#/destinations/hampi-unesco", "iframe[data-google-map]"], ["#/states/kerala", "iframe[data-google-map]"],
]) {
  await page.goto("file://" + plain + hash, { waitUntil: "load" });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`${hash} works in the app with no sideways scroll`, (await page.locator(sel).count()) > 0 && overflow <= 1, `${overflow}px`);
}

// A trip, then the things a WebView cannot do the browser way.
await page.evaluate(() => {
  const now = new Date().toISOString();
  localStorage.setItem("onlytravelers.demo.trips.v1", JSON.stringify({ activeId: "t1",
    trips: [{ id: "t1", name: "Goa", status: "planning", createdAt: now, updatedAt: now, slugs: ["baga-calangute-anjuna", "palolem-agonda"] }] }));
});
await open(plain, "#/trip");
ok("no Print button in the app (a WebView cannot print)", (await page.locator("[data-print]").count()) === 0);
await page.locator("[data-export='ics']").click();
await page.waitForTimeout(300);
ok("calendar export opens as copyable text instead of a dead download", await page.locator("#copy-panel").isVisible());
ok("the copy panel carries the calendar", (await page.locator("#copy-panel textarea").inputValue()).includes("BEGIN:VCALENDAR"));
await page.locator("[data-close-copy]").first().click();
await page.locator("[data-share]").click();
await page.waitForTimeout(300);
ok("with no website configured, share hands over the itinerary itself",
   await page.locator("#copy-panel").isVisible() && (await page.evaluate(() => window.__copied.length)) === 0);

await open(linked, "#/trip");
await page.locator("[data-share]").click();
await page.waitForTimeout(300);
const copied = await page.evaluate(() => window.__copied[0] || "");
ok("with a website configured, share links to its trip page", copied === "https://onlytravelers.in/trip?bag=baga-calangute-anjuna,palolem-agonda", copied);

await open(plain, "#/trips/t1?tab=map");
ok("the trip map works in the app", (await page.locator("[data-trip-map] iframe[data-google-map]").count()) === 1);
ok("map links leave the app for Google Maps", (await page.locator("[data-open-route]").getAttribute("target")) === "_blank");

await open(keyed, "#/destinations/hampi-unesco");
ok("a key switches the app's maps to the Embed API",
   (await page.locator("iframe[data-google-map]").first().getAttribute("src")).startsWith("https://www.google.com/maps/embed/v1/place?key=TEST_KEY"));

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
console.log("errors:", errs.length ? errs.join("\n") : "none");
await browser.close();
process.exit(fail > 0 || errs.length ? 1 : 0);
