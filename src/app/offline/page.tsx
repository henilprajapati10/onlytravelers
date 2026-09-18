import Link from "next/link";

export const metadata = { title: "Offline — OnlyTravelers" };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-coral-500">
        No signal
      </p>
      <h1 className="font-display mt-3 text-4xl font-bold text-navy-800">
        You&apos;re offline
      </h1>
      <p className="mx-auto mt-4 max-w-md text-navy-500">
        This page hasn&apos;t been opened on this device before, so there&apos;s no copy to
        show. Your saved trips and any destination you&apos;ve already read are still here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/trips"
          className="rounded-lg bg-coral-500 px-6 py-3 text-sm font-semibold text-white hover:bg-coral-600"
        >
          My trips
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-navy-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
