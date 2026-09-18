import type { ReactElement } from "react";

/**
 * The installed-app icon. Drawn rather than shipped as a binary so it stays
 * in sync with the brand, and so the maskable variant gets the safe padding
 * Android expects.
 */
export function appIcon(size: number, maskable: boolean): ReactElement {
  const pad = maskable ? size * 0.18 : size * 0.1;
  const glyph = size - pad * 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1b30",
        borderRadius: maskable ? 0 : size * 0.22,
      }}
    >
      <div
        style={{
          width: glyph,
          height: glyph,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Two swept wings and a coral beak — the logo reduced to what
            survives at 48 pixels. */}
        <div
          style={{
            position: "absolute",
            width: glyph * 0.74,
            height: glyph * 0.1,
            background: "#ffffff",
            borderRadius: glyph,
            transform: "rotate(-28deg) translateY(-12%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: glyph * 0.56,
            height: glyph * 0.09,
            background: "#ffffff",
            borderRadius: glyph,
            transform: "rotate(22deg) translateY(28%) translateX(-8%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: glyph * 0.2,
            height: glyph * 0.2,
            background: "#ffffff",
            borderRadius: glyph,
            transform: `translateX(${glyph * 0.24}px) translateY(${-glyph * 0.06}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: glyph * 0.2,
            height: glyph * 0.08,
            background: "#e8492a",
            borderRadius: glyph,
            transform: `translateX(${glyph * 0.42}px) translateY(${-glyph * 0.06}px)`,
          }}
        />
      </div>
    </div>
  );
}
