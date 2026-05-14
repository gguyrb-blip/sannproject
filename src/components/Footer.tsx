import Link from "next/link";
import { CONTACT } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="bg-sann-text text-sann-beige-2 px-6 lg:px-20 pt-16 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12">
        <div>
          <p className="font-display text-xl text-sann-beige mb-3">
            Sann <span className="italic text-sann-red-lt">Stay</span>
          </p>
          <p className="text-[0.82rem] text-sann-beige-2/50 leading-[1.75] max-w-[260px]">
            Boutique accommodation in the best locations of Hat Yai, Thailand.
          </p>
          <div className="flex gap-4 mt-5">
            <a
              href="#"
              className="text-[0.65rem] tracking-[0.15em] uppercase text-sann-beige-2/35 hover:text-sann-beige transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[0.65rem] tracking-[0.15em] uppercase text-sann-beige-2/35 hover:text-sann-beige transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://www.airbnb.com/rooms/1672362046238838999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] tracking-[0.15em] uppercase text-sann-beige-2/35 hover:text-sann-beige transition-colors"
            >
              Airbnb
            </a>
            <a
              href={CONTACT.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] tracking-[0.15em] uppercase text-sann-beige-2/35 hover:text-sann-beige transition-colors"
            >
              LINE
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red-lt font-semibold mb-4 opacity-75">
            Properties
          </h4>
          <ul className="flex flex-col gap-2 list-none text-[0.82rem]">
            <li>
              <Link
                href="/#properties"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                Sann Stay Hatyai
              </Link>
            </li>
            <li>
              <Link
                href="/#properties"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                Sann Thung Sao
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red-lt font-semibold mb-4 opacity-75">
            Guests
          </h4>
          <ul className="flex flex-col gap-2 list-none text-[0.82rem]">
            <li>
              <Link
                href="/book"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                Book a Stay
              </Link>
            </li>
            <li>
              <Link
                href="/checkin"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                Online Check-in
              </Link>
            </li>
            <li>
              <Link
                href="/location"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                Getting Here
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red-lt font-semibold mb-4 opacity-75">
            Contact
          </h4>
          <ul className="flex flex-col gap-2 list-none text-[0.82rem]">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sann-beige-2/45 hover:text-sann-beige transition-colors"
              >
                LINE: {CONTACT.lineHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sann-beige-2/10 pt-6 flex flex-col sm:flex-row gap-2 sm:justify-between text-[0.7rem] text-sann-beige-2/25">
        <p>© {new Date().getFullYear()} Sann Stay. All rights reserved.</p>
        <p>Made with ♥ in Hat Yai</p>
      </div>
    </footer>
  );
}
