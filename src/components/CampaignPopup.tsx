"use client";

// The 11.11 pop-up, on the main site, for as long as the campaign is running.
//
// The strip under the header is always-on and deliberately small — a toolbar
// line that carries the price without making the front page look like a coupon
// site. It is easy to scroll past, which is the price of being unobtrusive.
// This is the other half: one interruption, once, while the sale is actually
// open.
//
// THE RULES IT KEEPS, BECAUSE A POP-UP THAT BREAKS THEM IS AN ANNOYANCE
//
//   · It only exists while the server says the sale is open. Not "between two
//     dates in the browser's clock" — the campaign window lives in the PMS,
//     and a phone that is a day fast must not open the sale early or leave a
//     dead offer up after it closes. When the sale ends this disappears on its
//     own, with nobody remembering to take it down.
//   · Dismissed is dismissed. The choice is remembered per campaign, so this
//     one never comes back for that visitor, and the next campaign still gets
//     its turn.
//   · It waits. Arriving on a page and being covered before you have read a
//     word is how people learn to close things without looking.
//   · Never on /1111. Someone already reading the campaign page does not need
//     to be told about the campaign.
//   · Escape closes it, the backdrop closes it, focus goes to the dialog, and
//     the page behind it stops scrolling while it is up.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

/** Long enough to read the hero, short enough to still be on the page. */
const DELAY_MS = 3500;

type Campaign = {
  open?: boolean;
  reason?: string | null;
  campaign?: string;
  price?: number;
  faceValue?: number;
  opensOn?: string;
  closesOn?: string;
  today?: string;
};

/**
 * Three states, and only two of them are worth interrupting somebody for.
 *
 *   soon   announced, not yet selling. The point of a campaign is that people
 *          know it is coming; one that appears for the first time on the
 *          morning it opens has wasted its run-up.
 *   open   selling. Buy now.
 *   over   nothing to say. Stay quiet.
 */
type Phase = "soon" | "open" | "over" | null;
const phaseOf = (c: Campaign | null): Phase =>
  !c ? null
    : c.reason === "sales_closed" ? "over"
    : c.open ? "open"
    : c.reason === "not_started" ? "soon"
    : null;

