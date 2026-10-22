import { ImageResponse } from "next/og";
import { sceneSvg } from "./scene";
import type { Theme } from "@/data/destinations";
import { siteName } from "./site";

/**
 * Social preview cards. The artwork is the same generated scene the site
 * uses in place of photographs — nothing here is an image we lack rights to.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export interface OgCard {
  title: string;
  subtitle: string;
  /** Short facts across the bottom. */
  facts: string[];
  /** Scene seed and themes. */
  slug: string;
  themes: Theme[];
  eyebrow?: string;
}

export function ogImage(card: OgCard): ImageResponse {
  const svg = sceneSvg(card.slug, card.themes, { width: 560, height: 630 });
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const titleSize = card.title.length > 28 ? 52 : card.title.length > 18 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b1b30",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={560} height={630} alt="" style={{ objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 52px", width: 640 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
              <span>only</span>
              <span style={{ color: "#fa6d47" }}>travelers</span>
            </div>
            {card.eyebrow && (
              <div style={{ marginTop: 28, fontSize: 22, color: "#fa6d47", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>
                {card.eyebrow}
              </div>
            )}
            <div style={{ marginTop: card.eyebrow ? 10 : 36, fontSize: titleSize, fontWeight: 700, lineHeight: 1.05 }}>{card.title}</div>
            <div style={{ marginTop: 16, fontSize: 28, color: "#b0c1d9" }}>{card.subtitle}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {card.facts.slice(0, 4).map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  fontSize: 22,
                  color: "#eef2f7",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}

export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT_SUFFIX = ` — ${siteName}`;
