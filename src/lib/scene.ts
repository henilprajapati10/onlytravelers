import type { Theme } from "@/data/destinations";

/**
 * Deterministic vector artwork for a destination, used wherever a licensed
 * photograph has not been supplied yet. Same slug always produces the same
 * scene, so a place looks like itself across the whole site.
 */

type Palette = {
  sky: [string, string];
  far: string;
  mid: string;
  near: string;
  accent: string;
  ink: string;
};

const PALETTES: Record<Theme, Palette[]> = {
  Hills: [
    { sky: ["#1b3a5c", "#5b8bb5"], far: "#3f6f97", mid: "#2c5378", near: "#17334e", accent: "#ffd9a0", ink: "#0b1b30" },
    { sky: ["#2a4a6b", "#8fb8d6"], far: "#537fa3", mid: "#36607f", near: "#1d3a52", accent: "#ffe7bd", ink: "#0b1b30" },
  ],
  Trekking: [
    { sky: ["#16324a", "#4f86a8"], far: "#3d7392", mid: "#2a5570", near: "#14304a", accent: "#f5c77e", ink: "#0b1b30" },
  ],
  Heritage: [
    { sky: ["#5a2a18", "#c07341"], far: "#a85c33", mid: "#7d3f22", near: "#4a2414", accent: "#ffd9a0", ink: "#2b1108" },
    { sky: ["#6b3420", "#d98b52"], far: "#b96b3c", mid: "#8d4a28", near: "#532917", accent: "#ffe3b8", ink: "#2b1108" },
  ],
  Spiritual: [
    { sky: ["#63240f", "#e0763a"], far: "#c25a2a", mid: "#93401d", near: "#571f0d", accent: "#ffd166", ink: "#2b1108" },
  ],
  Nature: [
    { sky: ["#123a2e", "#4e9e7a"], far: "#3a7f61", mid: "#255c46", near: "#123a2c", accent: "#cdebd8", ink: "#08251c" },
  ],
  Wildlife: [
    { sky: ["#2a3d15", "#7ba24a"], far: "#5f8639", mid: "#42602a", near: "#26391a", accent: "#ffd166", ink: "#16240f" },
  ],
  Beach: [
    { sky: ["#0f4c63", "#5fc0cf"], far: "#2f93a8", mid: "#1d6f85", near: "#0f4a5c", accent: "#ffd9a0", ink: "#062a36" },
  ],
  Islands: [
    { sky: ["#0d4757", "#54c8c4"], far: "#28a0a0", mid: "#177c83", near: "#0c4a54", accent: "#ffe0a3", ink: "#052a30" },
  ],
  Lakes: [
    { sky: ["#1b3350", "#6f9cc4"], far: "#4b7aa3", mid: "#2f5a80", near: "#1a3853", accent: "#ffe7bd", ink: "#0b1b30" },
  ],
  Cities: [
    { sky: ["#241b3d", "#6a5a9c"], far: "#4a3f77", mid: "#2f2856", near: "#1a1636", accent: "#ffc46b", ink: "#120f28" },
  ],
  Culture: [
    { sky: ["#5c1b33", "#c25a72"], far: "#a2415a", mid: "#772c42", near: "#471526", accent: "#ffce7a", ink: "#2c0d19" },
  ],
  "Food & Drink": [
    { sky: ["#2f3d12", "#8aa24a"], far: "#6d8a38", mid: "#4c6527", near: "#2c3d16", accent: "#ffdf9e", ink: "#1a240c" },
  ],
  Desert: [
    { sky: ["#7a3d10", "#e9a44f"], far: "#d08640", mid: "#a2622a", near: "#6d3d17", accent: "#fff0c2", ink: "#3a1e08" },
  ],
  Backwaters: [
    { sky: ["#12463f", "#5cb39b"], far: "#358d7c", mid: "#1f6a5d", near: "#0f463e", accent: "#ffe0a3", ink: "#072b26" },
  ],
};

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** xmur3-seeded mulberry32: stable across platforms, no dependency. */
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

function ridge(rand: () => number, w: number, baseY: number, amp: number, steps: number) {
  const pts: string[] = [`0,${round(baseY + amp * 0.4)}`];
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = baseY - amp * (0.35 + rand() * 0.65);
    pts.push(`${round(x)},${round(y)}`);
  }
  return pts.join(" ");
}

function peaks(rand: () => number, w: number, baseY: number, count: number, minH: number, maxH: number) {
  const out: { x: number; y: number; halfWidth: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = (w / (count + 1)) * (i + 1) + (rand() - 0.5) * (w / (count + 2));
    const h = minH + rand() * (maxH - minH);
    out.push({ x, y: baseY - h, halfWidth: h * (0.8 + rand() * 0.7) });
  }
  return out;
}

