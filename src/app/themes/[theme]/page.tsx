import { notFound } from "next/navigation";
import { destinations, themes, type Theme } from "@/data/destinations";
import { THEME_INTRO, themeSlug } from "@/data/landing";
import { renownScore } from "@/data/renown";
import LandingPage from "@/components/LandingPage";
import { pageMetadata } from "@/lib/seo";
import { themeEmoji } from "@/lib/format";

function themeFromSlug(slug: string): Theme | undefined {
  return themes.find((t) => themeSlug(t) === slug);
}

export function generateStaticParams() {
  return themes.map((t) => ({ theme: themeSlug(t) }));
}

export function generateMetadata({ params }: { params: { theme: string } }) {
  const theme = themeFromSlug(params.theme);
  if (!theme) return {};
  const count = destinations.filter((d) => d.themes.includes(theme)).length;
  return pageMetadata({
    title: `${THEME_INTRO[theme].title} — ${count} places`,
    description: THEME_INTRO[theme].intro,
    path: `/themes/${params.theme}`,
    image: "/opengraph-image",
  });
}

export default function ThemePage({ params }: { params: { theme: string } }) {
  const theme = themeFromSlug(params.theme);
  if (!theme) notFound();
  const list = destinations
    .filter((d) => d.themes.includes(theme))
    .sort((a, b) => renownScore(b.slug) - renownScore(a.slug) || a.name.localeCompare(b.name));
  return (
    <LandingPage
      eyebrow={`${themeEmoji[theme]} ${theme}`}
      title={THEME_INTRO[theme].title}
      intro={THEME_INTRO[theme].intro}
      crumbs={[{ name: "Destinations", path: "/destinations" }, { name: theme, path: `/themes/${params.theme}` }]}
      list={list}
      path={`/themes/${params.theme}`}
    />
  );
}
