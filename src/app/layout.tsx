import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { BookingModalProvider } from "@/components/BookingModalProvider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";

const DESC =
  "Sann Stay Hatyai — your own modern 4-bedroom house in the heart of Hat Yai, a 4-minute walk to Lee Garden Plaza. Sleeps up to 8, self check-in, air-con in every room, full kitchen. Book direct for the best rate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sann Stay Hatyai — 4-Bedroom House near Lee Garden, Hat Yai",
    template: "%s · Sann Stay",
  },
  description: DESC,
  keywords: [
    "Hat Yai accommodation", "Hatyai hotel", "Sann Stay", "Sann Stay Hatyai",
    "4 bedroom house Hat Yai", "Lee Garden Plaza hotel", "Hat Yai homestay",
    "entire house Hat Yai", "ที่พักหาดใหญ่", "บ้านพักหาดใหญ่", "บ้านพักทั้งหลังหาดใหญ่",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sann Stay Hatyai — 4-Bedroom House near Lee Garden",
    description: DESC,
    url: SITE_URL,
    siteName: "Sann Stay",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Sann Stay Hatyai — 4-bedroom house in Hat Yai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sann Stay Hatyai — 4-Bedroom House near Lee Garden",
    description: DESC,
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="font-sans antialiased">
        <BookingModalProvider>{children}</BookingModalProvider>
      </body>
    </html>
  );
}
