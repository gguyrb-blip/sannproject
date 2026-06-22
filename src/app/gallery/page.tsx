import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LineFloat from "@/components/LineFloat";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Sann Stay Hatyai room by room — bedrooms, living room, kitchen, common area and exterior, each with details.",
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20">
        <header className="max-w-3xl mx-auto text-center mb-12 px-6">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Gallery
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-sann-text font-normal leading-[1.1]">
            Take a look <em className="italic text-sann-red">inside</em>
          </h1>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
          <p className="font-serif italic text-lg text-sann-text-md leading-[1.7]">
            A room-by-room look at our modern 3-storey house in Hat Yai — tap any
            photo to view it larger with details.
          </p>
        </header>

        <GalleryGrid />
      </main>
      <Footer />
      <LineFloat />
    </>
  );
}
