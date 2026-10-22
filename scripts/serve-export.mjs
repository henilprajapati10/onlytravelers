// Serves the static export (out/) the way GitHub Pages would at /onlytravelers: extensionless
// paths resolve to .html, directories to index.html, misses to 404.html.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(process.argv[2] ?? "out");
const base = process.argv[3] ?? "/onlytravelers";
const port = Number(process.argv[4] ?? 3300);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon", ".woff2": "font/woff2" };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (!u.pathname.startsWith(base)) { res.writeHead(404); return res.end("outside base"); }
  let p = decodeURIComponent(u.pathname.slice(base.length)) || "/";
  const tries = [p, p + ".html", path.join(p, "index.html")];
  for (const t of tries) {
    const f = path.join(root, t);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const ext = path.extname(f);
      res.writeHead(200, { "content-type": types[ext] ?? "application/octet-stream" });
      return fs.createReadStream(f).pipe(res);
    }
  }
  res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
  fs.createReadStream(path.join(root, "404.html")).pipe(res);
}).listen(port, () => console.log("pages-like server on", port, "base", base));
