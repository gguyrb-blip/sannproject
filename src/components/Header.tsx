"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/lib/site-data";
import { useSiteLang, type SiteLang } from "@/lib/site-lang";

const NAV: { th: string; en: string; href: string }[] = [
  { en: "Properties", th: "ที่พัก", href: "/#properties" },
  { en: "About", th: "เกี่ยวกับเรา", href: "/#about" },
  { en: "Gallery", th: "แกลเลอรี", href: "/gallery" },
  { en: "Check-in", th: "เช็คอิน", href: "/checkin" },
  { en: "Location", th: "ที่ตั้ง", href: "/location" },
  { en: "FAQ", th: "คำถาม", href: "/#faq" },
];
const BOOK = { th: "จองเลย", en: "Book Now" };

/** ไทย | EN — what used to be a label reading "EN" that switched nothing. */
function LangSwitch({ lang, set, className = "" }: { lang: SiteLang; set: (l: SiteLang) => void; className?: string }) {
  return (
    <span role="group" aria-label="Language" className={`inline-flex items-center rounded-full border border-sann-line p-0.5 text-xs ${className}`}>
      {(["th", "en"] as SiteLang[]).map(l => (
        <button key={l} type="button" onClick={() => set(l)} aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${lang === l ? "bg-sann-text text-white" : "text-sann-text-lt hover:text-sann-text"}`}>
          {l === "th" ? "ไทย" : "EN"}
        </button>
      ))}
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useSiteLang();
  return (
    <header className="sticky top-0 z-[100] bg-[rgba(248,246,242,0.85)] backdrop-blur-md border-b border-sann-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Sann Stay home" className="flex items-center">
          <Image src={LOGO.primary} alt="Sann Stay" width={400} height={90} className="h-5 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-sann-text">
          {NAV.map((n) => (
            <Link key={n.en} href={n.href} className="hover:text-sann-red transition-colors">
              {n[lang]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitch lang={lang} set={setLang} className="hidden sm:inline-flex" />
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center bg-sann-text text-white text-[0.8rem] font-medium px-4 py-2.5 rounded-xl hover:bg-sann-red transition-colors"
          >
            {BOOK[lang]}
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
            <Link key={n.en} href={n.href} onClick={() => setOpen(false)} className="py-3 text-sann-text border-b border-sann-line/60">
              {n[lang]}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3">
            <LangSwitch lang={lang} set={setLang} />
          </div>
          <Link href="/book" onClick={() => setOpen(false)} className="mt-3 mb-1 text-center bg-sann-red text-white font-semibold py-3 rounded-xl">
            {BOOK[lang]}
          </Link>
        </div>
      )}
    </header>
  );
}
