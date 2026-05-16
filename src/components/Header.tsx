"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBookingModal } from "./BookingModalProvider";
import MobileNav from "./MobileNav";
import { LOGO } from "@/lib/site-data";

const NAV_LINKS = [
  { href: "/#properties", label: "Properties" },
  { href: "/#about", label: "About" },
  { href: "/checkin", label: "Check-in" },
  { href: "/location", label: "Location" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useBookingModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(253,249,244,0.97)] backdrop-blur-md border-b border-sann-red/10 shadow-[0_2px_16px_rgba(197,49,18,0.05)]"
            : "bg-transparent"
        }`}
      >
        <Link href="/" aria-label="Sann Stay home" className="flex items-center">
          <Image
            src={LOGO.primary}
            alt="Sann Stay"
            width={120}
            height={36}
            priority
            className="h-7 lg:h-8 w-auto"
          />
        </Link>

        <ul className="hidden lg:flex gap-8 list-none">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[0.73rem] tracking-[0.15em] uppercase text-sann-text-md hover:text-sann-red transition-colors font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => open()}
            className="bg-sann-red hover:bg-sann-red-dk text-white px-5 py-2 rounded-sm text-[0.72rem] tracking-[0.14em] uppercase font-semibold transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex flex-col gap-[5px] p-1"
            aria-label="Open menu"
          >
            <span className="w-6 h-[1.5px] bg-sann-red" />
            <span className="w-6 h-[1.5px] bg-sann-red" />
            <span className="w-6 h-[1.5px] bg-sann-red" />
          </button>
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        onBookClick={() => {
          setMobileOpen(false);
          open();
        }}
      />
    </>
  );
}
