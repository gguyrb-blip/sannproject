"use client";

// The 11.11 page: the sales half, plus the way back in for someone who already
// bought and has lost the email.
//
// The redeem box at the bottom is not an afterthought. Until it existed, a
// voucher could only be opened from the link in its confirmation email — fine
// until someone deletes it, buys one as a gift, or comes back in February, at
// which point the only route left was phoning the hostel.
import { useState } from "react";
import VoucherFlow from "./VoucherFlow";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

/** Accepts it lower case, without dashes, pasted with spaces. */
function tidyCode(raw: string) {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  return s.length > 6 ? `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6)}`
       : s.length > 2 ? `${s.slice(0, 2)}-${s.slice(2)}`
       : s;
}

export default function Sale() {
  const [buying, setBuying] = useState(false);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ bad: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

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
      <div className="mx-auto max-w-[460px] px-4 pb-20">
        {/* ── the offer ── */}
        <section className="pb-1 pt-3.5 text-center">
          <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.3em] text-sann-red">
            Thungsao Hostel · ทุ่งเสา หาดใหญ่
          </div>
          <div className="font-display text-[68px] leading-none tracking-tight text-sann-red">
            11<span className="text-sann-terracotta-soft">.</span>11
          </div>
          <h1 className="mt-1.5 font-display text-[34px] leading-tight">
            เตียงดอร์ม <em className="italic text-sann-red">ราคาพิเศษ</em>
          </h1>
          <div className="mx-auto my-3.5 h-0.5 w-9 bg-sann-red opacity-40" />
          <p className="font-serif text-[17px] italic text-sann-muted">
            ซื้อวันนี้ เลือกวันเข้าพักทีหลัง
          </p>
          <div className="my-4 flex items-baseline justify-center gap-3">
            <span className="text-xl text-sann-muted line-through decoration-sann-red-lt decoration-2">฿350</span>
            <span className="font-display text-[58px] leading-none">
              ฿299<span className="font-sans text-[22px] text-sann-muted">/คืน</span>
            </span>
          </div>
          <span className="inline-block rounded-full bg-sann-terracotta-soft px-3 py-1
            text-xs font-bold text-sann-red-dk">
            ประหยัด ฿51 ต่อเตียง · 15%
          </span>
        </section>

        <Card>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sann-muted">
            1 Voucher = 1 เตียง 1 คืน
          </div>
          <Spec icon="🛏" th="เตียงในห้องดอร์มชาย 10 เตียง" en="A bed in the 10-bed male dormitory" />
          <Spec icon="📅" th="เข้าพักได้ จันทร์–พฤหัสบดี" en="Stays on Monday to Thursday nights" />
          <Spec icon="⏳" th="ใช้ได้ถึง 31 มีนาคม 2570" en="Valid until 31 March 2027" />
          <Spec icon="📍" th="ทุ่งเสา หาดใหญ่ · ใกล้สถานีขนส่ง" en="Thung Sao, Hat Yai — near the bus terminal" last />
        </Card>

        <Card>
          <button onClick={() => setBuying(true)}
            className="w-full justify-center bg-sann-red hover:bg-sann-red-dk text-white text-base font-medium px-6 py-4 rounded-2xl shadow-sann-md transition-colors">
            ซื้อ Voucher — ฿299
          </button>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[12.5px] text-sann-muted">
            <span>🇹🇭</span>
            <span>ชำระผ่าน <b className="text-sann-text">QR PromptPay</b> เท่านั้น · ไม่มีค่าธรรมเนียม</span>
          </div>
          <a href="#use" className="mt-3.5 block border-t border-sann-line pt-3.5 text-center
            text-[13px] font-semibold text-sann-red hover:underline">
            ซื้อไว้แล้ว? ใช้ Voucher ที่นี่
          </a>
        </Card>

        <Card>
          <h2 className="mb-2.5 font-display text-[21px]">เงื่อนไข</h2>
          <ul className="text-[13.5px]">
            {[
              "1 Voucher ใช้ได้กับ 1 เตียง 1 คืน",
              "เข้าพักได้เฉพาะคืนวันจันทร์ อังคาร พุธ และพฤหัสบดี",
              "จองวันเข้าพักผ่านลิงก์ในอีเมลยืนยัน ขึ้นกับห้องว่าง ณ วันที่จอง",
              "ใช้ได้ถึง 31 มีนาคม 2570 หลังจากนั้นถือว่าหมดอายุ",
              "ห้องดอร์มรับเฉพาะผู้เข้าพักชาย",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 py-1.5"><span className="text-sann-red">—</span>{t}</li>
            ))}
            {["ไม่สามารถคืนเงินหรือเปลี่ยนเป็นเงินสดได้", "ใช้ร่วมกับโปรโมชั่นอื่นไม่ได้"].map((t) => (
              <li key={t} className="flex gap-2.5 py-1.5">
                <span className="pt-0.5 text-[11px] text-sann-red-lt">✕</span>{t}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-1 font-display text-[21px]">คำถามที่พบบ่อย</h2>
          <Faq q="ซื้อแล้วต้องรีบใช้ไหม"
            a="ไม่ต้องครับ ซื้อวันนี้แล้วเลือกวันเข้าพักทีหลังได้ ใช้ได้ถึง 31 มีนาคม 2570" />
          <Faq q="ทำไมพักได้แค่ จันทร์–พฤหัสบดี"
            a="เป็นคืนที่โฮสเทลว่างมากที่สุด ราคานี้จึงทำได้ คืนศุกร์ เสาร์ อาทิตย์ จองได้ในราคาปกติ" />
          <Faq q="ถ้าวันที่อยากพักเต็ม"
            a="Voucher ยังอยู่ครับ เลือกวันอื่นได้จนกว่าจะหมดอายุ หน้าจองจะแสดงเตียงว่างของแต่ละวันให้เห็นก่อนกดยืนยัน" />
          <Faq q="ซื้อให้คนอื่นได้ไหม"
            a="ได้ครับ ส่งรหัส Voucher กับลิงก์ในอีเมลให้เขาจองเองได้เลย" last />
        </Card>

        {/* ── the way back in ── */}
        <div id="use" className="mt-3.5 scroll-mt-4 rounded-sann-lg border border-sann-line
          bg-white p-[18px] shadow-sann-sm">
          <h2 className="mb-1 font-display text-[21px]">ใช้ Voucher ที่ซื้อไว้</h2>
          <p className="mb-3 text-[13.5px] text-sann-muted">
            กรอกรหัสจากอีเมลยืนยัน เพื่อเลือกวันเข้าพัก
          </p>
          <label htmlFor="vcode" className="mb-1.5 block text-[12.5px] font-semibold">รหัส Voucher</label>
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
            {busy ? "กำลังตรวจสอบ…" : code.replace(/-/g, "").length !== 10 ? "กรอกรหัสให้ครบก่อน" : "ใช้ Voucher นี้"}
          </button>
          <p className="mt-2.5 text-center text-[12.5px] text-sann-muted">
            หาอีเมลไม่เจอ? ทักไลน์ <b className="text-sann-text">@sannstay</b> พร้อมเบอร์ที่ใช้ซื้อ
          </p>
        </div>
      </div>

      {buying && <VoucherFlow onClose={() => setBuying(false)} />}
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-sann-lg border border-sann-line bg-white p-[18px] shadow-sann-sm">
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

function Faq({ q, a, last }: { q: string; a: string; last?: boolean }) {
  return (
    <details className={last ? "" : "border-b border-sann-line"}>
      <summary className="flex cursor-pointer list-none justify-between gap-2.5 py-3
        text-[14.5px] font-semibold marker:content-none">
        {q}<span className="text-lg leading-none text-sann-red">+</span>
      </summary>
      <p className="pb-3 text-[13.5px] text-sann-muted">{a}</p>
    </details>
  );
}
