import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { siteUrl } from "@/lib/site";

const display = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OnlyTravelers — Before life gets too busy, travel.",
    template: "%s",
  },
  description:
    "359 destinations across all 36 Indian states and union territories, each with what it is, how long it deserves, when to go and how to reach it. Add the ones that pull you in and we build the trip around them.",
  openGraph: {
    title: "OnlyTravelers — Before life gets too busy, travel.",
    description:
      "Every state, every union territory, 359 destinations. Be travelers, not tourists.",
    siteName: "OnlyTravelers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
