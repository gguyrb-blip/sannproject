import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CheckinForm from "./CheckinForm";

export const metadata: Metadata = {
  title: "Online Check-in",
  description:
    "Complete your Sann Stay online check-in before arrival to receive self check-in details.",
};

export default function CheckinPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20 px-6 lg:px-20">
        <header className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Online Check-in
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-sann-text font-normal leading-[1.1]">
            Welcome <em className="italic text-sann-red">home</em>
          </h1>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
          <p className="font-serif italic text-lg text-sann-text-md">
            Complete this short form so we can send your self check-in details
            ahead of your arrival.
          </p>
        </header>
        <CheckinForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
