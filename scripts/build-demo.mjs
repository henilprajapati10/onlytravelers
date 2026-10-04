/**
 * Builds the standalone single-file demo of the site.
 *
 * The demo reuses the app's real modules — same data, same trip builder,
 * same artwork generator — compiled with sucrase and wired through a tiny
 * module registry, so the demo cannot drift from the product.
 *
 *   node scripts/build-demo.mjs [<output.html>]
 *   node scripts/build-demo.mjs --app [<output.html>]
 *
 * --app builds the native app's web bundle (see capacitor.config.json): a
 * complete HTML document with the preview banner removed, written to
 * mobile/www/index.html by default.
 *
 * SITE_URL (or NEXT_PUBLIC_SITE_URL) is where the app's share links point —
 * the deployed website. Without it the app shares the itinerary as text.
 *
 * GOOGLE_MAPS_API_KEY, when set, is baked in for the Maps Embed API. Without
 * it the maps use Google's keyless embed, which is what the committed demo
 * ships with — a key in a committed file should be one restricted to your
 * own referrers and app.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const appMode = args.includes("--app");
const outArg = args.find((a) => !a.startsWith("--"));
const outFile = outArg
  ? path.resolve(outArg)
  : appMode
    ? path.join(root, "mobile", "www", "index.html")
    : path.join(root, "demo", "index.html");

const MODULES = [
  "src/data/states.ts",
  "src/data/destinations.ts",
  "src/data/guides/north.ts",
  "src/data/guides/west.ts",
  "src/data/guides/south.ts",
  "src/data/guides/east.ts",
  "src/data/guides/central.ts",
  "src/data/guides/northeast.ts",
  "src/data/guides/index.ts",
  "src/data/circuits.ts",
  "src/lib/format.ts",
  "src/lib/scene.ts",
  "src/lib/trip.ts",
  "src/lib/suggest.ts",
  "src/lib/export.ts",
  "src/data/trips.ts",
  "src/data/profile.ts",
  "src/data/operators.ts",
  "src/lib/prep.ts",
  "src/lib/bookings.ts",
  "src/data/renown.ts",
  "src/data/essentials.ts",
  "src/lib/starter.ts",
  "src/lib/today.ts",
  "src/lib/search.ts",
  "src/lib/storage.ts",
  "src/lib/wallet.ts",
  "src/data/festivals.ts",
  "src/lib/alternatives.ts",
  "src/lib/responsible.ts",
  "src/lib/dayshape.ts",
  "src/lib/maps.ts",
];

/** "src/data/guides/index.ts" -> canonical id "@/data/guides" */
function moduleId(file) {
  let id = "@/" + file.replace(/^src\//, "").replace(/\.tsx?$/, "");
  if (id.endsWith("/index")) id = id.slice(0, -"/index".length);
  return id;
}

const compiled = MODULES.map((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const { code } = transform(source, {
    transforms: ["typescript", "imports"],
    filePath: file,
  });
  return { id: moduleId(file), file, code };
});

// Relative imports inside src/data/guides ("./north") need resolving to ids.
function rewriteRequires(code, file) {
  return code.replace(/require\((['"])([^'"]+)\1\)/g, (match, q, spec) => {
    if (spec.startsWith("@/")) return `__req(${q}${spec}${q})`;
    if (spec.startsWith(".")) {
      const abs = path.normalize(path.join(path.dirname(file), spec));
      let id = "@/" + abs.replace(/^src\//, "");
      if (id.endsWith("/index")) id = id.slice(0, -"/index".length);
      return `__req(${q}${id}${q})`;
    }
    return match;
  });
}

const registry = compiled
  .map(
    ({ id, file, code }) =>
      `__def(${JSON.stringify(id)}, function(exports, module){\n${rewriteRequires(code, file)}\n});`
  )
  .join("\n");

const runtime = `
(function(){
  var __factories = {}, __cache = {};
  function __def(id, fn){ __factories[id] = fn; }
  function __req(id){
    if (__cache[id]) return __cache[id].exports;
    var m = { exports: {} };
    __cache[id] = m;
    var f = __factories[id];
    if (!f) throw new Error("Module not found: " + id);
    f(m.exports, m);
    return m.exports;
  }
${registry}
  window.OT = {
    states: __req("@/data/states"),
    destinations: __req("@/data/destinations"),
    guides: __req("@/data/guides"),
    circuits: __req("@/data/circuits"),
    format: __req("@/lib/format"),
    scene: __req("@/lib/scene"),
    trip: __req("@/lib/trip"),
    suggest: __req("@/lib/suggest"),
    exportTrip: __req("@/lib/export"),
    tripsData: __req("@/data/trips"),
    profileData: __req("@/data/profile"),
    operators: __req("@/data/operators"),
    prep: __req("@/lib/prep"),
    bookings: __req("@/lib/bookings"),
    renown: __req("@/data/renown"),
    essentials: __req("@/data/essentials"),
    starter: __req("@/lib/starter"),
    today: __req("@/lib/today"),
    search: __req("@/lib/search"),
    storage: __req("@/lib/storage"),
    wallet: __req("@/lib/wallet"),
    festivals: __req("@/data/festivals"),
    alternatives: __req("@/lib/alternatives"),
    responsible: __req("@/lib/responsible"),
    dayshape: __req("@/lib/dayshape"),
    maps: __req("@/lib/maps"),
  };
})();
`;

const ui = fs.readFileSync(path.join(root, "scripts", "demo-app.js"), "utf8");
const shell = fs.readFileSync(path.join(root, "scripts", "demo-shell.html"), "utf8");
// Regenerate the demo's CSS from the demo's own sources first, so a class
// used only here can never silently do nothing.
const cssFile = path.join(root, "scripts", "demo.tw.css");
const cssIn = path.join(os.tmpdir(), "onlytravelers-demo-tw-in.css");
fs.writeFileSync(cssIn, "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n");
execFileSync(
  process.execPath,
  [
    path.join(root, "node_modules", "tailwindcss", "lib", "cli.js"),
    "-c", path.join(root, "scripts", "demo.tailwind.config.js"),
    "-i", cssIn,
    "-o", cssFile,
    "--minify",
  ],
  { cwd: root, stdio: ["ignore", "ignore", "inherit"] }
);
const css = fs.readFileSync(cssFile, "utf8");

const config = {
  googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || "",
  app: appMode,
  // Where the app's share links point: the deployed website's /trip?bag= page.
  siteUrl: appMode ? process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "" : "",
};

let html = shell
  .replace("/*__CSS__*/", () => css)
  .replace("//__CONFIG__", () => `window.OT_CONFIG = ${JSON.stringify(config)};`)
  .replace("//__RUNTIME__", () => runtime)
  .replace("//__APP__", () => ui);

if (appMode) {
  // The app is the product, not a preview of it.
  html = html.replace(/<!--preview-->[\s\S]*?<!--\/preview-->/g, "");
  // The demo shell is a fragment (its host supplies the document); a WebView needs the whole thing.
  html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b1b30">
<meta name="format-detection" content="telephone=no">
${html.slice(0, html.indexOf("<div class=\"flex min-h-screen flex-col\">"))}
</head>
<body>
${html.slice(html.indexOf("<div class=\"flex min-h-screen flex-col\">"))}
</body>
</html>
`;
} else {
  html = html.replace(/<!--\/?preview-->/g, "");
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);

const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(`built ${outFile} (${kb} KB) from ${compiled.length} modules${appMode ? " [app]" : ""}`);