const baht = (n: number) => "฿" + n.toLocaleString("en-US");
const thDay = (d: string) => {
  const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const [, m, day] = d.split("-").map(Number);
  return `${day} ${M[m - 1]}`;
};
const daysLeft = (today: string, closes: string) =>
  Math.max(0, Math.round((Date.parse(closes + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000)) + 1;

export default function CampaignPopup() {
  const pathname = usePathname();
  const [camp, setCamp] = useState<Campaign | null>(null);
  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Keyed on the campaign so dismissing 11.11 does not silence next year's.
  const key = camp?.campaign ? `sann_promo_${camp.campaign}_dismissed` : null;

  const onCampaignPage = pathname?.startsWith("/1111") ?? false;

  useEffect(() => {
    if (onCampaignPage) return;
    let gone = false;
    fetch(`${ADMIN_API}/api/public/voucher`)
      .then(r => r.json())
      .then((d: Campaign) => { if (!gone) setCamp(d ?? null); })
      .catch(() => {});
    fetch(`${ADMIN_API}/api/public/rooms?property_slug=thungsao`)
      .then(r => r.json())
      .then((d: { units?: { kind?: string; photos?: string[] }[] }) => {
        const dorm = (d.units ?? []).find(u => u.kind === "dorm");
        if (!gone) setPhoto(dorm?.photos?.[0] ?? null);
      })
      .catch(() => {});
    return () => { gone = true; };
  }, [onCampaignPage]);

  useEffect(() => {
    if (onCampaignPage || !key) return;
    const p = phaseOf(camp);
    if (p !== "open" && p !== "soon") return;
    let dismissed = false;
    try { dismissed = localStorage.getItem(key) === "1"; } catch { /* show it */ }
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [camp, key, onCampaignPage]);

  const close = useCallback(() => {
    try { if (key) localStorage.setItem(key, "1"); } catch { /* back next visit */ }
    setShow(false);
  }, [key]);

  // While it is up: no scrolling behind it, Escape closes it, focus lands on
  // the close button so a keyboard or screen reader is not stranded.
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [show, close]);

  const phase = phaseOf(camp);
  if (!show || !camp || (phase !== "open" && phase !== "soon")) return null;

  const price = camp.price ?? 299;
  const face = camp.faceValue ?? 350;
  const soon = phase === "soon";
  const left = camp.today && camp.closesOn ? daysLeft(camp.today, camp.closesOn) : null;
  const until = camp.today && camp.opensOn ? daysLeft(camp.today, camp.opensOn) - 1 : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      onClick={close}
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[#2a1b16]/55 p-0
        backdrop-blur-[3px] sm:items-center sm:p-6"
      style={{ animation: "sannPromoFade .22s ease" }}
    >
      <style>{`
        @keyframes sannPromoFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sannPromoUp { from { transform: translateY(28px); opacity: .5 } to { transform: none; opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          [data-promo-card] { animation: none !important }
        }
      `}</style>

      <div
        data-promo-card
        onClick={e => e.stopPropagation()}
        style={{ animation: "sannPromoUp .28s cubic-bezier(.2,.8,.2,1)" }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-sann-cream
          shadow-sann-lg sm:rounded-[24px]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="ปิด · Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full
            bg-white/90 text-[15px] text-sann-text shadow-sann-sm transition-colors hover:bg-white"
        >
          ✕
        </button>

        {/* The bed being sold. A promotion for a room that shows no room is
           asking people to take the price on trust. */}
        {photo && (
          <div className="relative h-[164px] w-full sm:h-[186px]">
            <Image src={photo} alt="ห้องดอร์มชาย SANN Thungsao Hostel" fill sizes="420px" unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-sann-cream via-sann-cream/15 to-transparent" aria-hidden />
          </div>
        )}

        <div className="px-6 pb-6 pt-1 text-center">
          <div className="font-display text-[44px] leading-none tracking-tight text-sann-red">
            {/* The separating dot is pale peach on thered strip, where it reads
               against red. On this cream card it vanished and the mark came
               out as "11 11". It keeps the accent, several shades down. */}
            11<span className="text-sann-red/40">.</span>11
          </div>
          <h2 id="promo-title" className="mt-1.5 font-display text-[25px] leading-tight text-sann-text">
            เตียงดอร์ม <em className="italic text-sann-red">ราคาพิเศษ</em>
          </h2>

          <div className="mt-3.5 flex items-baseline justify-center gap-3">
            <span className="text-[17px] text-sann-text-lt line-through decoration-sann-red/50 decoration-2">
              {baht(face)}
            </span>
            <span className="font-display text-[46px] leading-none text-sann-text">
              {baht(price)}
              <span className="font-sans text-[16px] text-sann-text-lt">/คืน</span>
            </span>
          </div>

          {soon ? (
            camp.opensOn && (
              <div className="mt-3 inline-block rounded-full bg-sann-red px-3.5 py-1 text-[12.5px] font-bold text-white">
                เปิดขาย {thDay(camp.opensOn)}
                {until !== null && until > 0 ? ` · อีก ${until} วัน` : " · พรุ่งนี้"}
              </div>
            )
          ) : (
            left !== null && (
              <div className="mt-3 inline-block rounded-full bg-sann-terracotta-soft px-3 py-1 text-[12.5px] font-bold text-sann-red-dk">
                เหลืออีก {left} วัน · ขายถึง {camp.closesOn ? thDay(camp.closesOn) : ""}
              </div>
            )
          )}

          {/* "Buy today" is only true once there is something to buy. Before
             the sale opens the same sentence is a small lie the visitor can
             check in one tap, so it waits a day. */}
          <p className="mt-3.5 text-[13.5px] leading-relaxed text-sann-text-lt">
            {soon ? "ซื้อแล้วเลือกวันเข้าพักทีหลัง" : "ซื้อวันนี้ เลือกวันเข้าพักทีหลัง"}
            {" · ใช้ได้ถึง 31 มี.ค. 70"}
            <span className="mt-0.5 block text-[12px]">
              {soon ? "Choose your dates later" : "Buy now, choose your dates later"}
              {" · valid until 31 March 2027"}
            </span>
          </p>

          <Link
            href="/1111"
            onClick={close}
            className="mt-5 block rounded-2xl bg-sann-red px-6 py-[15px] text-[16px] font-medium
              leading-tight text-white shadow-sann-md transition-colors hover:bg-sann-red-dk"
          >
            {soon ? "ดูรายละเอียดโปรโมชั่น" : "ดูโปรโมชั่น"}
            <span className="block text-[11px] font-normal opacity-80">
              {soon ? "See the details" : "See the offer"}
            </span>
          </Link>

          <button
            type="button"
            onClick={close}
            className="mt-2.5 w-full py-2 text-[12.5px] text-sann-text-lt underline-offset-2 hover:underline"
          >
            ไม่ใช่ตอนนี้ · Not now
          </button>
        </div>
      </div>
    </div>
  );
}
