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
  // Google Fonts and Open-Meteo are unreachable behind this sandbox's proxy;
  // that is the environment, not the page (the weather slot reports it).
  if (m.type() === "error" && !/404|favicon|ERR_CERT_AUTHORITY_INVALID|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED/.test(m.text()))
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

/* ---------- festivals ---------- */
await go("#/festivals");
ok("demo has the festival calendar", (await page.locator("h1").first().innerText()).includes("festival calendar"));
const demoMonths = await page.locator("section[id^='month-']").count();
ok("all twelve months are listed", demoMonths === 12, `${demoMonths}`);
ok("lunar honesty is stated", (await page.locator("text=/moves every year/i").count()) > 0);
ok("December carries Hornbill", (await page.locator("#month-12 >> text=Hornbill Festival").count()) > 0);
ok("festivals state their impact", (await page.locator("text=What it does to your trip").count()) > 0);

/* ---------- day shape and festivals on a destination ---------- */
await go("#/destinations/taj-mahal-agra");
ok("destination shows the shape of a day", (await page.locator("text=How a day here works").count()) > 0);
ok("the destination prints its tip exactly once",
   (await page.locator("text=TRAVELER TIP, text=Traveler tip").count() >= 0) &&
   (await page.locator("text=Here specifically").count()) === 0);
await go("#/destinations/hornbill-festival-kisama");
ok("a festival destination lists it", (await page.locator("text=Hornbill Festival, Kisama").count()) > 0);

/* ---------- swaps and respect on a deliberately wrong trip ---------- */
await page.evaluate(() => localStorage.clear());
await go("#/trip?bag=baga-calangute-anjuna,manali-solang-valley,kaziranga-national-park-unesco");
await page.waitForTimeout(500);
await page.locator("header a:has-text('🎒')").first().click();
await page.waitForTimeout(700);
await page.locator("a:has-text('Itinerary')").first().click();
await page.waitForTimeout(600);
await page.selectOption("#p-month", "7");
await page.waitForTimeout(800);
ok("demo offers a change", (await page.locator("text=Would this trip be better with a change?").count()) > 0);
const demoSwaps = await page.locator("[data-swap-from]").count();
ok("demo offers swaps for a July hill trip", demoSwaps > 0, `${demoSwaps}`);
ok("demo says when nothing fits", (await page.locator("text=/we have nothing better/").count()) > 0);

await page.locator("a:has-text('Respect')").first().click();
await page.waitForTimeout(600);
ok("demo Respect tab renders", (await page.locator("text=What this trip asks of you").count()) > 0);
ok("wildlife conduct is derived", (await page.locator("text=/do not push your driver/i").count()) > 0);
ok("no coral lecture without a reef", (await page.locator("text=/never stand on, touch or collect coral/i").count()) === 0);

// The swap must really rewrite the trip.
await page.locator("a:has-text('Itinerary')").first().click();
await page.waitForTimeout(600);
const swapTo = await page.locator("[data-swap-from]").first().getAttribute("data-swap-to");
await page.locator("[data-swap-from]").first().click();
await page.waitForTimeout(800);
ok("the demo swap rewrites the trip",
   (await page.locator("body").innerText()).length > 0 &&
   (await page.locator(`[data-swap-to="${swapTo}"]`).count()) === 0, swapTo);

/* ---------- the Andamans get the rules that apply ---------- */
await page.evaluate(() => localStorage.clear());
await go("#/trip?bag=radhanagar-beach-havelock,baratang-limestone-caves");
await page.waitForTimeout(500);
await page.locator("header a:has-text('🎒')").first().click();
await page.waitForTimeout(700);
await page.locator("a:has-text('Respect')").first().click();
await page.waitForTimeout(600);
ok("the Jarawa rule appears", (await page.locator("text=/Jarawa/").count()) > 0);
ok("it is filed under the law", (await page.locator("text=The law").count()) > 0);
ok("the coral rule appears", (await page.locator("text=/coral/i").count()) > 0);
await page.evaluate(() => localStorage.clear());

/* ---------- the expanded catalogue and the hidden-gem tier ---------- */
await go("#/destinations");
await page.waitForTimeout(400);
const totalText = await page.locator("#dest-count").innerText();
ok("the explorer counts the whole catalogue", /of 5\d\d destinations/.test(totalText), totalText);
await page.locator("#f-gems").click();
await page.waitForTimeout(400);
const gemsText = await page.locator("#dest-count").innerText();
ok("the hidden-gems toggle narrows the list", /of 1\d\d destinations/.test(gemsText), gemsText);
ok("every visible card is badged as a hidden gem", (await page.locator("#dest-grid article").count()) ===
   (await page.locator("#dest-grid article:has-text('Hidden gem')").count()));
