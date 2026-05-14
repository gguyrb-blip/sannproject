import { TESTIMONIALS } from "@/lib/site-data";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-sann-red px-6 lg:px-20 py-20 lg:py-24"
    >
      <header className="rv">
        <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-beige/70 font-semibold mb-2">
          Guest Reviews
        </p>
        <h2 className="font-display text-3xl lg:text-4xl text-white font-normal leading-[1.15]">
          What Our <em className="italic text-sann-beige">Guests</em> Say
        </h2>
        <div className="w-9 h-0.5 bg-sann-beige mt-5 opacity-40" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            className="rv border-t border-sann-beige/25 pt-5"
          >
            <div className="text-sann-beige mb-2 text-sm tracking-[0.12em]">
              ★ ★ ★ ★ ★
            </div>
            <p className="font-serif italic text-lg font-light leading-[1.75] text-sann-off/80 mb-4">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="text-[0.72rem] tracking-[0.1em] uppercase text-white">
              {t.author}
            </p>
            <p className="text-[0.65rem] text-sann-beige/55 mt-1">
              {t.property}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
