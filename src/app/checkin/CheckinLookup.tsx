"use client";

// Online check-in, step one: which property, then which reservation.
//
// The guest never fills a form here — the PMS owns check-in, and each property
// does it differently. Once the reservation is verified this page hands over to
// the right place: Hatyai to its per-booking check-in form (whose link the PMS
// mints on the spot), Thungsao to the self check-in flow it already uses on site.
import { useEffect, useState } from "react";
import Image from "next/image";
import { PROPERTY_PAGES } from "@/lib/property-pages";
import { CONTACT } from "@/lib/site-data";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

type Found = {
  property: string;
  booking_ref: string;
  check_in_date: string;
  check_out_date: string;
  url: string;
};

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
  });

export default function CheckinLookup() {
  const [slug, setSlug] = useState<string | null>(null);
  const [ref, setRef] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);

  // The confirmation email links here as /checkin?ref=SANN00123 (optionally with
  // &property=), so the guest only has to confirm the name. The reservation
  // number alone is guessable, which is exactly why the name is still asked for.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const r = q.get("ref");
    if (r) setRef(r);
    const p = q.get("property");
    if (p && PROPERTY_PAGES.some((x) => x.apiSlug === p)) setSlug(p);
  }, []);

  const page = PROPERTY_PAGES.find((p) => p.apiSlug === slug) ?? null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !ref.trim() || !name.trim()) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch(`${ADMIN_API}/api/public/checkin-lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_slug: slug, ref: ref.trim(), name: name.trim(), lang: "en" }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Something went wrong — please try again."); return; }
      setFound(d as Found);
      // Hand straight over; the button below is the fallback if the browser
      // blocks the automatic navigation.
      setTimeout(() => { window.location.href = (d as Found).url; }, 1200);
    } catch {
      setError("Couldn't reach our system. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  // ── Handed over ──
  if (found) {
    return (
      <div className="max-w-md mx-auto bg-white border border-sann-red/10 rounded-sann-md p-7 text-center">
        <div className="w-12 h-12 rounded-full bg-sann-red/10 text-sann-red grid place-items-center mx-auto text-xl">✓</div>
        <h2 className="font-display text-2xl text-sann-text mt-4">Reservation found</h2>
        <p className="text-[0.8rem] text-sann-text-lt mt-1">พบการจองของคุณแล้ว</p>
        <dl className="text-sm text-sann-text-md mt-5 flex flex-col gap-1.5">
          <div className="flex justify-between gap-3"><dt className="text-sann-text-lt">Property</dt><dd>{found.property}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-sann-text-lt">Reservation</dt><dd className="font-mono">{found.booking_ref}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-sann-text-lt">Stay</dt><dd>{fmt(found.check_in_date)} → {fmt(found.check_out_date)}</dd></div>
        </dl>
        <p className="text-[0.78rem] text-sann-text-lt mt-5">Taking you to your check-in…</p>
        <a href={found.url}
          className="inline-flex mt-3 items-center bg-sann-text text-white text-[0.85rem] font-medium px-7 py-3 rounded-xl hover:bg-sann-red transition-colors">
          Continue to check-in
        </a>
      </div>
    );
  }

  // ── Step 1 · which property ──
  if (!slug) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-sm text-sann-text-md mb-1">Which stay are you checking in to?</p>
        <p className="text-center text-[0.8rem] text-sann-text-lt mb-6">คุณเช็คอินที่พักไหน</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROPERTY_PAGES.map((p) => (
            <button key={p.apiSlug} type="button" onClick={() => { setSlug(p.apiSlug); setError(null); }}
              className="group text-left bg-white border border-sann-red/10 rounded-sann-md overflow-hidden hover:border-sann-red transition-colors">
              <div className="relative aspect-[16/10]">
                <Image src={p.heroImage} alt={p.name} fill sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-4">
                <p className="font-display text-lg text-sann-text">{p.name}</p>
                <p className="text-[0.75rem] text-sann-text-lt mt-1">{p.areaNote.en}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2 · which reservation ──
  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="font-display text-xl text-sann-text">{page?.name}</p>
          <p className="text-[0.75rem] text-sann-text-lt">{page?.areaNote.en}</p>
        </div>
        <button type="button" onClick={() => { setSlug(null); setError(null); }}
          className="text-[0.72rem] text-sann-red underline underline-offset-2 shrink-0">Change</button>
      </div>

      <form onSubmit={submit} className="bg-white border border-sann-red/10 rounded-sann-md p-6 flex flex-col gap-4">
        <div>
          <label htmlFor="ref" className="block text-[0.78rem] font-medium text-sann-text">
            Reservation number
          </label>
          <p className="text-[0.72rem] text-sann-text-lt mb-1.5">
            หมายเลขการจอง — ours (SANN…) or the one from Booking.com / Airbnb
          </p>
          <input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} required
            autoComplete="off" spellCheck={false} placeholder="SANN00123"
            className="w-full px-3.5 py-2.5 rounded-sann-md border border-sann-line bg-sann-off text-sann-text font-mono text-sm focus:outline-none focus:border-sann-red" />
        </div>

        <div>
          <label htmlFor="name" className="block text-[0.78rem] font-medium text-sann-text">
            Name on the booking
          </label>
          <p className="text-[0.72rem] text-sann-text-lt mb-1.5">ชื่อผู้จอง — first or last name is enough</p>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required
            autoComplete="name" placeholder="Somchai"
            className="w-full px-3.5 py-2.5 rounded-sann-md border border-sann-line bg-sann-off text-sann-text text-sm focus:outline-none focus:border-sann-red" />
        </div>

        {error && (
          <p className="text-[0.8rem] text-sann-red bg-sann-red/[0.06] border border-sann-red/15 rounded-sann-md px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || !ref.trim() || !name.trim()}
          className="w-full bg-sann-text text-white text-[0.85rem] font-medium px-6 py-3 rounded-xl hover:bg-sann-red transition-colors disabled:opacity-50">
          {busy ? "Checking…" : "Find my reservation"}
        </button>

        <p className="text-[0.72rem] text-sann-text-lt text-center">
          Can&apos;t find it?{" "}
          <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="text-sann-red underline underline-offset-2">Message us on WhatsApp</a>
        </p>
      </form>
    </div>
  );
}
