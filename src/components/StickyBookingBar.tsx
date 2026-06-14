"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyBookingBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth > 1024) {
        setShow(false);
        return;
      }
      setShow(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-[75] bg-sann-off border-t border-sann-red/10 px-5 py-2.5 sticky-safe shadow-[0_-4px_16px_rgba(42,31,24,0.08)] transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[0.55rem] tracking-[0.1em] uppercase text-sann-text-lt">
            From
          </span>
          <div className="font-display text-xl text-sann-red font-semibold">
            ฿3,500{" "}
            <span className="text-[0.7rem] text-sann-text-lt font-sans font-normal">
              / night
            </span>
          </div>
        </div>
        <Link
          href="/book"
          className="bg-sann-red text-white px-6 py-2.5 rounded-sm text-[0.7rem] tracking-[0.16em] uppercase font-bold whitespace-nowrap"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
