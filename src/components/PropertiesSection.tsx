import Link from "next/link";
import { PROPERTIES, CONTACT, type Property } from "@/lib/site-data";
import { ArrowR } from "./icons";

export default function PropertiesSection() {
  return (
    <section id="properties" className="bg-sann-bg2 px-5 sm:px-8 lg:px-14 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
          <div>
            <div className="font-mono text-xs text-sann-text-lt tracking-[0.18em] uppercase mb-2.5">Our properties</div>
            <h2 className="font-display font-normal text-4xl lg:text-[3.4rem] leading-[1.05] text-sann-text m-0">
              Two unique stays in <i className="text-sann-red">Hat Yai</i>
            </h2>
          </div>
          <p className="max-w-sm text-sann-text-lt text-sm leading-relaxed">
            A 4-bedroom home for groups, and a hostel for solo travellers — both
            within 10 minutes of Hat Yai&apos;s best food, markets, and transport.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {PROPERTIES.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ p }: { p: Property }) {
  const soon = p.status === "coming-soon";
  // Every open property now has its own page; the Malay article is Hatyai-only.
  const href = p.pageHref;
  const linkable = !soon;
  const isHatyai = p.id === "sann-stay-hatyai";
  return (
    <div className="bg-sann-card rounded-sann-xl overflow-hidden flex flex-col shadow-sann-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        {linkable ? (
          <Link href={href} className="block w-full h-full group" aria-label={`View ${p.name}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={p.images[0]}
            alt={p.name}
            className={`w-full h-full object-cover ${soon ? "grayscale-[.4] brightness-90" : ""}`}
          />
        )}
        <div
          className={`absolute top-3.5 left-3.5 px-3 py-1.5 text-[0.68rem] font-mono tracking-[0.12em] uppercase rounded-md text-white pointer-events-none ${
            soon ? "bg-[rgba(20,12,8,.7)]" : "bg-sann-red"
          }`}
        >
          {soon ? "Opening soon" : "Now open"}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-3.5 flex-1">
        <div>
          <div className="font-display text-3xl leading-tight text-sann-text">
            {linkable ? (
              <Link href={href} className="hover:text-sann-red transition-colors">
                {p.name}
              </Link>
            ) : (
              p.name
            )}
          </div>
          <div className="text-[0.82rem] text-sann-text-lt mt-1.5">{p.location}</div>
        </div>

        <p className="text-sm text-sann-text leading-relaxed m-0">{p.description}</p>

        {isHatyai && (
          <Link
            href="/ms/penginapan-hatyai-dekat-lee-garden"
            className="text-[0.82rem] text-sann-red font-medium underline underline-offset-2 hover:text-sann-red-dk -mt-0.5"
          >
            🇲🇾 Untuk family Malaysia — baca dalam Bahasa Melayu →
          </Link>
        )}

        <div className="grid grid-cols-2 gap-2 mt-1">
          {p.amenities.slice(0, 4).map((a) => (
            <div key={a} className="flex items-center gap-2 text-[0.82rem] text-sann-text">
              {a}
            </div>
          ))}
        </div>

        <div className="h-px bg-sann-line my-2" />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-2xl font-medium text-sann-text">{p.price}</div>
            <div className="text-[0.68rem] text-sann-text-lt">{p.priceUnit}</div>
          </div>
          {soon ? (
            <button disabled className="bg-white border border-sann-line text-sann-text/70 text-sm px-4 py-2.5 rounded-xl opacity-70 cursor-default">
              Join waitlist
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link href={href} className="text-sm text-sann-text-md hover:text-sann-red border-b border-sann-line pb-px transition-colors">
                Details
              </Link>
              <Link href="/book" className="inline-flex items-center gap-1.5 bg-sann-text hover:bg-sann-red text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                Book now <ArrowR size={14} />
              </Link>
            </div>
          )}
        </div>

        {!soon && (
          <div className="flex flex-wrap gap-2 mt-1">
            {p.airbnbUrl && <Chip href={p.airbnbUrl}>🏠 Airbnb</Chip>}
            {p.bookingUrl && <Chip href={p.bookingUrl}>📘 Booking.com</Chip>}
            <Chip href={CONTACT.lineUrl}>💬 LINE</Chip>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[0.7rem] text-sann-text border border-sann-line bg-white rounded-full px-2.5 py-1 hover:border-sann-red transition-colors"
    >
      {children}
    </a>
  );
}
