import { TESTIMONIALS } from "@/lib/site-data";
import { Star } from "./icons";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-sann-bg2 px-5 sm:px-8 lg:px-14 py-16 lg:py-24">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-9">
          <div>
            <div className="font-mono text-xs text-sann-text-lt tracking-[0.18em] uppercase mb-2.5">Guests say</div>
            <h2 className="font-display font-normal text-4xl lg:text-[3.4rem] leading-[1.05] text-sann-text m-0">
              What guests <i className="text-sann-red">love</i>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} className="text-sann-red" />
            ))}
            <span className="font-mono text-2xl font-medium ml-2 text-sann-text">4.9</span>
            <span className="text-sm text-sann-text-lt">· loved on Airbnb</span>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-sann-card rounded-sann-lg p-6 lg:p-7 flex flex-col gap-3.5 shadow-sann-sm">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= t.rating ? "text-sann-red" : "text-sann-line"} />
                ))}
              </div>
              <p className="font-display italic text-lg lg:text-xl leading-snug text-sann-text m-0">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="h-px bg-sann-line mt-auto" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[0.82rem] font-medium text-sann-text">{t.author}</div>
                  <div className="text-[0.7rem] text-sann-text-lt">{t.location}</div>
                </div>
                <span className="text-[0.65rem] text-sann-text-lt border border-sann-line rounded-full px-2.5 py-1">
                  via {t.via}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
