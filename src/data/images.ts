/**
 * Photograph slots and the image rights register.
 *
 * The directory (Part 2, "Photo sourcing plan") is explicit that photographs
 * are not supplied with the catalogue: usable ones must be licensed or your
 * own. Until a real photograph is added here, every destination falls back to
 * generated vector artwork, so no page ever renders a broken or empty slot.
 *
 * To add a photograph:
 *   1. Put the file in /public/images/<slug>/ (or use a full https URL).
 *   2. Add an entry below with the full licence record.
 *
 * Every field in ImageAsset except `src` and `alt` exists to satisfy the
 * rights register the directory asks for: destination, source URL, licence
 * type, photographer, date acquired, and where it is used. The register is
 * rendered at /image-rights.
 */

export type Licence =
  | "Own work"
  | "Commissioned"
  | "Licensed stock"
  | "CC BY"
  | "CC BY-SA"
  | "CC0 / Public domain"
  | "User submitted";

export interface ImageAsset {
  /** /images/<slug>/hero.jpg, or a full https URL. */
  src: string;
  /** Describe the place, not the photo. Required. */
  alt: string;
  photographer?: string;
  licence?: Licence;
  sourceUrl?: string;
  /** ISO date the file was acquired, for the rights register. */
  acquired?: string;
}

export interface DestinationImages {
  /** 16:5 banner, 1920x1080 cropped. */
  hero?: ImageAsset;
  /** 3:2, three to six images. */
  gallery?: ImageAsset[];
}

/**
 * Keyed by destination slug. Empty until real photographs are licensed.
 *
 * Example of a complete entry:
 *
 * "taj-mahal-agra": {
 *   hero: {
 *     src: "/images/taj-mahal-agra/hero.jpg",
 *     alt: "The Taj Mahal at sunrise from the main gate",
 *     photographer: "Your Name",
 *     licence: "Own work",
 *     acquired: "2026-01-14",
 *   },
 *   gallery: [
 *     { src: "/images/taj-mahal-agra/inlay.jpg", alt: "Pietra dura inlay on the cenotaph screen", licence: "Own work" },
 *   ],
 * },
 */
export const destinationImages: Record<string, DestinationImages> = {};

export interface RightsRegisterRow {
  slug: string;
  usedIn: "Hero" | "Gallery";
  src: string;
  photographer: string;
  licence: string;
  sourceUrl: string;
  acquired: string;
}

/** Flattens every supplied photograph into the register the directory requires. */
export function imageRightsRegister(): RightsRegisterRow[] {
  const rows: RightsRegisterRow[] = [];
  for (const [slug, set] of Object.entries(destinationImages)) {
    const push = (asset: ImageAsset, usedIn: RightsRegisterRow["usedIn"]) =>
      rows.push({
        slug,
        usedIn,
        src: asset.src,
        photographer: asset.photographer ?? "—",
        licence: asset.licence ?? "UNRECORDED",
        sourceUrl: asset.sourceUrl ?? "—",
        acquired: asset.acquired ?? "—",
      });
    if (set.hero) push(set.hero, "Hero");
    set.gallery?.forEach((g) => push(g, "Gallery"));
  }
  return rows;
}

export function getImages(slug: string): DestinationImages {
  return destinationImages[slug] ?? {};
}
