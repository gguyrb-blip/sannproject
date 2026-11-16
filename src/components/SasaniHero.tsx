"use client";
// SasaniHero — the home page's first screen, with Sasani in it.
//
// "Looking for…" over a line that types itself out, one kind of stay at a
// time (a whole house near Lee Garden, a bed by the bus terminal, a late
// arrival…), and under it the box where a guest just says what they want.
// Sasani, the key-cat, peeks over the box. The two properties and their prices
// follow, so the first screen still says what SANN is.
//
// The typing goes by grapheme, not by character: a Thai vowel or tone mark is
// its own code point, and typing those one at a time draws them floating on
// nothing before their consonant arrives.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HERO_IMAGE, PROPERTIES } from "@/lib/site-data";
import { lineSeed } from "@/lib/fonts";
import { useSiteSasani, SasaniPanel, SasaniFab, SasaniCat, SASANI_CSS, pickLang, type Lang } from "./SasaniChat";


const COPY = {
  pre: { th: "อยากพัก..", en: "Looking for…" },
  rot: {
    th: ["มาคนเดียว ราคาประหยัด", "ที่พัก 2 แห่งในหาดใหญ่", "จะมากับครอบครัว หรือเดอะแก๊งค์", "บ้านทั้งหลังใกล้ลีการ์เด้น", "โฮสเทลใกล้ บขส.หาดใหญ่", "มาถึงดึกก็เข้าพักได้ด้วยตนเอง", "เช็คอินออนไลน์ 100%"],
    en: ["solo, on a budget", "2 places to stay in Hat Yai", "family trips or the whole gang", "a whole house near Lee Garden", "a hostel by the Hat Yai bus terminal", "a late arrival? Let yourself in", "100% online check-in"],
  },
  ph: { th: "สนใจเข้าพักวันไหนคะ ให้ซาซานิจองให้เลยไหมคะ", en: "Which dates? Sasani can book it for you" },
  chips: {
    th: ["บ้านว่างเสาร์-อาทิตย์หน้าไหม", "เตียงดอร์ม 2 คืน พรุ่งนี้", "เช็คอินกี่โมง จอดรถได้ไหม"],
    en: ["Is the house free next weekend?", "A dorm bed for 2 nights from tomorrow", "Check-in time and parking?"],
  },
  note: { th: "ซาซานิ (AI) เช็คห้องว่างและจองให้ได้ทันทีในแชท", en: "Sasani (AI) checks free rooms and books for you, right here." },
  send: { th: "ส่ง", en: "Send" },
  from: { th: "เริ่มต้น", en: "From" },
  h1: {
    th: "SANN — ที่พักในหาดใหญ่: บ้านทั้งหลังใกล้ลีการ์เด้น และโฮสเทลใกล้ บขส.",
    en: "SANN — stays in Hat Yai: a whole house near Lee Garden and a hostel by the bus terminal",
  },
} as const;

/** Split into what a reader sees as one letter — a Thai consonant keeps its marks. */
function graphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (!Seg) return Array.from(s);
  return Array.from(new Seg("th", { granularity: "grapheme" }).segment(s), x => x.segment);
}

function useTypewriter(lines: readonly string[]) {
  const [text, setText] = useState(lines[0] ?? "");
  useEffect(() => {
    // A new set of lines (the language changed) starts from its own first line.
    setText(lines[0] ?? "");
    // Someone who has asked for less motion gets the first line, still.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let i = 0;
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    (async () => {
      // The first line is already on screen (server-rendered), so start by holding it.
      await sleep(2200);
      while (alive) {
        const cur = graphemes(lines[i % lines.length]);
        for (let n = cur.length; n >= 0 && alive; n--) { setText(cur.slice(0, n).join("")); await sleep(28); }
        i++;
        const next = graphemes(lines[i % lines.length]);
        await sleep(250);
        for (let n = 1; n <= next.length && alive; n++) { setText(next.slice(0, n).join("")); await sleep(70); }
        await sleep(2200);
      }
    })();
    return () => { alive = false; };
  }, [lines]);
  return text;
}

