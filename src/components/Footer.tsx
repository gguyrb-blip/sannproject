import Link from "next/link";
import Image from "next/image";
import { CONTACT, LOGO } from "@/lib/site-data";

const SOCIAL = [
  { label: "Instagram", letter: "I", href: "https://www.instagram.com/sannstay.hatyai/" },
  { label: "Facebook", letter: "F", href: "https://www.facebook.com/people/sann-stay/61565234153610/" },
  { label: "TikTok", letter: "T", href: "https://www.tiktok.com/@sannastayhatyai" },
  { label: "Airbnb", letter: "A", href: "https://www.airbnb.com/rooms/1672362046238838999" },
  { label: "LINE", letter: "L", href: CONTACT.lineUrl },
];

export default function Footer() {
  return (
    <footer className="bg-sann-bg2 border-t border-sann-line px-5 sm:px-8 lg:px-14 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 lg:gap-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Image src={LOGO.primary} alt="Sann Stay" width={400} height={90} className="h-6 w-auto" />
            <p className="text-sm text-sann-text-lt leading-relaxed mt-4 max-w-[280px]">
              Boutique accommodation in the best locations of Hat Yai, Thailand.
            </p>
            <div className="flex gap-2.5 mt-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="w-9 h-9 rounded-[10px] border border-sann-line bg-white flex items-center justify-center text-xs text-sann-text hover:border-sann-red hover:text-sann-red transition-colors"
                >
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Properties">
            <Link href="/sann-stay-hatyai">Sann Stay Hatyai</Link>
            <Link href="/sann-thungsao-hostel">Sann Thungsao Hostel</Link>
          </FooterCol>
          <FooterCol title="Guests">
            <Link href="/book">Book a Stay</Link>
            <Link href="/checkin">Online Check-in</Link>
            <Link href="/location">Getting Here</Link>
            <a href="/#faq">FAQ</a>
          </FooterCol>
          <FooterCol title="Contact" mono>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer">LINE {CONTACT.lineHandle}</a>
          </FooterCol>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pt-6 border-t border-sann-line text-xs text-sann-text-lt">
          <div>
            {/* Operating entity — required on the pages that take payment. */}
            <div className="text-sann-text">SANN ASCENT CO., LTD.</div>
            <div className="font-mono text-[0.68rem] mt-0.5">
              Company Registration No. 0905569003322
            </div>
            <div className="mt-1.5">© {new Date().getFullYear()} Sann Stay · Made with ♥ in Hat Yai</div>
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-sann-red transition-colors">Privacy Notice</Link>
            <Link href="/privacy" className="hover:text-sann-red transition-colors">TM.30 &amp; ร.ร.4</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, mono }: { title: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[0.62rem] text-sann-text-lt tracking-[0.16em] uppercase mb-3.5">{title}</div>
      <div className={`flex flex-col gap-2.5 text-[0.82rem] text-sann-text [&_a:hover]:text-sann-red [&_a]:transition-colors ${mono ? "font-mono" : ""}`}>
        {children}
      </div>
    </div>
  );
}
