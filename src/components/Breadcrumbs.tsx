import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

/**
 * Where this page sits in the site, for people and for crawlers: the visible
 * trail and the BreadcrumbList that mirrors it come from one list.
 */
export default function Breadcrumbs({ crumbs, tone = "dark" }: { crumbs: Crumb[]; tone?: "dark" | "light" }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  const text = tone === "light" ? "text-white/80 hover:text-white" : "text-navy-500 hover:text-coral-500";
  const sep = tone === "light" ? "text-white/50" : "text-navy-300";
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className={sep}>
                  /
                </span>
              )}
              {last ? (
                <span aria-current="page" className={tone === "light" ? "font-medium text-white" : "font-medium text-navy-800"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={text}>
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
