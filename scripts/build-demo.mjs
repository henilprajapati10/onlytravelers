/**
 * Builds the standalone single-file demo of the site.
 *
 * The demo reuses the app's real modules — same data, same trip builder,
 * same artwork generator — compiled with sucrase and wired through a tiny
 * module registry, so the demo cannot drift from the product.
 *
 *   node scripts/build-demo.mjs <output.html>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = process.argv[2] ?? path.join(root, "demo", "index.html");

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
  };
})();
`;

const ui = fs.readFileSync(path.join(root, "scripts", "demo-app.js"), "utf8");
const shell = fs.readFileSync(path.join(root, "scripts", "demo-shell.html"), "utf8");
const css = fs.readFileSync(path.join(root, "scripts", "demo.tw.css"), "utf8");

const html = shell
  .replace("/*__CSS__*/", () => css)
  .replace("//__RUNTIME__", () => runtime)
  .replace("//__APP__", () => ui);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);

const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(`built ${outFile} (${kb} KB) from ${compiled.length} modules`);
