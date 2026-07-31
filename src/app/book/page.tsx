import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BookingEngine from "./BookingEngine";

export const metadata: Metadata = {
  title: "Book a Stay",
  description:
    "Book SANN Stay Hatyai or SANN Thungsao Hostel directly — live availability, best direct rates, instant confirmation.",
};

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20 px-6 lg:px-20">
        <header className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Direct Booking
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-sann-text font-normal leading-[1.1]">
            Plan your <em className="italic text-sann-red">stay</em>
          </h1>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
          <p className="font-serif italic text-lg text-sann-text-md">
            Choose your stay, pick your dates, and book in a few taps.
          </p>
        </header>
        <BookingEngine />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
