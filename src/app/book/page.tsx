import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LineFloat from "@/components/LineFloat";
import BookForm from "./BookForm";

export const metadata: Metadata = {
  title: "Book a Stay",
  description:
    "Send a booking inquiry for Sann Stay. Our team will check availability and reply shortly.",
};

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20 px-6 lg:px-20">
        <header className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Booking Inquiry
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-sann-text font-normal leading-[1.1]">
            Plan your <em className="italic text-sann-red">stay</em>
          </h1>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
          <p className="font-serif italic text-lg text-sann-text-md">
            Tell us a little about your trip and we&apos;ll get back to you
            shortly.
          </p>
        </header>
        <BookForm />
      </main>
      <Footer />
      <LineFloat />
    </>
  );
}
