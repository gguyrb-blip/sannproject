"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const touchStartX = useRef(0);

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <div
      className="relative h-[280px] overflow-hidden bg-sann-beige-2"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1);
      }}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="min-w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Previous image"
        className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 shadow-md z-[2] flex items-center justify-center text-sann-text"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next image"
        className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 shadow-md z-[2] flex items-center justify-center text-sann-text"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-[2]">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-[18px] bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(42,31,24,0.3)_0%,transparent_40%)]" />
    </div>
  );
}
