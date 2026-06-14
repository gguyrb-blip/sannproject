import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SANN Stay Hatyai · Contact & Links",
  description:
    "Book SANN Stay Hatyai and reach us on WhatsApp, Instagram, Facebook, and TikTok.",
};

// ── Brand-glyph icons ──
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.288-.819zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E1306C" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="#E1306C" stroke="none" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#111" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.3 0 .59.05.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

const LINKS = [
  { title: "WhatsApp", sub: "+66 62 945 5541", href: "https://wa.me/66629455541", tint: "rgba(37,211,102,0.12)", icon: <WhatsAppIcon /> },
  { title: "Instagram", sub: "@sannstay.hatyai", href: "https://www.instagram.com/sannstay.hatyai/", tint: "rgba(225,48,108,0.10)", icon: <InstagramIcon /> },
  { title: "Facebook", sub: "SANN Stay", href: "https://www.facebook.com/people/sann-stay/61565234153610/", tint: "rgba(24,119,242,0.10)", icon: <FacebookIcon /> },
  { title: "TikTok", sub: "@sannastayhatyai", href: "https://www.tiktok.com/@sannastayhatyai", tint: "rgba(0,0,0,0.06)", icon: <TikTokIcon /> },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-12 bg-gradient-to-b from-[#faf6ee] to-[#f0e6d4]">
      <div className="relative w-full max-w-[420px] bg-white rounded-[28px] border border-sann-red/10 px-6 pb-8 pt-16 shadow-[0_22px_60px_rgba(42,31,24,0.14)]">
        {/* Logo badge */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sann-badge.png" alt="SANN Stay" className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-3xl text-sann-red tracking-wide">SANN Stay</h1>
          <p className="text-[0.68rem] tracking-[0.3em] uppercase text-sann-text-lt mt-1.5">Hat Yai · Thailand</p>
          <p className="text-sann-text-md text-sm italic mt-3">A good stay feels like coming home.</p>
        </div>

        {/* Photo */}
        <div className="mt-5 h-36 rounded-2xl overflow-hidden bg-[#efe7d6]">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.jpg')" }} />
        </div>

        {/* Book now (primary) */}
        <a href="https://www.sannstay.com/book" target="_blank" rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 bg-sann-red hover:bg-sann-red-dk text-white font-bold tracking-[0.14em] uppercase text-sm py-4 rounded-2xl shadow-[0_8px_22px_rgba(197,49,18,0.30)] transition-colors">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" />
          </svg>
          Book Now
        </a>

        {/* Contact / social links */}
        <div className="mt-3 flex flex-col gap-2.5">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white border border-sann-red/[0.12] hover:border-sann-red/40 rounded-2xl px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: l.tint }}>
                {l.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-sann-text leading-tight">{l.title}</span>
                <span className="block text-[0.72rem] text-sann-text-lt truncate">{l.sub}</span>
              </span>
              <span className="text-sann-text-lt group-hover:text-sann-red transition-colors"><ArrowIcon /></span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[0.7rem] text-sann-text-lt mt-7">
          <a href="https://www.sannstay.com" target="_blank" rel="noopener noreferrer" className="text-sann-red font-semibold">sannstay.com</a>
          {" · Hat Yai, Songkhla"}
        </p>
      </div>
    </main>
  );
}
