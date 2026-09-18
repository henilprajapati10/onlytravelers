import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import AppRuntime from "@/components/AppRuntime";
import GlobalSearch from "@/components/GlobalSearch";
import { TripsProvider } from "@/context/TripsContext";
import { ProfileProvider } from "@/context/ProfileContext";
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
    "Plan and carry your India trips: 359 destinations across all 36 states, itineraries with real travel time, prep lists, bookings and spend — offline when you need it.",
  applicationName: "OnlyTravelers",
  appleWebApp: {
    capable: true,
    title: "OnlyTravelers",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "OnlyTravelers — Before life gets too busy, travel.",
    description:
      "Every state, every union territory, 359 destinations. Be travelers, not tourists.",
    siteName: "OnlyTravelers",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1b30",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <ProfileProvider>
          <TripsProvider>
            <Header />
            {/* Bottom padding clears the mobile tab bar. */}
            <main className="min-h-screen pb-20 md:pb-0">{children}</main>
            <Footer />
            <TabBar />
            <AppRuntime />
            <GlobalSearch />
          </TripsProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
