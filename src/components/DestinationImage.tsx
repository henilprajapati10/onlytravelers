import type { Destination } from "@/data/destinations";
import { getImages } from "@/data/images";
import { sceneSvg } from "@/lib/scene";

type Ratio = "hero" | "card" | "square";

const RATIO: Record<Ratio, { className: string; w: number; h: number }> = {
  hero: { className: "aspect-[16/5]", w: 640, h: 200 },
  card: { className: "aspect-[3/2]", w: 360, h: 240 },
  square: { className: "aspect-square", w: 300, h: 300 },
};

export default function DestinationImage({
  destination,
  ratio = "card",
  className = "",
  priority = false,
}: {
  destination: Destination;
  ratio?: Ratio;
  className?: string;
  priority?: boolean;
}) {
  const { hero } = getImages(destination.slug);
  const r = RATIO[ratio];

  if (hero) {
    return (
      <div className={`relative overflow-hidden ${r.className} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt={hero.alt}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
        {hero.photographer && (
          <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
            © {hero.photographer}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${r.className} ${className}`}
      dangerouslySetInnerHTML={{
        __html: sceneSvg(destination.slug, destination.themes, { width: r.w, height: r.h }),
      }}
    />
  );
}
