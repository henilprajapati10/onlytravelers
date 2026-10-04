/**
 * Runs the app's own TypeScript modules under plain Node.
 *
 * Tests and data checks have to exercise the real modules, not a copy — a
 * fixture that drifts from the product is worse than no test at all. Imports
 * are followed from disk rather than listed by hand, so adding a module to the
 * app cannot silently leave it untested.
 *
 * Only the data and logic layers load this way. Anything importing React is
 * out of scope, which is the honest boundary: that is what the browser tests
 * are for.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(root + "/package.json");
const { transform } = require("sucrase");

const cache = new Map();

/** Resolve a specifier to a file on disk, the way the bundler would. */
function resolve(spec, fromFile) {
  const base = spec.startsWith("@/")
    ? path.join(root, "src", spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [base, base + ".ts", base + ".tsx", path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Load one module and everything it imports. Returns its exports. */
export function loadModule(file) {
  const abs = path.isAbsolute(file) ? file : path.join(root, file);
  if (cache.has(abs)) return cache.get(abs);

  const { code } = transform(fs.readFileSync(abs, "utf8"), {
    transforms: ["typescript", "imports"],
    filePath: abs,
  });

  const module = { exports: {} };
  // Registered before evaluating, so a cycle resolves to the partial exports
  // object rather than looping forever — the same contract Node gives CommonJS.
  cache.set(abs, module.exports);

  const req = (spec) => {
    const target = resolve(spec, abs);
    // A package import (react, next/...) is not ours to run; an empty object
    // keeps the module loading and fails loudly only if it is actually used.
    if (!target) return {};
    return loadModule(target);
  };

  new Function("exports", "module", "require", code)(module.exports, module, req);
  cache.set(abs, module.exports);
  return module.exports;
}

/** Every .ts file under a directory, for checks that want the whole layer. */
export function filesUnder(dir, ext = ".ts") {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(rel, ext));
    else if (entry.name.endsWith(ext)) out.push(rel);
  }
  return out;
}
