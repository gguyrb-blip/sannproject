"use client";
// TestimonialsSection — "what guests say", as a dark band on the home page.
//
// A card for each property up top, then two rows that drift past on their
// own: guests' own words in one, and in the other what every platform scores
// us — Booking.com, Trip.com, Airbnb and Google, for both places — each card
// a link to the reviews where they were written.
//
// The scores are the platforms' own numbers (lib/site-data REVIEW_SCORES, with
// the date they were read). Nothing here is rounded up or picked from the best
// platform only: a guest who clicks through finds what this page said.
import { useEffect, useMemo, useRef } from "react";
import {
  PROPERTIES, REVIEW_SCORES, REVIEW_SCORES_CHECKED, TESTIMONIALS,
  type PlatformScore, type ReviewPlatform, type ReviewProperty, type Testimonial,
} from "@/lib/site-data";
import { useSiteLang, type SiteLang } from "@/lib/site-lang";

type Lang = SiteLang;

const PLATFORM: Record<ReviewPlatform, { name: string; mark: string; color: string }> = {
  booking: { name: "Booking.com", mark: "B.", color: "#003580" },
  trip:    { name: "Trip.com",    mark: "T.", color: "#287DFA" },
  airbnb:  { name: "Airbnb",      mark: "A",  color: "#FF5A5F" },
  google:  { name: "Google",      mark: "G",  color: "#4285F4" },
};

const PROP: Record<ReviewProperty, { name: string; th: string; en: string; image: string }> = {
  hatyai: {
    name: "SANN Stay Hatyai",
    th: "บ้านทั้งหลัง 4 ห้องนอน เดิน 4 นาทีถึงลีการ์เด้นส์",
    en: "A whole 4-bedroom house, 4 minutes’ walk to Lee Garden",
    image: PROPERTIES.find(p => /hatyai/i.test(p.id))?.images[0] ?? "/images/hero.jpg",
  },
  thungsao: {
    name: "SANN Thungsao Hostel",
    th: "โฮสเทลใกล้ บขส. หาดใหญ่ · ดอร์มชาย และห้องส่วนตัว",
    en: "A hostel by the Hat Yai bus terminal — men’s dorm and private rooms",
    image: PROPERTIES.find(p => /thung-?sao/i.test(p.id))?.images[0] ?? "/images/thungsao-3.jpg",
  },
};

const T = {
  eyebrow: { th: "รีวิวจากแขก", en: "What guests say" },
  /** [lead, tail, italic] — the italic word in terracotta, as every heading on
   *  the page. Tail and italic never part: Thai has no spaces, and the browser
   *  would otherwise break "มา / พัก" on a phone. */
  title: { th: ["รีวิวจริง ", "จากแขกที่", "มาพัก"], en: ["Real reviews from guests ", "who ", "stayed"] },
  reviews: { th: "รีวิว", en: "reviews" },
  read: { th: "อ่านรีวิว", en: "Read the reviews" },
  on: { th: "บน", en: "on" },
} as const;

function fmtScore(s: PlatformScore) {
  return s.outOf === 5 ? (Number.isInteger(s.score) ? s.score.toFixed(1) : String(s.score)) : String(s.score)
}

function PlatformMark({ p, size = 22 }: { p: ReviewPlatform; size?: number }) {
  const m = PLATFORM[p];
  return (
    <span aria-hidden="true" style={{ width: size, height: size, background: m.color, borderRadius: size * 0.28, fontSize: size * 0.5 }}
      className="inline-flex flex-none items-center justify-center font-bold text-white leading-none">
      {m.mark}
    </span>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-sann-red tracking-[2px]" aria-label={`${n} / 5`}>
      {"★★★★★".slice(0, Math.round(n))}<span className="text-sann-line">{"★★★★★".slice(Math.round(n))}</span>
    </span>
  );
}

