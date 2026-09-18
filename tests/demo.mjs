/*
 * The demo is a separate UI over the same compiled modules, so it gets its
 * own pass — a feature can work in the app and be missing here.
 *
 *   node tests/demo.mjs
 */
const { chromium } = await import("playwright").catch(() =>
  import(process.env.PLAYWRIGHT_PATH ?? "/opt/pw-browsers/../node_modules/playwright/index.mjs")
);
import path from "node:path";

const file = "file://" + path.resolve(process.cwd(), "demo/index.html");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
const page = await ctx.newPage();

const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  // The Google Fonts request fails behind this sandbox's proxy; that is the
  // environment, not the page.
  if (m.type() === "error" && !/404|favicon|ERR_CERT_AUTHORITY_INVALID/.test(m.text()))
    errs.push("CONSOLE: " + m.text());
});

let pass = 0, fail = 0;
const ok = (label, cond, extra = "") => {
  if (cond) pass++; else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? " — " + extra : ""}`);
};
const go = async (hash) => {
  await page.goto(file + hash, { waitUntil: "load" });
  await page.waitForTimeout(500);
};

await go("#/");
ok("demo boots", (await page.locator("h1").first().innerText()).length > 0);
ok("hero carries the tagline", (await page.locator("text=Before life gets too busy, travel.").count()) > 0);
ok("hero leads with the starter", (await page.locator("a:has-text('Plan my trip in 30 seconds')").count()) > 0);

/* ---------- search ---------- */
await page.keyboard.press("/");
await page.waitForTimeout(300);
ok("'/' opens search", await page.locator("#search-overlay").isVisible());
await page.fill("#search-input", "alleppey");
await page.waitForTimeout(300);
const hits = await page.locator("[role=option]").count();
ok("search returns results", hits > 0, `${hits} hits`);
ok("Alleppey ranks first", /Alleppey/i.test(await page.locator("[role=option]").first().innerText()));
await page.locator("[role=option]").first().locator("[data-search-add]").click();
await page.waitForTimeout(300);
ok("search adds to the trip", (await page.locator("[role=option]").first().locator("text=In trip").count()) > 0);
ok("the bag badge updates", (await page.locator("#cart-badge").innerText()) === "1");
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(200);
ok("arrow keys move the cursor", (await page.locator("[role=option][aria-selected=true]").count()) === 1);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok("Escape closes search", !(await page.locator("#search-overlay").isVisible()));

await page.evaluate(() => localStorage.clear());

/* ---------- starter ---------- */
await go("#/start");
ok("starter page renders", (await page.locator("text=Build me a trip").count()) > 0);
await page.locator("[data-start-days='10']").click();
await page.waitForTimeout(200);
await page.locator("[data-start-month='11']").click();
await page.waitForTimeout(200);
await page.locator("[data-start-theme='Hills']").click();
await page.waitForTimeout(200);
await page.locator("[data-start-run]").first().click();
await page.waitForTimeout(600);
const headline = await page.locator("article h2").first().innerText();
ok("starter builds a trip", /\d+ days, \d+ stops?/.test(headline), headline);
const days = Number(headline.match(/(\d+) days/)?.[1] ?? 0);
ok("starter stays inside the budget", days > 0 && days <= 10, `${days} days`);
ok("starter says why", (await page.locator("article li:has-text('✓')").count()) > 0);

await page.locator("[data-start-save]").click();
await page.waitForTimeout(700);
ok("saving opens the workspace", page.url().includes("#/trips/trip_"), page.url().split("#")[1]);

/* ---------- Today ---------- */
ok("workspace has a Today tab", (await page.locator("a:has-text('Today')").count()) > 0);
await page.locator("a:has-text('Today')").first().click();
await page.waitForTimeout(500);
ok("Today asks for a start date first", (await page.locator("text=Set a start date").count()) > 0);
await page.locator("a:has-text('Set start date')").click();
await page.waitForTimeout(500);
ok("that lands on the tab with the date field", (await page.locator("#w-start").count()) > 0);

const soon = await page.evaluate(() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
});
await page.fill("#w-start", soon);
await page.waitForTimeout(500);

/* ---------- wallet ---------- */
const refField = page.locator("[data-wallet-ref]").first();
const refKey = await refField.getAttribute("data-wallet-ref");
await refField.fill("PNR-7781234");
await page.waitForTimeout(300);
await page.locator("[data-wallet-booked]").first().check();
await page.waitForTimeout(400);
ok("booked count reflects the tick", (await page.locator("text=/1 of \\d+ booked/").count()) > 0);
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(700);
ok(
  "the reference survives a reload",
  (await page.locator(`[data-wallet-ref="${refKey}"]`).inputValue()) === "PNR-7781234"
);

/* ---------- send ---------- */
const wa = await page.locator("a:has-text('Send on WhatsApp')").first().getAttribute("href");
ok("WhatsApp hand-off is a real wa.me link", (wa ?? "").startsWith("https://wa.me/?text="));
ok("the brief carries no price", !decodeURIComponent(wa ?? "").match(/₹\s?\d/));
const mail = await page.locator("a:has-text('Email it')").first().getAttribute("href");
ok("email hand-off is a mailto", (mail ?? "").startsWith("mailto:?subject="));

/* ---------- Today, now that it has a date ---------- */
await page.locator("a:has-text('Today')").first().click();
await page.waitForTimeout(500);
ok("Today counts down to departure", (await page.locator("text=/Tomorrow|In \\d+ days/").count()) > 0);

/* ---------- home adapts ---------- */
await go("#/");
ok("home opens on the trip", (await page.locator("text=Your trip").count()) > 0);
ok("home offers all trips", (await page.locator("a:has-text('All my trips')").count()) > 0);

/* ---------- no price anywhere ---------- */
let priced = [];
for (const h of ["#/", "#/start", "#/destinations", "#/circuits", "#/states/kerala", "#/destinations/alleppey-backwaters"]) {
  await go(h);
  const body = await page.locator("body").innerText();
  if (/(₹|Rs\.?\s?)\d[\d,]*\s*(per|each|onwards|entry|ticket|fee)/i.test(body)) priced.push(h);
}
ok("no page quotes a price", priced.length === 0, priced.join(", "));

/* ---------- phone shell ---------- */
const m = await ctx.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto(file + "#/", { waitUntil: "load" });
await m.waitForTimeout(500);
ok("five tabs on a phone", (await m.locator("#tabbar a").count()) === 5, `${await m.locator("#tabbar a").count()}`);
await m.locator("#tab-search").click();
await m.waitForTimeout(400);
ok("search opens from the phone tab bar", await m.locator("#search-overlay").isVisible());
await m.fill("#search-input", "pangong");
await m.waitForTimeout(300);
await m.locator("[data-search-go]").first().click();
await m.waitForTimeout(500);
ok("a search result navigates", m.url().includes("#/destinations/pangong-tso"), m.url().split("#")[1]);

for (const h of ["#/", "#/start", "#/trips", "#/destinations"]) {
  await m.goto(file + h, { waitUntil: "load" });
  await m.waitForTimeout(400);
  const overflow = await m.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  ok(`no h-scroll at 390px ${h}`, overflow <= 1, `${overflow}px`);
}
await m.close();

console.log(`\n${pass} passed, ${fail} failed`);
console.log("errors:", errs.length ? errs.join("\n") : "none");
await browser.close();
process.exit(fail > 0 || errs.length ? 1 : 0);
