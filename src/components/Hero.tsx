"use client";
// Hero — the home page's first screen.
//
// The headline types itself out, one kind of stay at a time, starting from
// the line the site has always opened with ("Where every stay feels like
// home."). Under it, where a paragraph used to describe SANN, is the box where
// a guest asks Sasani for dates, a price or a booking — she opens with their
// question already asked (SasaniChat, talking to app.sannstay.com). Everything
// else is the hero as it was: the buttons, the counters, the two photos and
// the two prices.
//
// The first line is in the page as served, so the headline is never empty for
// a search engine or a slow phone, and someone who asked for less motion keeps
// it still.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HERO_IMAGE, PROPERTIES, REVIEW_SCORES } from "@/lib/site-data";
import { useSiteLang, type SiteLang } from "@/lib/site-lang";
import { useSiteSasani, SasaniPanel, SasaniFab, SasaniCat, SASANI_CSS } from "./SasaniChat";
import { ArrowR, Star, Check, DotGrid } from "./icons";

/** Each line is [plain, italic] — the italic part is the terracotta word. */
const LINES: Record<SiteLang, [string, string][]> = {
  en: [
    ["Where every stay feels like ", "home"],
    ["A whole house, ", "near Lee Garden"],
    ["A bed by the ", "bus terminal"],
    ["Arriving late? ", "Let yourself in"],
    ["Ask Sasani — ", "she books it"],
  ],
  th: [
    ["ที่พักที่อยู่แล้ว", "เหมือนบ้าน"],
    ["บ้านทั้งหลัง ", "ใกล้ลีการ์เด้นส์"],
    ["เตียงคืนนี้ ", "ใกล้ บขส. หาดใหญ่"],
    ["มาถึงดึกก็ ", "เข้าพักเองได้"],
    ["ถามซาซานิ ", "จองให้ได้เลย"],
  ],
};

const T = {
  eyebrow: { en: "Hat Yai · Thailand · est. 2026", th: "หาดใหญ่ · สงขลา · ตั้งแต่ 2569" },
  h1: { en: "Where every stay feels like home.", th: "ที่พักในหาดใหญ่ ที่อยู่แล้วเหมือนบ้าน" },
  ph: { en: "Which dates? Sasani can check what’s free and book it for you", th: "สนใจเข้าพักวันไหนคะ ให้ซาซานิจองให้เลยไหมคะ" },
  chips: {
    en: ["Is the house free this weekend?", "A dorm bed tonight", "Parking?"],
    th: ["บ้านว่างเสาร์-อาทิตย์นี้ไหม", "เตียงดอร์มคืนนี้", "จอดรถได้ไหม"],
  },
  send: { en: "Send", th: "ส่ง" },
  book: { en: "Book a stay", th: "จองที่พัก" },
  explore: { en: "Explore properties", th: "ดูที่พักทั้งหมด" },
  reviews: { en: "guest reviews", th: "รีวิวจากแขก" },
  props: { en: "properties", th: "ที่พัก" },
  ci1: { en: "Self check-in from 15:00", th: "เช็คอินเองได้ตั้งแต่ 15:00" },
  ci2: { en: "Smart lock · arrive anytime", th: "ล็อกอัจฉริยะ · มาถึงกี่โมงก็ได้" },
  from: { en: "FROM", th: "เริ่มต้น" },
  hostel: { en: "Thungsao Hostel", th: "ทุ่งเสา โฮสเทล" },
} as const;

/** Split into what a reader sees as one letter — a Thai consonant keeps its marks. */
function graphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (!Seg) return Array.from(s);
  return Array.from(new Seg("th", { granularity: "grapheme" }).segment(s), x => x.segment);
}

/** How much of which line is showing. Starts with the first line whole. */
function useTypedLine(lines: [string, string][]) {
  const [state, setState] = useState({ i: 0, n: Infinity });
  useEffect(() => {
    setState({ i: 0, n: Infinity });
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const len = (k: number) => { const [a, b] = lines[k % lines.length]; return graphemes(a).length + graphemes(b).length; };
    (async () => {
      let i = 0;
      await sleep(3000);
      while (alive) {
        for (let n = len(i); n >= 0 && alive; n--) { setState({ i, n }); await sleep(24); }
        i = (i + 1) % lines.length;
        await sleep(260);
        const total = len(i);
        for (let n = 1; n <= total && alive; n++) { setState({ i, n }); await sleep(62); }
        await sleep(3000);
      }
    })();
    return () => { alive = false; };
  }, [lines]);
  return state;
}