function QuoteCard({ t, lang }: { t: Testimonial; lang: Lang }) {
  return (
    <figure className="rv-card flex w-[300px] sm:w-[340px] flex-none flex-col gap-3 rounded-sann-lg bg-sann-card p-5 sm:p-6 text-sann-text shadow-sann-md">
      <div className="flex items-center gap-2 text-sm"><Stars n={t.rating} /><span className="font-mono text-sann-text-lt">{t.rating.toFixed(1)}</span></div>
      <blockquote className="m-0 font-display text-[1.3rem] leading-snug rv-clamp">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-1">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sann-terracotta-soft font-medium text-sann-red">
          {t.author.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium leading-tight">{t.author}</span>
          <span className="block truncate text-xs text-sann-text-lt">{t.location} · {t.via}</span>
        </span>
      </figcaption>
      <span className="sr-only">{lang === "th" ? "รีวิวจากแขก" : "Guest review"}</span>
    </figure>
  );
}

function ScoreCard({ s, lang }: { s: PlatformScore; lang: Lang }) {
  const m = PLATFORM[s.platform];
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer"
      className="rv-card flex w-[260px] sm:w-[280px] flex-none flex-col gap-3 rounded-sann-lg bg-sann-card p-5 sm:p-6 text-sann-text no-underline shadow-sann-md transition-shadow hover:shadow-sann-lg">
      <div className="flex items-center gap-2.5">
        <PlatformMark p={s.platform} size={26} />
        <span className="min-w-0">
          <span className="block text-sm font-medium leading-tight">{m.name}</span>
          <span className="block truncate text-xs text-sann-text-lt">{PROP[s.property].name}</span>
        </span>
      </div>
      {/* Numbers in the site's mono, like the prices; the platform's own colour
          stays on its little mark only. */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[2.3rem] font-medium leading-none text-sann-text">{fmtScore(s)}</span>
        <span className="font-mono text-sm text-sann-text-lt">/{s.outOf}</span>
        {s.label && <span className="ml-1 text-sm text-sann-red">{s.label}</span>}
      </div>
      <div className="text-sm text-sann-text-lt">{s.count} {T.reviews[lang]}</div>
      {s.detail && (
        <div className="flex flex-wrap gap-1.5">
          {s.detail.map(d => (
            <span key={d.en} className="rounded-full bg-sann-bg2 px-2.5 py-1 text-[0.72rem] text-sann-text">{lang === "th" ? d.th : d.en} {d.v}</span>
          ))}
        </div>
      )}
      <span className="mt-auto text-sm font-medium text-sann-red">{T.read[lang]} →</span>
    </a>
  );
}

/**
 * A row that drifts sideways on its own — and that a guest can move too:
 * swipe on a phone, drag with a mouse, scroll with a trackpad.
 *
 * It is a real scrolling box holding the cards twice over. The drift nudges
 * scrollLeft a little every frame, and passing the halfway point jumps back by
 * exactly one copy, so the row never runs out in either direction — whether the
 * drift or a guest's thumb got it there. Hands on the row (hover, touch, drag,
 * wheel, keyboard focus) stop the drift; it picks up again a moment after they
 * let go. With reduced motion asked for, it never drifts and simply scrolls.
 */
function Row({ children, reverse, speed = 30 }: { children: React.ReactNode[]; reverse?: boolean; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const half = () => el.scrollWidth / 2;
    let pos = 0, last = 0, raf = 0, holdUntil = 0, hover = false, focus = false;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    let dragged = false;

    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
    };
    const hold = (ms: number) => { holdUntil = performance.now() + ms; };

    // The leftward row starts one copy in, so it has somewhere to go.
    if (reverse) el.scrollLeft = half();
    pos = el.scrollLeft;

    const step = (t: number) => {
      const dt = last ? Math.min(64, t - last) : 0;
      last = t;
      if (!reduce && !hover && !focus && !drag && t > holdUntil) {
        const h = half();
        pos += (reverse ? -1 : 1) * speed * dt / 1000;
        if (h > 0) { if (pos >= h) pos -= h; else if (pos <= 0) pos += h; }
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const onScroll = () => { wrap(); };
    const onEnter = () => { hover = true; };
    const onLeave = () => { hover = false; hold(1200); };
    const onTouch = () => hold(3500);
    const onWheel = () => hold(2500);
    const onFocusIn = () => { focus = true; };
    const onFocusOut = () => { focus = false; hold(1500); };
    // A mouse drags; a finger already scrolls the box natively.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
      dragged = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        el.classList.add("rv-dragging");
        // Keeps the drag going if the mouse leaves the row; a browser that
        // refuses still drags while the pointer stays over it.
        try { el.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
      }
      if (drag.moved) { el.scrollLeft = drag.left - dx; wrap(); }
    };
    const onUp = () => {
      if (!drag) return;
      dragged = drag.moved;
      drag = null;
      el.classList.remove("rv-dragging");
      hold(1500);
    };
    // A drag that ends over a score card must not also open its link.
    const onClick = (e: MouseEvent) => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [reverse, speed]);

  return (
    <div ref={ref} className="rv-row">
      <div className="rv-track">
        {children.map((c, i) => <div key={`a${i}`} className="rv-cell">{c}</div>)}
        {children.map((c, i) => <div key={`b${i}`} className="rv-cell" aria-hidden="true">{c}</div>)}
      </div>
    </div>
  );
}

// Every word here is set in the site's body face at its regular weight, like
// the rest of the page's paragraphs. The first version used a bold weight for
// headings and scores, and the band read as a different website from the
// sections around it. The language follows the header's ไทย / EN switch.
export default function TestimonialsSection() {
  const [lang] = useSiteLang();

  const total = REVIEW_SCORES.reduce((n, s) => n + s.count, 0);
  const checked = new Date(REVIEW_SCORES_CHECKED + "T00:00:00").toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  // A row of four quotes would show the same guest twice on a wide screen, so
  // short lists are repeated before they are doubled for the loop.
  const quotes = useMemo(() => {
    const q = [...TESTIMONIALS];
    while (q.length && q.length < 6) q.push(...TESTIMONIALS);
    return q;
  }, []);

  const best = (p: ReviewProperty) => REVIEW_SCORES
    .filter(s => s.property === p)
    .sort((a, b) => b.count - a.count)[0];

  // Dressed like "Our properties": the same warm band, eyebrow, serif heading
  // with one terracotta word, white cards and the site's own shadows. The
  // first version was a black band with its own colours, and read as another
  // website in the middle of this one.
  return (
    <section id="testimonials" className="bg-sann-bg2 px-5 sm:px-8 lg:px-14 py-16 lg:py-24">
      {/* position:relative on the row keeps each card's hidden "Guest review"
          label (sr-only, absolutely placed) inside the scroller. Without it the
          labels of the far-off copies hung out past the page's right edge,
          made it 5,000px wide, and a jump to a section slid it sideways. */}
      <style>{`
        .rv-row{position:relative;overflow-x:auto;overflow-y:hidden;scroll-behavior:auto;overscroll-behavior-x:contain;scrollbar-width:none;cursor:grab;padding:6px 0 18px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
        .rv-row::-webkit-scrollbar{display:none}
        .rv-row.rv-dragging{cursor:grabbing;user-select:none}
        .rv-track{display:flex;width:max-content}
        .rv-cell{padding-right:16px;display:flex}
        .rv-clamp{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
          <div>
            <div className={`text-xs text-sann-text-lt mb-2.5 ${lang === "th" ? "" : "font-mono tracking-[0.18em] uppercase"}`}>{T.eyebrow[lang]}</div>
            <h2 className={`font-display font-normal text-4xl lg:text-[3.4rem] text-sann-text m-0 ${lang === "th" ? "leading-[1.3]" : "leading-[1.05]"}`}>
              {T.title[lang][0]}
              <span className="whitespace-nowrap">{T.title[lang][1]}<i className="text-sann-red">{T.title[lang][2]}</i>{lang === "en" && "."}</span>
            </h2>
          </div>
          <p className="max-w-sm text-sann-text-lt text-sm leading-relaxed m-0">
            {lang === "th"
              ? `${total} รีวิวจาก Booking.com, Trip.com, Airbnb และ Google — คะแนนตามที่แต่ละแพลตฟอร์มแสดง อัปเดต ${checked}`
              : `${total} reviews on Booking.com, Trip.com, Airbnb and Google — each score as the platform shows it, checked ${checked}.`}
          </p>
        </header>

        {/* The two places, each with every platform's score. */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {(["hatyai", "thungsao"] as ReviewProperty[]).map(p => {
            const b = best(p);
            return (
              <div key={p} className="bg-sann-card rounded-sann-xl shadow-sann-md p-5 sm:p-6 flex gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROP[p].image} alt="" className="h-20 w-20 sm:h-28 sm:w-28 flex-none rounded-sann-md object-cover" loading="lazy" />
                <div className="min-w-0 flex flex-col gap-1.5">
                  <div className="font-display text-2xl leading-tight text-sann-text">{PROP[p].name}</div>
                  {b && (
                    <div className="text-sm text-sann-text-lt">
                      <span className="font-mono font-medium text-sann-text">{fmtScore(b)}</span>
                      <span className="text-sann-red">{b.outOf === 5 ? " ★" : `/${b.outOf}`}</span> {T.on[lang]} {PLATFORM[b.platform].name} · {b.count} {T.reviews[lang]}
                    </div>
                  )}
                  <p className="m-0 text-sm leading-relaxed text-sann-text">{lang === "th" ? PROP[p].th : PROP[p].en}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {REVIEW_SCORES.filter(s => s.property === p).map(s => (
                      <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-sann-line bg-sann-cream py-1 pl-1 pr-2.5 text-xs text-sann-text no-underline hover:border-sann-red transition-colors">
                        <PlatformMark p={s.platform} size={18} />
                        <span className="font-mono">{fmtScore(s)}</span><span className="text-sann-text-lt">({s.count})</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <Row speed={32}>
            {quotes.map((t, i) => <QuoteCard key={i} t={t} lang={lang} />)}
          </Row>
          <Row reverse speed={28}>
            {REVIEW_SCORES.map(s => <ScoreCard key={`${s.platform}-${s.property}`} s={s} lang={lang} />)}
          </Row>
        </div>
      </div>
    </section>
  );
}
