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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sann Stay — Where every stay feels like home",
    template: "%s · Sann Stay",
  },
  description:
    "Boutique accommodation in Hat Yai, Thailand. Cozy 4BR home & modern hostel.",
  openGraph: {
    title: "Sann Stay — Where every stay feels like home",
    description:
      "Boutique accommodation in Hat Yai, Thailand. Cozy 4BR home & modern hostel.",
    url: SITE_URL,
    siteName: "Sann Stay",
    type: "website",
  },
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
