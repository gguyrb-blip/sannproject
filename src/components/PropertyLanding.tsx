// One property, one page. Shared by /sann-stay-hatyai and /sann-thungsao-hostel
// so the two stay identical in structure and only the content differs.
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RevealOnScroll from "@/components/RevealOnScroll";
import RoomShowcase, { type ShowcaseRoom } from "@/components/RoomShowcase";
import { CONTACT } from "@/lib/site-data";
import type { PropertyPage } from "@/lib/property-pages";

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

type RoomsResponse = {
  property: { name: string; check_in_time: string | null; check_out_time: string | null };
  units: ShowcaseRoom[];
};

// The PMS is a separate deployment; if it is down or mid-deploy the page still
// has to render its own content, so a failure here is not fatal.
async function loadRooms(slug: string): Promise<RoomsResponse | null> {
  try {
    const r = await fetch(`${ADMIN_API}/api/public/rooms?property_slug=${slug}`, {
      next: { revalidate: 300 },
    });
    if (!r.ok) return null;
    return (await r.json()) as RoomsResponse;
  } catch {
    return null;
  }
}

function Section({ id, kicker, title, children }: {
  id?: string; kicker: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 lg:px-20 py-14 lg:py-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">{kicker}</p>
        <h2 className="font-display text-3xl lg:text-4xl text-sann-text mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default async function PropertyLanding({ page }: { page: PropertyPage }) {
  const data = await loadRooms(page.apiSlug);
  const rooms = data?.units ?? [];
  const bookHref = `/book?property=${page.apiSlug}`;

  return (
    <>
      <Header />
      <main className="bg-sann-off">
        {/* ── Hero ── */}
        <section className="relative pt-32 pb-16 px-6 lg:px-20">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
            <div>
              <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-3">
                {page.kicker}
              </p>
              <h1 className="font-display text-4xl lg:text-5xl text-sann-text leading-[1.1]">{page.name}</h1>
              <p className="font-serif italic text-lg text-sann-text-md mt-4">{page.tagline.en}</p>
              <p className="text-[0.82rem] text-sann-text-lt mt-1">{page.tagline.th}</p>
              <p className="text-[0.75rem] text-sann-text-lt mt-4">📍 {page.areaNote.en}</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href={bookHref}
                  className="inline-flex items-center bg-sann-text text-white text-[0.82rem] font-medium px-6 py-3 rounded-xl hover:bg-sann-red transition-colors">
                  Check dates & book
                </Link>
                <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center border border-sann-line text-sann-text text-[0.82rem] px-6 py-3 rounded-xl hover:border-sann-red hover:text-sann-red transition-colors">
                  Ask a question
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-sann-md overflow-hidden">
              <Image src={page.heroImage} alt={page.name} fill sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover" priority />
            </div>
          </div>
        </section>

        {/* ── About + highlights ── */}
        <section className="px-6 lg:px-20 pb-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10">
            <div className="rv">
              <p className="text-[0.9rem] text-sann-text-md leading-[1.85]">{page.intro.en}</p>
              <p className="text-[0.82rem] text-sann-text-lt leading-[1.9] mt-4">{page.intro.th}</p>
              {page.alsoSee && (
                <Link href={page.alsoSee.href}
                  className="inline-flex mt-5 text-[0.65rem] tracking-[0.14em] uppercase text-sann-red font-semibold border-b border-sann-red/30 pb-px">
                  {page.alsoSee.label}
                </Link>
              )}
            </div>
            <ul className="rv grid sm:grid-cols-2 lg:grid-cols-1 gap-2.5 content-start">
              {page.highlights.map((h) => (
                <li key={h.en} className="flex items-start gap-2.5 bg-white border border-sann-red/[0.07] rounded-sann-md px-4 py-3">
                  <span aria-hidden className="text-base leading-none mt-0.5">{h.icon}</span>
                  <span className="text-[0.82rem] text-sann-text-md">{h.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Rooms, live from the PMS ── */}
        {rooms.length > 0 && (
          <Section id="rooms" kicker="Rooms" title="Where you'll sleep">
            <RoomShowcase rooms={rooms} bookHref={bookHref} />
            {data?.property.check_in_time && data.property.check_out_time && (
              <p className="text-[0.75rem] text-sann-text-lt mt-6">
                Check-in from {data.property.check_in_time.slice(0, 5)} · check-out by {data.property.check_out_time.slice(0, 5)}
              </p>
            )}
          </Section>
        )}

        {/* ── Property gallery ── */}
        {page.gallery.length > 1 && (
          <Section kicker="Gallery" title="Around the property">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {page.gallery.map((src) => (
                <div key={src} className="rv relative aspect-[4/3] rounded-sann-md overflow-hidden">
                  <Image src={src} alt={page.name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Location ── */}
        <Section kicker="Location" title="Getting here">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
            <div className="rv rounded-sann-md overflow-hidden border border-sann-line aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
              <iframe src={page.mapEmbed} title={`Map — ${page.name}`} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[280px] border-0" />
            </div>
            <div className="rv">
              <p className="text-[0.85rem] text-sann-text-md">{page.areaNote.en}</p>
              <p className="text-[0.78rem] text-sann-text-lt mt-1">{page.address}</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {page.nearby.map((n) => (
                  <li key={n.name} className="border-b border-sann-line pb-2.5">
                    <p className="text-[0.85rem] text-sann-text font-medium">{n.name}</p>
                    <p className="text-[0.72rem] text-sann-text-lt">{n.desc}</p>
                  </li>
                ))}
              </ul>
              <a href={page.mapOpen} target="_blank" rel="noopener noreferrer"
                className="inline-flex mt-5 text-[0.65rem] tracking-[0.14em] uppercase text-sann-red font-semibold border-b border-sann-red/30 pb-px">
                Open in Google Maps
              </a>
            </div>
          </div>
        </Section>

        {/* ── Booking CTA ── */}
        <section className="px-6 lg:px-20 pb-20">
          <div className="max-w-5xl mx-auto bg-sann-cream border border-sann-red/10 rounded-sann-md px-6 lg:px-12 py-12 text-center">
            <h2 className="font-display text-3xl text-sann-text">Book direct, pay less</h2>
            <p className="text-[0.85rem] text-sann-text-md mt-3 max-w-xl mx-auto">
              Booking on sannstay.com skips the platform commission — you get our best rate,
              and free cancellation until 7 days before arrival.
            </p>
            <Link href={bookHref}
              className="inline-flex mt-7 items-center bg-sann-text text-white text-[0.85rem] font-medium px-8 py-3.5 rounded-xl hover:bg-sann-red transition-colors">
              Check availability
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <RevealOnScroll />
    </>
  );
}
