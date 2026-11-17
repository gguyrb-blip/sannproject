"use client";
// SasaniChat — ซาซานิ on sannstay.com: the booking chat the home page's ask box
// opens, talking to the same Sasani as app.sannstay.com/stay.
//
// The conversation runs on the PMS (POST {ADMIN_API}/api/stay/sasani) — this
// file only draws it. She answers in three kinds of message: words, room cards
// (photos and prices, from check_availability) and a booking card with the pay
// button. Every price and "free" comes from the PMS's tools, never from here.
//
// If she is not there — switched off in Admin, the PMS not yet answering this
// site, a network that blocks it — `enabled` stays false and the ask box sends
// the guest to /book instead. Nobody types into a box that goes nowhere.
//
// She opens by asking which place, with a card for each one she can book (the
// PMS says which: each place has its own switch in Admin). The cards are drawn
// here from site-data, not sent by her, so they cost nothing and never come
// twice.
import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, PROPERTIES } from "@/lib/site-data";

export const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";
/** Both properties: the site sells the house and the hostel. */
const SITE_SCOPE = "site";
const STORE = "sann_site_sasani_v1";

export type Lang = "th" | "en";

/** The guest's language: ?lang=, then the one they chose on /book, then the browser's. */
export function pickLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "th" || q === "en") return q;
    const saved = localStorage.getItem("book_lang");
    if (saved === "th" || saved === "en") return saved;
  } catch { /* private mode */ }
  return navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
}

// ── What the PMS sends (lib/sasani on app.sannstay.com) ─────────────────────
interface Card {
  ref: string; refs: string[]; checkIn: string; checkOut: string; nights: number
  lines: { name: string; qty: number; amount: number }[]; total: number
  status: "pending_payment" | "confirmed"; payUrl: string | null; holdUntil: string | null
}
interface Room {
  unit: string; name: string; kind: "dorm" | "room" | "whole"; sleeps: number; bedInfo: string | null
  rate: number; total: number; photos: string[]; amenities: string[]; maleOnly: boolean
}
interface Rooms {
  checkIn: string; checkOut: string; nights: number; rooms: Room[]
  property?: { slug: string; name: string; type: string }
}
/** A place she can book, as the PMS names it. */
export interface Place { slug: string; name: string; type: string }
type Event = { type: "text"; text: string } | { type: "card"; card: Card } | { type: "rooms"; rooms: Rooms };
type Item =
  | { kind: "me"; text: string }
  | { kind: "bot"; text: string }
  | { kind: "card"; card: Card }
  | { kind: "rooms"; rooms: Rooms }
  | { kind: "err"; code: string };

