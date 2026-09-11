import Link from "next/link";
import { imageRightsRegister } from "@/data/images";

export const metadata = {
  title: "Image rights register — OnlyTravelers",
  description:
    "One row per photograph: destination, source, licence, photographer, date acquired and where it is used.",
};

export default function ImageRightsPage() {
  const rows = imageRightsRegister();
  const unrecorded = rows.filter((r) => r.licence === "UNRECORDED");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-navy-800">Image rights register</h1>
      <p className="mt-3 max-w-[65ch] text-navy-600">
        One row per photograph on the site: destination, source URL, licence type,
        photographer, date acquired and where it is used. Kept from day one, because
        retrofitting it across a thousand images is close to impossible — and because it is
        the only thing that resolves a takedown or an invoice quickly.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-navy-100 bg-white p-4">
          <div className="font-display text-2xl font-bold text-navy-800">{rows.length}</div>
          <div className="text-xs uppercase tracking-wide text-navy-400">photographs on file</div>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white p-4">
          <div
            className={`font-display text-2xl font-bold ${
              unrecorded.length ? "text-coral-600" : "text-navy-800"
            }`}
          >
            {unrecorded.length}
          </div>
          <div className="text-xs uppercase tracking-wide text-navy-400">missing a licence</div>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white p-4">
          <div className="font-display text-2xl font-bold text-navy-800">359</div>
          <div className="text-xs uppercase tracking-wide text-navy-400">slots ready</div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-navy-200 bg-white p-8">
          <h2 className="font-display text-lg font-semibold text-navy-800">
            No photographs added yet
          </h2>
          <p className="mt-2 max-w-[65ch] text-sm text-navy-600">
            Every destination currently renders generated vector artwork, so no page looks
            broken. To add real photographs, drop files into{" "}
            <code className="rounded bg-sand-100 px-1 text-navy-700">
              public/images/&lt;slug&gt;/
            </code>{" "}
            and add an entry to{" "}
            <code className="rounded bg-sand-100 px-1 text-navy-700">src/data/images.ts</code>{" "}
            with its licence record. Hero slots are 16:5, gallery slots 3:2, three to six per
            destination.
          </p>
          <p className="mt-3 max-w-[65ch] text-sm text-navy-600">
            The sourcing plan in the directory suggests phasing it: paid or commissioned
            photography for the top thirty by demand, your own shoot for the launch state,
            then licence-checked Unsplash, Pexels and Wikimedia Commons for volume, with
            user-submitted photos under an explicit licence grant after that.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy-100 bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-navy-100 bg-sand-50 text-xs uppercase tracking-wide text-navy-500">
              <tr>
                {["Destination", "Used in", "File", "Photographer", "Licence", "Source", "Acquired"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.slug}-${r.src}`} className="border-b border-navy-50 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/destinations/${r.slug}`} className="font-medium text-navy-800 hover:text-coral-500">
                      {r.slug}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-navy-600">{r.usedIn}</td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-500">{r.src}</td>
                  <td className="px-4 py-3 text-navy-600">{r.photographer}</td>
                  <td
                    className={`px-4 py-3 ${
                      r.licence === "UNRECORDED" ? "font-bold text-coral-600" : "text-navy-600"
                    }`}
                  >
                    {r.licence}
                  </td>
                  <td className="px-4 py-3 text-navy-500">{r.sourceUrl}</td>
                  <td className="px-4 py-3 tabular-nums text-navy-600">{r.acquired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
