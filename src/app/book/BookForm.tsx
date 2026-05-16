"use client";

import { useState } from "react";
import { PREFERRED_UNITS } from "@/lib/types";

const todayISO = () => new Date().toISOString().split("T")[0];
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export default function BookForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  if (done) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-10 text-center shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
        <p className="font-display text-2xl text-sann-red mb-3">Thank you</p>
        <p className="text-sann-text-md leading-[1.7]">
          Thank you for your interest in staying with SANN. Our team will check
          availability and get back to you shortly.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-6 lg:p-10 shadow-[0_10px_36px_rgba(42,31,24,0.06)] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Check-in date">
          <input
            type="date"
            value={form.check_in_date}
            onChange={(e) =>
              setForm((f) => ({ ...f, check_in_date: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Check-out date">
          <input
            type="date"
            value={form.check_out_date}
            onChange={(e) =>
              setForm((f) => ({ ...f, check_out_date: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Number of guests">
          <input
            type="number"
            min={1}
            max={20}
            value={form.number_of_guests}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                number_of_guests: Number(e.target.value),
              }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Property">
          <div className="border-[1.5px] border-sann-red/15 bg-sann-cream/40 px-3 py-2.5 rounded-sm text-sm text-sann-text">
            {form.preferred_unit}
          </div>
        </Field>
        <Field label="Guest name" wide>
          <input
            type="text"
            value={form.guest_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, guest_name: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Phone / LINE">
          <input
            type="tel"
            value={form.phone_line}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone_line: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            className={inputCls}
          />
        </Field>
      </div>
      <Field label="Message">
        <textarea
          value={form.message}
          onChange={(e) =>
            setForm((f) => ({ ...f, message: e.target.value }))
          }
          rows={4}
          className={inputCls}
          placeholder="Anything we should know? Arrival time, special requests, etc."
        />
      </Field>

      {error && (
        <p className="text-sann-red text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-sann-red hover:bg-sann-red-dk text-white py-3.5 rounded-sm text-[0.78rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Booking Request →"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full border-[1.5px] border-sann-red/15 bg-white px-3 py-2.5 rounded-sm text-sm text-sann-text outline-none focus:border-sann-red transition-colors";

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}