const T = {
  name: { th: "ซาซานิ", en: "Sasani" },
  role: { th: "ผู้ช่วยจองห้อง SANN · AI", en: "SANN booking assistant · AI" },
  hi: {
    th: "สวัสดีค่ะ **ซาซานิ**เองค่ะ เช็คห้องว่าง เสนอราคา และจองให้ในแชทนี้ได้เลยค่ะ สนใจเข้าพักที่ไหนคะ?",
    en: "Hi! I’m **Sasani**. I can check what’s free, quote the price and book your stay right here. Which place would you like?",
  },
  /** One place only (the other switched off): no choice to ask about. */
  hi1: {
    th: "สวัสดีค่ะ **ซาซานิ**เองค่ะ เช็คห้องว่าง เสนอราคา และจองให้ในแชทนี้ได้เลยค่ะ อยากเข้าพักวันไหน กี่ท่านคะ?",
    en: "Hi! I’m **Sasani**. I can check what’s free, quote the price and book your stay right here. Which dates, and how many of you?",
  },
  choose: { th: "เลือกที่นี่", en: "Choose this" },
  // Neutral: the guest may be a man or a woman.
  chooseMsg: { th: "สนใจ {name}", en: "I’m interested in {name}" },
  from: { th: "เริ่มต้น", en: "From" },
  blurb: {
    house: { th: "บ้านทั้งหลัง 4 ห้องนอน · พักได้ 8 ท่าน · ใกล้ลีการ์เด้นส์", en: "A whole 4-bedroom house · sleeps 8 · near Lee Garden" },
    hostel: { th: "เตียงดอร์มชาย และห้องส่วนตัว · ใกล้ บขส.", en: "Men’s dorm beds and private rooms · by the bus terminal" },
  } as Record<string, Record<Lang, string>>,
  bookHouse: { th: "จองบ้านหลังนี้", en: "Book the house" },
  ph: { th: "พิมพ์ข้อความถึงซาซานิ…", en: "Message Sasani…" },
  send: { th: "ส่ง", en: "Send" },
  close: { th: "ปิดแชท", en: "Close chat" },
  typing: { th: "ซาซานิกำลังพิมพ์…", en: "Sasani is typing…" },
  slow: { th: "กำลังเช็คให้อยู่ค่ะ อีกสักครู่…", en: "Still checking — one moment…" },
  foot: {
    th: "ซาซานิเป็น AI อาจตอบผิดได้ — ราคาและการจองมาจากระบบของเราโดยตรง",
    en: "Sasani is an AI and can make mistakes — prices and bookings come straight from our system.",
  },
  sugg: {
    th: ["บ้านว่างเสาร์-อาทิตย์หน้าไหม", "เตียงดอร์ม 2 คืน พรุ่งนี้", "Family Room 3 คน ศุกร์-อาทิตย์", "เช็คอินกี่โมง จอดรถได้ไหม"],
    en: ["Is the house free next weekend?", "A dorm bed for 2 nights from tomorrow", "Family room, 3 people, Fri–Sun", "Check-in time and parking?"],
  },
  fab: { th: "คุยกับซาซานิ", en: "Chat with Sasani" },
  book: { th: "จองห้องนี้", en: "Book this" },
  // Neutral: the guest may be a man or a woman, so no ค่ะ/ครับ in their mouth.
  bookMsg: { th: "ขอจอง {name}", en: "I’d like to book the {name}" },
  perNight: { th: "ต่อคืน", en: "/ night" },
  perBed: { th: "ต่อเตียง", en: "/ bed" },
  sleeps: { th: "พักได้ {n} ท่าน", en: "Sleeps {n}" },
  totalFor: { th: "รวม {n} คืน", en: "{n} nights" },
  maleOnly: { th: "ผู้ชายเท่านั้น", en: "Men only" },
  card: { th: "การจอง", en: "Booking" },
  pending: { th: "รอชำระเงิน", en: "Awaiting payment" },
  paid: { th: "ยืนยันแล้ว", en: "Confirmed" },
  pay: { th: "ชำระเงิน", en: "Pay now" },
  total: { th: "รวม", en: "Total" },
  holdTill: { th: "กันไว้ให้ถึง {t} น. — ชำระเพื่อยืนยัน", en: "Held until {t} — pay to confirm" },
  mail: { th: "รายละเอียดและลิงก์เช็คอินออนไลน์ส่งไปที่อีเมลแล้วค่ะ", en: "Details and your online check-in link are in your email." },
  human: { th: "คุยกับเจ้าหน้าที่ (WhatsApp)", en: "Talk to us on WhatsApp" },
  err: {
    busy: { th: "วันนี้ซาซานิคุยกับแขกเยอะมากแล้วค่ะ จองได้ที่หน้า “จองห้องพัก” หรือทักเจ้าหน้าที่ทาง WhatsApp นะคะ", en: "Sasani has talked with a lot of guests today. Book on the booking page, or message us on WhatsApp." },
    slow_down: { th: "ข้อความถี่เกินไปค่ะ รอสักหนึ่งนาทีแล้วลองใหม่นะคะ", en: "That’s a lot of messages at once — please wait a minute and try again." },
    off: { th: "ตอนนี้ซาซานิไม่ว่างค่ะ จองได้ที่หน้า “จองห้องพัก” หรือทักเจ้าหน้าที่ทาง WhatsApp นะคะ", en: "Sasani isn’t available right now. Book on the booking page, or message us on WhatsApp." },
    refused: { th: "เรื่องนี้ซาซานิช่วยไม่ได้ค่ะ ลองถามแบบอื่น หรือทักเจ้าหน้าที่นะคะ", en: "I can’t help with that one — try asking another way, or message us." },
    error: { th: "ขัดข้องชั่วคราวค่ะ ลองส่งข้อความนั้นอีกครั้งนะคะ", en: "Something went wrong — please send that again." },
  } as Record<string, Record<Lang, string>>,
};
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const THB = (n: number) => "฿" + Math.round(n).toLocaleString("en-US");

