import { chromium } from "playwright";

const B = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("CONSOLE: " + m.text()); });
const ok = (label, cond, extra = "") => console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? " — " + extra : ""}`);

/* --- 1. circuits page loads and shows real numbers --- */
await page.goto(B + "/circuits", { waitUntil: "networkidle" });
const cards = await page.locator("article").count();
ok("circuits render", cards === 12, `${cards} circuits`);
const firstDays = await page.locator("article").first().locator("dd").nth(1).innerText();
ok("circuit shows day count", /^\d+$/.test(firstDays), `days=${firstDays}`);

/* --- 2. "Use this trip" loads the bag and navigates --- */
await page.locator("article").first().getByRole("button", { name: "Use this trip" }).click();
await page.waitForURL("**/trip", { timeout: 10000 });
await page.waitForTimeout(800);
const h1 = await page.locator("h1").first().innerText();
ok("circuit loads into trip", h1 === "Your trip", h1);
const bagCount = async (pg) => (await pg.locator('a[href="/cart"]').first().innerText()).replace(/[^0-9]/g, "");
const badge = await bagCount(page);
ok("bag filled from circuit", badge === "8", `badge=${badge}`);

/* --- 3. Golden Triangle day maths: 4 Delhi half-days must share days --- */
const stats = await page.locator(".tabular-nums").allInnerTexts();
console.log("      trip stats:", stats.slice(0, 4).join(" | "));
const totalDays = parseInt(stats[0], 10);
ok("Golden Triangle is a sane length", totalDays >= 7 && totalDays <= 14, `${totalDays} days`);

/* --- 4. month selector marks out-of-season stops --- */
await page.selectOption("#travel-month", "7"); // July — Golden Triangle is Oct-Mar
await page.waitForTimeout(500);
const oos = await page.locator("text=/Out of season in Jul/").count();
ok("July flags out-of-season stops", oos > 0, `${oos} stops flagged`);
const seasonWarn = await page.locator("text=/out of season in July/i").count();
ok("season warning appears", seasonWarn > 0);

await page.selectOption("#travel-month", "12"); // December — should be in season
await page.waitForTimeout(500);
const oosDec = await page.locator("text=/Out of season in Dec/").count();
ok("December has no out-of-season stops", oosDec === 0, `${oosDec} flagged`);

/* --- 5. days-available fit check --- */
await page.selectOption("#days-available", "5");
await page.waitForTimeout(500);
const overWarn = await page.locator("text=/over your 5 days/").count();
ok("short trip flags overrun", overWarn > 0);
await page.selectOption("#days-available", "30");
await page.waitForTimeout(500);
const spare = await page.locator("text=/spare/").count();
ok("long window flags spare time", spare > 0);

/* --- 6. remove a stop from the trip page --- */
const before = await page.locator("text=/^Stop \\d+$/").count();
await page.locator("button[aria-label^='Remove']").first().click();
await page.waitForTimeout(600);
const after = await page.locator("text=/^Stop \\d+$/").count();
ok("remove stop works", after === before - 1, `${before} -> ${after}`);

/* --- 7. share link round-trips --- */
await page.getByRole("button", { name: "Share link" }).click();
await page.waitForTimeout(400);
const link = await page.evaluate(() => navigator.clipboard.readText());
ok("share link built", link.includes("/trip?bag="), link.slice(0, 70));

const page2 = await ctx.newPage();
await page2.goto(link.replace("http://localhost:3310", B), { waitUntil: "networkidle" });
await page2.waitForTimeout(900);
const badge2 = (await page2.locator('a[href="/cart"]').first().innerText()).replace(/[^0-9]/g, "");
ok("shared link restores the bag", badge2 === "7", `badge=${badge2}`);
await page2.close();

/* --- 8. exports --- */
const dl1 = page.waitForEvent("download");
await page.getByRole("button", { name: "Text" }).click();
const text = await dl1;
ok("text export downloads", (await text.suggestedFilename()).endsWith(".txt"));

const dl2 = page.waitForEvent("download");
await page.getByRole("button", { name: "Calendar" }).click();
const ics = await dl2;
const icsPath = await ics.path();
const fs = await import("node:fs");
const icsBody = fs.readFileSync(icsPath, "utf8");
ok("ics is valid-ish", icsBody.startsWith("BEGIN:VCALENDAR") && icsBody.includes("END:VCALENDAR") && icsBody.includes("DTSTART;VALUE=DATE:"));
ok("ics has one event per stop", (icsBody.match(/BEGIN:VEVENT/g) || []).length >= 7, `${(icsBody.match(/BEGIN:VEVENT/g) || []).length} events`);

/* --- 9. theme filter link updates an already-mounted explorer --- */
await page.goto(B + "/destinations", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.goto(B + "/destinations?theme=Desert", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const themeVal = await page.locator("#filter-theme").inputValue();
ok("theme param applies", themeVal === "Desert", themeVal);
// now simulate in-app nav from home while explorer is mounted
await page.goto(B + "/", { waitUntil: "networkidle" });
await page.locator('a[href="/destinations?theme=Beach"]').first().click();
await page.waitForTimeout(700);
const themeVal2 = await page.locator("#filter-theme").inputValue();
ok("client-side theme nav applies", themeVal2 === "Beach", themeVal2);

/* --- 10. pairs-well-with --- */
await page.goto(B + "/destinations/hampi-unesco", { waitUntil: "networkidle" });
const pairs = await page.locator("text=Pairs well with").count();
ok("pairs-well-with renders", pairs > 0);

/* --- 11. 404 --- */
const resp = await page.goto(B + "/destinations/not-a-place", { waitUntil: "networkidle" });
ok("404 status", resp.status() === 404, String(resp.status()));
ok("404 is branded", (await page.locator("h1").first().innerText()).includes("mapped"));

/* --- 12. sitemap + robots --- */
const sm = await page.goto(B + "/sitemap.xml");
const smBody = await sm.text();
ok("sitemap lists destinations", (smBody.match(/<url>/g) || []).length > 380, `${(smBody.match(/<url>/g) || []).length} urls`);
const rb = await page.goto(B + "/robots.txt");
ok("robots served", (await rb.text()).includes("Sitemap:"));

/* --- 13. mobile layout has no horizontal scroll --- */
const m = await ctx.newPage();
await m.setViewportSize({ width: 390, height: 844 });
for (const path of ["/", "/destinations", "/circuits", "/trip", "/destinations/taj-mahal-agra"]) {
  await m.goto(B + path, { waitUntil: "networkidle" });
  await m.waitForTimeout(300);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`no h-scroll at 390px ${path}`, overflow <= 1, `overflow=${overflow}px`);
}
await m.close();

console.log("\nerrors:", errs.length ? errs.join("\n") : "none");
await browser.close();