const ARCHETYPE: Record<Theme, "mountains" | "monument" | "shrine" | "water" | "forest" | "coast" | "skyline" | "dunes" | "terraces"> = {
  Hills: "mountains",
  Trekking: "mountains",
  Lakes: "water",
  Heritage: "monument",
  Spiritual: "shrine",
  Nature: "forest",
  Wildlife: "forest",
  Beach: "coast",
  Islands: "coast",
  Cities: "skyline",
  Culture: "terraces",
  "Food & Drink": "terraces",
  Desert: "dunes",
  Backwaters: "water",
};

export function sceneSvg(
  slug: string,
  themes: Theme[],
  opts: { width?: number; height?: number } = {}
): string {
  const w = opts.width ?? 320;
  const h = opts.height ?? 200;
  const theme = themes[0] ?? "Heritage";
  const rand = rng(slug);
  const variants = PALETTES[theme] ?? PALETTES.Heritage;
  const p = variants[Math.floor(rand() * variants.length)] ?? variants[0];
  const kind = ARCHETYPE[theme] ?? "mountains";
  // Hashed, because two SVGs sharing a gradient id on one page makes the
  // second one render with the first one's sky.
  const id = "s" + hash(slug).toString(36);

  const sunX = round(w * (0.15 + rand() * 0.7));
  const sunY = round(h * (0.16 + rand() * 0.2));
  const sunR = round(h * (0.055 + rand() * 0.035));

  const body: string[] = [];

  // sky + sun/moon
  body.push(`<rect width="${w}" height="${h}" fill="url(#sky${id})"/>`);
  body.push(`<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.accent}" opacity="0.92"/>`);

  // a few stars in the upper band for the darker palettes
  const starCount = 3 + Math.floor(rand() * 5);
  for (let i = 0; i < starCount; i++) {
    body.push(
      `<circle cx="${round(rand() * w)}" cy="${round(rand() * h * 0.4)}" r="${round(
        0.6 + rand() * 1.1
      )}" fill="#ffffff" opacity="${round(0.25 + rand() * 0.4)}"/>`
    );
  }

  if (kind === "mountains") {
    const far = peaks(rand, w, h * 0.78, 3, h * 0.3, h * 0.52);
    const near = peaks(rand, w, h * 0.95, 2, h * 0.22, h * 0.38);
    body.push(
      `<path d="M0,${h} ${far
        .map((k) => `L${round(k.x - k.halfWidth)},${h} L${round(k.x)},${round(k.y)} L${round(k.x + k.halfWidth)},${h}`)
        .join(" ")} L${w},${h} Z" fill="${p.far}"/>`
    );
    far.forEach((k) => {
      const snow = k.halfWidth * 0.34;
      body.push(
        `<path d="M${round(k.x - snow)},${round(k.y + snow * 0.82)} L${round(k.x)},${round(k.y)} L${round(
          k.x + snow
        )},${round(k.y + snow * 0.82)} Z" fill="#ffffff" opacity="0.85"/>`
      );
    });
    body.push(
      `<path d="M0,${h} ${near
        .map((k) => `L${round(k.x - k.halfWidth)},${h} L${round(k.x)},${round(k.y)} L${round(k.x + k.halfWidth)},${h}`)
        .join(" ")} L${w},${h} Z" fill="${p.near}"/>`
    );
  } else if (kind === "water") {
    const far = peaks(rand, w, h * 0.62, 3, h * 0.2, h * 0.36);
    body.push(
      `<path d="M0,${round(h * 0.62)} ${far
        .map(
          (k) =>
            `L${round(k.x - k.halfWidth)},${round(h * 0.62)} L${round(k.x)},${round(k.y)} L${round(
              k.x + k.halfWidth
            )},${round(h * 0.62)}`
        )
        .join(" ")} L${w},${round(h * 0.62)} Z" fill="${p.far}"/>`
    );
    body.push(`<rect y="${round(h * 0.62)}" width="${w}" height="${round(h * 0.38)}" fill="${p.mid}"/>`);
    for (let i = 0; i < 5; i++) {
      const y = round(h * 0.66 + i * h * 0.06);
      const x = round(rand() * w * 0.5);
      body.push(
        `<rect x="${x}" y="${y}" width="${round(w * (0.15 + rand() * 0.35))}" height="1.6" rx="0.8" fill="#ffffff" opacity="${round(
          0.12 + rand() * 0.16
        )}"/>`
      );
    }
    // a small boat
    const bx = round(w * (0.55 + rand() * 0.25));
    const by = round(h * 0.82);
    body.push(
      `<path d="M${bx - 14},${by} q14,8 28,0 z" fill="${p.ink}" opacity="0.85"/><rect x="${bx - 1}" y="${by - 14}" width="2" height="14" fill="${p.ink}" opacity="0.85"/>`
    );
  } else if (kind === "monument") {
    body.push(`<rect y="${round(h * 0.74)}" width="${w}" height="${round(h * 0.26)}" fill="${p.near}"/>`);
    const cx = w / 2;
    const domeR = h * 0.17;
    const baseY = h * 0.74;
    body.push(`<rect x="${round(cx - w * 0.2)}" y="${round(baseY - h * 0.18)}" width="${round(w * 0.4)}" height="${round(h * 0.18)}" fill="${p.mid}"/>`);
    body.push(
      `<path d="M${round(cx - domeR)},${round(baseY - h * 0.18)} a${round(domeR)},${round(domeR)} 0 0 1 ${round(
        domeR * 2
      )},0 z" fill="${p.mid}"/>`
    );
    body.push(`<rect x="${round(cx - 1.6)}" y="${round(baseY - h * 0.18 - domeR - h * 0.07)}" width="3.2" height="${round(h * 0.07)}" fill="${p.mid}"/>`);
    [-1, 1].forEach((s) => {
      const mx = cx + s * w * 0.3;
      body.push(`<rect x="${round(mx - w * 0.018)}" y="${round(baseY - h * 0.32)}" width="${round(w * 0.036)}" height="${round(h * 0.32)}" fill="${p.far}"/>`);
      body.push(`<circle cx="${round(mx)}" cy="${round(baseY - h * 0.34)}" r="${round(w * 0.024)}" fill="${p.far}"/>`);
    });
    body.push(
      `<path d="M0,${h} L0,${round(h * 0.88)} ${ridge(rand, w, h * 0.9, h * 0.04, 6)} L${w},${h} Z" fill="${p.ink}" opacity="0.35"/>`
    );
  } else if (kind === "shrine") {
    body.push(`<rect y="${round(h * 0.76)}" width="${w}" height="${round(h * 0.24)}" fill="${p.near}"/>`);
    const cx = w / 2;
    const baseY = h * 0.76;
    const tiers = 4;
    for (let i = 0; i < tiers; i++) {
      const tw = w * (0.34 - i * 0.062);
      const th = h * 0.1;
      const ty = baseY - th * (i + 1);
      body.push(`<path d="M${round(cx - tw / 2)},${round(ty + th)} L${round(cx - tw / 2 + tw * 0.1)},${round(ty)} L${round(cx + tw / 2 - tw * 0.1)},${round(ty)} L${round(cx + tw / 2)},${round(ty + th)} Z" fill="${i % 2 ? p.mid : p.far}"/>`);
    }
    body.push(`<circle cx="${round(cx)}" cy="${round(baseY - h * 0.44)}" r="${round(h * 0.035)}" fill="${p.accent}"/>`);
    for (let i = 0; i < 6; i++) {
      const lx = round(w * (0.08 + rand() * 0.84));
      const ly = round(baseY + h * 0.06 + rand() * h * 0.12);
      body.push(`<circle cx="${lx}" cy="${ly}" r="${round(1.6 + rand() * 1.6)}" fill="${p.accent}" opacity="0.9"/>`);
    }
  } else if (kind === "forest") {
    body.push(`<path d="M0,${h} L0,${round(h * 0.7)} ${ridge(rand, w, h * 0.72, h * 0.1, 7)} L${w},${h} Z" fill="${p.far}"/>`);
    const trees = 7 + Math.floor(rand() * 5);
    for (let i = 0; i < trees; i++) {
      const tx = round((w / trees) * i + rand() * (w / trees));
      const th = h * (0.16 + rand() * 0.2);
      const ty = h * (0.88 + rand() * 0.08);
      const tw = th * 0.42;
      body.push(
        `<path d="M${round(tx)},${round(ty - th)} L${round(tx - tw / 2)},${round(ty)} L${round(tx + tw / 2)},${round(ty)} Z" fill="${
          i % 2 ? p.mid : p.near
        }"/>`
      );
    }
    body.push(`<rect y="${round(h * 0.94)}" width="${w}" height="${round(h * 0.06)}" fill="${p.near}"/>`);
  } else if (kind === "coast") {
    body.push(`<rect y="${round(h * 0.58)}" width="${w}" height="${round(h * 0.42)}" fill="${p.mid}"/>`);
    body.push(
      `<path d="M0,${round(h * 0.78)} q${round(w * 0.25)},${round(-h * 0.06)} ${round(w * 0.5)},0 t${round(w * 0.5)},0 L${w},${h} L0,${h} Z" fill="${p.near}"/>`
    );
    for (let i = 0; i < 4; i++) {
      const y = round(h * 0.62 + i * h * 0.04);
      body.push(
        `<rect x="${round(rand() * w * 0.6)}" y="${y}" width="${round(w * (0.14 + rand() * 0.3))}" height="1.6" rx="0.8" fill="#ffffff" opacity="0.18"/>`
      );
    }
    // palm
    const px = round(w * (0.12 + rand() * 0.18));
    const py = round(h * 0.84);
    body.push(`<path d="M${px},${py} q2,${round(-h * 0.18)} -2,${round(-h * 0.28)}" stroke="${p.ink}" stroke-width="2.4" fill="none" opacity="0.85"/>`);
    for (let i = 0; i < 5; i++) {
      const a = -2.5 + i * 0.55;
      body.push(
        `<path d="M${round(px - 2)},${round(py - h * 0.28)} q${round(Math.cos(a) * 18)},${round(Math.sin(a) * 10 - 6)} ${round(
          Math.cos(a) * 30
        )},${round(Math.sin(a) * 12)}" stroke="${p.ink}" stroke-width="2" fill="none" opacity="0.8"/>`
      );
    }
  } else if (kind === "skyline") {
    body.push(`<rect y="${round(h * 0.82)}" width="${w}" height="${round(h * 0.18)}" fill="${p.near}"/>`);
    const blocks = 9 + Math.floor(rand() * 5);
    for (let i = 0; i < blocks; i++) {
      const bw = w / blocks;
      const bh = h * (0.16 + rand() * 0.42);
      const bx = i * bw;
      body.push(`<rect x="${round(bx + 1)}" y="${round(h * 0.82 - bh)}" width="${round(bw - 2)}" height="${round(bh)}" fill="${i % 2 ? p.mid : p.far}"/>`);
      const rows = Math.floor(bh / 12);
      for (let r = 0; r < rows; r++) {
        if (rand() > 0.55) {
          body.push(
            `<rect x="${round(bx + bw * 0.25)}" y="${round(h * 0.82 - bh + 6 + r * 12)}" width="${round(bw * 0.2)}" height="4" fill="${p.accent}" opacity="0.75"/>`
          );
        }
      }
    }
  } else if (kind === "dunes") {
    for (let i = 0; i < 3; i++) {
      const y = h * (0.62 + i * 0.13);
      const fill = [p.far, p.mid, p.near][i];
      body.push(
        `<path d="M0,${round(y + h * 0.1)} q${round(w * 0.3)},${round(-h * (0.1 + rand() * 0.08))} ${round(w * 0.55)},${round(
          h * 0.02
        )} t${round(w * 0.5)},${round(-h * 0.03)} L${w},${h} L0,${h} Z" fill="${fill}"/>`
      );
    }
    // camel silhouette
    const cx2 = round(w * (0.6 + rand() * 0.2));
    const cy2 = round(h * 0.88);
    body.push(
      `<path d="M${cx2 - 16},${cy2} q3,-7 7,-8 q2,-6 6,-2 q4,-5 7,1 q4,1 5,9 M${cx2 - 13},${cy2} l-1,7 M${cx2 - 4},${cy2 + 1} l0,7 M${cx2 + 5},${cy2 + 1} l1,7 M${cx2 + 11},${cy2} l2,7 M${cx2 + 16},${cy2 - 8} q4,-2 5,-7" stroke="${p.ink}" stroke-width="2" fill="none" opacity="0.9" stroke-linecap="round"/>`
    );
  } else {
    // terraces
    for (let i = 0; i < 5; i++) {
      const y = h * (0.56 + i * 0.09);
      const fill = i % 2 ? p.mid : p.far;
      body.push(
        `<path d="M0,${round(y)} q${round(w * 0.35)},${round(-h * 0.05)} ${round(w)},${round(h * 0.01)} L${w},${round(
          y + h * 0.1
        )} q${round(-w * 0.35)},${round(h * 0.04)} ${round(-w)},0 Z" fill="${fill}" opacity="0.95"/>`
      );
    }
    body.push(`<rect y="${round(h * 0.94)}" width="${w}" height="${round(h * 0.06)}" fill="${p.near}"/>`);
    const huts = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < huts; i++) {
      const hx = round(w * (0.15 + rand() * 0.7));
      const hy = round(h * 0.92);
      body.push(
        `<path d="M${hx - 11},${hy} l11,-11 l11,11 z" fill="${p.ink}" opacity="0.85"/><rect x="${hx - 8}" y="${hy}" width="16" height="8" fill="${p.ink}" opacity="0.85"/>`
      );
    }
  }

  return [
    `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">`,
    `<defs><linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient></defs>`,
    body.join(""),
    `</svg>`,
  ].join("");
}
