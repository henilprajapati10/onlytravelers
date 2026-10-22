/**
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment once you have a
 * domain — it is used for canonical URLs, the sitemap and social cards.
 */
function readSiteUrl(): string | undefined {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL;
  } catch {
    return undefined;
  }
}
export const siteUrl = (readSiteUrl() || "https://onlytravelers.example").replace(
  /\/$/,
  ""
);

export const siteName = "OnlyTravelers";
export const siteTagline = "Be travelers, not tourists.";
