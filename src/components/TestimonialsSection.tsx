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
import { useEffect, useMemo, useState } from "react";
import {
  PROPERTIES, REVIEW_SCORES, REVIEW_SCORES_CHECKED, TESTIMONIALS,
  type PlatformScore, type ReviewPlatform, type ReviewProperty, type Testimonial,
} from "@/lib/site-data";

type Lang = "th" | "en";

/** The guest's language: ?lang=, then the one they chose on /book, then the browser's. */
function pickLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "th" || q === "en") return q;
    const saved = localStorage.getItem("book_lang");
    if (saved === "th" || saved === "en") return saved;
  } catch { /* private mode */ }
  return navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
}

const PLATFORM: Record<ReviewPlatform, { name: string; mark: string; color: string }> = {
  booking: { name: "Booking.com", mark: "B.", color: "#003580" },
  trip:    { name: "Trip.com",    mark: "T.", color: "#287DFA" },
  airbnb:  { name: "Airbnb",      mark: "A",  color: "#FF5A5F" },
  google:  { name: "Google",      mark: "G",  color: "#4285F4" },
};

const PROP: Record<ReviewProperty, { name: string; th: string; en: string; whereTh: string; whereEn: string; image: string }> = {
  hatyai: {
    name: "SANN Stay Hatyai",
    th: "บ้านทั้งหลัง 4 ห้องนอน เดิน 4 นาทีถึงลีการ์เด้นส์",
    en: "A whole 4-bedroom house, 4 minutes’ walk to Lee Garden",
    whereTh: "หาดใหญ่, สงขลา", whereEn: "Hat Yai, Songkhla",
    image: PROPERTIES.find(p => /hatyai/i.test(p.id))?.images[0] ?? "/images/hero.jpg",
  },
  thungsao: {
    name: "SANN Thungsao Hostel",
    th: "โฮสเทลใกล้ บขส. หาดใหญ่ · ดอร์มชาย และห้องส่วนตัว",
    en: "A hostel by the Hat Yai bus terminal — men’s dorm and private rooms",
    whereTh: "หาดใหญ่, สงขลา", whereEn: "Hat Yai, Songkhla",
    image: PROPERTIES.find(p => /thung-?sao/i.test(p.id))?.images[0] ?? "/images/thungsao-3.jpg",
  },
};

const T = {
  eyebrow: { th: "GUESTS SAY", en: "GUESTS SAY" },
  title: { th: "แขกพูดถึงเรา", en: "What guests say" },
  real: { th: "รีวิวจริง", en: "Real reviews" },
  realRest: { th: " จากแขกที่มาพัก", en: " from guests who stayed" },
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
    <span className="text-[#E8A33D] tracking-[2px]" aria-label={`${n} / 5`}>
      {"★★★★★".slice(0, Math.round(n))}<span className="text-black/15">{"★★★★★".slice(Math.round(n))}</span>
    </span>
  );
}