/** Plain turns for the PMS, alternating; a card or room list is told back as a line of text. */
function toHistory(items: Item[]) {
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  const push = (role: "user" | "assistant", content: string) => {
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += "\n\n" + content;
    else turns.push({ role, content });
  };
  for (const it of items) {
    if (it.kind === "me") push("user", it.text);
    else if (it.kind === "bot") push("assistant", it.text);
    else if (it.kind === "card") push("assistant", `(Booking ${it.card.refs.join(", ")} was created in this chat: ${it.card.checkIn} → ${it.card.checkOut}, total ${it.card.total} THB, ${it.card.status === "confirmed" ? "confirmed" : "awaiting payment"}.)`);
    // So she knows what is on the screen when the guest says "that one" — and
    // the PMS does not send the same cards twice (lib/sasani cardsOnScreen).
    else if (it.kind === "rooms") {
      const r = it.rooms;
      push("assistant", `(Room cards shown for ${r.property ? r.property.slug + " " : ""}${r.checkIn} → ${r.checkOut}: `
        + `${r.rooms.map(x => `${x.name} [${x.unit}] ${x.total} THB`).join("; ")}.)`);
    }
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.slice(-16);
}

/** The chat's state, held by whoever shows the ask box so the box and the panel share it. */
export function useSiteSasani() {
  const [enabled, setEnabled] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpenRaw] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const loaded = useRef(false);
  /** The messages as of now, for send() — read outside a state updater, which
   *  React may run twice and would then post the message twice. */
  const itemsRef = useRef<Item[]>([]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    let live = true;
    fetch(`${ADMIN_API}/api/stay/sasani?property=${SITE_SCOPE}`)
      .then(r => r.json()).then(j => {
        if (!live) return;
        setEnabled(!!j?.enabled);
        if (Array.isArray(j?.places)) setPlaces(j.places.filter((p: Place) => p && typeof p.slug === "string"));
      })
      .catch(() => { /* not reachable from this site yet: the box falls back to /book */ });
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) { const saved = JSON.parse(raw); if (Array.isArray(saved)) setItems(saved); }
    } catch { /* storage blocked */ }
    loaded.current = true;
    return () => { live = false; };
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { sessionStorage.setItem(STORE, JSON.stringify(items.slice(-60))); } catch { /* full */ }
  }, [items]);

  const setOpen = useCallback((v: boolean) => {
    setOpenRaw(v);
    // Full screen on a phone: the page behind must not scroll under a thumb.
    if (window.matchMedia("(max-width: 639px)").matches) document.body.style.overflow = v ? "hidden" : "";
  }, []);

  const send = useCallback((text: string, lang: Lang) => {
    const said = text.trim().slice(0, 1000);
    if (!said || busy) return;
    setOpen(true);
    const next: Item[] = [...itemsRef.current, { kind: "me", text: said }];
    itemsRef.current = next;
    setItems(next);
    setBusy(true); setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), 7000);
    fetch(`${ADMIN_API}/api/stay/sasani`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ property: SITE_SCOPE, lang, messages: toHistory(next) }),
      signal: AbortSignal.timeout(70_000),
    })
      .then(r => r.json().catch(() => ({})))
      .then((j: { ok?: boolean; code?: string; events?: Event[] }) => {
        if (j?.ok && Array.isArray(j.events)) {
          // Cards after the words that introduce them, whatever order they ran in.
          const words = j.events.filter(e => e.type === "text").map(e => ({ kind: "bot", text: (e as { text: string }).text }) as Item);
          const rest = j.events.filter(e => e.type !== "text").map(e =>
            e.type === "card" ? ({ kind: "card", card: e.card }) as Item : ({ kind: "rooms", rooms: (e as { rooms: Rooms }).rooms }) as Item);
          const add = [...words, ...rest];
          setItems(p => [...p, ...(add.length ? add : [{ kind: "err", code: "error" } as Item])]);
          return;
        }
        const code = ["busy", "slow_down", "off", "refused", "error"].includes(String(j?.code)) ? String(j.code) : "error";
        if (code === "off") setEnabled(false);
        setItems(p => [...p, { kind: "err", code }]);
      })
      .catch(() => setItems(p => [...p, { kind: "err", code: "error" }]))
      .finally(() => { clearTimeout(slowTimer); setBusy(false); setSlow(false); });
  }, [busy, setOpen]);

  return { enabled, places, open, setOpen, items, busy, slow, send };
}
export type SiteSasani = ReturnType<typeof useSiteSasani>;

