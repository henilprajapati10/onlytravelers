/**
 * The sub-path the site is served under, if any — "" on a domain of its
 * own, "/onlytravelers" on a GitHub project site. Next prefixes it for
 * <Link> and the router automatically; anything that builds a URL by hand
 * (the service worker, the manifest, raw HTML in a map popup) goes
 * through here.
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export const withBase = (path: string): string => `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
