"use client";

import { useEffect, useState } from "react";
import { PREFERRED_UNITS } from "@/lib/types";

// SANN booking engine (admin PMS)
const ADMIN_API = "https://app.sannstay.com";

const todayISO = () => new Date().toISOString().split("T")[0];
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

interface Quote {
  available: boolean;
  reason: string | null;
  nights: number;
  total: number;
  min_nights: number;
}

export default function BookForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string | null; total: number; nights: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [form, setForm] = useState({
    check_in_date: todayISO(),
    check_out_date: tomorrowISO(),
    number_of_guests: 2,
    preferred_unit: PREFERRED_UNITS[0],
    guest_name: "",
    phone_line: "",
    email: "",
    message: "",
  });

  // ── Live quote when dates change ──
  useEffect(() => {
    const { check_in_date, check_out_date } = form;
    if (!check_in_date || !check_out_date || check_out_date <= check_in_date) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    const t = setTimeout(() => {
      fetch(`${ADMIN_API}/api/public/quote?from=${check_in_date}&to=${check_out_date}`)
        .then((r) => r.json())
        .then((d) => { if (!cancelled) setQuote(d as Quote); })
        .catch(() => { if (!cancelled) setQuote(null); })
        .finally(() => { if (!cancelled) setQuoteLoading(false); });
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [form.check_in_date, form.check_out_date]);

  const fmt = (n: number) => "฿" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  if (done) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-10 text-center shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
        <p className="text-4xl mb-2">✅</p>
        <p className="font-display text-2xl text-sann-red mb-2">จองสำเร็จแล้ว!</p>
        {done.ref && (
          <p className="font-mono font-bold text-lg text-sann-text mb-1">เลขจอง: {done.ref}</p>
        )}
        <p className="text-sann-text-md leading-[1.7]">
          {done.nights} คืน · รวม {fmt(done.total)}
          <br />
          เราได้ส่งรายละเอียดการเข้าพักไปทางอีเมลแล้ว ขอบคุณที่เลือก SANN Stay ค่ะ 🙏
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (quote && !quote.available) {
      setError(quote.reason || "ช่วงวันที่นี้จองไม่ได้");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Submission failed");
      if (j.unavailable) {
        throw new Error("ช่วงวันที่เพิ่งถูกจอง กรุณาเลือกวันใหม่");
      }
      setDone({
        ref: j.booking_ref ?? null,
        total: quote?.total ?? 0,
        nights: quote?.nights ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const blocked = !!(quote && !quote.available);

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-6 lg:p-10 shadow-[0_10px_36px_rgba(42,31,24,0.06)] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Check-in date">
          <input type="date" min={todayISO()} value={form.check_in_date}
            onChange={(e) => setForm((f) => ({ ...f, check_in_date: e.target.value }))}
            className={inputCls} required />
        </Field>
        <Field label="Check-out date">
          <input type="date" min={form.check_in_date} value={form.check_out_date}
            onChange={(e) => setForm((f) => ({ ...f, check_out_date: e.target.value }))}
            className={inputCls} required />
        </Field>
        <Field label="Number of guests">
          <input type="number" min={1} max={20} value={form.number_of_guests}
            onChange={(e) => setForm((f) => ({ ...f, number_of_guests: Number(e.target.value) }))}
            className={inputCls} required />
        </Field>
        <Field label="Property">
          <div className="border-[1.5px] border-sann-red/15 bg-sann-cream/40 px-3 py-2.5 rounded-sm text-sm text-sann-text">
            {form.preferred_unit}
          </div>
        </Field>
        <Field label="Guest name" wide>
          <input type="text" value={form.guest_name}
            onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
            className={inputCls} required />
        </Field>
        <Field label="Phone / LINE">
          <input type="tel" value={form.phone_line}
            onChange={(e) => setForm((f) => ({ ...f, phone_line: e.target.value }))}
            className={inputCls} required />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputCls} />
        </Field>
      </div>
      <Field label="Message">
        <textarea value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          rows={3} className={inputCls}
          placeholder="Anything we should know? Arrival time, special requests, etc." />
      </Field>

      {/* ── Live price box ── */}
      <div
        className={`rounded-sm px-4 py-3 text-sm border ${
          blocked
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-sann-cream/50 border-sann-red/15 text-sann-text"
        }`}
      >
        {quoteLoading ? (
          <span className="text-sann-text-lt">กำลังคำนวณราคา…</span>
        ) : !quote ? (
          <span className="text-sann-text-lt">เลือกวันเข้าพักเพื่อดูราคา</span>
        ) : quote.available ? (
          <div className="flex items-center justify-between">
            <span>{quote.nights} คืน</span>
            <span className="font-display text-xl text-sann-red font-semibold">
              {fmt(quote.total)}
            </span>
          </div>
        ) : (
          <span>⚠️ {quote.reason}</span>
        )}
      </div>

      {error && (
        <p className="text-sann-red text-sm" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || blocked || quoteLoading}
        className="w-full bg-sann-red hover:bg-sann-red-dk text-white py-3.5 rounded-sm text-[0.78rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60"
      >
        {submitting ? "กำลังจอง…" : blocked ? "เลือกวันใหม่" : "จองเลย →"}
      </button>
      <p className="text-center text-[0.7rem] text-sann-text-lt">
        ยืนยันทันที · เราจะส่งรายละเอียดการเข้าพักทางอีเมล
      </p>
    </form>
  );
}

const inputCls =
  "w-full border-[1.5px] border-sann-red/15 bg-white px-3 py-2.5 rounded-sm text-sm text-sann-text outline-none focus:border-sann-red transition-colors";

function Field({
  label, children, wide,
}: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}
