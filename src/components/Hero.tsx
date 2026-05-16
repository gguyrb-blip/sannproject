"use client";

import { useEffect, useState } from "react";
import { HERO_IMAGE, HERO_IMAGE_MOBILE } from "@/lib/site-data";
import { useBookingModal } from "./BookingModalProvider";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { open } = useBookingModal();

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out ${
          loaded ? "scale-100" : "scale-[1.03]"
        }`}
        style={{
          backgroundImage: `url('${isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE}')`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(253,249,244,0.92)_0%,rgba(253,249,244,0.7)_42%,rgba(253,249,244,0.12)_75%,transparent_100%),linear-gradient(to_top,rgba(42,31,24,0.18)_0%,transparent_40%)]" />

      <div className="relative z-[3] h-full flex flex-col justify-center px-6 lg:px-20 max-w-[560px]">
        <p className="text-[0.63rem] tracking-[0.35em] uppercase text-sann-red font-semibold mb-4 flex items-center gap-3">
          Hat Yai &nbsp;·&nbsp; Thailand
          <span className="inline-block w-8 h-px bg-sann-red opacity-50" />
        </p>
        <h1 className="font-display text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.1] font-normal text-sann-text mb-5">
          Where every stay
          <br />
          feels like <em className="italic text-sann-red">home</em>
        </h1>
        <p className="font-serif italic text-base lg:text-lg text-sann-text-md leading-[1.7] mb-8 max-w-[380px] font-light">
          Stay in style with Sann Stay
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => open()}
            className="bg-sann-red hover:bg-sann-red-dk text-white px-7 py-3 rounded-sm text-[0.73rem] tracking-[0.16em] uppercase font-semibold transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(197,49,18,0.25)]"
          >
            Book Now
          </button>
          <a
            href="#properties"
            className="border-[1.5px] border-sann-red/30 hover:border-sann-red text-sann-red bg-transparent hover:bg-sann-red/[0.04] px-7 py-3 rounded-sm text-[0.73rem] tracking-[0.16em] uppercase font-semibold transition-all"
          >
            Explore Stays
          </a>
        </div>
      </div>
    </section>
  );
}