export default function SasaniHero() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => { setLang(pickLang()); }, []);
  const lines = useMemo(() => COPY.rot[lang], [lang]);
  const typed = useTypewriter(lines);
  const [draft, setDraft] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const sasani = useSiteSasani();

  // Into the chat, already asking — or, when Sasani is not there, to the
  // booking page, so the box never goes nowhere.
  const go = (text: string) => {
    if (!text.trim()) return;
    if (sasani.enabled) { sasani.send(text, lang); setDraft(""); }
    else router.push("/book");
  };

  // The floating "Chat with Sasani" appears once the box has scrolled away.
  const formRef = useRef<HTMLFormElement>(null);
  const [boxGone, setBoxGone] = useState(false);
  useEffect(() => {
    const el = formRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBoxGone(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const props = [...PROPERTIES].sort((a, b) => num(a.price) - num(b.price));

  return (
    // The whole band in LINE Seed: Thai and Latin from one family.
    <section className={`relative overflow-hidden ${lineSeed.className}`}>
      <style>{SASANI_CSS + CSS}</style>
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(120% 70% at 50% 0%, #FBE3D6 0%, #FDF1EA 38%, rgba(255,255,255,0) 72%)" }} />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-12 lg:pt-16 pb-10 text-center">
        <h1 className="sr-only">{COPY.h1[lang]}</h1>
        <p className="text-base lg:text-lg text-sann-text-lt">{COPY.pre[lang]}</p>
        <p aria-hidden className="sh-type mx-auto mt-1 text-sann-text font-normal">
          <span>{typed}</span><i className="sh-caret" />
        </p>

        <form ref={formRef} className="sh-ask relative mx-auto mt-6 flex items-center gap-2 bg-white rounded-[28px] pl-4 pr-1.5 py-1.5"
          onSubmit={e => { e.preventDefault(); go(draft); }}>
          <span aria-hidden className="absolute right-[58px] -top-[46px] w-[58px] h-[58px] pointer-events-none"><SasaniCat /></span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B23D1D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
            <path d="M4 5h16v11H9l-5 4z" />
          </svg>
          <textarea ref={areaRef} rows={1} value={draft} onChange={e => setDraft(e.target.value)} placeholder={COPY.ph[lang]}
            aria-label={COPY.ph[lang]} enterKeyHint="send"
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); go(draft); } }}
            className="sh-input flex-1 min-w-0 resize-none bg-transparent outline-none text-sann-text placeholder:text-sann-text-lt" />
          <button type="submit" aria-label={COPY.send[lang]}
            className="shrink-0 w-12 h-12 rounded-full bg-sann-red hover:bg-sann-red-dk text-white grid place-items-center transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-[640px] mx-auto">
          {COPY.chips[lang].map(c => (
            <button key={c} type="button" onClick={() => go(c)}
              className="rounded-full border border-sann-line bg-white/80 px-3.5 py-1.5 text-[0.8rem] text-sann-text hover:border-sann-red transition-colors">
              {c}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.78rem] text-sann-text-lt">{COPY.note[lang]}</p>
      </div>

      {/* The two places, cheapest first — what the first screen must still say. */}
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-14 grid sm:grid-cols-2 gap-4">
        {props.map(p => ({ p, img: p.id === "sann-thung-sao-hostel" ? "/images/thungsao-3.jpg" : HERO_IMAGE })).map(({ img, p }) => (
          <a key={p.id} href="#properties" className="group relative block h-56 sm:h-64 rounded-sann-xl overflow-hidden shadow-sann-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,12,8,0) 45%, rgba(20,12,8,.7) 100%)" }} />
            <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3 text-white text-left">
              <div className="font-display text-2xl leading-tight">{p.name}</div>
              <div className="shrink-0 rounded-full bg-white/95 text-sann-text px-3 py-1.5 text-[0.75rem]">
                {COPY.from[lang]} <span className="font-mono font-medium">{p.price}</span>
                <span className="text-sann-text-lt"> {unitLabel(p.priceUnit, lang)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <SasaniPanel s={sasani} lang={lang} />
      <SasaniFab s={sasani} lang={lang} show={boxGone} />
    </section>
  );
}

function num(p: string) { return Number(String(p).replace(/[^\d.]/g, "")) || 0; }

/** site-data writes units in English ("/ bed / night"); the Thai band says them in Thai. */
function unitLabel(unit: string, lang: Lang) {
  if (lang !== "th") return unit;
  return unit.replace(/bed/gi, "เตียง").replace(/night/gi, "คืน").replace(/house/gi, "หลัง");
}

const CSS = `
.sh-type{font-size:clamp(2rem,7.2vw,4.6rem);line-height:1.15;min-height:2.3em;max-width:16ch;display:flex;align-items:center;justify-content:center;flex-wrap:wrap}
@media (min-width:821px){.sh-type{max-width:none;min-height:1.25em}}
.sh-caret{display:inline-block;width:3px;height:.9em;margin-left:4px;background:#B23D1D;border-radius:2px;animation:sh-blink 1s steps(1) infinite}
@keyframes sh-blink{50%{opacity:0}}
.sh-ask{max-width:640px;border:1px solid #E9E3DC;box-shadow:0 18px 40px -22px rgba(178,61,29,.45);transition:border-color .15s}
.sh-ask:focus-within{border-color:#B23D1D}
.sh-input{font-size:16px;line-height:1.45;padding:12px 2px;height:3.1em}
@media (max-width:640px){.sh-input{height:4.4em}}
@media (prefers-reduced-motion: reduce){.sh-caret{animation:none}}
`;
