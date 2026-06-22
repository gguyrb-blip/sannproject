"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/lib/site-data";

const NAV = [
  { label: "Properties", href: "/#properties" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Check-in", href: "/checkin" },
  { label: "Location", href: "/location" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[100] bg-[rgba(248,246,242,0.85)] backdrop-blur-md border-b border-sann-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Sann Stay home" className="flex items-center">
          <Image src={LOGO.primary} alt="Sann Stay" width={400} height={90} className="h-5 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-sann-text">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="hover:text-sann-red transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-sann-text-lt border border-sann-line rounded-full px-3 py-1.5">
            EN
          </span>
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center bg-sann-text text-white text-[0.8rem] font-medium px-4 py-2.5 rounded-xl hover:bg-sann-red transition-colors"
          >
            Book Now
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Menu"
          >
            <span className="w-5 h-0.5 bg-sann-text rounded-full" />
            <span className="w-5 h-0.5 bg-sann-text rounded-full" />
            <span className="w-5 h-0.5 bg-sann-text rounded-full" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-sann-line bg-sann-cream px-5 py-3 flex flex-col">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-3 text-sann-text border-b border-sann-line/60">
              {n.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} className="mt-3 mb-1 text-center bg-sann-red text-white font-semibold py-3 rounded-xl">
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
