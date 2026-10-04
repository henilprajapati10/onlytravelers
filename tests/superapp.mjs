/**
 * Drives the super-app flows end to end: trips, prep, bookings, spend,
 * profile, the mobile shell and offline.
 *
 *   BASE_URL=http://localhost:3000 node tests/superapp.mjs
 */
// Playwright may be installed globally rather than in the project.
const { chromium } = await import("playwright").catch(() =>
  import(process.env.PLAYWRIGHT_PATH ?? "/opt/pw-browsers/../node_modules/playwright/index.mjs")
);

const B = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
const page = await ctx.newPage();

const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  // A fast page.goto aborts Next's in-flight link prefetch; Next says so and
  // falls back to a full navigation, which is correct behaviour, not a fault.
  if (
    m.type() === "error" &&
    !/404|favicon/.test(m.text()) &&
    !/Failed to fetch RSC payload/.test(m.text())
  ) {
    errs.push("CONSOLE: " + m.text());
  }
});

let pass = 0;
let fail = 0;
const ok = (label, cond, extra = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? " — " + extra : ""}`);
};

/* ---------- migration from the old single bag ---------- */
await page.goto(B + "/", { waitUntil: "networkidle" });
await page.evaluate(() =>
  localStorage.setItem(
    "onlytravelers.cart.v2",
    JSON.stringify(["taj-mahal-agra", "pangong-tso", "tawang-monastery", "radhanagar-beach-havelock"])
  )
);
await page.goto(B + "/trips", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
ok("old Trip Bag migrates into a trip", (await page.locator("article").count()) === 1);
const migratedName = await page.locator("article h2").first().innerText();
ok("migrated trip gets a real name", migratedName.length > 3 && migratedName !== "New trip", migratedName);
const legacyGone = await page.evaluate(() => localStorage.getItem("onlytravelers.cart.v2"));
ok("legacy key cleaned up", legacyGone === null);

/* ---------- open the trip workspace ---------- */
await page.locator("text=Open trip").first().click();
await page.waitForURL("**/trips/**", { timeout: 10000 });
await page.waitForTimeout(700);
ok("workspace opens", (await page.locator("h1").first().innerText()).length > 0);
ok("four tabs present", (await page.locator("button:has-text('Prep')").count()) > 0);

/* ---------- itinerary tab: controls write back to the trip ---------- */
await page.selectOption("#travel-month", "1");
await page.waitForTimeout(500);
const oos = await page.locator("text=/Out of season in January/").count();
ok("month selection flags out-of-season", oos > 0, `${oos} flagged`);

// reload to prove it persisted on the trip, not in component state
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
ok("travel month persists across reload", (await page.locator("#travel-month").inputValue()) === "1");

/* ---------- reorder ---------- */
const firstBefore = await page.locator("h3:has(a)").first().innerText();
await page.locator("button[aria-label$='later']").first().click();
await page.waitForTimeout(500);
const firstAfter = await page.locator("h3:has(a)").first().innerText();
ok("reorder changes the route", firstBefore !== firstAfter, `${firstBefore} -> ${firstAfter}`);

/* ---------- prep tab ---------- */
await page.locator("button:has-text('Prep')").first().click();
await page.waitForTimeout(600);
const prepItems = await page.locator("label:has(input[type='checkbox'])").count();
ok("prep list generated", prepItems >= 5, `${prepItems} items`);
ok("permit item appears for Ladakh/Andaman trip", (await page.locator("text=/Permit|permit/").count()) > 0);
ok("island item appears", (await page.locator("text=/island ferries and flights/i").count()) > 0);
ok("altitude item appears", (await page.locator("text=/acclimatisation/i").count()) > 0);

const firstBox = page.locator("input[type='checkbox']").first();
await firstBox.check();
await page.waitForTimeout(400);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator("button:has-text('Prep')").first().click();
await page.waitForTimeout(500);
ok("ticked prep item persists", await page.locator("input[type='checkbox']").first().isChecked());

/* ---------- bookings tab ---------- */
await page.locator("button:has-text('Bookings')").first().click();
await page.waitForTimeout(600);
const tasks = await page.locator("li:has-text('Copy details')").count();
ok("booking tasks generated", tasks >= 3, `${tasks} tasks`);
const firstTask = await page.locator("li:has-text('Copy details')").first().innerText();
ok("permits are ordered first", /permit/i.test(firstTask), firstTask.split("\n")[1] ?? firstTask.slice(0, 40));
ok("no price is ever shown", (await page.locator("body").innerText()).match(/₹\s?\d/) === null);
ok("operator hand-off shown", (await page.locator("text=/official|add your partner link/i").count()) > 0);

/* ---------- documents wallet: a reference survives a reload ---------- */
const refField = page.locator("input[aria-label^='Reference for']").first();
const refLabel = await refField.getAttribute("aria-label");
await refField.fill("PNR-4821993");
await page.waitForTimeout(400);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator("button:has-text('Bookings')").first().click();
await page.waitForTimeout(600);
ok(
  "booking reference persists in the wallet",
  (await page.locator(`input[aria-label="${refLabel}"]`).inputValue()) === "PNR-4821993"
);
const bookedBox = page.locator("input[type='checkbox']").first();
await bookedBox.check();
await page.waitForTimeout(400);
ok("booked count reflects the tick", (await page.locator("text=/1 of \\d+ booked/").count()) > 0);

/* ---------- send a trip: real hand-off links, no invented URLs ---------- */
const waHref = await page.locator("a:has-text('Send on WhatsApp')").first().getAttribute("href");
ok("WhatsApp link is a real wa.me share", (waHref ?? "").startsWith("https://wa.me/?text="), (waHref ?? "").slice(0, 30));
const mailHref = await page.locator("a:has-text('Email it')").first().getAttribute("href");
ok("email link is a mailto with a body", (mailHref ?? "").startsWith("mailto:?subject=") && mailHref.includes("&body="));
ok("the enquiry carries no price", !decodeURIComponent(waHref ?? "").match(/₹\s?\d/));

await page.fill('input[type="date"]', "2026-11-05");
await page.waitForTimeout(600);
ok("start date turns day numbers into dates", (await page.locator("text=/Nov 2026/").count()) > 0);

/* ---------- spend tab ---------- */
await page.locator("button:has-text('Spend')").first().click();
await page.waitForTimeout(500);
await page.fill('input[placeholder="What was it?"]', "Tuk-tuk to the fort");
await page.fill('input[placeholder="₹"]', "250");
await page.locator("button:has-text('Add')").first().click();
await page.waitForTimeout(500);
ok("expense recorded", (await page.locator("text=Tuk-tuk to the fort").count()) > 0);
ok("total shows in rupees", (await page.locator("text=/₹250/").count()) > 0);

/* ---------- profile ---------- */
await page.goto(B + "/profile", { waitUntil: "networkidle" });
await page.fill("#profile-name", "Henil");
await page.locator("label:has-text('Slow')").first().click();
await page.waitForTimeout(400);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
ok("profile persists", (await page.locator("#profile-name").inputValue()) === "Henil");

/* ---------- multiple trips ---------- */
await page.goto(B + "/circuits", { waitUntil: "networkidle" });
await page.locator("button:has-text('Use this trip')").first().click();
await page.waitForTimeout(900);
await page.goto(B + "/trips", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const tripCount = await page.locator("article").count();
ok("circuit lands in the active trip, not a new one", tripCount === 1, `${tripCount} trips`);

await page.locator("button:has-text('New trip')").first().click();
await page.waitForTimeout(800);
await page.goto(B + "/trips", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
ok("second trip created", (await page.locator("article").count()) === 2);
ok("exactly one trip is active", (await page.getByText("Active", { exact: true }).count()) === 1);

/* ---------- trip starter: three answers to a real itinerary ---------- */
await page.goto(B + "/start", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.locator("button[aria-pressed]:has-text('10 days')").first().click();
await page.locator("button[aria-pressed]:has-text('Nov')").first().click();
await page.locator("button[aria-pressed]:has-text('Hills')").first().click();
await page.locator("button:has-text('Build me a trip')").click();
await page.waitForTimeout(900);
const headline = await page.locator("article h2").first().innerText();
ok("starter produces a trip", /\d+ days, \d+ stops?/.test(headline), headline);
const starterDays = Number(headline.match(/(\d+) days/)?.[1] ?? 0);
ok("starter respects the 10-day budget", starterDays > 0 && starterDays <= 10, `${starterDays} days`);
ok("starter explains its choices", (await page.locator("article li:has-text('✓'), article ul li").count()) > 0);

await page.locator("button:has-text('Save as my trip')").click();
await page.waitForTimeout(900);
ok("saved starter trip opens a workspace", /\/trips\//.test(page.url()), page.url());

/* ---------- Today: a dateless trip asks for a date, then becomes a companion ---------- */
// No start date, so the workspace opens on the plan; Today is where it asks.
await page.locator("button:has-text('Today')").first().click();
await page.waitForTimeout(500);
ok("a trip without a date asks for one", (await page.locator("text=Set a start date").count()) > 0);
await page.locator("a:has-text('Set start date')").first().click();
await page.waitForTimeout(700);
// Regression: an in-app ?tab= link used to be a no-op, because the tab was
// only read from the URL at mount.
ok("the prompt lands on the tab that has the date field", (await page.locator('input[type="date"]').count()) > 0);
ok("the URL reflects the tab", page.url().includes("tab=bookings"), page.url());
await page.fill('input[type="date"]', "2026-11-05");
await page.waitForTimeout(600);
await page.goto(B + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
ok("home shows the trip, not the marketing hero", (await page.locator("text=Your trip").count()) > 0);
ok("home counts down to departure", (await page.locator("text=/day|Day/").count()) > 0);
ok("home links to all trips", (await page.locator("a:has-text('All my trips')").count()) > 0);

// A trip starting in two days should open on Today, not on the plan.
const soon = await page.evaluate(() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
});
await page.goBack({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.locator("button:has-text('Bookings')").first().click();
await page.waitForTimeout(500);
await page.fill('input[type="date"]', soon);
await page.waitForTimeout(600);
const tripUrl = page.url().split("?")[0];
await page.goto(tripUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
ok("an imminent trip opens on Today", page.url().includes("tab=today"), page.url());
ok("Today counts down", (await page.locator("text=/Tomorrow|In \\d+ days/").count()) > 0);

// Once the trip is under way, Today carries the shape of the day and places
// the guide's own advice in the part of the day it refers to.
await page.goto(page.url().split("?")[0] + "?tab=itinerary", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
// Day 1 is always a stay at the first stop; later days can be travel days,
// and a travel day correctly shows the move rather than the shape of a day.
const started = await page.evaluate(() => new Date().toISOString().slice(0, 10));
await page.locator("button:has-text('Bookings')").first().click();
await page.waitForTimeout(500);
await page.fill('input[type="date"]', started);
await page.waitForTimeout(600);
await page.locator("button:has-text('Today')").first().click();
await page.waitForTimeout(700);
ok("Today shows how to spend the day", (await page.locator("text=/before 9am/").count()) > 0);
ok("the guide's timing advice is placed in the day",
   (await page.locator("text=Here specifically").count()) > 0);

/* ---------- global search on desktop ---------- */
await page.keyboard.press("/");
await page.waitForTimeout(400);
const dialog = page.locator("[role=dialog][aria-label='Search OnlyTravelers']");
ok("'/' opens search anywhere", await dialog.isVisible());
await page.locator("input[aria-label='Search']").fill("alleppey");
await page.waitForTimeout(300);
const hits = await page.locator("[role=option]").count();
ok("search returns results as you type", hits > 0, `${hits} hits`);
const topHit = await page.locator("[role=option]").first().innerText();
ok("Alleppey ranks first", /Alleppey/i.test(topHit), topHit.split("\n")[0]);

// Add straight from the results — the point of searching mid-plan.
await page.locator("[role=option]").first().locator("button:has-text('+ Trip')").click();
await page.waitForTimeout(500);
ok("search can add to the trip in place", (await page.locator("[role=option]").first().locator("button:has-text('In trip')").count()) > 0);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
ok("Escape closes search", !(await dialog.isVisible()));

await page.keyboard.press("/");
await page.waitForTimeout(300);
await page.locator("input[aria-label='Search']").fill("zzqqxnothingatall");
await page.waitForTimeout(300);
ok("empty search states so plainly", (await page.locator("text=/Nothing matches/").count()) > 0);
await page.locator("input[aria-label='Search']").fill("hornbill");
await page.waitForTimeout(300);
ok("search reaches festivals", (await page.locator("[role=option]").first().innerText()).includes("Hornbill"));
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

/* ---------- festivals: the calendar nobody else publishes properly ---------- */
await page.goto(B + "/festivals", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
ok("festival calendar renders", (await page.locator("h1:has-text('festival calendar')").count()) > 0);
const monthSections = await page.locator("section[id^='month-']").count();
ok("every month has a section", monthSections === 12, `${monthSections}`);
ok("the calendar is honest that lunar dates move", (await page.locator("text=/date moves|moves every year/i").count()) > 0);
ok("festivals say what they do to a trip", (await page.locator("text=What it does to your trip").count()) > 0);
ok("no price on the festival calendar", (await page.locator("body").innerText()).match(/₹\s?\d/) === null);

await page.locator("a[href='#month-12']").first().click();
await page.waitForTimeout(400);
ok("December lists Hornbill", (await page.locator("#month-12 >> text=Hornbill Festival").count()) > 0);

/* ---------- day shape and festivals on a destination ---------- */
await page.goto(B + "/destinations/taj-mahal-agra", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
ok("destination shows how a day works", (await page.locator("text=How a day here works").count()) > 0);
ok("the day has three parts",
   (await page.locator("text=Early").count()) > 0 &&
   (await page.locator("text=Midday").count()) > 0 &&
   (await page.locator("text=Evening").count()) > 0);
// The tip has its own box on this page, so the day shape must not repeat it.
ok("the destination prints its tip exactly once",
   (await page.locator("text=Traveler tip").count()) === 1 &&
   (await page.locator("text=Here specifically").count()) === 0);

await page.goto(B + "/destinations/hornbill-festival-kisama", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
ok("a festival destination lists its festival", (await page.locator("text=Hornbill Festival, Kisama").count()) > 0);

/* ---------- swaps and Respect on a real trip ---------- */
// A deliberately wrong trip: Goa beaches and a Himalayan hill town in July.
await page.goto(
  B + "/trip?bag=baga-calangute-anjuna,manali-solang-valley,kaziranga-national-park-unesco",
  { waitUntil: "networkidle" }
);
await page.waitForTimeout(900);
// The bag link fills the ACTIVE trip; the hub list is ordered independently,
// so open the active one via the header chip rather than the first card.
await page.locator("header a:has-text('🎒')").first().click();
await page.waitForURL("**/trips/**", { timeout: 10000 });
await page.waitForTimeout(800);

await page.locator("button:has-text('Itinerary')").first().click();
await page.waitForTimeout(500);
await page.selectOption("#travel-month", "7");
await page.waitForTimeout(700);

ok("the trip offers a change", (await page.locator("text=Would this trip be better with a change?").count()) > 0);
const swapCards = await page.locator("button:has-text('Make the swap')").count();
ok("swaps are offered for a July hill trip", swapCards > 0, `${swapCards} swaps`);
ok("an unfixable stop is said out loud", (await page.locator("text=/we have nothing better/").count()) > 0);

// Respect is checked before the swap, because the swap deliberately changes
// which stops are in the trip — and the notes are derived from the stops.
await page.locator("button:has-text('Respect')").first().click();
await page.waitForTimeout(600);
ok("Respect tab renders", (await page.locator("text=What this trip asks of you").count()) > 0);
ok("wildlife conduct is derived from the trip", (await page.locator("text=/do not push your driver/i").count()) > 0);
ok("a trip with no reef is not lectured about coral", (await page.locator("text=/never stand on, touch or collect coral/i").count()) === 0);
ok("where the money lands is covered", (await page.locator("text=/Book the bed and the guide locally/i").count()) > 0);
ok("no price in the Respect tab", (await page.locator("body").innerText()).match(/₹\s?\d/) === null);

// Now take a swap and prove it really rewrites the itinerary.
await page.locator("button:has-text('Itinerary')").first().click();
await page.waitForTimeout(600);
const routeBefore = await page.locator("body").innerText();
const swapTarget = await page.locator("button:has-text('Make the swap')").first().evaluate(
  (b) => b.closest("div")?.querySelector("a:last-of-type")?.textContent?.trim() ?? ""
);
await page.locator("button:has-text('Make the swap')").first().click();
await page.waitForTimeout(1000);
const routeAfter = await page.locator("body").innerText();
ok("the swap actually rewrites the trip", routeAfter !== routeBefore);
ok("the swapped-in place is now in the itinerary",
   swapTarget.length > 0 && routeAfter.includes(swapTarget), swapTarget);

/* ---------- an Andaman trip gets the rules that actually apply ---------- */
await page.goto(B + "/trip?bag=radhanagar-beach-havelock,baratang-limestone-caves", { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.locator("header a:has-text('🎒')").first().click();
await page.waitForURL("**/trips/**", { timeout: 10000 });
await page.waitForTimeout(800);
await page.locator("button:has-text('Respect')").first().click();
await page.waitForTimeout(600);
ok("the Jarawa rule appears for the Andamans", (await page.locator("text=/Jarawa/").count()) > 0);
ok("it is marked as law, not etiquette", (await page.locator("text=The law").count()) > 0);
ok("the coral rule appears", (await page.locator("text=/coral/i").count()) > 0);

/* ---------- PWA plumbing ---------- */
const mani = await page.goto(B + "/manifest.webmanifest");
const manifest = await mani.json();
ok("manifest is standalone", manifest.display === "standalone", manifest.display);
ok("manifest has 192 and 512 icons", manifest.icons.some((i) => i.sizes === "192x192") && manifest.icons.some((i) => i.sizes === "512x512"));
for (const icon of ["/icon-192.png", "/icon-512.png", "/icon-maskable.png"]) {
  const r = await page.goto(B + icon);
  ok(`icon ${icon} renders`, r.status() === 200 && (r.headers()["content-type"] || "").includes("image"), r.headers()["content-type"]);
}
const sw = await page.goto(B + "/sw.js");
ok("service worker served", sw.status() === 200);

/* ---------- Google Maps ---------- */
{
  const q = (sel) => page.locator(sel);
  const gUrl = async (sel) => new URL(await q(sel).first().getAttribute("href"));

  await page.goto(B + "/destinations/hampi-unesco", { waitUntil: "networkidle" });
  const embed = await q("iframe[data-google-map]").first().getAttribute("src");
  ok("destination page embeds a Google Map", embed.startsWith("https://www.google.com/maps") && embed.includes("Hampi"), embed.slice(0, 80));
  const dir = await gUrl("[data-maps-directions]");
  ok("Directions start from the traveller's position", dir.pathname === "/maps/dir/" && !dir.searchParams.has("origin") && dir.searchParams.get("destination").includes("Karnataka"));
  ok("map links open outside the app", (await q("[data-maps-open]").first().getAttribute("target")) === "_blank");
  ok("nearby essentials are one tap away", (await q("[data-nearby]").count()) >= 8);
  ok("destination links to the big map", (await q("a[href='/map?place=hampi-unesco']").count()) === 1);

  await page.goto(B + "/states/kerala", { waitUntil: "networkidle" });
  ok("state page embeds a Google Map of the state", (await q("iframe[data-google-map]").first().getAttribute("src")).includes("Kerala"));

  await page.goto(B + "/map?place=hampi-unesco", { waitUntil: "networkidle" });
  ok("the big map opens on the linked place", (await q("[data-map-title]").innerText()) === (await q("[data-map-place='hampi-unesco'] span.block").first().innerText()));
  await page.selectOption("select[aria-label='State or union territory']", "rajasthan");
  await page.waitForURL("**/map?state=rajasthan", { timeout: 10000 });
  ok("picking a state narrows the map", (await q("[data-map-title]").innerText()) === "Rajasthan");
  await page.fill("input[aria-label='Filter places']", "fort");
  await page.waitForTimeout(300);
  const firstPlace = await q("[data-map-place]").first().getAttribute("data-map-place");
  await q("[data-map-place]").first().click();
  await page.waitForURL(`**/map?state=rajasthan&place=${firstPlace}`, { timeout: 10000 });
  ok("picking a place moves the map to it", (await q("iframe[data-google-map]").first().getAttribute("src")).includes("Rajasthan"));

  await page.evaluate(() => {
    const now = new Date().toISOString();
    localStorage.setItem("onlytravelers.trips.v1", JSON.stringify([{ id: "trip_mapcheck", name: "Coast and islands", status: "planning", createdAt: now, updatedAt: now,
      slugs: ["baga-calangute-anjuna", "palolem-agonda", "radhanagar-beach-havelock", "neil-island-shaheed-dweep"] }]));
    localStorage.setItem("onlytravelers.activeTrip.v1", JSON.stringify("trip_mapcheck"));
  });
  await page.goto(B + "/trips/trip_mapcheck?tab=map", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  ok("the trip has a Map tab", (await q("[data-trip-map]").count()) === 1);
  ok("the trip map embeds a route", (await q("iframe[data-google-map]").first().getAttribute("src")).includes("saddr="));
  ok("every move gets a link", (await q("[data-leg-link]").count()) === 3);
  ok("the flight leg links to flights", (await q("[data-leg-link='flights']").count()) >= 1);
  const route = await gUrl("[data-open-route]");
  ok("navigate opens the route in Google Maps", route.pathname === "/maps/dir/" && route.searchParams.get("origin").startsWith("Baga"));
  await q("[data-map-stop='palolem-agonda']").click();
  await page.waitForTimeout(400);
  ok("tapping a stop shows it with what is around it",
     (await q("iframe[data-google-map]").first().getAttribute("src")).includes("Palolem") && (await q("[data-nearby]").count()) === 8);

  await page.evaluate(() => {
    const t = JSON.parse(localStorage.getItem("onlytravelers.trips.v1"));
    t[0].startDate = new Date().toISOString().slice(0, 10);
    localStorage.setItem("onlytravelers.trips.v1", JSON.stringify(t));
  });
  await page.goto(B + "/trips/trip_mapcheck?tab=today", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  ok("Today offers navigation", (await q("[data-today-nav] a").count()) > 0);
}

/* ---------- mobile shell ---------- */
const m = await ctx.newPage();
await m.setViewportSize({ width: 390, height: 844 });
await m.goto(B + "/trips", { waitUntil: "networkidle" });
await m.waitForTimeout(500);
ok("tab bar visible on phone", await m.locator("nav[aria-label='Main']").isVisible());
const tabs = await m.locator("nav[aria-label='Main'] a").count();
ok("five tabs", tabs === 5, `${tabs}`);
for (const path of ["/", "/trips", "/profile", "/destinations", "/map", "/destinations/hampi-unesco", "/trips/trip_mapcheck?tab=map"]) {
  await m.goto(B + path, { waitUntil: "networkidle" });
  await m.waitForTimeout(300);
  const overflow = await m.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  ok(`no h-scroll at 390px ${path}`, overflow <= 1, `${overflow}px`);
}

/* ---------- global search reaches the whole catalogue from a phone ---------- */
await m.goto(B + "/", { waitUntil: "networkidle" });
await m.waitForTimeout(400);
await m.locator("nav[aria-label='Main'] a", { hasText: "Search" }).click();
await m.waitForTimeout(400);
ok("search opens from the phone tab bar", await m.locator("[role=dialog][aria-label='Search OnlyTravelers']").isVisible());
await m.locator("input[aria-label='Search']").fill("pangong");
await m.waitForTimeout(300);
const mFirst = await m.locator("[role=option]").first().innerText();
ok("search finds Pangong on mobile", /Pangong/i.test(mFirst), mFirst.split("\n")[0]);
await m.locator("[role=option]").first().locator("button").first().click();
await m.waitForURL("**/destinations/pangong-tso", { timeout: 10000 });
ok("search result navigates", m.url().endsWith("/destinations/pangong-tso"));
await m.close();

console.log(`\n${pass} passed, ${fail} failed`);
console.log("errors:", errs.length ? errs.join("\n") : "none");
await browser.close();
process.exit(fail > 0 ? 1 : 0);
