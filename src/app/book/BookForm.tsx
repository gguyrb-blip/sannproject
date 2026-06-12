"use client";

import { useEffect, useMemo, useState } from "react";
import { PREFERRED_UNITS } from "@/lib/types";

const ADMIN_API = "https://app.sannstay.com";

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const todayISO = () => ymd(new Date());
const fmt = (n: number) => "฿" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Quote {
  available: boolean; reason: string | null; nights: number;
  rooms_total: number; cleaning_fee: number; total: number; min_nights: number;
}

export default function BookForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string | null; total: number; nights: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // availability + pricing
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [rates, setRates] = useState<Record<string, number>>({});
  const [cleaningFee, setCleaningFee] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  // calendar
  const today = new Date();
  const [calY, setCalY] = useState(today.getUTCFullYear());
  const [calM, setCalM] = useState(today.getUTCMonth());
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  // guest
  const [form, setForm] = useState({
    number_of_guests: 2, preferred_unit: PREFERRED_UNITS[0],
    guest_name: "", phone_line: "", email: "", message: "",
  });

  useEffect(() => {
    fetch(`${ADMIN_API}/api/public/availability`)
      .then((r) => r.json())
      .then((d) => { setBlocked(new Set(d.unavailable_dates ?? [])); setRates(d.rates ?? {}); setCleaningFee(d.cleaning_fee ?? 0); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) { setQuote(null); return; }
    let cancelled = false;
    fetch(`${ADMIN_API}/api/public/quote?from=${checkIn}&to=${checkOut}`)
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
  function clickDay(d: string) {
    if (blocked.has(d) || d < todayISO()) return;
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(d); setCheckOut(null); }
    else if (d <= checkIn) { setCheckIn(d); setCheckOut(null); }
    else {
      let t = new Date(checkIn + "T00:00:00Z").getTime();
      const end = new Date(d + "T00:00:00Z").getTime();
      let ok = true;
      while (t < end) { if (blocked.has(new Date(t).toISOString().slice(0, 10))) { ok = false; break; } t += 86_400_000; }
      if (ok) setCheckOut(d); else { setCheckIn(d); setCheckOut(null); }
    }
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
        <p className="font-display text-2xl text-sann-red mb-2">จองสำเร็จแล้ว!</p>
        {done.ref && <p className="font-mono font-bold text-lg mb-1">{done.ref}</p>}
        <p className="text-sann-text-md leading-[1.7]">{done.nights} คืน · {fmt(done.total)}<br/>เราได้ส่งรายละเอียดทางอีเมลแล้ว ขอบคุณค่ะ 🙏</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!checkIn || !checkOut) return setError("กรุณาเลือกวันบนปฏิทิน");
    if (!form.guest_name.trim()) return setError("กรุณากรอกชื่อ");
    if (quote && !quote.available) return setError(quote.reason || "ช่วงวันที่นี้จองไม่ได้");
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, check_in_date: checkIn, check_out_date: checkOut }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Submission failed");
      if (j.unavailable) throw new Error("ช่วงวันที่เพิ่งถูกจอง กรุณาเลือกวันใหม่");
      setDone({ ref: j.booking_ref ?? null, total: quote?.total ?? 0, nights: quote?.nights ?? 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally { setSubmitting(false); }
  };

  const blockedSubmit = !!(quote && !quote.available) || !checkIn || !checkOut;

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-6 lg:p-8 shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
      <p className="text-[0.7rem] tracking-[0.16em] uppercase text-sann-red font-semibold mb-3">Select your dates</p>

      {/* Calendar */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={() => shiftMonth(-1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">‹</button>
        <div className="font-semibold">{MONTHS[calM]} {calY}</div>
        <button type="button" onClick={() => shiftMonth(1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DOW.map((d, i) => <div key={i} className={`text-center text-[0.6rem] font-bold py-1 ${i === 0 || i === 6 ? "text-sann-red" : "text-sann-text-lt"}`}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isPast = d < todayISO();
          const isBlocked = blocked.has(d);
          const isCI = d === checkIn, isCO = checkOut && d === checkOut;
          const ranged = inRange(d);
          const price = rates[d];
          const dom = Number(d.slice(8, 10));
          return (
            <button key={d} type="button" disabled={isPast || isBlocked} onClick={() => clickDay(d)}
              className={`min-h-[44px] rounded flex flex-col items-center justify-center gap-0.5 border ${
                isCI || isCO ? "border-2 border-sann-red" : "border-sann-red/10"
              } ${isPast ? "bg-sann-cream/40 opacity-40" : isBlocked ? "bg-red-50" : (isCI || ranged) ? "bg-sann-red/[0.08]" : "bg-white"}`}>
              <span className={`text-xs ${isCI || isCO ? "font-extrabold" : "font-medium"} text-sann-text`}>{dom}</span>
              {isBlocked ? <span className="text-[0.5rem] font-bold text-red-600">จองแล้ว</span>
                : price != null ? <span className="text-[0.55rem] font-mono text-sann-red">{(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k</span>
                : null}
            </button>
          );
        })}
      </div>

      {/* Cleaning fee note */}
      {cleaningFee > 0 && (
        <p className="text-center text-[0.7rem] text-sann-text-lt mt-2">
          * ราคาในปฏิทินยังไม่รวมค่าทำความสะอาด {fmt(cleaningFee)}/ครั้ง · Calendar prices exclude the {fmt(cleaningFee)} cleaning fee
        </p>
      )}

      {/* Price summary */}
      {quote && (
        <div className={`rounded-sm px-4 py-3 mt-4 border text-sm ${quote.available ? "bg-sann-cream/50 border-sann-red/15" : "bg-red-50 border-red-200 text-red-700"}`}>
          {quote.available ? (
            <>
              <div className="flex justify-between"><span>{quote.nights} คืน</span><span>{fmt(quote.rooms_total)}</span></div>
              {quote.cleaning_fee > 0 && <div className="flex justify-between mt-1"><span>ค่าทำความสะอาด</span><span>{fmt(quote.cleaning_fee)}</span></div>}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-sann-red/15"><b>รวมทั้งหมด</b><b className="text-lg text-sann-red">{fmt(quote.total)}</b></div>
            </>
          ) : <span>⚠️ {quote.reason}</span>}
        </div>
      )}

      {/* Guest fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <Field label="Number of guests">
          <input type="number" min={1} max={20} value={form.number_of_guests}
            onChange={(e) => setForm((f) => ({ ...f, number_of_guests: Number(e.target.value) }))} className={inputCls} />
        </Field>
        <Field label="Property">
          <div className="border-[1.5px] border-sann-red/15 bg-sann-cream/40 px-3 py-2.5 rounded-sm text-sm">{form.preferred_unit}</div>
        </Field>
        <Field label="Guest name" wide>
          <input value={form.guest_name} onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))} className={inputCls} required />
        </Field>
        <Field label="Phone / LINE">
          <input value={form.phone_line} onChange={(e) => setForm((f) => ({ ...f, phone_line: e.target.value }))} className={inputCls} required />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
        </Field>
      </div>
      <Field label="Message">
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={2} className={inputCls} placeholder="Arrival time, special requests, etc." />
      </Field>

      {error && <p className="text-sann-red text-sm mt-2">{error}</p>}
      <button type="submit" disabled={submitting || blockedSubmit}
        className="w-full bg-sann-red hover:bg-sann-red-dk text-white py-3.5 rounded-sm text-[0.78rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60 mt-4">
        {submitting ? "กำลังจอง…" : "จองเลย →"}
      </button>
      <p className="text-center text-[0.7rem] text-sann-text-lt mt-2">ยืนยันทันที · ส่งรายละเอียดทางอีเมล</p>
    </form>
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
