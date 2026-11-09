"use client";

// The 11.11 page: the sales half, plus the way back in for someone who already
// bought and has lost the email.
//
// The redeem box at the bottom is not an afterthought. Until it existed, a
// voucher could only be opened from the link in its confirmation email — fine
// until someone deletes it, buys one as a gift, or comes back in February, at
// which point the only route left was phoning the hostel.
import { useEffect, useState } from "react";
import Image from "next/image";
import VoucherFlow from "./VoucherFlow";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

/** Accepts it lower case, without dashes, pasted with spaces. */
function tidyCode(raw: string) {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  return s.length > 6 ? `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6)}`
       : s.length > 2 ? `${s.slice(0, 2)}-${s.slice(2)}`
       : s;
}

type Campaign = {
  open: boolean; reason: string | null;
  today: string; opensOn: string; closesOn: string;
};

/** 2026-11-10 → "10 พ.ย." */
const thDay = (d: string) => {
  const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const [, m, day] = d.split("-").map(Number);
  return `${day} ${M[m - 1]}`;
};
/** "2026-11-10" → "10 Nov", for the English half. A Thai date inside an
 *  English sentence reads as a half-finished translation. */
const enDay = (d: string) => {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, m, day] = d.split("-").map(Number);
  return `${day} ${M[m - 1]}`;
};
const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);

