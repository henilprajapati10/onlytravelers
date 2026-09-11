import type { Category } from "@/data/destinations";

export const categoryStyle: Record<Category, { emoji: string; gradient: string }> = {
  Heritage: { emoji: "🏛️", gradient: "from-amber-700 via-orange-700 to-navy-800" },
  "Hill Station": { emoji: "⛰️", gradient: "from-emerald-700 via-teal-700 to-navy-800" },
  Beach: { emoji: "🏖️", gradient: "from-cyan-600 via-sky-700 to-navy-800" },
  Spiritual: { emoji: "🪔", gradient: "from-coral-500 via-orange-600 to-navy-800" },
  Wildlife: { emoji: "🐅", gradient: "from-lime-700 via-green-700 to-navy-800" },
  Adventure: { emoji: "🥾", gradient: "from-indigo-600 via-violet-700 to-navy-800" },
  Backwaters: { emoji: "🛶", gradient: "from-teal-600 via-emerald-700 to-navy-800" },
  Desert: { emoji: "🐪", gradient: "from-amber-600 via-yellow-700 to-navy-800" },
  Island: { emoji: "🏝️", gradient: "from-sky-600 via-cyan-700 to-navy-800" },
  "Village & Culture": { emoji: "🧵", gradient: "from-rose-600 via-red-700 to-navy-800" },
};

export function primaryCategoryStyle(categories: Category[]) {
  return categoryStyle[categories[0]];
}