// ── Drawing ─────────────────────────────────────────────────────────────────

export function SasaniCat({ size = 58 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <g className="s-bob">
        <path className="s-tail" d="M48 56 Q60 52 57 40" fill="none" stroke="#E8C9A8" strokeWidth="5" strokeLinecap="round" />
        <path className="s-ear" d="M14 26 L17 9 L28 19 Z" fill="#F3DDC6" stroke="#E8C9A8" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M50 26 L47 9 L36 19 Z" fill="#F3DDC6" stroke="#E8C9A8" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M17.5 21 L18.5 13 L24 18 Z" fill="#F6A9A0" />
        <path d="M46.5 21 L45.5 13 L40 18 Z" fill="#F6A9A0" />
        <ellipse cx="32" cy="37" rx="20" ry="18" fill="#F3DDC6" />
        <path d="M26 20 Q32 17 38 20" fill="none" stroke="#E0B994" strokeWidth="2" strokeLinecap="round" />
        <ellipse className="s-eye" cx="25" cy="35" rx="2.5" ry="3.2" fill="#1B1714" />
        <ellipse className="s-eye" cx="39" cy="35" rx="2.5" ry="3.2" fill="#1B1714" />
        <path d="M30.5 40 L33.5 40 L32 42 Z" fill="#E0857A" />
        <path d="M32 42 Q29.5 45 27.5 43.5 M32 42 Q34.5 45 36.5 43.5" fill="none" stroke="#1B1714" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 38 H22 M15 42 L22 40.5 M49 38 H42 M49 42 L42 40.5" stroke="#C9A584" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M18 50 Q32 57 46 50" fill="none" stroke="#B23D1D" strokeWidth="3.5" strokeLinecap="round" />
        <g className="s-key">
          <circle cx="32" cy="57" r="3.4" fill="none" stroke="#E2A93B" strokeWidth="2" />
          <path d="M32 60.2 V64 M32 62.5 H34.2" stroke="#E2A93B" strokeWidth="2" strokeLinecap="round" />
          <circle className="s-glow" cx="32" cy="57" r="1.2" fill="#F8D16B" />
        </g>
      </g>
    </svg>
  );
}

export const SASANI_CSS = `
.s-bob{animation:s-bob 3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes s-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.s-eye{animation:s-blink 4.2s infinite;transform-box:fill-box;transform-origin:center}
@keyframes s-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
.s-ear{animation:s-ear 5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes s-ear{0%,80%,100%{transform:rotate(0)}84%{transform:rotate(-14deg)}88%{transform:rotate(4deg)}92%{transform:rotate(-8deg)}}
.s-tail{animation:s-tail 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 100%}
@keyframes s-tail{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(14deg)}}
.s-key{animation:s-key 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}
@keyframes s-key{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
.s-glow{animation:s-glow 2.2s ease-in-out infinite}
@keyframes s-glow{0%,100%{opacity:.35}50%{opacity:1}}
.s-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#8C847D;margin-right:4px;animation:s-dot 1.2s ease-in-out infinite}
.s-dot:nth-child(2){animation-delay:.15s}.s-dot:nth-child(3){animation-delay:.3s}
@keyframes s-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
.s-in{animation:s-in .25s ease-out both}
@keyframes s-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.s-rail{scrollbar-width:none}.s-rail::-webkit-scrollbar{display:none}
@media (prefers-reduced-motion: reduce){.s-bob,.s-eye,.s-ear,.s-tail,.s-key,.s-glow,.s-dot,.s-in{animation:none}}
`;

