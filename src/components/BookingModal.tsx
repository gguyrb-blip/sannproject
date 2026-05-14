"use client";

import { useEffect, useState } from "react";
import { useBookingModal } from "./BookingModalProvider";
import { PREFERRED_UNITS } from "@/lib/types";

const todayISO = () => new Date().toISOString().split("T")[0];
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export default function BookingModal() {
  const { isOpen, close, preferredUnit } = useBookingModal();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    preferred_unit: preferredUnit ?? "Sann Stay Hatyai",
    number_of_guests: 2,
    check_in_date: todayISO(),
    check_out_date: tomorrowISO(),
    guest_name: "",
    email: "",
    phone_line: "",
    message: "",
  });

  useEffect(() => {
    if (preferredUnit) {
      setForm((f) => ({ ...f, preferred_unit: preferredUnit }));
    }
  }, [preferredUnit]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setDone(false);
        setError(null);
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.guest_name || !form.phone_line) {
      setError("Please fill in your name and phone number.");
      return;
    }
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
    <div
      className="fixed inset-0 z-[200] bg-[rgba(42,31,24,0.65)] backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="bg-sann-off w-full max-w-[480px] rounded border border-sann-red/10 shadow-[0_28px_70px_rgba(42,31,24,0.22)] overflow-hidden animate-[fadeUp_0.35s_ease]">
        <div className="bg-sann-red px-6 py-4 flex justify-between items-start">
          <div>
            <h3 className="font-display text-white text-lg">Book Your Stay</h3>
            <p className="text-[0.7rem] text-sann-beige/80 mt-0.5">
              {form.preferred_unit}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="bg-transparent text-white/60 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <p className="font-display text-xl text-sann-red mb-3">
              Thank you!
            </p>
            <p className="text-sann-text-md text-sm leading-[1.7]">
              Thank you for your interest in staying with SANN. Our team will
              check availability and get back to you shortly.
            </p>
            <button
              onClick={close}
              className="mt-6 bg-sann-red hover:bg-sann-red-dk text-white px-7 py-3 rounded-sm text-[0.73rem] tracking-[0.16em] uppercase font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="px-6 pt-5 pb-5 max-h-[70vh] overflow-y-auto"
          >
            <Field label="Preferred Unit">
              <select
                value={form.preferred_unit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, preferred_unit: e.target.value }))
                }
                className={inputCls}
              >
                {PREFERRED_UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
                {!(PREFERRED_UNITS as readonly string[]).includes(
                  form.preferred_unit,
                ) && <option>{form.preferred_unit}</option>}
              </select>
            </Field>
            <Field label="Guests">
              <select
                value={form.number_of_guests}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    number_of_guests: Number(e.target.value),
                  }))
                }
                className={inputCls}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Check In">
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
              <Field label="Check Out">
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
            </div>
            <Field label="Full Name">
              <input
                type="text"
                value={form.guest_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guest_name: e.target.value }))
                }
                placeholder="Your name"
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
                placeholder="08x-xxx-xxxx"
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
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Note">
              <input
                type="text"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Special requests"
                className={inputCls}
              />
            </Field>

            {error && (
              <p className="text-sann-red text-sm mt-2" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 w-full bg-sann-red hover:bg-sann-red-dk text-white py-3 rounded-sm text-[0.76rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Booking Request →"}
            </button>
          </form>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

const inputCls =
  "w-full border-[1.5px] border-sann-red/15 bg-white px-3 py-2 rounded-sm text-sm text-sann-text outline-none focus:border-sann-red transition-colors";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 mb-2.5">
      <span className="text-[0.55rem] tracking-[0.16em] uppercase text-sann-red font-semibold opacity-80">
        {label}
      </span>
      {children}
    </label>
  );
}
