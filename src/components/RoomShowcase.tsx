"use client";

// The "Rooms" section of a property page. Everything here — names, bed lines,
// blurbs, photos, facilities, rates — comes from the PMS, so staff maintain it
// in Admin → Rooms and this page follows. Availability is deliberately NOT
// shown: a property page has no dates, and implying a room is free would be a
// promise we cannot keep. The dates live one click away, in /book.
import { useState } from "react";
import Link from "next/link";
import { PhotoStrip, PhotoViewer } from "./RoomGallery";

export type ShowcaseRoom = {
  key: string;
  kind: "whole" | "dorm" | "room";
  label: string;
  bedInfo: string | null;
  description: string | null;
  photos: string[];
  amenities: { key: string; th: string; en: string; icon: string }[];
  capacity: number;
  bedCount: number | null;
  priceFrom: number;
};

const baht = (n: number) => `฿${n.toLocaleString("en-US")}`;

export default function RoomShowcase({ rooms, bookHref, wholeLabel = "The whole house" }: {
  rooms: ShowcaseRoom[];
  bookHref: string;
  /** A whole-property stay carries the property's own name in the PMS, which
   *  would just repeat the page title here. */
  wholeLabel?: string;
}) {
  const [viewer, setViewer] = useState<{ photos: string[]; label: string; start: number } | null>(null);
  if (rooms.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {rooms.map((r) => (
        <article key={r.key} className="rv bg-white border border-sann-red/10 rounded-sann-md overflow-hidden">
          {r.photos.length > 0 && (
            <PhotoStrip photos={r.photos} label={r.label} viewLabel="View photos"
              className="p-1.5 bg-sann-cream/60 border-b border-sann-line/70"
              onOpen={(i) => setViewer({ photos: r.photos, label: r.label, start: i })} />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-[55%]">
                <h3 className="font-display text-lg text-sann-text">
                  {r.kind === "whole" ? wholeLabel : r.label}
                </h3>
                <p className="text-[0.72rem] text-sann-text-lt mt-1">
                  {r.kind === "dorm"
                    ? `${r.bedCount ?? ""} beds · sold per bed`.trim()
                    : `Sleeps up to ${r.capacity}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[0.62rem] tracking-[0.14em] uppercase text-sann-text-lt">From</p>
                <p className="font-display text-xl text-sann-red">
                  {baht(r.priceFrom)}
                  <span className="text-[0.68rem] font-normal text-sann-text-lt">
                    {r.kind === "dorm" ? " / bed / night" : " / night"}
                  </span>
                </p>
              </div>
            </div>

            {r.bedInfo && <p className="text-[0.82rem] text-sann-text-md mt-3">🛏 {r.bedInfo}</p>}
            {r.description && (
              <p className="text-[0.82rem] text-sann-text-md leading-[1.7] mt-2 whitespace-pre-line">{r.description}</p>
            )}

            {r.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {r.amenities.map((a) => (
                  <span key={a.key}
                    className="inline-flex items-center gap-1 rounded-full border border-sann-line bg-sann-off px-2.5 py-1 text-[0.7rem] text-sann-text-md">
                    <span aria-hidden>{a.icon}</span>{a.en}
                  </span>
                ))}
              </div>
            )}

            <Link href={bookHref}
              className="inline-flex mt-5 text-[0.65rem] tracking-[0.14em] uppercase text-sann-red font-semibold border-b border-sann-red/30 pb-px">
              Check dates & book
            </Link>
          </div>
        </article>
      ))}

      {viewer && (
        <PhotoViewer photos={viewer.photos} start={viewer.start} label={viewer.label}
          onClose={() => setViewer(null)} />
      )}
    </div>
  );
}