/** **bold**, "- " lists and paragraphs — nothing else is rendered. */
function Said({ text }: { text: string }) {
  const inline = (s: string, k: number) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <b key={`${k}-${i}`}>{p.slice(2, -2)}</b> : <span key={`${k}-${i}`}>{p}</span>);
  return (
    <>
      {text.split(/\n{2,}/).map((b, bi) => {
        const lines = b.split("\n").filter(l => l.trim());
        if (lines.length && lines.every(l => /^\s*[-•]\s+/.test(l))) {
          return <ul key={bi} className={`${bi ? "mt-1.5" : ""} pl-5 list-disc`}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-•]\s+/, ""), li)}</li>)}</ul>;
        }
        return (
          <p key={bi} className={bi ? "mt-1.5" : ""}>
            {lines.map((l, li) => <span key={li}>{li > 0 && <br />}{/^\s*[-•]\s+/.test(l) ? "• " : ""}{inline(l.replace(/^\s*[-•]\s+/, ""), li)}</span>)}
          </p>
        );
      })}
    </>
  );
}

const day = (iso: string, lang: Lang) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });

function RoomRail({ rooms, lang, onBook, named }: { rooms: Rooms; lang: Lang; onBook: (name: string) => void; named: boolean }) {
  const [view, setView] = useState<{ photos: string[]; i: number } | null>(null);
  return (
    <div className="s-in flex-none -mx-4">
      {/* With two places in one chat, which one these cards are for. */}
      {named && rooms.property && (
        <div className="px-4 mb-1.5 text-[0.72rem] text-sann-text-lt">
          <span className="font-medium text-sann-text">{rooms.property.name}</span> · {day(rooms.checkIn, lang)} → {day(rooms.checkOut, lang)}
        </div>
      )}
      <div className="s-rail flex gap-2.5 overflow-x-auto px-4 scroll-px-4 pb-1 snap-x snap-mandatory">
        {rooms.rooms.map(r => (
          <div key={r.unit} className="snap-start flex-none w-[232px] bg-white border border-sann-line rounded-2xl overflow-hidden">
            <button type="button" onClick={() => r.photos.length && setView({ photos: r.photos, i: 0 })}
              className="relative block w-full h-[132px] bg-[#E9DED2]" aria-label={r.name}>
              {r.photos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photos[0]} alt="" loading="lazy" className="w-full h-full object-cover" />
              )}
              {r.maleOnly && <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-[0.68rem] font-medium text-sann-text">{T.maleOnly[lang]}</span>}
              {r.photos.length > 1 && <span className="absolute top-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[0.68rem] text-white">1/{r.photos.length}</span>}
            </button>
            <div className="p-3 text-left">
              <div className="text-[0.9rem] font-semibold text-sann-text leading-snug">{r.name}</div>
              <div className="text-[0.75rem] text-sann-text-lt mt-0.5">{fill(T.sleeps[lang], { n: r.sleeps })}{r.bedInfo ? ` · ${r.bedInfo}` : ""}</div>
              <div className="flex items-baseline justify-between gap-2 mt-2">
                <span className="text-[1.1rem] font-semibold text-sann-red">{THB(r.rate)}<span className="text-[0.7rem] font-normal text-sann-text-lt"> {r.kind === "dorm" ? T.perBed[lang] : T.perNight[lang]}</span></span>
                {rooms.nights > 1 && <span className="text-[0.7rem] text-sann-text-lt">{fill(T.totalFor[lang], { n: rooms.nights })} {THB(r.total)}</span>}
              </div>
              <button type="button" onClick={() => onBook(r.name)}
                className="mt-2.5 w-full rounded-full bg-sann-red hover:bg-sann-red-dk text-white text-[0.8rem] font-medium py-2 transition-colors">
                {r.kind === "whole" ? T.bookHouse[lang] : T.book[lang]}
              </button>
            </div>
          </div>
        ))}
      </div>
      {view && (
        <div className="fixed inset-0 z-[120] bg-black/90 flex flex-col" onClick={() => setView(null)} role="dialog" aria-modal="true">
          <div className="flex justify-between items-center p-4 text-white text-sm">
            <span>{view.i + 1} / {view.photos.length}</span>
            <button type="button" aria-label="Close" className="w-9 h-9 rounded-full bg-white/15">✕</button>
          </div>
          <div className="s-rail flex-1 flex overflow-x-auto snap-x snap-mandatory" onClick={e => e.stopPropagation()}
            onScroll={e => { const el = e.currentTarget; setView(v => v && { ...v, i: Math.round(el.scrollLeft / el.clientWidth) }); }}>
            {view.photos.map(src => (
              <div key={src} className="snap-center flex-none w-full h-full grid place-items-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="max-w-full max-h-full object-contain rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The site's own entry for a place the PMS names ("thungsao" → SANN Thungsao Hostel). */
function siteEntry(slug: string) {
  const key = slug.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return PROPERTIES.find(p => p.id.replace(/[^a-z0-9]/gi, "").toLowerCase().includes(key));
}
/** "/ bed / night" in Thai, as the hero's price card says it. */
const unitIn = (unit: string, lang: Lang) =>
  lang === "th" ? unit.replace(/bed/gi, "เตียง").replace(/night/gi, "คืน").replace(/house/gi, "หลัง") : unit;

/**
 * Her opening question, "which place?", answered with a tap: a card for each
 * place she can book — photo, what it is, the lowest price — in the site's own
 * order. Choosing one says so for the guest, in the PMS's name for it.
 */
function PlaceCards({ places, lang, busy, onPick }: { places: Place[]; lang: Lang; busy: boolean; onPick: (p: Place) => void }) {
  const list = places
    .map(p => ({ p, site: siteEntry(p.slug) }))
    .sort((a, b) => (a.site ? PROPERTIES.indexOf(a.site) : 99) - (b.site ? PROPERTIES.indexOf(b.site) : 99));
  return (
    <div className="s-in flex-none grid grid-cols-2 gap-2">
      {list.map(({ p, site }) => (
        <div key={p.slug} className="bg-white border border-sann-line rounded-2xl overflow-hidden flex flex-col">
          <div className="h-[96px] bg-[#E9DED2]">
            {site?.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.images[0]} alt="" loading="lazy" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-2.5 flex flex-col gap-1 flex-1">
            <div className="text-[0.82rem] font-semibold text-sann-text leading-snug">{site?.name ?? p.name}</div>
            <div className="text-[0.7rem] text-sann-text-lt leading-snug">{T.blurb[p.type === "hostel" ? "hostel" : "house"][lang]}</div>
            {site && (
              <div className="text-[0.7rem] text-sann-text-lt mt-auto pt-1">
                {T.from[lang]} <span className="font-mono text-[0.85rem] font-medium text-sann-red">{site.price}</span> {unitIn(site.priceUnit, lang)}
              </div>
            )}
            <button type="button" disabled={busy} onClick={() => onPick(p)}
              className="mt-1.5 w-full rounded-full bg-sann-red hover:bg-sann-red-dk text-white text-[0.75rem] font-medium py-1.5 transition-colors disabled:opacity-50">
              {T.choose[lang]}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BookingCard({ c, lang }: { c: Card; lang: Lang }) {
  const pending = c.status !== "confirmed";
  const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit" });
  return (
    <div className="s-in self-start w-[min(320px,92%)] bg-white border border-sann-line rounded-2xl overflow-hidden">
      <div className="bg-[#2A2420] text-white px-3.5 py-2.5 flex justify-between items-center">
        <span className="text-[0.75rem] opacity-80">{T.card[lang]}</span>
        <span className="font-mono text-[0.85rem] font-medium">{c.ref}</span>
      </div>
      <div className="px-3.5 py-3 text-[0.82rem] grid gap-1.5">
        <span className={`justify-self-start rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${pending ? "bg-[#FFF3D6] text-[#8A5A00]" : "bg-[#ECFDF3] text-[#067647]"}`}>{pending ? T.pending[lang] : T.paid[lang]}</span>
        <div>{day(c.checkIn, lang)} → {day(c.checkOut, lang)} · {c.nights} {lang === "th" ? "คืน" : c.nights > 1 ? "nights" : "night"}</div>
        {c.lines.map((x, i) => (
          <div key={i} className="flex justify-between gap-2 text-sann-text-lt"><span>{x.qty > 1 ? `${x.qty}× ` : ""}{x.name}</span><span className="font-mono">{THB(x.amount)}</span></div>
        ))}
        <div className="flex justify-between gap-2 border-t border-sann-line pt-1.5 mt-0.5 font-semibold"><span>{T.total[lang]}</span><span className="font-mono">{THB(c.total)}</span></div>
      </div>
      <div className="px-3.5 pb-3.5 grid gap-2">
        {pending && c.payUrl && (
          <a href={c.payUrl} className="block text-center rounded-xl bg-sann-red hover:bg-sann-red-dk text-white text-[0.85rem] font-medium py-2.5">{T.pay[lang]} · {THB(c.total)}</a>
        )}
        {pending && c.holdUntil && <div className="text-[0.75rem] text-sann-text-lt">{fill(T.holdTill[lang], { t: clock(c.holdUntil) })}</div>}
        <div className="text-[0.75rem] text-sann-text-lt">{T.mail[lang]}</div>
      </div>
    </div>
  );
}

/** The chat window: full screen on a phone, a floating panel on a computer. */
export function SasaniPanel({ s, lang }: { s: SiteSasani; lang: Lang }) {
  const logRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => { const el = logRef.current; if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; }); }, [s.items.length, s.busy, s.open]);
  useEffect(() => {
    if (!s.open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") s.setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s]);
  if (!s.open) return null;
  const said = s.items.some(i => i.kind === "me");
  const submit = () => { if (draft.trim() && !s.busy) { s.send(draft, lang); setDraft(""); } };

  return (
    <section role="dialog" aria-modal="false" aria-label={T.name[lang]}
      className="fixed z-[100] inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[min(660px,calc(100vh-48px))] sm:rounded-3xl sm:border sm:border-sann-line sm:shadow-[0_30px_60px_-20px_rgba(27,23,20,.45)] overflow-hidden flex flex-col bg-sann-cream text-sann-text">
      <style>{SASANI_CSS}</style>
      <div className="flex items-center gap-2.5 px-4 py-3 bg-white border-b border-sann-line">
        <span className="w-11 h-11 rounded-full bg-[#FDF1EA] grid place-items-center shrink-0"><SasaniCat size={40} /></span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold leading-tight">{T.name[lang]}</div>
          <div className="text-[0.72rem] text-sann-text-lt">{T.role[lang]}</div>
        </div>
        <button type="button" onClick={() => s.setOpen(false)} aria-label={T.close[lang]}
          className="w-9 h-9 rounded-full border border-sann-line bg-white text-sann-text">✕</button>
      </div>

      <div ref={logRef} aria-live="polite" className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-2.5 bg-[#F6EBDD]">
        <Bubble bot><Said text={(s.places.length > 1 ? T.hi : T.hi1)[lang]} /></Bubble>
        {s.places.length > 1 && <PlaceCards places={s.places} lang={lang} busy={s.busy} onPick={p => s.send(fill(T.chooseMsg[lang], { name: p.name }), lang)} />}
        {s.items.map((it, i) => {
          if (it.kind === "me") return <Bubble key={i}>{it.text}</Bubble>;
          if (it.kind === "bot") return <Bubble key={i} bot><Said text={it.text} /></Bubble>;
          if (it.kind === "card") return <BookingCard key={i} c={it.card} lang={lang} />;
          if (it.kind === "rooms") return <RoomRail key={i} rooms={it.rooms} lang={lang} named={s.places.length > 1} onBook={name => s.send(fill(T.bookMsg[lang], { name }), lang)} />;
          const human = it.code === "busy" || it.code === "off" || it.code === "refused";
          return (
            <Bubble key={i} bot err>
              {(T.err[it.code] ?? T.err.error)[lang]}
              {human && <div className="mt-1.5"><a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-sann-red">{T.human[lang]} →</a></div>}
            </Bubble>
          );
        })}
        {s.busy && (
          <Bubble bot>
            <span aria-label={T.typing[lang]}><span className="s-dot" /><span className="s-dot" /><span className="s-dot" /></span>
            <span className="ml-1.5 text-[0.75rem] text-sann-text-lt">{s.slow ? T.slow[lang] : T.typing[lang]}</span>
          </Bubble>
        )}
      </div>

      {!said && (
        <div className="s-rail flex gap-1.5 overflow-x-auto px-4 pt-2.5 bg-sann-cream">
          {T.sugg[lang].map(q => (
            <button key={q} type="button" disabled={s.busy} onClick={() => s.send(q, lang)}
              className="flex-none rounded-full border border-sann-line bg-white px-3 py-1.5 text-[0.75rem] whitespace-nowrap">{q}</button>
          ))}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); submit(); }}
        className="mx-4 mt-2.5 mb-1.5 flex items-center gap-2 bg-white border border-sann-line rounded-[26px] pl-3.5 pr-1.5 py-1.5 focus-within:border-sann-red transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B23D1D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0"><path d="M4 5h16v11H9l-5 4z" /></svg>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={T.ph[lang]} aria-label={T.ph[lang]} enterKeyHint="send"
          className="flex-1 min-w-0 bg-transparent outline-none text-[16px] py-2 placeholder:text-sann-text-lt" />
        <button type="submit" disabled={s.busy} aria-label={T.send[lang]}
          className="shrink-0 w-10 h-10 rounded-full bg-sann-red hover:bg-sann-red-dk text-white grid place-items-center disabled:opacity-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <p className="px-4 pb-[max(10px,env(safe-area-inset-bottom))] text-center text-[0.65rem] text-sann-text-lt">{T.foot[lang]}</p>
    </section>
  );
}

function Bubble({ children, bot, err }: { children: React.ReactNode; bot?: boolean; err?: boolean }) {
  return (
    <div className={[
      "s-in flex-none max-w-[86%] px-3.5 py-2.5 rounded-[18px] text-[0.9rem] leading-relaxed break-words",
      bot ? `self-start rounded-bl-md border ${err ? "bg-[#FBEAE5] border-[#F2C6B8] text-sann-red" : "bg-white border-sann-line"}` : "self-end rounded-br-md bg-[#2A2420] text-white whitespace-pre-wrap",
    ].join(" ")}>
      {children}
    </div>
  );
}

/** "Chat with Sasani", once the ask box has scrolled out of view. */
export function SasaniFab({ s, lang, show }: { s: SiteSasani; lang: Lang; show: boolean }) {
  if (!s.enabled || s.open) return null;
  return (
    <button type="button" onClick={() => s.setOpen(true)} aria-haspopup="dialog"
      className={`fixed z-[85] right-4 bottom-36 lg:right-7 lg:bottom-24 flex items-center gap-2 rounded-full bg-sann-red text-white pl-1.5 pr-4 py-1.5 font-semibold text-[0.8rem] shadow-[0_14px_30px_-12px_rgba(178,61,29,.7)] transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
      <span className="w-9 h-9 rounded-full bg-white grid place-items-center overflow-hidden"><SasaniCat size={34} /></span>
      {T.fab[lang]}
    </button>
  );
}
