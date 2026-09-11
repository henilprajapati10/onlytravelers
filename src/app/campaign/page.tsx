import Link from "next/link";

export const metadata = {
  title: "Travelers, Not Tourists — OnlyTravelers",
};

const principles = [
  {
    title: "Go for understanding, not a checklist",
    body:
      "A tourist collects landmarks. A traveler asks why a place is the way it is — why Varanasi's ghats face the river the way they do, why Kutch turns white every winter. Every destination page here leads with that context first.",
  },
  {
    title: "Move at the place's pace, not your itinerary's",
    body:
      "We recommend real days, not rushed half-days — two days in Udaipur, five in Spiti, one in Khajuraho. Our trip generator builds in travel buffers instead of pretending distance doesn't exist.",
  },
  {
    title: "Spend where it lands with people, not around them",
    body:
      "Our traveler tips point you toward homestays, local guides, family-run estates and community kitchens over the version of a place built only for tour buses.",
  },
  {
    title: "Leave with a story, not just a photo",
    body:
      "If a destination page here doesn't teach you something you didn't know before you clicked it, we haven't done our job.",
  },
];

export default function CampaignPage() {
  return (
    <div>
      <section className="bg-navy-800 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-coral-400">
            Our Campaign
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Be travelers, not tourists.
          </h1>
          <p className="mt-5 text-lg text-navy-200">
            Tourism moves through a place. Traveling moves you. OnlyTravelers
            exists to make the second one easier to plan than the first.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-navy-800">{p.title}</h2>
              <p className="mt-3 text-sm text-navy-600">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-sand-100 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-navy-800">
            India rewards the traveler who slows down.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-600">
            Start with a place you&apos;re actually curious about, read why it
            matters, and add it to your Trip Bag. We&apos;ll handle turning
            your curiosity into an itinerary.
          </p>
          <Link
            href="/destinations"
            className="mt-6 inline-block rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
}
