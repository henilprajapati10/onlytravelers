import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import { festivalsInMonth } from "@/data/festivals";
import { getState } from "@/data/states";
import { MONTH_INTRO } from "@/data/landing";
import { renownScore } from "@/data/renown";
import { monthFull, monthName } from "@/lib/trip";
import LandingPage from "@/components/LandingPage";
import { pageMetadata } from "@/lib/seo";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const slugOf = (m: number) => monthFull(m).toLowerCase();
const monthFromSlug = (slug: string) => MONTHS.find((m) => slugOf(m) === slug);

export function generateStaticParams() {
  return MONTHS.map((m) => ({ month: slugOf(m) }));
}

export function generateMetadata({ params }: { params: { month: string } }) {
  const m = monthFromSlug(params.month);
  if (!m) return {};
  const count = destinations.filter((d) => d.bestMonths.includes(m)).length;
  return pageMetadata({
    title: `Where to go in India in ${monthFull(m)} — ${count} places in season`,
    description: MONTH_INTRO[m],
    path: `/best-time/${params.month}`,
    image: "/opengraph-image",
  });
}

export default function MonthPage({ params }: { params: { month: string } }) {
  const m = monthFromSlug(params.month);
  if (!m) notFound();
  // In season this month, the places whose season is short first: they are
  // the reason to pick this month over another.
  const list = destinations
    .filter((d) => d.bestMonths.includes(m))
    .sort((a, b) => a.bestMonths.length - b.bestMonths.length || renownScore(b.slug) - renownScore(a.slug));
  const fests = festivalsInMonth(m);
  const prev = ((m + 10) % 12) + 1;
  const next = (m % 12) + 1;
  return (
    <LandingPage
      eyebrow="Best time to visit"
      title={`Where to go in India in ${monthFull(m)}`}
      intro={MONTH_INTRO[m]}
      crumbs={[{ name: "Best time", path: "/festivals" }, { name: monthFull(m), path: `/best-time/${params.month}` }]}
      list={list}
      path={`/best-time/${params.month}`}
      aside={
        <div className="mt-6 flex flex-col gap-4">
          <nav aria-label="Other months" className="flex flex-wrap gap-2">
            {MONTHS.map((x) => (
              <Link
                key={x}
                href={`/best-time/${slugOf(x)}`}
                aria-current={x === m ? "page" : undefined}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  x === m ? "bg-navy-800 text-white" : "border border-navy-200 bg-white text-navy-700 hover:border-coral-300"
                }`}
              >
                {monthName(x)}
              </Link>
            ))}
          </nav>
          {fests.length > 0 && (
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
                Happening in {monthFull(m)}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                {fests.slice(0, 8).map((f) => (
                  <li key={f.id}>
                    <Link href={`/festivals#month-${m}`} className="rounded-lg bg-sand-100 px-2.5 py-1 text-navy-700 hover:bg-sand-200">
                      {f.name} · {getState(f.stateId)?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-navy-400">
            <Link href={`/best-time/${slugOf(prev)}`} className="hover:text-coral-500">← {monthFull(prev)}</Link>
            {" · "}
            <Link href={`/best-time/${slugOf(next)}`} className="hover:text-coral-500">{monthFull(next)} →</Link>
          </p>
        </div>
      }
    />
  );
}
