import { groupResponsible, type ResponsibleNote } from "@/lib/responsible";

const KIND_TONE: Record<string, string> = {
  law: "border-coral-400 bg-coral-50",
  fragile: "border-sky-400 bg-sky-50",
  respect: "border-amber-400 bg-amber-50",
  money: "border-emerald-400 bg-emerald-50",
};

/**
 * The campaign, applied to this specific trip. Everything here is here
 * because of something actually in the itinerary.
 */
export default function ResponsibleList({ notes }: { notes: ResponsibleNote[] }) {
  const groups = groupResponsible(notes);
  if (!groups.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.kind}>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500">
            {group.label}
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {group.notes.map((note) => (
              <li
                key={note.id}
                className={`rounded-xl border-l-4 p-4 ${KIND_TONE[note.kind] ?? "border-navy-200 bg-white"}`}
              >
                <h4 className="font-display font-semibold text-navy-800">{note.title}</h4>
                <p className="mt-1.5 text-sm text-navy-600">{note.detail}</p>
                {note.because.length > 0 && (
                  <p className="mt-2 text-xs text-navy-400">
                    Because of: {note.because.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
