import { getState, states } from "@/data/states";

/**
 * 1:1 locator map. A coarse national outline with the state's travel hub
 * pinned — the directory is explicit that exact coordinates must be verified
 * before publishing, so this locates rather than navigates.
 */

// Simplified India outline as [lng, lat] pairs.
const OUTLINE: [number, number][] = [
  [68.2, 23.7], [68.5, 24.3], [70.0, 24.3], [70.6, 27.7], [72.9, 28.0],
  [73.9, 30.1], [74.6, 31.7], [74.0, 32.5], [74.3, 34.1], [76.0, 34.6],
  [77.8, 35.5], [78.9, 34.4], [79.2, 33.0], [79.0, 32.0], [80.1, 30.6],
  [81.0, 30.2], [82.5, 30.1], [84.0, 29.0], [86.0, 28.0], [88.0, 27.9],
  [88.7, 26.5], [89.8, 26.7], [92.0, 27.5], [94.5, 28.0], [96.5, 28.5],
  [97.3, 28.2], [96.5, 27.0], [95.0, 26.6], [94.6, 25.2], [93.4, 24.0],
  [92.5, 22.0], [91.5, 22.8], [89.5, 22.0], [88.0, 21.6], [86.5, 20.5],
  [85.0, 19.5], [83.0, 17.5], [80.3, 15.8], [80.2, 13.5], [79.8, 10.3],
  [79.0, 9.3], [78.2, 8.4], [77.5, 8.1], [76.5, 9.5], [75.7, 11.6],
  [74.8, 13.0], [73.8, 15.5], [72.8, 18.9], [72.6, 21.5], [70.0, 20.8],
  [69.0, 22.3],
];

const LNG_MIN = 67;
const LNG_MAX = 98;
const LAT_MIN = 6;
const LAT_MAX = 37;
const SIZE = 300;
const PAD = 12;

function project(lng: number, lat: number): [number, number] {
  const x = PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (SIZE - PAD * 2);
  const y = PAD + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (SIZE - PAD * 2);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export default function StateMap({ stateId }: { stateId: string }) {
  const state = getState(stateId);
  if (!state) return null;

  const outlinePath =
    OUTLINE.map(([lng, lat], i) => {
      const [x, y] = project(lng, lat);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ") + " Z";

  const [px, py] = project(state.lng, state.lat);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="aspect-square w-full rounded-lg bg-sand-100"
      role="img"
      aria-label={`Locator map showing ${state.name} within India`}
    >
      <path d={outlinePath} fill="#e4ebf3" stroke="#b0c1d9" strokeWidth="1.2" strokeLinejoin="round" />

      {states
        .filter((s) => s.id !== state.id)
        .map((s) => {
          const [x, y] = project(s.lng, s.lat);
          return <circle key={s.id} cx={x} cy={y} r="1.8" fill="#b0c1d9" />;
        })}

      <circle cx={px} cy={py} r="13" fill="#e8492a" opacity="0.18" />
      <circle cx={px} cy={py} r="6" fill="#e8492a" stroke="#ffffff" strokeWidth="2" />
      <text
        x={px > SIZE * 0.72 ? px - 10 : px + 10}
        y={py + 4}
        textAnchor={px > SIZE * 0.72 ? "end" : "start"}
        fontSize="11"
        fontWeight="600"
        fill="#0b1b30"
      >
        {state.capital}
      </text>
    </svg>
  );
}
