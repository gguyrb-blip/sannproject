import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import { BookingModalProvider } from "@/components/BookingModalProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
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
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}
    >
      <body className="font-sans antialiased">
        <BookingModalProvider>{children}</BookingModalProvider>
      </body>
    </html>
  );
}
