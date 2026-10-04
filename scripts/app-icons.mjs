/**
 * Draws the native app's launcher icons and splash screens from the same
 * source as the PWA icons (src/lib/appIcon.tsx), so the app on a home screen
 * and the site installed from a browser look the same.
 *
 *   node scripts/app-icons.mjs
 *
 * Rerun after changing the icon. Writes into android/ and ios/.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");
const React = require("react");
const { ImageResponse } = require("next/dist/compiled/@vercel/og/index.node.js");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// appIcon.tsx is JSX; compile it to a CommonJS module that uses React.createElement.
const src = fs.readFileSync(path.join(root, "src/lib/appIcon.tsx"), "utf8");
const { code } = transform(src, { transforms: ["typescript", "jsx", "imports"], production: true, jsxRuntime: "classic" });
const mod = { exports: {} };
new Function("exports", "module", "require", "React", code)(mod.exports, mod, require, React);
const { appIcon } = mod.exports;

const NAVY = "#0b1b30";
const SAND = "#fbf8f3";

async function png(element, width, height) {
  const res = new ImageResponse(element, { width, height });
  return Buffer.from(await res.arrayBuffer());
}

function write(rel, buf) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
}

const h = React.createElement;

/** The maskable artwork, clipped to a circle for launchers that want round icons. */
const round = (size) =>
  h("div", { style: { width: size, height: size, display: "flex", borderRadius: size, overflow: "hidden" } }, appIcon(size, true));

/** Adaptive-icon foreground: 108dp canvas, artwork inside the 66dp safe zone. */
const foreground = (size) => {
  const inner = Math.round(size * (72 / 108));
  return h(
    "div",
    { style: { width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: NAVY } },
    appIcon(inner, true)
  );
};

/** Splash: the icon centred on the app's background colour. */
const splash = (w, hgt) => {
  const s = Math.round(Math.min(w, hgt) * 0.22);
  return h(
    "div",
    { style: { width: w, height: hgt, display: "flex", alignItems: "center", justifyContent: "center", background: SAND } },
    appIcon(s, false)
  );
};

const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const res = "android/app/src/main/res";

for (const [d, k] of Object.entries(DENSITIES)) {
  const launcher = Math.round(48 * k);
  const fg = Math.round(108 * k);
  write(`${res}/mipmap-${d}/ic_launcher.png`, await png(appIcon(launcher, false), launcher, launcher));
  write(`${res}/mipmap-${d}/ic_launcher_round.png`, await png(round(launcher), launcher, launcher));
  write(`${res}/mipmap-${d}/ic_launcher_foreground.png`, await png(foreground(fg), fg, fg));
}
write(
  `${res}/values/ic_launcher_background.xml`,
  Buffer.from(`<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0B1B30</color>\n</resources>\n`)
);

// Android splash images keep the size Capacitor generated for each slot.
const SPLASH = {
  drawable: [480, 320],
  "drawable-land-mdpi": [480, 320], "drawable-land-hdpi": [800, 480], "drawable-land-xhdpi": [1280, 720],
  "drawable-land-xxhdpi": [1600, 960], "drawable-land-xxxhdpi": [1920, 1280],
  "drawable-port-mdpi": [320, 480], "drawable-port-hdpi": [480, 800], "drawable-port-xhdpi": [720, 1280],
  "drawable-port-xxhdpi": [960, 1600], "drawable-port-xxxhdpi": [1280, 1920],
};
for (const [dir, [w, hh]] of Object.entries(SPLASH)) write(`${res}/${dir}/splash.png`, await png(splash(w, hh), w, hh));

// iOS: one 1024 icon (no transparency, no rounding — iOS masks it) and a square splash.
const ios = "ios/App/App/Assets.xcassets";
write(`${ios}/AppIcon.appiconset/AppIcon-512@2x.png`, await png(appIcon(1024, true), 1024, 1024));
const iosSplash = await png(splash(2732, 2732), 2732, 2732);
for (const f of ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]) write(`${ios}/Splash.imageset/${f}`, iosSplash);

console.log("app icons and splash screens written");
