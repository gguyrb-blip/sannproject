"use client";

// Buying a voucher, in three steps.
//
// Selling and buying are kept apart. The page below sells; the moment someone
// has decided, this takes the screen and asks one thing at a time — the same
// stepped frame the PMS uses for check-in and the laundry book, so it is
// already familiar to anyone who has used either.
//
// Nothing here handles money. It posts to the PMS, which creates the vouchers
// and asks Beam for a PromptPay-only link, and the buyer is sent to Beam's own
// checkout. We never see a card number because there is never a card.
import { useEffect, useState } from "react";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

const PRICE = 299;
const FACE = 350;
const MAX = 10;

const baht = (n: number) => "฿" + n.toLocaleString("en-US");

/** Thai mobile numbers, however they were typed or pasted. */
function tidyTel(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("66")) d = "0" + d.slice(2);
  d = d.slice(0, 10);
  return d.length > 6 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
       : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}`
       : d;
}
const telOk = (v: string) => v.replace(/\D/g, "").length === 10 && v.startsWith("0");
const mailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const nameOk = (v: string) => v.trim().split(/\s+/).filter(Boolean).length >= 2;

export default function VoucherFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [mail, setMail] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const detailsOk = nameOk(name) && telOk(tel) && mailOk(mail);
  const total = PRICE * qty;

  async function pay() {
    if (!detailsOk) return;
    setBusy(true); setHint(null);
    try {
      const r = await fetch(`${ADMIN_API}/api/public/voucher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: mail, phone: tel, qty }),
      });
      const j = await r.json();
      if (!r.ok || !j.payUrl) {
        setHint(j.error ?? "สร้างรายการชำระเงินไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      // Beam's own checkout. Leaving our site is the point: the card details
      // that do not exist here cannot leak from here.
      window.location.href = j.payUrl;
    } catch {
      setHint("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-sann-off">
      {/* where you are */}
      <div className="sticky top-0 z-10 mx-auto flex max-w-[460px] items-center gap-2.5 bg-sann-off px-4 pb-2.5 pt-3">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
          aria-label={step > 1 ? "ย้อนกลับ" : "ปิด"}
          className="h-[34px] w-[34px] flex-none rounded-full border border-sann-line
            bg-white text-lg leading-none text-sann-text"
        >
          {step > 1 ? "‹" : "✕"}
        </button>
        <div className="flex-1 text-[15px] font-bold">ซื้อ Voucher</div>
        <div className="text-[12.5px] text-sann-muted">
          ขั้น <b className="text-sann-red">{step}</b>/3
        </div>
      </div>
      {/* how far */}
      <div className="mx-auto mb-1 flex max-w-[460px] gap-1 px-4">
        {[1, 2, 3].map((i) => (
          <i key={i} className={`h-[3px] flex-1 rounded-sm transition-colors ${
            i <= step ? "bg-sann-red" : "bg-sann-beige"}`} />
        ))}
      </div>

      <div className="mx-auto max-w-[460px] px-4 pb-32 pt-4">
        {step === 1 && (
          <>
            <h2 className="font-display text-[29px] leading-tight">ซื้อกี่ใบ</h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              1 ใบ = 1 เตียง 1 คืน · อยากพัก 2 คืน ซื้อ 2 ใบ
            </p>
            <div className="flex items-center justify-between rounded-sann-md bg-sann-warm px-3.5 py-3">
              <div className="flex items-center gap-3.5">
                <StepBtn onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} label="ลดจำนวน">−</StepBtn>
                <output aria-live="polite" className="min-w-[34px] text-center font-display text-[26px]">{qty}</output>
                <StepBtn onClick={() => setQty(Math.min(MAX, qty + 1))} disabled={qty >= MAX} label="เพิ่มจำนวน">+</StepBtn>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.1em] text-sann-muted">รวม</div>
                <div className="font-display text-[28px]">{baht(total)}</div>
              </div>
            </div>
            <p className="mt-2.5 text-center text-[12.5px] text-sann-muted">
              {qty === 1
                ? `ราคาปกติ ${baht(FACE)} ต่อเตียง · ประหยัด ${baht(FACE - PRICE)}`
                : `${qty} เตียง หรือ ${qty} คืน · ประหยัดรวม ${baht((FACE - PRICE) * qty)}`}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-[29px] leading-tight">ข้อมูลผู้ซื้อ</h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              รหัส Voucher จะถูกส่งไปที่อีเมลนี้ — กรุณาตรวจสอบให้ถูกต้องก่อนชำระเงิน
            </p>
            <Field id="v-name" label="ชื่อ-นามสกุล">
              <input id="v-name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อ และ นามสกุล" autoComplete="name" className={INPUT} />
            </Field>
            <Field id="v-tel" label="เบอร์โทรศัพท์">
              <input id="v-tel" value={tel} onChange={(e) => setTel(tidyTel(e.target.value))}
                type="tel" inputMode="numeric" placeholder="08x-xxx-xxxx" maxLength={12}
                autoComplete="tel" className={INPUT} />
            </Field>
            <Field id="v-mail" label="อีเมล">
              <input id="v-mail" value={mail} onChange={(e) => setMail(e.target.value)}
                type="email" inputMode="email" placeholder="you@example.com"
                autoComplete="email" spellCheck={false} className={INPUT} />
            </Field>
            {/* Said once, on the way out of the field — not on every keystroke. */}
            {mail && !mailOk(mail) && <Note bad>รูปแบบอีเมลไม่ถูกต้อง</Note>}
            {name && !nameOk(name) && <Note bad>กรุณากรอกทั้งชื่อและนามสกุล</Note>}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display text-[29px] leading-tight">ตรวจสอบและชำระเงิน</h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              กดชำระเงินแล้วจะพาไปหน้า QR PromptPay
            </p>
            <div className="rounded-sann-lg border border-sann-line bg-white p-[18px]">
              <Row k="จำนวน" v={`Voucher เตียงดอร์ม ${qty} ใบ`} />
              <Row k="ผู้ซื้อ" v={name} />
              <Row k="อีเมล" v={mail} />
              <Row k="เบอร์โทร" v={tel} />
              <Row k="ยอดชำระ" v={baht(total)} bold />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-sann-muted">
              <span>🇹🇭</span>
              <span>ชำระผ่าน <b className="text-sann-text">QR PromptPay</b> เท่านั้น · ไม่มีค่าธรรมเนียม</span>
            </div>
            {hint && <Note bad>{hint}</Note>}
            <p className="mt-3 text-center text-[12.5px] text-sann-muted">
              เมื่อชำระเงินแล้ว รหัส Voucher จะถูกส่งไปที่อีเมลของท่านทันที
            </p>
          </>
        )}
      </div>

      {/* the action, where the thumb is */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sann-line bg-sann-off
        px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={() => {
            if (step === 1) return setStep(2);
            if (step === 2) return detailsOk && setStep(3);
            void pay();
          }}
          disabled={(step === 2 && !detailsOk) || busy}
          className="mx-auto block w-full max-w-[428px] rounded-sann-md px-4 py-4 text-base
            font-semibold shadow-sann-md transition-colors
            disabled:cursor-default disabled:bg-sann-beige disabled:text-sann-muted
            disabled:shadow-none bg-sann-red text-white hover:bg-sann-red-dk"
        >
          {busy ? "กำลังสร้าง QR…"
            : step === 1 ? "ถัดไป →"
            : step === 2 ? (detailsOk ? "ตรวจสอบรายการ →" : "กรอกข้อมูลให้ครบก่อน")
            : `ชำระเงิน ${baht(total)}`}
        </button>
      </div>
    </div>
  );
}

const INPUT =
  "w-full rounded-sann-md border border-sann-line bg-white px-3.5 py-3 text-[15px] " +
  "text-sann-text outline-none focus:border-sann-red focus:ring-2 focus:ring-sann-terracotta-soft";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function StepBtn({ children, onClick, disabled, label }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className="h-[38px] w-[38px] rounded-full border border-sann-line bg-white text-xl
        leading-none shadow-sann-sm disabled:opacity-35 disabled:shadow-none">
      {children}
    </button>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 py-[7px] ${
      bold ? "mt-1.5 border-t border-sann-line pt-3 text-base font-semibold" : "text-sm"}`}>
      <span className="text-sann-muted">{k}</span>
      <b className="font-semibold">{v}</b>
    </div>
  );
}

function Note({ children, bad }: { children: React.ReactNode; bad?: boolean }) {
  return (
    <p className={`mt-2 text-center text-[12.5px] ${bad ? "text-red-700" : "text-sann-muted"}`}>
      {children}
    </p>
  );
}
