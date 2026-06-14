import { ABOUT_IMAGE_MAIN, ABOUT_IMAGE_SECONDARY } from "@/lib/site-data";

const FACTS = [
  { e: "🔑", h: "Smart lock check-in", s: "Arrive anytime — your code lives 24h ahead." },
  { e: "📶", h: "100 Mbps WiFi", s: "Perfect for remote work, video calls, streaming." },
  { e: "🍳", h: "Kitchenettes", s: "Cook your own meals in select properties." },
  { e: "💬", h: "Responsive host", s: "A LINE message away, 24/7." },
];

export default function AboutSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Image stack + stamp */}
      <div className="relative h-[360px] lg:h-[480px] order-2 lg:order-1">
        <div className="absolute top-0 left-0 w-[60%] h-[70%] rounded-sann-xl overflow-hidden shadow-sann-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ABOUT_IMAGE_MAIN} alt="Sann Stay interior" className="w-full h-full object-cover brightness-90" />
        </div>
        <div className="absolute bottom-0 right-0 w-[58%] h-[62%] rounded-sann-xl overflow-hidden shadow-sann-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ABOUT_IMAGE_SECONDARY} alt="" className="w-full h-full object-cover sepia-[.18] brightness-95" />
        </div>
        <div className="absolute top-[42%] left-[46%] w-28 h-28 rounded-full bg-sann-red text-white flex flex-col items-center justify-center shadow-sann-lg -rotate-[8deg] text-center">
          <div className="font-display italic text-lg leading-none">made with</div>
          <div className="text-3xl leading-none my-1">♥</div>
          <div className="font-mono text-[0.6rem] tracking-[0.14em]">HAT YAI</div>
        </div>
      </div>

      {/* Copy */}
      <div className="order-1 lg:order-2">
        <div className="font-mono text-xs text-sann-text-lt tracking-[0.18em] uppercase mb-3.5">Our story</div>
        <h2 className="font-display font-normal text-4xl lg:text-[3.5rem] leading-[1.05] text-sann-text m-0">
          More than just a <i className="text-sann-red">room</i>.
        </h2>
        <p className="text-base lg:text-[1.05rem] text-sann-text leading-relaxed mt-5">
          Sann Stay was born from the belief that a true getaway should feel like
          home — whether you&apos;re travelling for business, leisure, or just
          need a break.
        </p>
        <p className="text-sm text-sann-text-lt leading-relaxed mt-2.5">
          Every property is designed and maintained with attention to detail,
          from bed linens to the scent in the room.
        </p>

        <div className="grid sm:grid-cols-2 gap-3.5 mt-7">
          {FACTS.map((f) => (
            <div key={f.h} className="flex gap-3.5 items-start">
              <div className="w-9 h-9 rounded-[10px] bg-sann-terracotta-soft flex items-center justify-center shrink-0 text-base">
                {f.e}
              </div>
              <div>
                <div className="text-sm font-medium text-sann-text">{f.h}</div>
                <div className="text-xs text-sann-text-lt mt-0.5 leading-snug">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
