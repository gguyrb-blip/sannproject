"use client";

import { useEffect, useMemo, useState } from "react";
import { PREFERRED_UNITS } from "@/lib/types";

const ADMIN_API = "https://app.sannstay.com";

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const todayISO = () => ymd(new Date());
const fmt = (n: number) => "฿" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// ── i18n ──
type Lang = "th" | "en";
const T: Record<Lang, Record<string, string>> = {
  th: {
    pickDates: "เลือกวันเข้าพัก", guests: "จำนวนผู้เข้าพัก", property: "ที่พัก",
    guestName: "ชื่อผู้จอง", phone: "เบอร์โทร / LINE", email: "อีเมล", message: "ข้อความ",
    msgPh: "เวลาถึง คำขอพิเศษ ฯลฯ", nights: "คืน", cleaning: "ค่าทำความสะอาด", total: "รวมทั้งหมด",
    booked: "จองแล้ว", book: "จองเลย →", booking: "กำลังจอง…", success: "จองสำเร็จแล้ว!",
    sentEmail: "เราได้ส่งรายละเอียดทางอีเมลแล้ว ขอบคุณค่ะ 🙏", instant: "ยืนยันทันที · ส่งรายละเอียดทางอีเมล",
    feeNote: "ราคาในปฏิทินยังไม่รวมค่าทำความสะอาด", perStay: "/ครั้ง",
    errDates: "กรุณาเลือกวันบนปฏิทิน", errName: "กรุณากรอกชื่อ", errTaken: "ช่วงวันที่เพิ่งถูกจอง กรุณาเลือกวันใหม่",
    review: "ตรวจสอบรายละเอียดการจอง", checkInL: "เช็กอิน", checkOutL: "เช็กเอาต์",
    confirmBooking: "ยืนยันการจอง →", edit: "← แก้ไข", noEmail: "—",
  },
  en: {
    pickDates: "Select your dates", guests: "Number of guests", property: "Property",
    guestName: "Guest name", phone: "Phone / LINE", email: "Email", message: "Message",
    msgPh: "Arrival time, special requests, etc.", nights: "nights", cleaning: "Cleaning fee", total: "Total",
    booked: "Booked", book: "Book now →", booking: "Booking…", success: "Booking confirmed!",
    sentEmail: "We've sent the details to your email. Thank you! 🙏", instant: "Instant confirmation · details by email",
    feeNote: "Calendar prices exclude the cleaning fee of", perStay: "/stay",
    errDates: "Please pick dates on the calendar", errName: "Please enter your name", errTaken: "Those dates were just taken — pick new dates",
    review: "Review your booking", checkInL: "Check-in", checkOutL: "Check-out",
    confirmBooking: "Confirm booking →", edit: "← Edit", noEmail: "—",
  },
};
const fmtDate = (iso: string, l: Lang) => {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[l][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
const DOW: Record<Lang, string[]> = {
  th: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};
const MONTHS: Record<Lang, string[]> = {
  th: ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

interface Quote {
  available: boolean; reason: string | null; nights: number;
  rooms_total: number; cleaning_fee: number; total: number; min_nights: number;
}

export default function BookForm() {
  const [lang, setLang] = useState<Lang>("th");
  const tr = T[lang];
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState(false);
  const [done, setDone] = useState<{ ref: string | null; total: number; nights: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [rates, setRates] = useState<Record<string, number>>({});
  const [cleaningFee, setCleaningFee] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const today = new Date();
  const [calY, setCalY] = useState(today.getUTCFullYear());
  const [calM, setCalM] = useState(today.getUTCMonth());
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [form, setForm] = useState({
    number_of_guests: 2, preferred_unit: PREFERRED_UNITS[0],
    guest_name: "", phone_line: "", email: "", message: "",
  });

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("book_lang")) as Lang | null;
    if (saved === "en" || saved === "th") setLang(saved);
    fetch(`${ADMIN_API}/api/public/availability?property_slug=hatyai`)
      .then((r) => r.json())
      .then((d) => { setBlocked(new Set(d.unavailable_dates ?? [])); setRates(d.rates ?? {}); setCleaningFee(d.cleaning_fee ?? 0); })
      .catch(() => {});
  }, []);
  function setLanguage(l: Lang) { setLang(l); try { localStorage.setItem("book_lang", l); } catch {} }

  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) { setQuote(null); return; }
    let cancelled = false;
    fetch(`${ADMIN_API}/api/public/quote?property_slug=hatyai&from=${checkIn}&to=${checkOut}`)
      .then((r) => r.json()).then((d) => { if (!cancelled) setQuote(d as Quote); }).catch(() => null);
    return () => { cancelled = true; };
  }, [checkIn, checkOut]);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(calY, calM, 1));
    const daysIn = new Date(Date.UTC(calY, calM + 1, 0)).getUTCDate();
    const arr: (string | null)[] = [];
    for (let i = 0; i < first.getUTCDay(); i++) arr.push(null);
    for (let d = 1; d <= daysIn; d++) arr.push(ymd(new Date(Date.UTC(calY, calM, d))));
    while (arr.length % 7) arr.push(null);
    return arr;
  }, [calY, calM]);

  const inRange = (d: string) => !!(checkIn && checkOut && d >= checkIn && d < checkOut);
  // Every NIGHT in [from, to) free? The check-out day itself is not a night.
  function nightsFree(from: string, to: string) {
    let t = new Date(from + "T00:00:00Z").getTime();
    const end = new Date(to + "T00:00:00Z").getTime();
    while (t < end) { if (blocked.has(new Date(t).toISOString().slice(0, 10))) return false; t += 86_400_000; }
    return true;
  }
  // A booked day can still be a valid CHECK-OUT (turnover day) — you leave that
  // morning while the next guest arrives. Only the nights you sleep must be free.
  const isCheckoutCandidate = (d: string) => !!checkIn && !checkOut && d > checkIn && nightsFree(checkIn, d);
  function clickDay(d: string) {
    if (d < todayISO()) return;
    const isBlk = blocked.has(d);
    // Start (or restart) a selection — a check-in night must be free
    if (!checkIn || checkOut) { if (isBlk) return; setCheckIn(d); setCheckOut(null); return; }
    if (d <= checkIn) { if (isBlk) return; setCheckIn(d); setCheckOut(null); return; }
    // d > checkIn → candidate check-out (day itself may be booked; nights must be free)
    if (nightsFree(checkIn, d)) setCheckOut(d);
    else if (!isBlk) { setCheckIn(d); setCheckOut(null); }
  }
  function shiftMonth(n: number) {
    let m = calM + n, y = calY;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCalM(m); setCalY(y);
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-10 text-center shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
        <p className="text-4xl mb-2">✅</p>
        <p className="font-display text-2xl text-sann-red mb-2">{tr.success}</p>
        {done.ref && <p className="font-mono font-bold text-lg mb-1">{done.ref}</p>}
        <p className="text-sann-text-md leading-[1.7]">{done.nights} {tr.nights} · {fmt(done.total)}<br/>{tr.sentEmail}</p>
      </div>
    );
  }

  // Step 1 — validate then open the review summary (no submit yet)
  const openReview = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!checkIn || !checkOut) return setError(tr.errDates);
    if (!form.guest_name.trim()) return setError(tr.errName);
    if (quote && !quote.available) return setError(quote.reason || tr.errTaken);
    setReview(true);
  };

  // Step 2 — confirmed in the review modal → actually create the booking
  const doSubmit = async () => {
    setError(null); setSubmitting(true);
    try {
      const res = await fetch("/api/booking-inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, check_in_date: checkIn, check_out_date: checkOut }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Submission failed");
      if (j.unavailable) throw new Error(tr.errTaken);
      setReview(false);
      setDone({ ref: j.booking_ref ?? null, total: quote?.total ?? 0, nights: quote?.nights ?? 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally { setSubmitting(false); }
  };

  const blockedSubmit = !!(quote && !quote.available) || !checkIn || !checkOut;

  return (
    <form onSubmit={openReview} className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-6 lg:p-8 shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
      {/* Header + language toggle */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[0.7rem] tracking-[0.16em] uppercase text-sann-red font-semibold">{tr.pickDates}</p>
        <div className="flex border border-sann-red/15 rounded overflow-hidden">
          {(["th", "en"] as Lang[]).map((l) => (
            <button key={l} type="button" onClick={() => setLanguage(l)}
              className={`px-2.5 py-1 text-[0.65rem] font-bold ${lang === l ? "bg-sann-red text-white" : "bg-white text-sann-text-md"}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={() => shiftMonth(-1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">‹</button>
        <div className="font-semibold">{MONTHS[lang][calM]} {lang === "th" ? calY + 543 : calY}</div>
        <button type="button" onClick={() => shiftMonth(1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DOW[lang].map((d, i) => <div key={i} className={`text-center text-[0.6rem] font-bold py-1 ${i === 0 || i === 6 ? "text-sann-red" : "text-sann-text-lt"}`}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isPast = d < todayISO();
          const isBlocked = blocked.has(d);
          const canCheckout = isCheckoutCandidate(d);   // booked day usable as check-out
          const isCI = d === checkIn, isCO = checkOut && d === checkOut;
          const ranged = inRange(d);
          const price = rates[d];
          const dom = Number(d.slice(8, 10));
          return (
            <button key={d} type="button" disabled={isPast || (isBlocked && !canCheckout)} onClick={() => clickDay(d)}
              className={`min-h-[44px] rounded flex flex-col items-center justify-center gap-0.5 border ${
                isCI || isCO ? "border-2 border-sann-red" : "border-sann-red/10"
              } ${isPast ? "bg-sann-cream/40 opacity-40" : (isBlocked && !canCheckout) ? "bg-red-50" : (isCI || isCO || ranged) ? "bg-sann-red/[0.08]" : "bg-white"}`}>
              <span className={`text-xs ${isCI || isCO ? "font-extrabold" : "font-medium"} text-sann-text`}>{dom}</span>
              {(isBlocked && !canCheckout) ? <span className="text-[0.5rem] font-bold text-red-600">{tr.booked}</span>
                : (!isBlocked && price != null) ? <span className="text-[0.55rem] font-mono text-sann-red">{(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k</span>
                : null}
            </button>
          );
        })}
      </div>

      {/* Cleaning fee note */}
      {cleaningFee > 0 && (
        <p className="text-center text-[0.7rem] text-sann-text-lt mt-2">* {tr.feeNote} {fmt(cleaningFee)}{tr.perStay}</p>
      )}

      {/* Price summary */}
      {quote && (
        <div className={`rounded-sm px-4 py-3 mt-3 border text-sm ${quote.available ? "bg-sann-cream/50 border-sann-red/15" : "bg-red-50 border-red-200 text-red-700"}`}>
          {quote.available ? (
            <>
              <div className="flex justify-between"><span>{quote.nights} {tr.nights}</span><span>{fmt(quote.rooms_total)}</span></div>
              {quote.cleaning_fee > 0 && <div className="flex justify-between mt-1"><span>{tr.cleaning}</span><span>{fmt(quote.cleaning_fee)}</span></div>}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-sann-red/15"><b>{tr.total}</b><b className="text-lg text-sann-red">{fmt(quote.total)}</b></div>
            </>
          ) : <span>⚠️ {quote.reason}</span>}
        </div>
      )}

      {/* Guest fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <Field label={tr.guests}>
          <input type="number" min={1} max={20} value={form.number_of_guests}
            onChange={(e) => setForm((f) => ({ ...f, number_of_guests: Number(e.target.value) }))} className={inputCls} />
        </Field>
        <Field label={tr.property}>
          <div className="border-[1.5px] border-sann-red/15 bg-sann-cream/40 px-3 py-2.5 rounded-sm text-sm">{form.preferred_unit}</div>
        </Field>
        <Field label={tr.guestName} wide>
          <input value={form.guest_name} onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))} className={inputCls} required />
        </Field>
        <Field label={tr.phone}>
          <input value={form.phone_line} onChange={(e) => setForm((f) => ({ ...f, phone_line: e.target.value }))} className={inputCls} required />
        </Field>
        <Field label={tr.email}>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
        </Field>
      </div>
      <Field label={tr.message}>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={2} className={inputCls} placeholder={tr.msgPh} />
      </Field>

      {error && <p className="text-sann-red text-sm mt-2">{error}</p>}
      <button type="submit" disabled={submitting || blockedSubmit}
        className="w-full bg-sann-red hover:bg-sann-red-dk text-white py-3.5 rounded-sm text-[0.78rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60 mt-4">
        {submitting ? tr.booking : tr.book}
      </button>
      <p className="text-center text-[0.7rem] text-sann-text-lt mt-2">{tr.instant}</p>

      {/* Review summary before final confirm */}
      {review && (
        <div className="fixed inset-0 z-[60] bg-black/45 flex items-center justify-center p-4" onClick={() => !submitting && setReview(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl text-sann-text">{tr.review}</h3>
            <div className="w-8 h-0.5 bg-sann-red/40 mt-2 mb-4" />
            <div className="divide-y divide-sann-line/60">
              <SummaryRow label={tr.property} value={form.preferred_unit} />
              <SummaryRow label={tr.checkInL} value={checkIn ? fmtDate(checkIn, lang) : "—"} />
              <SummaryRow label={tr.checkOutL} value={checkOut ? fmtDate(checkOut, lang) : "—"} />
              <SummaryRow label={tr.guests} value={String(form.number_of_guests)} />
              <SummaryRow label={tr.guestName} value={form.guest_name} />
              <SummaryRow label={tr.phone} value={form.phone_line || "—"} />
              <SummaryRow label={tr.email} value={form.email || tr.noEmail} />
              {form.message && <SummaryRow label={tr.message} value={form.message} />}
            </div>
            {quote && (
              <div className="mt-4 bg-sann-cream/50 rounded-sm p-3 text-sm">
                <div className="flex justify-between"><span>{quote.nights} {tr.nights}</span><span>{fmt(quote.rooms_total)}</span></div>
                {quote.cleaning_fee > 0 && <div className="flex justify-between mt-1"><span>{tr.cleaning}</span><span>{fmt(quote.cleaning_fee)}</span></div>}
                <div className="flex justify-between font-bold text-sann-red border-t border-sann-red/15 mt-2 pt-2"><span>{tr.total}</span><span>{fmt(quote.total)}</span></div>
              </div>
            )}
            {error && <p className="text-sann-red text-sm mt-3">{error}</p>}
            <div className="flex gap-3 mt-5">
              <button type="button" onClick={() => setReview(false)} disabled={submitting}
                className="flex-1 border-[1.5px] border-sann-red/20 text-sann-text py-3 rounded-sm text-sm font-medium disabled:opacity-60">{tr.edit}</button>
              <button type="button" onClick={doSubmit} disabled={submitting}
                className="flex-1 bg-sann-red hover:bg-sann-red-dk text-white py-3 rounded-sm text-[0.78rem] tracking-[0.12em] uppercase font-bold disabled:opacity-60">{submitting ? tr.booking : tr.confirmBooking}</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-sann-text-md shrink-0">{label}</span>
      <span className="text-sann-text font-medium text-right">{value}</span>
    </div>
  );
}

const inputCls = "w-full border-[1.5px] border-sann-red/15 bg-white px-3 py-2.5 rounded-sm text-sm text-sann-text outline-none focus:border-sann-red transition-colors";

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">{label}</span>
      {children}
    </label>
  );
}
