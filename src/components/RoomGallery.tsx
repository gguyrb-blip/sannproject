"use client";

// Room photography, shared by the booking engine and the property pages.
// Photos are uploaded per room in the PMS (Admin → Rooms) and arrive as plain
// URLs, in whatever mix of portrait and landscape the camera produced — so the
// strip fixes the HEIGHT and lets each photo keep its own width. Cropping them
// into one uniform box cut the tall ones in half.
import { useCallback, useEffect, useRef, useState } from "react";

export function PhotoStrip({ photos, label, viewLabel, onOpen, className = "" }: {
  photos: string[];
  label: string;
  viewLabel: string;
  onOpen: (i: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  // Widths only settle once the images decode, so re-measure on each load too.
  const check = useCallback(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollWidth > el.clientWidth + 8);
  }, []);
  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [check]);
  const nudge = (d: number) =>
    ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative">
      <div ref={ref} className={`no-scrollbar flex gap-1.5 overflow-x-auto snap-x scroll-smooth ${className}`}>
        {photos.map((src, i) => (
          <button key={src} type="button" onClick={() => onOpen(i)}
            aria-label={`${label} — ${viewLabel} ${i + 1}/${photos.length}`}
            className="relative shrink-0 snap-start rounded-[10px] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" onLoad={check}
              className="block h-40 sm:h-52 w-auto min-w-[5rem] max-w-[78vw] object-contain" />
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/55 text-white text-[0.65rem] px-2 py-0.5 pointer-events-none">
                📷 {photos.length > 1 ? `${photos.length} · ${viewLabel}` : viewLabel}
              </span>
            )}
          </button>
        ))}
      </div>
      {overflows && (
        <>
          <button type="button" aria-label="scroll left" onClick={() => nudge(-1)}
            className="hidden sm:grid place-items-center absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-sann-text shadow-sm border border-sann-line">‹</button>
          <button type="button" aria-label="scroll right" onClick={() => nudge(1)}
            className="hidden sm:grid place-items-center absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-sann-text shadow-sm border border-sann-line">›</button>
        </>
      )}
    </div>
  );
}

export function PhotoViewer({ photos, start, label, onClose }: {
  photos: string[]; start: number; label: string; onClose: () => void;
}) {
  const [i, setI] = useState(start);
  const go = useCallback((d: number) => setI((v) => (v + d + photos.length) % photos.length), [photos.length]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label={label}
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <button type="button" onClick={onClose} aria-label="close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white text-xl leading-none">×</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[i]} alt={label} onClick={(e) => e.stopPropagation()}
        className="max-h-[78vh] max-w-full object-contain rounded-sann-md" />
      <p className="text-white/80 text-xs mt-3">{label} · {i + 1}/{photos.length}</p>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="previous"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white text-2xl leading-none">‹</button>
          <button type="button" aria-label="next"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white text-2xl leading-none">›</button>
        </>
      )}
    </div>
  );
}
