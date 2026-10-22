/**
 * The sub-path the site is served under, if any — "" on a domain of its
 * own, "/onlytravelers" on a GitHub project site. Next prefixes it for
 * <Link> and the router automatically; anything that builds a URL by hand
 * (the service worker, the manifest, raw HTML in a map popup) goes
 * through here.
 */
// Guarded: the demo runs this module raw in a browser, where `process`
// does not exist; Next inlines the value at build time for the app.
const env = typeof process !== "undefined" ? process.env : ({} as Record<string, string | undefined>);
export const basePath = (env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export const withBase = (path: string): string => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