function QuoteCard({ t, lang }: { t: Testimonial; lang: Lang }) {
  return (
    <figure className="rv-card flex w-[300px] sm:w-[340px] flex-none flex-col gap-3 rounded-[22px] bg-white p-5 sm:p-6 text-[#2A2420] shadow-[0_10px_30px_-18px_rgba(27,23,20,.45)]">
      <div className="flex items-center gap-2 text-sm"><Stars n={t.rating} /><span className="font-semibold">{t.rating.toFixed(1)}</span></div>
      <blockquote className="m-0 text-[1.02rem] leading-relaxed rv-clamp">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-1">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sann-red font-semibold text-white">
          {t.author.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-tight">{t.author}</span>
          <span className="block truncate text-xs text-[#8B8178]">{t.location} · {t.via}</span>
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
      className="rv-card flex w-[260px] sm:w-[280px] flex-none flex-col gap-3 rounded-[22px] bg-white p-5 sm:p-6 text-[#2A2420] no-underline shadow-[0_10px_30px_-18px_rgba(27,23,20,.45)] transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-2.5">
        <PlatformMark p={s.platform} size={26} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">{m.name}</span>
          <span className="block truncate text-xs text-[#8B8178]">{PROP[s.property].name}</span>
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[2.6rem] font-semibold leading-none tracking-tight" style={{ color: m.color }}>{fmtScore(s)}</span>
        <span className="text-sm text-[#8B8178]">/{s.outOf}</span>
        {s.label && <span className="ml-1 text-sm font-medium">{s.label}</span>}
      </div>
      <div className="text-sm text-[#5F5650]">{s.count} {T.reviews[lang]}</div>
      {s.detail && (
        <div className="flex flex-wrap gap-1.5">
          {s.detail.map(d => (
            <span key={d.en} className="rounded-full bg-[#F5EFE8] px-2.5 py-1 text-[0.72rem] text-[#4A342E]">{lang === "th" ? d.th : d.en} {d.v}</span>
          ))}
        </div>
      )}
      <span className="mt-auto text-xs font-semibold text-sann-red">{T.read[lang]} →</span>
    </a>
  );
}

/** A row that drifts sideways forever: the cards twice over, moved by half. */
function Row({ children, reverse, seconds }: { children: React.ReactNode[]; reverse?: boolean; seconds: number }) {
  return (
    <div className={`rv-row ${reverse ? "rv-rev" : ""}`}>
      <div className="rv-track" style={{ animationDuration: `${seconds}s` }}>
        {children.map((c, i) => <div key={`a${i}`} className="rv-cell">{c}</div>)}
        {children.map((c, i) => <div key={`b${i}`} className="rv-cell" aria-hidden="true">{c}</div>)}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => { setLang(pickLang()); }, []);

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

  return (
    <section id="testimonials" className="bg-[#1B1714] px-4 sm:px-8 lg:px-14 py-16 lg:py-24 text-[#F8F6F2]">
      <style>{`
        .rv-row{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
        .rv-track{display:flex;width:max-content;animation:rv-scroll linear infinite}
        .rv-rev .rv-track{animation-direction:reverse}
        .rv-row:hover .rv-track{animation-play-state:paused}
        .rv-cell{padding-right:16px;display:flex}
        .rv-clamp{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes rv-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion:reduce){.rv-track{animation:none}.rv-row{overflow-x:auto;-webkit-mask-image:none;mask-image:none}}
      `}</style>
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#A9A19A]">{T.eyebrow[lang]}</div>
          <h2 className="m-0 text-4xl font-semibold leading-tight lg:text-[3.2rem]">{T.title[lang]}</h2>
        </header>

        <div className="overflow-hidden rounded-[32px] py-6 sm:py-8"
          style={{ background: "linear-gradient(135deg,#FBE6D8 0%,#F7F1EA 48%,#E3F1EA 100%)" }}>
          {/* The two places, each with every platform's score. */}
          <div className="mx-auto mb-6 grid max-w-4xl gap-4 px-4 sm:px-6 md:grid-cols-2">
            {(["hatyai", "thungsao"] as ReviewProperty[]).map(p => {
              const b = best(p);
              return (
                <div key={p} className="rounded-[24px] bg-white p-5 text-[#2A2420] shadow-[0_10px_30px_-20px_rgba(27,23,20,.4)]">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PROP[p].image} alt="" className="h-16 w-16 flex-none rounded-full object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <div className="text-lg font-semibold leading-tight">{PROP[p].name}</div>
                      {b && (
                        <div className="mt-0.5 text-sm text-[#8B8178]">
                          <span className="font-semibold text-[#E8A33D]">{fmtScore(b)}{b.outOf === 5 ? " ★" : `/${b.outOf}`}</span> {T.on[lang]} {PLATFORM[b.platform].name} · {b.count} {T.reviews[lang]}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mb-1 mt-3 text-[0.95rem] text-[#4A342E]">{lang === "th" ? PROP[p].th : PROP[p].en}</p>
                  <div className="mb-3 text-xs text-[#8B8178]">● {lang === "th" ? PROP[p].whereTh : PROP[p].whereEn}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {REVIEW_SCORES.filter(s => s.property === p).map(s => (
                      <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ECDFCF] bg-[#FBF8F4] py-1 pl-1 pr-2.5 text-xs text-[#2A2420] no-underline hover:border-sann-red">
                        <PlatformMark p={s.platform} size={18} />
                        <b>{fmtScore(s)}</b><span className="text-[#8B8178]">({s.count})</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <Row seconds={Math.max(40, quotes.length * 9)}>
              {quotes.map((t, i) => <QuoteCard key={i} t={t} lang={lang} />)}
            </Row>
            <Row reverse seconds={Math.max(36, REVIEW_SCORES.length * 7)}>
              {REVIEW_SCORES.map(s => <ScoreCard key={`${s.platform}-${s.property}`} s={s} lang={lang} />)}
            </Row>
          </div>
        </div>

        <div className="mt-10">
          <p className="m-0 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-[#F2A25C] to-[#D9542C] bg-clip-text text-transparent">{T.real[lang]}</span>{T.realRest[lang]}
          </p>
          <p className="mt-3 text-base text-[#A9A19A] sm:text-lg">
            {lang === "th"
              ? `${total} รีวิวจาก Booking.com, Trip.com, Airbnb และ Google · อัปเดต ${checked}`
              : `${total} reviews on Booking.com, Trip.com, Airbnb and Google · checked ${checked}`}
          </p>
        </div>
      </div>
    </section>
  );
}
