import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LineFloat from "@/components/LineFloat";
import {
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_OPEN_URL,
  NEARBY_PLACES,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Getting Here",
  description:
    "Find Sann Stay Hatyai — directions, Google Maps, and nearby places.",
};

export default function LocationPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20 px-6 lg:px-20">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Getting Here
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-sann-text font-normal leading-[1.1]">
            Sann Stay <em className="italic text-sann-red">Hatyai</em>
          </h1>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
          <p className="font-serif italic text-lg text-sann-text-md leading-[1.7]">
            We are located in the heart of Hat Yai, close to Lee Garden Plaza,
            Kim Yong Market, local restaurants, cafés, and shopping areas.
          </p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="rounded overflow-hidden border border-sann-red/10 shadow-[0_10px_36px_rgba(42,31,24,0.06)] bg-white">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              title="Sann Stay map"
              className="w-full h-[360px] lg:h-[480px] block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-5 py-4 flex items-center justify-between bg-white">
              <p className="text-sm text-sann-text-md">
                Heart of Hat Yai, Songkhla, Thailand
              </p>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sann-red hover:bg-sann-red-dk text-white px-5 py-2.5 rounded-sm text-[0.7rem] tracking-[0.16em] uppercase font-semibold transition-colors whitespace-nowrap"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          <aside className="bg-sann-cream border border-sann-red/10 rounded p-6 lg:p-8">
            <p className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red font-semibold mb-3">
              Nearby Places
            </p>
            <ul className="flex flex-col gap-4 list-none">
              {NEARBY_PLACES.map((p) => (
                <li
                  key={p.name}
                  className="pb-3 border-b border-sann-red/10 last:border-0"
                >
                  <p className="font-display text-base text-sann-text">
                    {p.name}
                  </p>
                  <p className="text-xs text-sann-text-md mt-0.5">{p.desc}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
      <LineFloat />
    </>
  );
}
