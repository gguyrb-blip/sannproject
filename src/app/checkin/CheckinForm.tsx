"use client";

import { useEffect, useState } from "react";
import { BOOKING_CHANNELS } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const MAX_GUESTS = 12;

type GuestRow = {
  full_name: string;
  date_of_birth: string;
  id_passport_number: string;
  file: File | null;
};

const emptyGuest = (): GuestRow => ({
  full_name: "",
  date_of_birth: "",
  id_passport_number: "",
  file: null,
});

export default function CheckinForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    booking_name: "",
    booking_channel: "Direct Booking",
    check_in_date: today(),
    check_out_date: tomorrow(),
    number_of_guests: 2,
    phone: "",
    email: "",
    nationality: "",
    estimated_arrival_time: "",
    special_requests: "",
    consent: false,
  });

  const [guests, setGuests] = useState<GuestRow[]>(() => [
    emptyGuest(),
    emptyGuest(),
  ]);

  // Resize guests array when number_of_guests changes — keeping previously
  // entered data for indexes that still fit.
  useEffect(() => {
    setGuests((prev) => {
      const n = Math.max(1, Math.min(MAX_GUESTS, form.number_of_guests || 1));
      if (prev.length === n) return prev;
      if (prev.length < n) {
        return [...prev, ...Array.from({ length: n - prev.length }, emptyGuest)];
      }
      return prev.slice(0, n);
    });
  }, [form.number_of_guests]);

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

  const setGuest = (i: number, patch: Partial<GuestRow>) =>
    setGuests((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.consent) {
      setError("Please confirm the consent checkbox before submitting.");
      return;
    }

    for (let i = 0; i < guests.length; i += 1) {
      const g = guests[i];
      if (!g.full_name.trim()) {
        setError(`Guest ${i + 1}: please enter the full name.`);
        return;
      }
      if (!g.date_of_birth) {
        setError(`Guest ${i + 1}: please enter the date of birth.`);
        return;
      }
      if (!g.id_passport_number.trim()) {
        setError(`Guest ${i + 1}: please enter the ID / passport number.`);
        return;
      }
      if (!g.file) {
        setError(`Guest ${i + 1}: please upload an ID / passport photo.`);
        return;
      }
      if (g.file.size > 10 * 1024 * 1024) {
        setError(`Guest ${i + 1}: file is too large (max 10 MB).`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append(
        "payload",
        JSON.stringify({
          ...form,
          guests: guests.map((g) => ({
            full_name: g.full_name.trim(),
            date_of_birth: g.date_of_birth,
            id_passport_number: g.id_passport_number.trim(),
          })),
        }),
      );
      guests.forEach((g, i) => {
        if (g.file) data.append(`file_${i}`, g.file);
      });

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
      className="max-w-2xl mx-auto bg-white border border-sann-red/10 rounded p-6 lg:p-10 shadow-[0_10px_36px_rgba(42,31,24,0.06)] space-y-5"
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
            max={MAX_GUESTS}
            value={form.number_of_guests}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                number_of_guests: Math.max(
                  1,
                  Math.min(MAX_GUESTS, Number(e.target.value) || 1),
                ),
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
        <Field label="Primary contact phone">
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
        <Field label="Primary contact email">
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
        <Field label="Estimated arrival time">
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

      <div>
        <p className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red font-semibold mb-1">
          Guest Details
        </p>
        <p className="text-xs text-sann-text-md mb-3">
          Please fill out the information and upload an ID/passport for every
          guest staying.
        </p>

        <div className="space-y-4">
          {guests.map((g, i) => (
            <fieldset
              key={i}
              className="border border-sann-red/15 rounded p-4 bg-sann-cream/30"
            >
              <legend className="px-2 text-[0.62rem] tracking-[0.24em] uppercase text-sann-red font-semibold">
                Guest {i + 1}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full name" wide>
                  <input
                    type="text"
                    value={g.full_name}
                    onChange={(e) => setGuest(i, { full_name: e.target.value })}
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    type="date"
                    value={g.date_of_birth}
                    onChange={(e) =>
                      setGuest(i, { date_of_birth: e.target.value })
                    }
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="ID / Passport number">
                  <input
                    type="text"
                    value={g.id_passport_number}
                    onChange={(e) =>
                      setGuest(i, { id_passport_number: e.target.value })
                    }
                    className={inputCls}
                    required
                  />
                </Field>
              </div>
              <label className="flex flex-col gap-1 mt-3">
                <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
                  Upload ID / passport
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    setGuest(i, { file: e.target.files?.[0] ?? null })
                  }
                  className="block w-full text-sm text-sann-text-md file:mr-3 file:px-4 file:py-2 file:rounded-sm file:border-0 file:bg-sann-red file:text-white file:font-semibold file:text-[0.65rem] file:tracking-[0.14em] file:uppercase"
                  required
                />
                {g.file && (
                  <span className="text-xs text-sann-text-lt mt-1">
                    {g.file.name} ({Math.round(g.file.size / 1024)} KB)
                  </span>
                )}
              </label>
            </fieldset>
          ))}
        </div>
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
          SANN may use this information for check-in, guest verification, and
          accommodation reporting purposes. I also acknowledge and agree to
          follow the House Rules during my stay.
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
