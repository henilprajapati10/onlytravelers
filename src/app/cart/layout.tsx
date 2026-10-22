import type { Metadata } from "next";

// The bag is one person's working list; it has no business in an index.
export const metadata: Metadata = {
  title: "Your Trip Bag — OnlyTravelers",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