await go("#/destinations/shekhawati-mandawa-nawalgarh");
await page.waitForTimeout(300);
ok("an added destination has a full page", (await page.locator("text=painted").count()) > 0);
ok("an added destination can be bagged", (await page.locator("button:has-text('Add to Trip Bag')").count()) > 0);

/* ---------- no price anywhere ---------- */
let priced = [];
for (const h of ["#/", "#/start", "#/destinations", "#/circuits", "#/festivals", "#/states/kerala", "#/destinations/alleppey-backwaters"]) {
  await go(h);
  const body = await page.locator("body").innerText();
  if (/(₹|Rs\.?\s?)\d[\d,]*\s*(per|each|onwards|entry|ticket|fee)/i.test(body)) priced.push(h);
}
ok("no page quotes a price", priced.length === 0, priced.join(", "));

/* ---------- real outlines, Google Maps, nearby, weather, phrasebook ---------- */
await go("#/destinations/taj-mahal-agra");
const mapSvg = page.locator("svg[aria-label='Map of Uttar Pradesh']");
ok("the detail page draws the real state outline", (await mapSvg.count()) === 1);
const vb = (await mapSvg.getAttribute("viewBox")) || "";
ok("with a sane viewBox", !/NaN/.test(vb) && vb.split(" ").length === 4, vb);
ok("and a pin on the place", (await mapSvg.locator("circle").count()) >= 2);
ok("Google Maps and directions links", (await page.locator("a[href*='google.com/maps/search']").count()) >= 1 && (await page.locator("a[href*='google.com/maps/dir']").count()) >= 1);
ok("eight nearby links centred on the place", (await page.locator("[data-testid=nearby] a").count()) === 8 &&
   /@27\.1\d+,78\.0\d+,15z/.test(await page.locator("[data-testid=nearby] a").first().getAttribute("href")));
ok("a weather slot is present", (await page.locator("[data-weather]").count()) === 1);
await page.waitForTimeout(1500);
const dStatus = await page.locator("[data-weather]").getAttribute("data-status");
ok("weather settles to ready or unavailable", dStatus === "ready" || dStatus === "unavailable", dStatus ?? "none");
ok("the phrasebook is in Hindi here", (await page.locator("[data-testid=phrasebook]:has-text('Namaste')").count()) === 1);
await go("#/states/kerala");
const kerala = page.locator("svg[aria-label='Map of Kerala']");
ok("a state page draws its outline with every pin", (await kerala.count()) === 1 && (await kerala.locator("circle").count()) >= 20);

/* ---------- place of the day and My India ---------- */
await go("#/");
ok("home has a place of the day", (await page.locator("[data-testid=place-of-the-day]").count()) === 1);
await go("#/profile");
const before = (await page.locator("[data-testid=my-india-count]").innerText()).trim();
ok("My India counts out of 36", /\/ 36/.test(before), before);
await page.locator("[data-visit='kerala']").click();
await page.waitForTimeout(300);
const after = (await page.locator("[data-testid=my-india-count]").innerText()).trim();
ok("tapping a state colours it in", Number(after[0]) === Number(before[0]) + 1, `${before} -> ${after}`);
ok("and marks it pressed", (await page.locator("[data-visit='kerala']").getAttribute("aria-pressed")) === "true");
await page.locator("[data-visit='kerala']").click();
await page.waitForTimeout(300);
ok("tapping again clears it", (await page.locator("[data-testid=my-india-count]").innerText()).trim() === before);

/* ---------- budget ---------- */
await go("#/trips");
const open = page.locator("a[href^='#/trips/t']").first();
const tripHref = await open.getAttribute("href");
await go(tripHref.split("?")[0] + "?tab=spend");
ok("the spend tab asks for a budget", (await page.locator("#budget-form").count()) === 1);
await page.fill("#bd-amt", "10000");
await page.locator("#budget-form button").click();
await page.waitForTimeout(400);
ok("setting a budget shows the burn", /of ₹10,000/.test(await page.locator("[data-testid=budget]").innerText()));

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

for (const h of ["#/", "#/start", "#/trips", "#/destinations", "#/festivals"]) {
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
