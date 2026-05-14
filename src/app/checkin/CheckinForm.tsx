"use client";

import { useState } from "react";
import { BOOKING_CHANNELS } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export default function CheckinForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    booking_name: "",
    booking_channel: "Direct Booking",
    check_in_date: today(),
    check_out_date: tomorrow(),
    number_of_guests: 2,
    guest_full_name: "",
    phone: "",
    email: "",
    nationality: "",
    id_passport_number: "",
    estimated_arrival_time: "",
    special_requests: "",
    consent: false,
  });

  if (done) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-10 text-center shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
        <p className="font-display text-2xl text-sann-red mb-3">Submitted</p>
        <p className="text-sann-text-md leading-[1.7]">
          Thank you. Your online check-in has been submitted. Our team will
          review your information and send the self check-in details shortly.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.consent) {
      setError("Please confirm the consent checkbox before submitting.");
      return;
    }
    if (!file) {
      setError("Please upload a photo of your ID or passport.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large (max 10 MB).");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("payload", JSON.stringify(form));
      const res = await fetch("/api/checkins", { method: "POST", body: data });
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
      <Field label="Booking name (as on Airbnb / Booking.com)" wide>
        <input
          type="text"
          value={form.booking_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, booking_name: e.target.value }))
          }
          className={inputCls}
          required
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Booking channel">
          <select
            value={form.booking_channel}
            onChange={(e) =>
              setForm((f) => ({ ...f, booking_channel: e.target.value }))
            }
            className={inputCls}
          >
            {BOOKING_CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
        <Field label="Guest full name" wide>
          <input
            type="text"
            value={form.guest_full_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, guest_full_name: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Phone number">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
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
            required
          />
        </Field>
        <Field label="Nationality">
          <input
            type="text"
            value={form.nationality}
            onChange={(e) =>
              setForm((f) => ({ ...f, nationality: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="ID / Passport number">
          <input
            type="text"
            value={form.id_passport_number}
            onChange={(e) =>
              setForm((f) => ({ ...f, id_passport_number: e.target.value }))
            }
            className={inputCls}
            required
          />
        </Field>
        <Field label="Estimated arrival time" wide>
          <input
            type="text"
            placeholder="e.g. 16:30 by car"
            value={form.estimated_arrival_time}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                estimated_arrival_time: e.target.value,
              }))
            }
            className={inputCls}
            required
          />
        </Field>
      </div>

      <Field label="Special requests">
        <textarea
          value={form.special_requests}
          onChange={(e) =>
            setForm((f) => ({ ...f, special_requests: e.target.value }))
          }
          rows={3}
          className={inputCls}
        />
      </Field>

      <Field label="Upload ID / passport image" wide>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-sann-text-md file:mr-3 file:px-4 file:py-2 file:rounded-sm file:border-0 file:bg-sann-red file:text-white file:font-semibold file:text-[0.7rem] file:tracking-[0.14em] file:uppercase"
          required
        />
        {file && (
          <span className="text-xs text-sann-text-lt mt-1">
            {file.name} ({Math.round(file.size / 1024)} KB)
          </span>
        )}
      </Field>

      <label className="flex gap-3 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) =>
            setForm((f) => ({ ...f, consent: e.target.checked }))
          }
          className="mt-1 accent-sann-red w-4 h-4 flex-shrink-0"
        />
        <span className="text-xs text-sann-text-md leading-[1.6]">
          I confirm that the information provided is accurate and agree that
          SANN may use this information for check-in and guest verification
          purposes.
        </span>
      </label>

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
        {submitting ? "Submitting…" : "Submit Check-in →"}
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
