import Link from "next/link";
import { HERO_IMAGE } from "@/lib/site-data";
import { ArrowR, Star, Check, DotGrid } from "./icons";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-12 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
      <div className="absolute top-16 right-8 opacity-40 hidden lg:block pointer-events-none">
        <DotGrid n={8} gap={18} size={140} />
      </div>

      {/* Left — copy */}
      <div className="flex flex-col gap-6 relative z-[2]">
        <div className="font-mono text-xs text-sann-text-lt tracking-[0.18em] uppercase flex items-center gap-3.5">
          <span className="w-8 h-px bg-sann-text-lt" /> Hat Yai · Thailand · est. 2026
        </div>

        <h1 className="font-display font-normal text-[2.7rem] sm:text-6xl lg:text-[5.2rem] leading-[1.02] text-sann-text m-0">
          Where every stay <br className="hidden sm:block" />
          feels like <i className="text-sann-red">home</i>.
        </h1>

        <p className="text-base lg:text-lg text-sann-text-lt leading-relaxed max-w-md">
          Boutique accommodation in the heart of Hat Yai — a 4-bedroom home and a
          hostel, both designed for travellers who want quiet, clean spaces with
          thoughtful details.
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-sann-red hover:bg-sann-red-dk text-white text-base font-medium px-6 py-4 rounded-2xl shadow-sann-md transition-colors"
          >
            Book a stay <ArrowR size={18} />
          </Link>
          <a
            href="#properties"
            className="inline-flex items-center bg-white border border-sann-line text-sann-text text-base font-medium px-6 py-4 rounded-2xl hover:border-sann-red transition-colors"
          >
            Explore properties
          </a>
        </div>

        <div className="flex items-center gap-5 mt-3 pt-5 border-t border-sann-line">
          <Stat n="4.9" l="avg rating" star />
          <Div />
          <Stat n="2" l="properties" />
        </div>
      </div>

      {/* Right — image stack */}
      <div className="relative h-[360px] sm:h-[460px] lg:h-[540px]">
        <div className="absolute top-0 right-0 w-[78%] h-[72%] rounded-sann-2xl overflow-hidden shadow-sann-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="Sann Stay bedroom" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 w-[52%] h-[48%] rounded-sann-xl overflow-hidden shadow-sann-lg border-8 border-sann-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover brightness-90 saturate-[.85]" />
        </div>

        <div className="absolute top-7 left-[-8px] sm:left-[-20px] bg-white rounded-sann-md shadow-sann-lg p-3.5 flex items-center gap-3 max-w-[250px]">
          <div className="w-11 h-11 rounded-xl bg-sann-success text-white flex items-center justify-center shrink-0">
            <Check size={20} />
          </div>
          <div>
            <div className="text-[0.8rem] font-medium text-sann-text">Self check-in from 15:00</div>
            <div className="text-[0.7rem] text-sann-text-lt mt-0.5">Smart lock · arrive anytime</div>
          </div>
        </div>

        <div className="absolute bottom-12 right-[-8px] sm:right-[-24px] bg-white rounded-sann-md shadow-sann-lg p-3.5 max-w-[210px]">
          <div className="font-mono text-[0.62rem] text-sann-text-lt tracking-[0.12em]">FROM</div>
          <div className="font-mono text-2xl font-medium mt-0.5 text-sann-text">
            ฿3,500<span className="text-[0.8rem] text-sann-text-lt font-normal"> / night</span>
          </div>
          <div className="text-[0.7rem] text-sann-text-lt mt-0.5">per house · Sann Stay Hatyai</div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l, star }: { n: string; l: string; star?: boolean }) {
  return (
    <div>
      <div className="font-mono text-xl lg:text-[1.4rem] font-medium text-sann-text flex items-center gap-1.5">
        {n}
        {star && <Star size={15} className="text-sann-red" />}
      </div>
      <div className="text-[0.7rem] text-sann-text-lt mt-0.5">{l}</div>
    </div>
  );
}
function Div() {
  return <div className="w-px h-7 bg-sann-line" />;
}
