/*
 * Tailwind over the demo's own sources.
 *
 * The demo ships as one self-contained file, so its CSS is generated rather
 * than served — and it has to be generated from demo-app.js and the shell,
 * not from src/, or a class used only in the demo silently does nothing.
 */
const path = require("path");
const base = require("../tailwind.config.ts");
const cfg = base.default ?? base;

module.exports = {
  ...cfg,
  content: [
    path.join(__dirname, "demo-app.js"),
    path.join(__dirname, "demo-shell.html"),
  ],
};
