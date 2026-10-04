/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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

export default nextConfig;
