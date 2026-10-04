import { PHRASE_SET, phrasebookFor } from "@/data/phrases";

/**
 * Eight phrases in the state's own languages. Rendered statically — it is a
 * table, not a feature — and kept to languages the phrasebook can state
 * confidently; English is assumed everywhere.
 */
export default function Phrasebook({ languages, compact = false }: { languages: string[]; compact?: boolean }) {
  const books = phrasebookFor(languages);
  if (!books.length) return null;
  const shown = compact ? books.slice(0, 1) : books.slice(0, 2);

  return (
    <div data-testid="phrasebook" className={compact ? "" : "rounded-2xl border border-navy-100 bg-white p-4 shadow-card"}>
      <p className="font-display text-xs font-semibold uppercase tracking-wide text-navy-500">
        Say it in {shown.map((b) => b.language).join(" / ")}
      </p>
      <table className="mt-2 w-full text-sm">
        <tbody>
          {PHRASE_SET.map((p) => (
            <tr key={p.id} className="border-t border-navy-50">
              <th scope="row" className="py-1 pr-3 text-left font-medium text-navy-500">
                {p.english}
              </th>
              {shown.map((b) => (
                <td key={b.language} className="py-1 pr-2 font-semibold text-navy-800">
                  {b.phrases[p.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && books.length > shown.length && (
        <p className="mt-2 text-[11px] text-navy-400">
          Also spoken here: {books.slice(shown.length).map((b) => b.language).join(", ")}.
        </p>
      )}
    </div>
  );
}
