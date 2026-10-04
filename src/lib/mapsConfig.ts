/**
 * Optional. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to a key with the Maps Embed
 * API enabled (Google does not bill that API) and the in-app maps switch to
 * the supported embed endpoint. Without it every map still works through
 * Google's keyless embed and Maps links.
 */
export const googleMapsKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || undefined;
