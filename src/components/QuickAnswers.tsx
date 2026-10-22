import type { Destination } from "@/data/destinations";
import { destinationFaq } from "@/lib/faq";
import { faqJsonLd } from "@/lib/seo";
import JsonLd from "./JsonLd";

/**
 * The questions a search engine gets asked about this place, answered on
 * the page in the same words the structured data carries.
 */
export default function QuickAnswers({ destination, summary }: { destination: Destination; summary?: string }) {
  const faq = destinationFaq(destination, summary);
  return (
    <section data-testid="quick-answers" className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <JsonLd data={faqJsonLd(faq)} />
      <h2 className="font-display text-lg font-semibold text-navy-800">Quick answers</h2>
      <dl className="mt-3 divide-y divide-navy-50">
        {faq.map((f) => (
          <div key={f.question} className="py-3">
            <dt className="font-semibold text-navy-800">{f.question}</dt>
            <dd className="mt-1 text-sm text-navy-600">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
