/**
 * The sub-path the site is served under, if any — "" on a domain of its
 * own, "/onlytravelers" on a GitHub project site. Next prefixes it for
 * <Link> and the router automatically; anything that builds a URL by hand
 * (the service worker, the manifest, raw HTML in a map popup) goes
 * through here.
 */
// Next inlines `process.env.NEXT_PUBLIC_BASE_PATH` at build time — but only
// that exact expression, so it must stay written out. The demo runs this
// module raw in a browser with no `process`, hence the try.
function readBasePath(): string | undefined {
  try {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  } catch {
    return undefined;
  }
}
export const basePath = (readBasePath() ?? "").replace(/\/$/, "");

export const withBase = (path: string): string => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
