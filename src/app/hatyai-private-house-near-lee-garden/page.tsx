import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { TESTIMONIALS, CONTACT } from "@/lib/site-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";
const PATH = "/hatyai-private-house-near-lee-garden";
const MS_PATH = "/ms/penginapan-hatyai-dekat-lee-garden";
const URL = `${SITE}${PATH}`;
const WHATSAPP = "https://wa.me/66629455541";
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p}`);

const TITLE = "SANN Stay Hatyai | 4BR Private House Near Lee Garden Plaza";
const DESC =
  "Stay at SANN Stay Hatyai, a private 4-bedroom house near Lee Garden Plaza. Perfect for families and groups up to 8 guests, with kitchen, self check-in, Wi-Fi and smart lock.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: PATH,
    languages: {
      "en": URL,
      "ms-MY": `${SITE}${MS_PATH}`,
      "x-default": URL,
    },
  },
  keywords: [
    "private house in Hat Yai near Lee Garden",
    "family accommodation Hat Yai",
    "group stay Hat Yai",
    "4 bedroom house Hat Yai",
    "Hat Yai homestay near Lee Garden",
    "whole house Hat Yai for family",
    "accommodation near Lee Garden Plaza",
    "บ้านพักหาดใหญ่ใกล้ลีการ์เด้น",
    "บ้านพักหาดใหญ่ทั้งหลัง",
    "ที่พักหาดใหญ่สำหรับครอบครัว",
    "ที่พักหาดใหญ่ 8 คน",
    "penginapan Hatyai dekat Lee Garden",
    "rumah sewa Hatyai untuk family",
  ],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: "Sann Stay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "SANN Stay Hatyai — private 4-bedroom house near Lee Garden Plaza in Hat Yai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is SANN Stay Hatyai near Lee Garden Plaza?",
    a: "Yes. SANN Stay Hatyai is approximately a 4-minute walk from Lee Garden Plaza, one of the most popular areas in Hat Yai.",
  },
  {
    q: "How many guests can stay at SANN Stay Hatyai?",
    a: "The house is suitable for families and groups of up to 8 guests.",
  },
  {
    q: "Is it a private house or shared accommodation?",
    a: "SANN Stay Hatyai is an entire private house, so guests can enjoy the whole property during their stay.",
  },
  {
    q: "How many bedrooms and bathrooms are available?",
    a: "The house has 4 bedrooms and 2 bathrooms.",
  },
  {
    q: "Is there a kitchen?",
    a: "Yes. The house includes a kitchen / kitchenette area for guest convenience.",
  },
  {
    q: "Is self check-in available?",
    a: "Yes. Guests can check in using a smart lock system and self check-in instructions.",
  },
  {
    q: "Is it suitable for Malaysian families?",
    a: "Yes. The house is suitable for Malaysian families and groups visiting Hat Yai, especially those who want to stay near Lee Garden Plaza.",
  },
  {
    q: "What places are nearby?",
    a: "Nearby places include Lee Garden Plaza, Kim Yong Market, Chue Chang Temple and other central Hat Yai attractions.",
  },
];

const HIGHLIGHTS = [
  { icon: "🏠", title: "Entire private house", desc: "The whole 4-bedroom home is yours — no shared spaces, no strangers." },
  { icon: "🛏️", title: "4 bedrooms · sleeps 8", desc: "Comfortable beds across four bedrooms, ideal for families and groups." },
  { icon: "🚿", title: "2 bathrooms", desc: "Two full bathrooms so the whole group can get ready with ease." },
  { icon: "🍳", title: "Kitchen & living room", desc: "Cook together and relax in a shared living area, just like home." },
  { icon: "🔑", title: "Smart lock self check-in", desc: "Arrive on your own schedule with keyless smart-lock entry." },
  { icon: "📍", title: "4 min to Lee Garden", desc: "Walk to Lee Garden Plaza, Kim Yong Market and central Hat Yai." },
];

const AMENITIES = [
  "Free high-speed Wi-Fi",
  "Air conditioning in every room",
  "Smart lock & self check-in",
  "Fully equipped kitchen",
  "Living room & dining area",
  "Washing machine",
  "Fresh linens & towels",
  "Hot shower",
  "Parking nearby",
];

const NEARBY = [
  { name: "Lee Garden Plaza", detail: "≈ 4-minute walk · shopping, dining & nightlife", emoji: "🛍️" },
  { name: "Kim Yong Market", detail: "Famous market for snacks, dried goods & souvenirs", emoji: "🧺" },
  { name: "Chue Chang Temple (Shrine)", detail: "Well-known local landmark and place to pray", emoji: "🛕" },
  { name: "Central Hat Yai", detail: "Cafés, street food and transport within easy reach", emoji: "🍜" },
];

const ROOMS = [
  {
    src: "/images/hatyai/1.jpg",
    alt: "Bedroom at SANN Stay Hatyai private house near Lee Garden Plaza",
    title: "Four cozy bedrooms",
    desc: "Each bedroom is air-conditioned with comfortable bedding — enough private space for the whole family or group.",
  },
  {
    src: "/images/hatyai/4.jpg",
    alt: "Living and dining area at SANN Stay Hatyai family house in Hat Yai",
    title: "Shared living & dining",
    desc: "Gather in the living room and dining area after a day exploring Hat Yai.",
  },
  {
    src: "/images/gallery-1.jpg",
    alt: "Kitchen and dining area at SANN Stay Hatyai whole house for families",
    title: "Kitchen for the group",
    desc: "Prepare meals together in the kitchen / kitchenette — perfect for longer family stays.",
  },
  {
    src: "/images/bathroom-1.png",
    alt: "Modern bathroom at SANN Stay Hatyai private 4-bedroom house in Hat Yai",
    title: "Two full bathrooms",
    desc: "Two clean, modern bathrooms with hot showers keep mornings stress-free for up to 8 guests.",
  },
];

export default function HatyaiHousePage() {
  const ratings = TESTIMONIALS.map((t) => t.rating).filter((n) => n > 0);
  const avg = ratings.length ? ratings.reduce((s, n) => s + n, 0) / ratings.length : 0;

  const lodgingLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${URL}#lodging`,
    name: "SANN Stay Hatyai",
    description: DESC,
    url: URL,
    image: [abs("/images/hero.jpg"), abs("/images/exterior-2.jpg"), abs("/images/hatyai/1.jpg")],
    telephone: "+66629455541",
    email: CONTACT.email,
    priceRange: "฿฿",
    currenciesAccepted: "THB",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hat Yai",
      addressRegion: "Songkhla",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.006212325779094,
      longitude: 100.47327252883606,
    },
    hasMap: "https://maps.app.goo.gl/JM118vZqP78M8Hm88",
    numberOfRooms: 4,
    petsAllowed: false,
    checkinTime: "15:00",
    checkoutTime: "12:00",
    tourBookingPage: `${SITE}/book`,
    amenityFeature: AMENITIES.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "https://schema.org/House",
      name: "Entire private 4-bedroom house",
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 2,
      occupancy: { "@type": "QuantitativeValue", maxValue: 8, unitText: "guests" },
    },
    ...(ratings.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(2),
            reviewCount: ratings.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    sameAs: [CONTACT.lineUrl].filter(Boolean),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main className="bg-sann-off text-sann-text">
        {/* ─── 1. HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] flex items-end overflow-hidden">
          <Image
            src="/images/hero.jpg"
            alt="SANN Stay Hatyai — private 4-bedroom house a short walk from Lee Garden Plaza in Hat Yai"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 pb-16 lg:pb-24 pt-40 text-white">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase font-semibold mb-4 text-white/85">
              SANN Stay Hatyai · Private House
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] max-w-3xl">
              Private 4-Bedroom House in Hat Yai, 4-Min Walk to{" "}
              <em className="italic text-sann-cream">Lee Garden Plaza</em>
            </h1>
            <p className="mt-6 font-serif italic text-lg lg:text-xl text-white/90 leading-[1.7] max-w-2xl">
              SANN Stay Hatyai is a private 4-bedroom house in the heart of Hat Yai, located just a short walk
              from Lee Garden Plaza. Designed for families and groups, the house offers comfortable bedrooms, a
              living area, kitchen, smart lock and self check-in for a convenient private stay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="bg-sann-red hover:bg-sann-red-dk text-white px-7 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Book Direct
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 hover:bg-white text-sann-text px-7 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <span>🛏️ 4 bedrooms</span>
              <span>🚿 2 bathrooms</span>
              <span>👨‍👩‍👧‍👦 Up to 8 guests</span>
              <span>🔑 Self check-in</span>
            </div>
          </div>
        </section>

        {/* language switch */}
        <div className="bg-sann-bg2 text-center py-3 px-6 text-sm text-sann-text-md">
          🇲🇾 Pelancong dari Malaysia?{" "}
          <Link
            href={MS_PATH}
            className="text-sann-red font-medium underline underline-offset-2 hover:text-sann-red-dk"
          >
            Baca dalam Bahasa Melayu
          </Link>
        </div>

        {/* ─── 2. WHY STAY ─────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Why stay here
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-normal leading-[1.15]">
            A whole house to yourselves in central Hat Yai
          </h2>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-6 opacity-40" />
          <p className="text-base lg:text-lg text-sann-text-md leading-[1.85]">
            Instead of separate hotel rooms, your family or group shares one private home. Cook together in the
            kitchen, relax in the living room, and spread out across four bedrooms — all just a four-minute walk
            from Lee Garden Plaza. With a smart lock and self check-in, you arrive on your own schedule and enjoy
            the kind of space, privacy and value a hotel simply can&apos;t offer. It&apos;s an easy, trustworthy{" "}
            <Link href="/book" className="text-sann-red underline underline-offset-2 hover:text-sann-red-dk">
              family accommodation in Hat Yai
            </Link>{" "}
            for groups who want to stay close to everything.
          </p>
        </section>

        {/* ─── 3. PROPERTY HIGHLIGHTS ──────────────────────────── */}
        <section className="bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-center mb-12">
              Property highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="bg-white rounded-lg border border-sann-red/10 p-6 shadow-[0_8px_28px_rgba(42,31,24,0.05)]"
                >
                  <div className="text-3xl mb-3">{h.icon}</div>
                  <h3 className="font-display text-lg text-sann-text mb-1.5">{h.title}</h3>
                  <p className="text-sm text-sann-text-md leading-[1.7]">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. ROOM LAYOUT ──────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Inside the house
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal">Room layout</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {ROOMS.map((r) => (
              <article key={r.title} className="overflow-hidden rounded-lg border border-sann-red/10 bg-white">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={r.src}
                    alt={r.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-sann-text mb-1">{r.title}</h3>
                  <p className="text-sm text-sann-text-md leading-[1.7]">{r.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-sann-text-md">
            Want to see more?{" "}
            <Link href="/gallery" className="text-sann-red underline underline-offset-2 hover:text-sann-red-dk">
              Browse the full photo gallery
            </Link>
            .
          </p>
        </section>

        {/* ─── 5. AMENITIES ────────────────────────────────────── */}
        <section className="bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-center mb-10">Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5">
              {AMENITIES.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[0.95rem] text-sann-text-md">
                  <span className="text-sann-red mt-0.5">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── 6. NEARBY PLACES ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              The neighbourhood
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal">Nearby places</h2>
            <p className="mt-3 text-sann-text-md max-w-2xl mx-auto leading-[1.7]">
              Staying in the heart of Hat Yai means you&apos;re minutes from shopping, markets and great food.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {NEARBY.map((n) => (
              <div
                key={n.name}
                className="flex items-start gap-4 bg-white rounded-lg border border-sann-red/10 p-5"
              >
                <span className="text-2xl">{n.emoji}</span>
                <div>
                  <h3 className="font-display text-lg text-sann-text">{n.name}</h3>
                  <p className="text-sm text-sann-text-md mt-0.5 leading-[1.6]">{n.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-sann-text-md">
            <Link href="/location" className="text-sann-red underline underline-offset-2 hover:text-sann-red-dk">
              See directions and how to get here
            </Link>
          </p>
        </section>

        {/* ─── 7. SELF CHECK-IN ────────────────────────────────── */}
        <section className="bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sann-red/10">
              <Image
                src="/images/exterior-2.jpg"
                alt="Entrance of SANN Stay Hatyai private house with smart-lock self check-in"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
                Easy arrival
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-normal mb-4">Smart-lock self check-in</h2>
              <p className="text-base text-sann-text-md leading-[1.85] mb-4">
                No waiting at a front desk. Before you arrive we&apos;ll send simple self check-in instructions and
                your smart-lock code, so you can settle in the moment you reach Hat Yai — day or night.
              </p>
              <ul className="flex flex-col gap-2.5 text-[0.95rem] text-sann-text-md">
                <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Keyless smart-lock entry</li>
                <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Check-in instructions sent ahead of time</li>
                <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Flexible arrival for late flights and drives</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 8. FAQ ──────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-10">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Good to know
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-sann-red/10 border-y border-sann-red/10">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-sann-text">
                  {f.q}
                  <span className="text-sann-red transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-[0.95rem] text-sann-text-md leading-[1.8]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── 9. BOOKING CTA ──────────────────────────────────── */}
        <section className="bg-sann-text text-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-normal leading-[1.15]">
              Book SANN Stay Hatyai <em className="italic text-sann-cream">direct</em>
            </h2>
            <p className="mt-4 text-white/80 leading-[1.8] max-w-xl mx-auto">
              Reserve the whole house for your family or group and get our best direct rate. Have a question first?
              Message us on WhatsApp — we&apos;re happy to help plan your stay in Hat Yai.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="bg-sann-red hover:bg-sann-red-dk text-white px-8 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Book Direct
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 hover:bg-white text-sann-text px-8 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