export default function Sale() {
  const [buying, setBuying] = useState(false);
  const [camp, setCamp] = useState<Campaign | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ bad: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // The campaign window decides what the button says, and the server decides
  // the window — a seven-day sale run off the visitor's own clock would open
  // early for anyone whose phone is a day fast.
  useEffect(() => {
    fetch(`${ADMIN_API}/api/public/voucher`)
      .then(r => r.json())
      .then((d: Partial<Campaign>) => {
        // This site and the PMS deploy separately, so the API answering here
        // may be a version behind — today/opensOn/closesOn were added after
        // this page shipped. Taking them on trust crashed the whole page on
        // the first render that got the older shape. Without them the page
        // simply shows no dates and the server still refuses an early sale.
        if (d && d.today && d.opensOn && d.closesOn) setCamp(d as Campaign);
      })
      .catch(() => {});
    // The room's real photographs, the same ones the property page shows.
    // Selling a bed to someone who has never seen the room is the one thing
    // this page was doing that no other page here does.
    fetch(`${ADMIN_API}/api/public/rooms?property_slug=thungsao`)
      .then(r => r.json())
      .then(d => {
        const dorm = (d.units ?? []).find((u: { kind?: string }) => u.kind === "dorm");
        setPhotos((dorm?.photos ?? []).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  async function useVoucher() {
    const clean = code.replace(/-/g, "");
    if (clean.length !== 10) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`${ADMIN_API}/api/public/voucher/${encodeURIComponent(code)}`);
      const j = await r.json();
      if (!r.ok) { setMsg({ bad: true, text: j.error ?? "ไม่พบรหัสนี้" }); return; }
      if (j.blocker) { setMsg({ bad: true, text: j.blocker }); return; }
      setMsg({ bad: false, text: "✓ ใช้ได้ — กำลังพาไปเลือกวันเข้าพัก" });
      window.location.href = `${ADMIN_API}/voucher/${encodeURIComponent(code)}`;
    } catch {
      setMsg({ bad: true, text: "เชื่อมต่อไม่สำเร็จ" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="px-6 pb-20 lg:px-20">
        {/* ── the offer ── */}
        {/* The offer, centred. On a phone it is the page; on a desktop it
           is the top of one, so it gets a wider measure and the two columns
           below it rather than a 460px strip down the middle of a 2,000px
           screen. */}
        <section className="mx-auto max-w-2xl pb-1 pt-3.5 text-center">
          <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.3em] text-sann-red">
            Thungsao Hostel · ทุ่งเสา หาดใหญ่
          </div>
          <div className="font-display text-[68px] leading-none tracking-tight text-sann-red">
            11<span className="text-sann-terracotta-soft">.</span>11
          </div>
          <h1 className="mt-1.5 font-display text-[34px] leading-tight">
            เตียงดอร์ม <em className="italic text-sann-red">ราคาพิเศษ</em>
            <span className="mt-1 block font-sans text-[15px] font-normal text-sann-muted">
              A dorm bed at a one-week price
            </span>
          </h1>
          <div className="mx-auto my-3.5 h-0.5 w-9 bg-sann-red opacity-40" />
          <p className="font-serif text-[17px] italic text-sann-muted">
            ซื้อวันนี้ เลือกวันเข้าพักทีหลัง
            <span className="mt-0.5 block font-sans text-[13px] not-italic">
              Buy now, choose your dates later
            </span>
          </p>
          <div className="my-4 flex items-baseline justify-center gap-3">
            <span className="text-xl text-sann-muted line-through decoration-sann-red-lt decoration-2">฿350</span>
            <span className="font-display text-[58px] leading-none">
              ฿299<span className="font-sans text-[22px] text-sann-muted">/คืน</span>
            </span>
          </div>
          <span className="inline-block rounded-full bg-sann-terracotta-soft px-3 py-1
            text-xs font-bold text-sann-red-dk">
            ประหยัด ฿51 ต่อเตียง · 15% · save ฿51 a bed
          </span>

          {/* When it is on sale. A 11.11 promotion with no dates gives nobody
              a reason to buy today — and before the 10th the honest thing is
              to say so rather than show a button that will refuse. */}
          {camp && (
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1
              rounded-full border border-sann-line bg-white px-4 py-2 text-[13px]">
              {camp.reason === "not_started" ? (
                <>
                  <b className="font-semibold text-sann-red">เปิดขาย {thDay(camp.opensOn)}</b>
                  <span className="text-sann-muted">
                    · อีก {daysBetween(camp.today, camp.opensOn)} วัน · ขาย 7 วันเท่านั้น
                  </span>
                  <span className="w-full text-center text-[12px] text-sann-muted">
                    Opens {enDay(camp.opensOn)} · seven days only
                  </span>
                </>
              ) : camp.reason === "sales_closed" ? (
                <b className="font-semibold text-sann-muted">
                  ปิดการขายแล้วเมื่อ {thDay(camp.closesOn)}
                  <span className="block text-[12px] font-normal">Sales closed</span>
                </b>
              ) : (
                <>
                  <b className="font-semibold text-sann-red">
                    เหลืออีก {Math.max(0, daysBetween(camp.today, camp.closesOn)) + 1} วัน
                  </b>
                  <span className="text-sann-muted">· ขายถึง {thDay(camp.closesOn)} เท่านั้น</span>
                  <span className="w-full text-center text-[12px] text-sann-muted">
                    On sale until {enDay(camp.closesOn)} only
                  </span>
                </>
              )}
            </div>
          )}
        </section>

        {/* The room, photographed. */}
        {photos.length > 0 && (
          <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((src, i) => (
              <div key={src}
                className={`relative overflow-hidden rounded-sann-md bg-sann-beige
                  ${i === 0 ? "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
                <Image src={src} alt="ห้องดอร์มชาย SANN Thungsao Hostel" fill sizes="(max-width: 640px) 50vw, 320px"
                  className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}

        {/* Two columns from lg up: what it is and how to buy on the left,
           the reading matter on the right. One column below that, in the
           same order, so the phone layout is unchanged. */}
        <div className="mx-auto mt-6 grid max-w-5xl items-start gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div className="mx-auto w-full max-w-[460px] lg:mx-0 lg:sticky lg:top-24">
        <Card>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sann-muted">
            1 Voucher = 1 เตียง 1 คืน · one bed, one night
          </div>
          <Spec icon="🛏" th="เตียงในห้องดอร์มชาย 10 เตียง" en="A bed in the 10-bed male dormitory" />
          <Spec icon="📅" th="เข้าพักได้คืนวันอาทิตย์–พฤหัสบดี" en="Sunday to Thursday nights only" />
          <Spec icon="⏳" th="ใช้ได้ถึง 31 มีนาคม 2570" en="Valid until 31 March 2027" />
          <Spec icon="📍" th="ทุ่งเสา หาดใหญ่ · ใกล้สถานีขนส่ง" en="Thung Sao, Hat Yai — near the bus terminal" last />
        </Card>

        {/* What happens after the money leaves. Nobody should have to read
            the terms to find out that the code arrives by email and the date
            is chosen later — that IS the offer, and it was buried in the FAQ
            below the button that asks for ฿299. */}
        <Card>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-sann-muted">
            ซื้อแล้วเกิดอะไรขึ้น · what happens next
          </div>
          <ol className="flex flex-col gap-3">
            {[
              ["ชำระเงินด้วย QR PromptPay", "ไม่มีค่าธรรมเนียม", "Pay by PromptPay QR — no fee"],
              ["รับรหัส Voucher ทางอีเมลทันที", "เก็บไว้ใช้ตอนจอง", "Your code is emailed straight away"],
              ["เลือกวันเข้าพักเมื่อไหร่ก็ได้", "จนถึง 31 มี.ค. 70", "Choose your dates any time until 31 March 2027"],
            ].map(([head, sub, en], i) => (
              <li key={head} className="flex gap-3">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full
                  bg-sann-red text-[12px] font-bold text-white">{i + 1}</span>
                <span className="text-[14px] leading-snug">
                  <b className="font-semibold">{head}</b>
                  <span className="block text-[12.5px] text-sann-muted">{sub}</span>
                  <span className="block text-[12px] text-sann-muted">{en}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <button onClick={() => setBuying(true)} disabled={!!camp && !camp.open}
            className="w-full justify-center bg-sann-red hover:bg-sann-red-dk text-white text-base
              font-medium px-6 py-4 rounded-2xl shadow-sann-md transition-colors
              disabled:cursor-default disabled:bg-sann-beige disabled:text-sann-muted disabled:shadow-none">
            {!camp ? (<>ซื้อ Voucher — ฿299<span className="block text-[11.5px] font-normal opacity-85">Buy a voucher</span></>)
              : camp.reason === "not_started" ? (<>เปิดขาย {thDay(camp.opensOn)}<span className="block text-[11.5px] font-normal opacity-85">Opens {enDay(camp.opensOn)}</span></>)
              : camp.reason === "sales_closed" ? (<>ปิดการขายแล้ว<span className="block text-[11.5px] font-normal opacity-85">Sales closed</span></>)
              : !camp.open ? (<>ยังไม่พร้อมขาย<span className="block text-[11.5px] font-normal opacity-85">Not on sale yet</span></>)
              : (<>ซื้อ Voucher — ฿299<span className="block text-[11.5px] font-normal opacity-85">Buy a voucher</span></>)}
          </button>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[12.5px] text-sann-muted">
            <span>🇹🇭</span>
            <span>
              ชำระผ่าน <b className="text-sann-text">QR PromptPay</b> เท่านั้น · ไม่มีค่าธรรมเนียม
              <span className="block">PromptPay QR only · no fee</span>
            </span>
          </div>
          <a href="#use" className="mt-3.5 block border-t border-sann-line pt-3.5 text-center
            text-[13px] font-semibold text-sann-red hover:underline">
            ซื้อไว้แล้ว? ใช้ Voucher ที่นี่
            <span className="block text-[11.5px] font-normal text-sann-muted">
              Already bought one? Redeem it here
            </span>
          </a>
        </Card>
        </div>

        <div className="mx-auto w-full max-w-[460px] lg:mx-0">
        <Card>
          <h2 className="mb-1 font-display text-[21px]">
            คำถามที่พบบ่อย
            <span className="ml-2 font-sans text-[13px] font-normal text-sann-muted">· FAQ</span>
          </h2>
          <Faq q="ซื้อแล้วต้องรีบใช้ไหม" qEn="Do I have to use it soon?"
            a="ไม่ต้องครับ ซื้อวันนี้แล้วเลือกวันเข้าพักทีหลังได้ ใช้ได้ถึง 31 มีนาคม 2570"
            aEn="No. Buy it now and choose your dates whenever you like, any time up to 31 March 2027." />
          <Faq q="คืนศุกร์กับเสาร์ใช้ได้ไหม" qEn="Can I use it on a Friday or Saturday?"
            a="ใช้ไม่ได้ครับ Voucher นี้ใช้ได้เฉพาะคืนวันอาทิตย์ถึงพฤหัสบดี สองคืนสุดสัปดาห์คนแน่นเกือบเต็มทุกสัปดาห์อยู่แล้ว เราเลยกันเตียงไว้ให้การจองปกติ"
            aEn="No — Sunday to Thursday nights only. Those two nights are close to full most weeks, so we keep those beds for ordinary bookings." />
          <Faq q="ถ้าวันที่อยากพักเต็ม" qEn="What if the night I want is full?"
            a="Voucher ยังอยู่ครับ เลือกวันอื่นได้จนกว่าจะหมดอายุ หน้าจองจะแสดงเตียงว่างของแต่ละวันให้เห็นก่อนกดยืนยัน"
            aEn="Your voucher keeps. Pick another night any time before it expires — the booking page shows how many beds are free on each date before you confirm." />
          <Faq q="ซื้อให้คนอื่นได้ไหม" qEn="Can I buy one as a gift?"
            a="ได้ครับ ส่งรหัส Voucher กับลิงก์ในอีเมลให้เขาจองเองได้เลย"
            aEn="Yes. Pass on the code and the link from the email and they can book it themselves." last />
        </Card>

        <Card>
          <h2 className="mb-2.5 font-display text-[21px]">
            เงื่อนไข
            <span className="ml-2 font-sans text-[13px] font-normal text-sann-muted">· Terms</span>
          </h2>
          <ul className="text-[13.5px]">
            {[
              ["1 Voucher ใช้ได้กับ 1 เตียง 1 คืน", "One voucher covers one bed for one night"],
              ["เข้าพักได้คืนวันอาทิตย์ จันทร์ อังคาร พุธ และพฤหัสบดี", "Valid on Sunday, Monday, Tuesday, Wednesday and Thursday nights"],
              ["คืนวันศุกร์และเสาร์ใช้ Voucher นี้ไม่ได้", "Not valid on Friday or Saturday nights"],
              ["จองวันเข้าพักผ่านลิงก์ในอีเมลยืนยัน ขึ้นกับห้องว่าง ณ วันที่จอง", "Book your dates through the link in the confirmation email, subject to availability"],
              ["ใช้ได้ถึง 31 มีนาคม 2570 หลังจากนั้นถือว่าหมดอายุ", "Valid until 31 March 2027, after which it expires"],
              ["ห้องดอร์มรับเฉพาะผู้เข้าพักชาย", "The dormitory is for male guests only"],
            ].map(([th, en]) => (
              <li key={th} className="flex gap-2.5 py-1.5">
                <span className="text-sann-red">—</span>
                <span>{th}<span className="block text-[12px] text-sann-muted">{en}</span></span>
              </li>
            ))}
            {[
              ["ไม่สามารถคืนเงินหรือเปลี่ยนเป็นเงินสดได้", "Non-refundable and cannot be exchanged for cash"],
              ["ใช้ร่วมกับโปรโมชั่นอื่นไม่ได้", "Cannot be combined with another offer"],
            ].map(([th, en]) => (
              <li key={th} className="flex gap-2.5 py-1.5">
                <span className="pt-0.5 text-[11px] text-sann-red-lt">✕</span>
                <span>{th}<span className="block text-[12px] text-sann-muted">{en}</span></span>
              </li>
            ))}
          </ul>
        </Card>


        {/* ── the way back in ── */}
        <div id="use" className="mt-3.5 scroll-mt-4 rounded-sann-lg border border-sann-line
          bg-white p-[18px] shadow-sann-sm">
          <h2 className="mb-1 font-display text-[21px]">
            ใช้ Voucher ที่ซื้อไว้
            <span className="ml-2 font-sans text-[13px] font-normal text-sann-muted">· Redeem a voucher</span>
          </h2>
          <p className="mb-3 text-[13.5px] text-sann-muted">
            กรอกรหัสจากอีเมลยืนยัน เพื่อเลือกวันเข้าพัก
            <span className="mt-0.5 block text-[12.5px]">
              Enter the code from your confirmation email to choose your dates.
            </span>
          </p>
          <label htmlFor="vcode" className="mb-1.5 block text-[12.5px] font-semibold">
            รหัส Voucher <span className="font-normal text-sann-muted">· Voucher code</span>
          </label>
          <input id="vcode" value={code}
            onChange={(e) => { setCode(tidyCode(e.target.value)); setMsg(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") void useVoucher(); }}
            placeholder="SV-XXXX-XXXX" maxLength={12} autoComplete="off" spellCheck={false}
            className="w-full rounded-sann-md border border-sann-line bg-white px-3.5 py-3
              text-center font-mono text-[19px] uppercase tracking-[0.1em] outline-none
              focus:border-sann-red focus:ring-2 focus:ring-sann-terracotta-soft" />
          {msg && (
            <p className={`mt-2 text-center text-[12.5px] ${msg.bad ? "text-red-700" : "text-sann-success"}`}>
              {msg.text}
            </p>
          )}
          <button onClick={useVoucher} disabled={code.replace(/-/g, "").length !== 10 || busy}
            className="mt-3.5 w-full justify-center bg-sann-red hover:bg-sann-red-dk text-white text-base font-medium px-6 py-4 rounded-2xl shadow-sann-md transition-colors disabled:cursor-default disabled:bg-sann-beige disabled:text-sann-muted disabled:shadow-none">
            {busy ? (<>กำลังตรวจสอบ…<span className="block text-[11.5px] font-normal opacity-85">Checking…</span></>)
              : code.replace(/-/g, "").length !== 10 ? (<>กรอกรหัสให้ครบก่อน<span className="block text-[11.5px] font-normal opacity-85">Enter the full code</span></>)
              : (<>ใช้ Voucher นี้<span className="block text-[11.5px] font-normal opacity-85">Use this voucher</span></>)}
          </button>
          <p className="mt-2.5 text-center text-[12.5px] text-sann-muted">
            หาอีเมลไม่เจอ? ทักไลน์ <b className="text-sann-text">@sannstay</b> พร้อมเบอร์ที่ใช้ซื้อ
            <span className="mt-0.5 block">
              Cannot find the email? Message <b className="text-sann-text">@sannstay</b> on LINE with the
              phone number you bought with.
            </span>
          </p>
        </div>
        </div>
        </div>
      </div>

      {buying && <VoucherFlow onClose={() => setBuying(false)} />}
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-sann-lg border border-sann-line bg-white p-[18px] shadow-sann-sm first:mt-0">
      {children}
    </div>
  );
}

function Spec({ icon, th, en, last }: { icon: string; th: string; en: string; last?: boolean }) {
  return (
    <div className={`flex gap-3 py-2.5 text-[14.5px] ${last ? "" : "border-b border-sann-line"}`}>
      <i className="w-5 flex-none text-center not-italic">{icon}</i>
      <div>
        <b className="font-semibold">{th}</b>
        <span className="mt-px block text-[12.5px] text-sann-muted">{en}</span>
      </div>
    </div>
  );
}

function Faq({ q, qEn, a, aEn, last }: {
  q: string; qEn?: string; a: string; aEn?: string; last?: boolean;
}) {
  return (
    <details className={last ? "" : "border-b border-sann-line"}>
      <summary className="flex cursor-pointer list-none justify-between gap-2.5 py-3
        text-[14.5px] font-semibold marker:content-none">
        <span>
          {q}
          {qEn && <span className="block text-[12px] font-normal text-sann-muted">{qEn}</span>}
        </span>
        <span className="text-lg leading-none text-sann-red">+</span>
      </summary>
      <p className="pb-3 text-[13.5px] text-sann-muted">
        {a}
        {aEn && <span className="mt-1.5 block text-[12.5px]">{aEn}</span>}
      </p>
    </details>
  );
}
