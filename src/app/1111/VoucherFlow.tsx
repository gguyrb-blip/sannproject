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
        <div className="flex-1 text-[15px] font-bold">
          ซื้อ Voucher <span className="font-normal text-sann-muted">· Buy a voucher</span>
        </div>
        <div className="text-[12.5px] text-sann-muted">
          <b className="text-sann-red">{step}</b>/3
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
            <h2 className="font-display text-[26px] leading-tight">
              กรุณาเลือกจำนวน Voucher ที่ต้องการซื้อ
            </h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              1 ใบ = 1 เตียง 1 คืน · อยากพัก 2 คืน ซื้อ 2 ใบ
              <span className="mt-0.5 block text-[12.5px]">
                Choose how many vouchers you want · 1 voucher = 1 bed for 1 night
              </span>
            </p>
            <div className="flex items-center justify-between rounded-sann-md bg-sann-warm px-3.5 py-3">
              <div className="flex items-center gap-3.5">
                <StepBtn onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} label="ลดจำนวน">−</StepBtn>
                <output aria-live="polite" className="min-w-[34px] text-center font-display text-[26px]">{qty}</output>
                <StepBtn onClick={() => setQty(Math.min(MAX, qty + 1))} disabled={qty >= MAX} label="เพิ่มจำนวน">+</StepBtn>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.1em] text-sann-muted">รวม · Total</div>
                <div className="font-display text-[28px]">{baht(total)}</div>
              </div>
            </div>
            <p className="mt-2.5 text-center text-[12.5px] text-sann-muted">
              {qty === 1
                ? `ราคาปกติ ${baht(FACE)} ต่อเตียง · ประหยัด ${baht(FACE - PRICE)}`
                : `${qty} เตียง หรือ ${qty} คืน · ประหยัดรวม ${baht((FACE - PRICE) * qty)}`}
              <span className="mt-0.5 block">
                {qty === 1
                  ? `Usually ${baht(FACE)} a bed · you save ${baht(FACE - PRICE)}`
                  : `${qty} beds, or ${qty} nights · you save ${baht((FACE - PRICE) * qty)} in all`}
              </span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-[29px] leading-tight">
              ข้อมูลผู้ซื้อ <span className="text-[20px] text-sann-muted">· Your details</span>
            </h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              รหัส Voucher จะถูกส่งไปที่อีเมลนี้ — กรุณาตรวจสอบให้ถูกต้องก่อนชำระเงิน
              <span className="mt-0.5 block text-[12.5px]">
                Your voucher code is emailed here — please check it before paying.
              </span>
            </p>
            <Field id="v-name" label="ชื่อ-นามสกุล" en="Full name">
              <input id="v-name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อ และ นามสกุล" autoComplete="name" className={INPUT} />
            </Field>
            <Field id="v-tel" label="เบอร์โทรศัพท์" en="Mobile number">
              <input id="v-tel" value={tel} onChange={(e) => setTel(tidyTel(e.target.value))}
                type="tel" inputMode="numeric" placeholder="08x-xxx-xxxx" maxLength={12}
                autoComplete="tel" className={INPUT} />
            </Field>
            <Field id="v-mail" label="อีเมล" en="Email">
              <input id="v-mail" value={mail} onChange={(e) => setMail(e.target.value)}
                type="email" inputMode="email" placeholder="you@example.com"
                autoComplete="email" spellCheck={false} className={INPUT} />
            </Field>
            {/* Said once, on the way out of the field — not on every keystroke. */}
            {mail && !mailOk(mail) && <Note bad>รูปแบบอีเมลไม่ถูกต้อง · That email does not look right</Note>}
            {name && !nameOk(name) && <Note bad>กรุณากรอกทั้งชื่อและนามสกุล · Please give both names</Note>}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display text-[29px] leading-tight">
              ตรวจสอบและชำระเงิน <span className="text-[19px] text-sann-muted">· Review and pay</span>
            </h2>
            <p className="mb-[18px] mt-1 text-[13.5px] leading-relaxed text-sann-muted">
              กดชำระเงินแล้วจะพาไปหน้า QR PromptPay
              <span className="mt-0.5 block text-[12.5px]">
                The next screen is a PromptPay QR code.
              </span>
            </p>
            <div className="rounded-sann-lg border border-sann-line bg-white p-[18px]">
              <Row k="จำนวน" en="Vouchers" v={`Voucher เตียงดอร์ม ${qty} ใบ`} />
              <Row k="ผู้ซื้อ" en="Name" v={name} />
              <Row k="อีเมล" en="Email" v={mail} />
              <Row k="เบอร์โทร" en="Mobile" v={tel} />
              <Row k="ยอดชำระ" en="Total" v={baht(total)} bold />
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-sann-muted">
              <span>🇹🇭</span>
              <span>
                ชำระผ่าน <b className="text-sann-text">QR PromptPay</b> เท่านั้น · ไม่มีค่าธรรมเนียม
                <span className="block">PromptPay QR only · no fee</span>
              </span>
            </div>
            {hint && <Note bad>{hint}</Note>}
            <p className="mt-3 text-center text-[12.5px] text-sann-muted">
              เมื่อชำระเงินแล้ว รหัส Voucher จะถูกส่งไปที่อีเมลของท่านทันที
              <span className="mt-0.5 block">Your code is emailed the moment the payment clears.</span>
            </p>
          </>
        )}
      </div>

      {/* the action, where the thumb is */}
      {/* The action, where the thumb is — and Back beside it.
         Going back used to mean the small chevron in the top-left corner,
         which on a phone is the hardest place on the screen to reach and the
         easiest to miss. Someone who wanted to change the quantity after
         typing their email had to find it. It stays up there as well, because
         it doubles as Close on the first step. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sann-line bg-sann-off
        px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex w-full max-w-[428px] gap-2.5">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={busy}
              className="flex-none rounded-2xl border border-sann-line bg-white px-5 py-4
                text-center text-[15px] font-medium leading-tight text-sann-text
                transition-colors hover:bg-sann-warm disabled:opacity-40"
            >
              ← ย้อนกลับ
              <span className="block text-[11px] font-normal text-sann-muted">Back</span>
            </button>
          )}
          <button
            onClick={() => {
              if (step === 1) return setStep(2);
              if (step === 2) return detailsOk && setStep(3);
              void pay();
            }}
            disabled={(step === 2 && !detailsOk) || busy}
            className="flex-1 rounded-2xl bg-sann-red px-6 py-4 text-center text-base font-medium
              leading-tight text-white shadow-sann-md transition-colors hover:bg-sann-red-dk
              disabled:cursor-default disabled:bg-sann-beige disabled:text-sann-muted disabled:shadow-none"
          >
            {busy ? (<>กำลังสร้าง QR…<span className="block text-[11px] font-normal opacity-80">Creating your QR…</span></>)
              : step === 1 ? (<>ถัดไป →<span className="block text-[11px] font-normal opacity-80">Next</span></>)
              : step === 2 ? (detailsOk
                  ? (<>ตรวจสอบรายการ →<span className="block text-[11px] font-normal opacity-80">Review</span></>)
                  : (<>กรอกข้อมูลให้ครบก่อน<span className="block text-[11px] font-normal opacity-80">Fill in every field</span></>))
              : (<>ชำระเงิน {baht(total)}<span className="block text-[11px] font-normal opacity-80">Pay now</span></>)}
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT =
  "w-full rounded-sann-md border border-sann-line bg-white px-3.5 py-3 text-[15px] " +
  "text-sann-text outline-none focus:border-sann-red focus:ring-2 focus:ring-sann-terracotta-soft";

function Field({ id, label, en, children }: {
  id: string; label: string; en?: string; children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold">
        {label}
        {en && <span className="ml-1.5 font-normal text-sann-muted">· {en}</span>}
      </label>
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

function Row({ k, en, v, bold }: { k: string; en?: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 py-[7px] ${
      bold ? "mt-1.5 border-t border-sann-line pt-3 text-base font-semibold" : "text-sm"}`}>
      <span className="text-sann-muted">
        {k}{en && <span className="block text-[11px]">{en}</span>}
      </span>
      <b className="text-right font-semibold">{v}</b>
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
