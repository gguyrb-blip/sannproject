"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GALLERY, type GalleryPhoto } from "@/lib/site-data";

const CATS = GALLERY.filter((c) => c.photos.length > 0);

export default function GalleryGrid() {
  const [active, setActive] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Flat list of photos for the active filter (each carries its category label)
  const photos = useMemo<(GalleryPhoto & { cat: string })[]>(() => {
    const cats = active === "all" ? CATS : CATS.filter((c) => c.key === active);
    return cats.flatMap((c) => c.photos.map((p) => ({ ...p, cat: c.label })));
  }, [active]);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => setLightbox((i) => (i === null ? i : (i + 1) % photos.length)), [photos.length]);
  const prev = useCallback(() => setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, next, prev]);

  const current = lightbox !== null ? photos[lightbox] : null;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[{ key: "all", label: "All · ทั้งหมด" }, ...CATS].map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === c.key
                ? "bg-sann-red text-white border-sann-red"
                : "bg-white text-sann-text border-sann-line hover:border-sann-red/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photos.map((p, i) => (
          <figure key={p.src + i} className="group flex flex-col">
            <button
              onClick={() => setLightbox(i)}
              className="relative block w-full aspect-[4/3] rounded-sann-md overflow-hidden cursor-zoom-in"
              aria-label={`View ${p.title}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${p.src}')` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(20,12,8,.45)_100%)]" />
              <span className="absolute bottom-3 left-3 text-white text-[0.8rem] font-medium drop-shadow">
                {p.title}
              </span>
            </button>
            <figcaption className="mt-3 px-0.5">
              <div className="text-sann-text font-medium text-[0.95rem]">{p.title}</div>
              <p className="text-sann-text-md text-[0.85rem] leading-[1.6] mt-1">{p.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
        >
          <button onClick={close} aria-label="Close" className="absolute top-4 right-5 text-white/80 hover:text-white text-3xl leading-none">×</button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-4xl leading-none px-2">‹</button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-4xl leading-none px-2">›</button>
          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.title} className="w-full max-h-[72vh] object-contain rounded-sann-md" />
            <figcaption className="mt-4 text-center">
              <div className="text-white font-medium">{current.title} <span className="text-white/50 text-sm">· {current.cat}</span></div>
              <p className="text-white/80 text-sm leading-[1.7] mt-1.5 max-w-2xl mx-auto">{current.description}</p>
              <div className="text-white/40 text-xs mt-2">{(lightbox ?? 0) + 1} / {photos.length}</div>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