export default function Hero() {
  const router = useRouter();
  const [lang] = useSiteLang();
  const lines = useMemo(() => LINES[lang], [lang]);
  const { i, n } = useTypedLine(lines);
  const sasani = useSiteSasani();
  const [draft, setDraft] = useState("");

  // Into the chat, already asking — or, when Sasani is not there (switched
  // off, or the PMS not answering), to the booking page: the box never leads
  // nowhere.
  const go = (text: string) => {
    if (!text.trim()) return;
    if (sasani.enabled) { sasani.send(text, lang); setDraft(""); }
    else router.push("/book");
  };

  // "Chat with Sasani" floats in once the box has scrolled away.
  const formRef = useRef<HTMLFormElement>(null);
  const [boxGone, setBoxGone] = useState(false);
  useEffect(() => {
    const el = formRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBoxGone(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [a, b] = lines[i % lines.length];
  const ga = graphemes(a), gb = graphemes(b);
  const shownA = ga.slice(0, Math.min(n, ga.length)).join("");
  const shownB = gb.slice(0, Math.max(0, Math.min(n, ga.length + gb.length) - ga.length)).join("");
  const done = n >= ga.length + gb.length;
  const reviews = REVIEW_SCORES.reduce((s, r) => s + r.count, 0);

  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-12 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
      <style>{SASANI_CSS + CSS}</style>
      <div className="absolute top-16 right-8 opacity-40 hidden lg:block pointer-events-none">
        <DotGrid n={8} gap={18} size={140} />
      </div>

      {/* Left — copy */}
      <div className="flex flex-col gap-6 relative z-[2]">
        {/* Letter-spacing pulls Thai apart into single letters; Thai keeps its own. */}
        <div className={`text-xs text-sann-text-lt flex items-center gap-3.5 ${lang === "th" ? "tracking-normal" : "font-mono tracking-[0.18em] uppercase"}`}>
          <span className="w-8 h-px bg-sann-text-lt" /> {T.eyebrow[lang]}
        </div>

        <h1 className={`hero-type ${lang === "th" ? "hero-th" : ""} font-normal text-sann-text m-0`}>
          <span className="sr-only">{T.h1[lang]}</span>
          {/* Thai has no spaces between words, so the browser would break the
              line anywhere — "เหมือน / บ้าน". Each Thai line is two phrases,
              set one under the other; Thai ends without a full stop. */}
          <span aria-hidden="true">
            {shownA}
            {lang === "th" && n >= ga.length && <br />}
            {shownB && <i className="text-sann-red">{shownB}</i>}
            {done && lang === "en" && "."}
            <span className="hero-caret" />
          </span>
        </h1>

        {/* Sasani, where the paragraph was. */}
        <div>
          <form ref={formRef} onSubmit={e => { e.preventDefault(); go(draft); }}
            className="hero-ask relative flex items-center gap-2 bg-white rounded-2xl pl-4 pr-1.5 py-1.5 max-w-xl">
            <span aria-hidden className="absolute right-[60px] -top-[44px] w-[54px] h-[54px] pointer-events-none"><SasaniCat size={54} /></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B23D1D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
              <path d="M4 5h16v11H9l-5 4z" />
            </svg>
            <textarea rows={2} value={draft} onChange={e => setDraft(e.target.value)} placeholder={T.ph[lang]}
              aria-label={T.ph[lang]} enterKeyHint="send"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); go(draft); } }}
              className="hero-input flex-1 min-w-0 resize-none bg-transparent outline-none text-sann-text placeholder:text-sann-text-lt" />
            <button type="submit" aria-label={T.send[lang]}
              className="shrink-0 w-12 h-12 rounded-full bg-sann-red hover:bg-sann-red-dk text-white grid place-items-center transition-colors">
              <ArrowR size={20} />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3 max-w-xl">
            {T.chips[lang].map(c => (
              <button key={c} type="button" onClick={() => go(c)}
                className="rounded-full border border-sann-line bg-white px-3.5 py-1.5 text-[0.8rem] text-sann-text hover:border-sann-red transition-colors">
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-1">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-sann-red hover:bg-sann-red-dk text-white text-base font-medium px-6 py-4 rounded-2xl shadow-sann-md transition-colors"
          >
            {T.book[lang]} <ArrowR size={18} />
          </Link>
          <a
            href="#properties"
            className="inline-flex items-center bg-white border border-sann-line text-sann-text text-base font-medium px-6 py-4 rounded-2xl hover:border-sann-red transition-colors"
          >
            {T.explore[lang]}
          </a>
        </div>

        {/* Reviews, counted from the platforms (site-data REVIEW_SCORES). The
            old "4.9 avg rating" outlived the Airbnb listing's real 4.67. */}
        <div className="flex items-center gap-5 mt-3 pt-5 border-t border-sann-line">
          <Stat n={String(reviews)} l={T.reviews[lang]} star />
          <Div />
          <Stat n={String(PROPERTIES.length)} l={T.props[lang]} />
        </div>
      </div>

      {/* Right — image stack */}
      <div className="relative h-[360px] sm:h-[460px] lg:h-[540px]">
        <div className="absolute top-0 right-0 w-[78%] h-[72%] rounded-sann-2xl overflow-hidden shadow-sann-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="Sann Stay bedroom" className="w-full h-full object-cover" />
        </div>
        {/* The SECOND property, not a second bedroom of the first.
           Both photos used to be the Hat Yai house, and with a price card
           reading "per house · Sann Stay Hatyai" underneath them, the whole
           hero argued that SANN is one 4-bedroom home — while the paragraph
           beside it said "a 4-bedroom home and a hostel" and the counter said
           2 properties. People read pictures and prices, not paragraphs. */}
        <div className="absolute bottom-0 left-0 w-[52%] h-[48%] rounded-sann-xl overflow-hidden shadow-sann-lg border-8 border-sann-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/thungsao-3.jpg" alt="SANN Thungsao Hostel room" className="w-full h-full object-cover" />
          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[0.62rem] font-medium text-sann-text shadow-sann-sm">
            {T.hostel[lang]}
          </span>
        </div>

        <div className="absolute top-7 left-[-8px] sm:left-[-20px] bg-white rounded-sann-md shadow-sann-lg p-3.5 flex items-center gap-3 max-w-[250px]">
          <div className="w-11 h-11 rounded-xl bg-sann-success text-white flex items-center justify-center shrink-0">
            <Check size={20} />
          </div>
          <div>
            <div className="text-[0.8rem] font-medium text-sann-text">{T.ci1[lang]}</div>
            <div className="text-[0.7rem] text-sann-text-lt mt-0.5">{T.ci2[lang]}</div>
          </div>
        </div>

        {/* TWO prices, cheapest first.
           A single "FROM ฿3,500 / night · per house" is the loudest thing on
           the page, and it priced the whole brand as an entire-home rental.
           Anyone looking for a ฿350 dorm bed read that number and left. The
           two together say what SANN actually is in the space where one
           number used to mislead — and they come from PROPERTIES, so a rate
           change is one edit in site-data rather than a stale hero. */}
        <div className="absolute bottom-12 right-[-8px] sm:right-[-24px] bg-white rounded-sann-md shadow-sann-lg p-3.5 max-w-[232px]">
          <div className={`text-sann-text-lt ${lang === "th" ? "text-[0.7rem]" : "font-mono text-[0.62rem] tracking-[0.12em]"}`}>{T.from[lang]}</div>
          {[...PROPERTIES]
            .slice()
            .sort((a, b) => priceNum(a.price) - priceNum(b.price))
            .map((p, i) => (
              <div key={p.id} className={i ? "mt-2 border-t border-sann-line pt-2" : "mt-0.5"}>
                <div className="font-mono text-[1.35rem] font-medium leading-none text-sann-text">
                  {p.price}
                  <span className={`text-[0.75rem] font-normal text-sann-text-lt ${lang === "th" ? "font-sans" : ""}`}> {unitLabel(p.priceUnit, lang)}</span>
                </div>
                <div className="mt-1 text-[0.7rem] text-sann-text-lt">{p.name}</div>
              </div>
            ))}
        </div>
      </div>

      <SasaniPanel s={sasani} lang={lang} />
      <SasaniFab s={sasani} lang={lang} show={boxGone} />
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

/** "฿3,500" → 3500, so the cheaper property leads whatever the rates become. */
function priceNum(p: string) {
  return Number(String(p).replace(/[^\d.]/g, "")) || 0;
}

/** site-data writes units in English ("/ bed / night"); the Thai page says them in Thai. */
function unitLabel(unit: string, lang: SiteLang) {
  if (lang !== "th") return unit;
  return unit.replace(/bed/gi, "เตียง").replace(/night/gi, "คืน").replace(/house/gi, "หลัง");
}

// The headline keeps two lines of room whatever is typed into it, so the box
// and buttons below never jump as a line grows or empties. Thai letters come
// from LINE Seed Sans TH (lib/fonts.ts, loaded in layout.tsx).
const CSS = `
.hero-type{font-family:var(--font-instrument),var(--font-line-seed),serif;font-size:2.7rem;line-height:1.02;min-height:2.04em}
@media (min-width:640px){.hero-type{font-size:3.75rem}}
@media (min-width:1024px){.hero-type{font-size:5.2rem}}
.hero-type.hero-th{font-size:2.2rem;line-height:1.3;min-height:2.6em}
@media (min-width:640px){.hero-type.hero-th{font-size:3rem}}
@media (min-width:1024px){.hero-type.hero-th{font-size:3.9rem}}
.hero-caret{display:inline-block;width:3px;height:.8em;margin-left:5px;background:#B23D1D;border-radius:2px;vertical-align:-.05em;animation:hero-blink 1s steps(1) infinite}
@keyframes hero-blink{50%{opacity:0}}
.hero-ask{border:1px solid #E7DCCF;box-shadow:0 18px 40px -24px rgba(178,61,29,.45);transition:border-color .15s}
.hero-ask:focus-within{border-color:#B23D1D}
.hero-input{font-size:16px;line-height:1.45;padding:8px 2px;height:4.2em}
@media (prefers-reduced-motion: reduce){.hero-caret{animation:none}}
`;
