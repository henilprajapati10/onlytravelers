// Two ways to ship. The default is a Node/edge host (Vercel and the like),
// which honours the cache headers below. STATIC_EXPORT=1 writes plain files
// for a static host such as GitHub Pages, optionally under a sub-path
// (NEXT_PUBLIC_BASE_PATH=/onlytravelers for a project site).
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  ...(staticExport ? { output: "export", trailingSlash: false } : {}),
  ...(basePath ? { basePath } : {}),
  // Nearly every page is prerendered at build time, so the work of serving
  // the app is the CDN's. These headers tell it, and the browser, what may be
  // kept and for how long.
  async headers() {
    return [
      {
        // Hashed build output never changes under the same name.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The service worker must be re-checked on every load or an old
        // shell can outlive a deploy.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // Prerendered pages: serve from the edge for a minute, refresh in
        // the background for a day. Only /trips/[id] is dynamic and it
        // sets its own policy.
        source: "/((?!api|trips/).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

// A static host sets its own headers; Next warns if the option is present on export.
if (staticExport) delete nextConfig.headers;

export default nextConfig;
