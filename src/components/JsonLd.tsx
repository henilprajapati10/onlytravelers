import type { JsonLdObject } from "@/lib/seo";

/**
 * Structured data, serialised safely. The closing-tag escape matters: a
 * place name with "</script>" in it (none today, but data changes) would
 * otherwise end the block early.
 */
export default function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
