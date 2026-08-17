import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { TESTIMONIALS, CONTACT } from "@/lib/site-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";
const PATH = "/ms/penginapan-hatyai-dekat-lee-garden";
const EN_PATH = "/hatyai-private-house-near-lee-garden";
const URL = `${SITE}${PATH}`;
const WHATSAPP = "https://wa.me/66656346834";
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p}`);

const TITLE = "Penginapan Hatyai Dekat Lee Garden untuk Family | SANN Stay Hatyai";
const DESC =
  "SANN Stay Hatyai ialah rumah persendirian 4 bilik dekat Lee Garden Plaza, sesuai untuk keluarga dan group dari Malaysia yang melancong ke Hatyai. Muat sehingga 8 tetamu, dengan dapur, Wi-Fi, smart lock dan self check-in.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: PATH,
    languages: {
      "en": `${SITE}${EN_PATH}`,
      "ms-MY": URL,
      "x-default": `${SITE}${EN_PATH}`,
    },
  },
  keywords: [
    "penginapan Hatyai dekat Lee Garden",
    "hotel Hatyai dekat Lee Garden",
    "homestay Hatyai",
    "rumah sewa Hatyai untuk family",
    "rumah Hatyai dekat Lee Garden",
    "penginapan keluarga di Hatyai",
    "tempat tinggal Hatyai untuk keluarga",
    "family accommodation Hat Yai",
    "private house near Lee Garden Plaza",
    "4 bedroom house Hat Yai",
    "whole house Hat Yai for family",
  ],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: "Sann Stay",
    locale: "ms_MY",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "SANN Stay Hatyai — rumah persendirian 4 bilik dekat Lee Garden Plaza di Hatyai",
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
    q: "Adakah SANN Stay Hatyai dekat dengan Lee Garden Plaza?",
    a: "Ya. SANN Stay Hatyai hanya kira-kira 4 minit berjalan kaki dari Lee Garden Plaza, salah satu kawasan paling popular di Hatyai.",
  },
  {
    q: "Berapa ramai tetamu boleh menginap di SANN Stay Hatyai?",
    a: "Rumah ini sesuai untuk keluarga dan group sehingga 8 orang tetamu.",
  },
  {
    q: "Adakah ini rumah persendirian atau penginapan kongsi?",
    a: "SANN Stay Hatyai ialah rumah persendirian sepenuhnya, jadi anda boleh menikmati keseluruhan rumah sepanjang penginapan.",
  },
  {
    q: "Berapa bilik tidur dan bilik air yang ada?",
    a: "Rumah ini mempunyai 4 bilik tidur dan 2 bilik air.",
  },
  {
    q: "Adakah terdapat dapur?",
    a: "Ya. Rumah ini dilengkapi dapur / kitchenette untuk kemudahan tetamu yang mahu memasak sendiri.",
  },
  {
    q: "Adakah self check-in disediakan?",
    a: "Ya. Anda boleh check-in sendiri menggunakan sistem smart lock dan arahan self check-in yang kami berikan.",
  },
  {
    q: "Adakah sesuai untuk keluarga dari Malaysia?",
    a: "Ya. Rumah ini sangat sesuai untuk keluarga dan group dari Malaysia yang melancong ke Hatyai, terutamanya yang mahu menginap dekat Lee Garden Plaza.",
  },
  {
    q: "Apakah tempat menarik berdekatan?",
    a: "Tempat berdekatan termasuk Lee Garden Plaza, Pasar Kim Yong, Tokong Chue Chang dan tarikan lain di tengah bandar Hatyai.",
  },
];

const HIGHLIGHTS = [
  { icon: "🏠", title: "Rumah persendirian penuh", desc: "Seluruh rumah 4 bilik untuk anda sahaja — tiada ruang kongsi, tiada orang asing." },
  { icon: "🛏️", title: "4 bilik tidur · muat 8", desc: "Katil yang selesa merentas empat bilik tidur, sesuai untuk keluarga dan group." },
  { icon: "🚿", title: "2 bilik air", desc: "Dua bilik air penuh supaya semua orang boleh bersiap dengan mudah." },
  { icon: "🍳", title: "Dapur & ruang tamu", desc: "Masak bersama di dapur dan berehat di ruang tamu, seperti di rumah sendiri." },
  { icon: "🔑", title: "Self check-in smart lock", desc: "Tiba mengikut masa anda sendiri dengan kemasukan tanpa kunci." },
  { icon: "📍", title: "4 minit ke Lee Garden", desc: "Berjalan kaki ke Lee Garden Plaza, Pasar Kim Yong dan tengah bandar Hatyai." },
];

const AMENITIES = [
  "Wi-Fi laju percuma",
  "Penghawa dingin di setiap bilik",
  "Smart lock & self check-in",
  "Dapur lengkap",
  "Ruang tamu & ruang makan",
  "Mesin basuh",
  "Cadar & tuala bersih",
  "Pancuran air panas",
  "Tempat letak kereta berdekatan",
];

const NEARBY = [
  { name: "Lee Garden Plaza", detail: "≈ 4 minit berjalan kaki · membeli-belah, makan & hiburan malam", emoji: "🛍️" },
  { name: "Pasar Kim Yong", detail: "Pasar terkenal untuk snek, barang kering & cenderahati", emoji: "🧺" },
  { name: "Tokong Chue Chang", detail: "Mercu tanda tempatan yang terkenal dan tempat beribadat", emoji: "🛕" },
  { name: "Tengah Bandar Hatyai", detail: "Kafe, makanan jalanan dan pengangkutan berhampiran", emoji: "🍜" },
];

const ROOMS = [
  {
    src: "/images/hatyai/1.jpg",
    alt: "Bilik tidur di SANN Stay Hatyai, rumah persendirian dekat Lee Garden Plaza",
    title: "Empat bilik tidur yang selesa",
    desc: "Setiap bilik tidur berhawa dingin dengan tilam dan cadar yang selesa — ruang persendirian yang cukup untuk seluruh keluarga atau group.",
  },
  {
    src: "/images/hatyai/4.jpg",
    alt: "Ruang tamu dan ruang makan di SANN Stay Hatyai untuk keluarga di Hatyai",
    title: "Ruang tamu & ruang makan",
    desc: "Berkumpul di ruang tamu dan ruang makan selepas seharian meneroka Hatyai.",
  },
  {
    src: "/images/gallery-1.jpg",
    alt: "Dapur di SANN Stay Hatyai, rumah sewa Hatyai untuk family",
    title: "Dapur untuk semua",
    desc: "Sediakan makanan bersama di dapur / kitchenette — sesuai untuk penginapan keluarga yang lebih lama.",
  },
  {
    src: "/images/bathroom-1.png",
    alt: "Bilik air moden di SANN Stay Hatyai, rumah 4 bilik di Hatyai",
    title: "Dua bilik air penuh",
    desc: "Dua bilik air yang bersih dan moden dengan pancuran air panas memudahkan waktu pagi untuk sehingga 8 tetamu.",
  },
];

export default function PenginapanHatyaiPage() {
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
    telephone: "+66656346834",
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
      name: "Rumah persendirian 4 bilik",
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
    inLanguage: "ms-MY",
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
            alt="SANN Stay Hatyai — rumah persendirian 4 bilik beberapa minit berjalan kaki dari Lee Garden Plaza di Hatyai"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 pb-16 lg:pb-24 pt-40 text-white">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase font-semibold mb-4 text-white/85">
              SANN Stay Hatyai · Rumah Persendirian
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] max-w-3xl">
              Penginapan Hatyai Dekat Lee Garden untuk{" "}
              <em className="italic text-sann-cream">Family dan Group</em>
            </h1>
            <p className="mt-6 font-serif italic text-lg lg:text-xl text-white/90 leading-[1.7] max-w-2xl">
              SANN Stay Hatyai ialah rumah persendirian 4 bilik di tengah bandar Hatyai, hanya beberapa minit
              berjalan kaki dari Lee Garden Plaza. Direka khas untuk keluarga dan group, rumah ini menawarkan bilik
              tidur yang selesa, ruang tamu, dapur, smart lock dan self check-in untuk penginapan persendirian yang
              mudah.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="bg-sann-red hover:bg-sann-red-dk text-white px-7 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Tempah Terus
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 hover:bg-white text-sann-text px-7 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Hubungi WhatsApp
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <span>🛏️ 4 bilik tidur</span>
              <span>🚿 2 bilik air</span>
              <span>👨‍👩‍👧‍👦 Sehingga 8 tetamu</span>
              <span>🔑 Self check-in</span>
            </div>
          </div>
        </section>

        {/* language switch */}
        <div className="bg-sann-bg2 text-center py-3 px-6 text-sm text-sann-text-md">
          Prefer English?{" "}
          <Link
            href={EN_PATH}
            className="text-sann-red font-medium underline underline-offset-2 hover:text-sann-red-dk"
          >
            Read this page in English
          </Link>
        </div>

        {/* ─── 2. WHY MALAYSIAN FAMILIES CHOOSE ────────────────── */}
        <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
          <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
            Mengapa pilih kami
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-normal leading-[1.15]">
            Mengapa keluarga Malaysia memilih SANN Stay Hatyai
          </h2>
          <div className="w-9 h-0.5 bg-sann-red mx-auto my-6 opacity-40" />
          <p className="text-base lg:text-lg text-sann-text-md leading-[1.85]">
            Daripada bilik hotel yang berasingan, keluarga atau group anda berkongsi satu rumah persendirian. Masak
            bersama di dapur, berehat di ruang tamu, dan selesa di empat bilik tidur — semuanya hanya empat minit
            berjalan kaki dari Lee Garden Plaza. Dengan smart lock dan self check-in, anda tiba mengikut masa sendiri
            dan menikmati ruang, privasi serta nilai yang sukar ditawarkan oleh hotel biasa. Ia merupakan pilihan{" "}
            <Link href="/book" className="text-sann-red underline underline-offset-2 hover:text-sann-red-dk">
              penginapan keluarga di Hatyai
            </Link>{" "}
            yang mudah dan dipercayai untuk pelancong dari Malaysia.
          </p>
        </section>

        {/* ─── 3. PRIVATE 4-BEDROOM HOUSE (ROOM LAYOUT) ────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-4 lg:pb-8">
          <div className="text-center mb-12">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Di dalam rumah
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal">
              Rumah persendirian 4 bilik dekat Lee Garden Plaza
            </h2>
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
            Mahu lihat lebih banyak?{" "}
            <Link href="/gallery" className="text-sann-red underline underline-offset-2 hover:text-sann-red-dk">
              Lihat galeri foto penuh
            </Link>
            .
          </p>
        </section>

        {/* ─── 4. SUITABLE FOR FAMILY & GROUP (HIGHLIGHTS) ─────── */}
        <section className="mt-12 bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-center mb-12">
              Sesuai untuk penginapan keluarga dan group
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

        {/* ─── 5. NEARBY PLACES ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Kawasan sekitar
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal">Tempat menarik berdekatan</h2>
            <p className="mt-3 text-sann-text-md max-w-2xl mx-auto leading-[1.7]">
              Menginap di tengah bandar Hatyai bermakna anda hanya beberapa minit dari pusat membeli-belah, pasar
              dan makanan yang sedap.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {NEARBY.map((n) => (
              <div key={n.name} className="flex items-start gap-4 bg-white rounded-lg border border-sann-red/10 p-5">
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
              Lihat arah dan cara untuk sampai ke sini
            </Link>
          </p>
        </section>

        {/* ─── 6. AMENITIES ────────────────────────────────────── */}
        <section className="bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-center mb-10">Kemudahan</h2>
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

        {/* ─── 7. SELF CHECK-IN ────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sann-red/10">
            <Image
              src="/images/exterior-2.jpg"
              alt="Pintu masuk SANN Stay Hatyai, rumah persendirian dengan self check-in smart lock"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Ketibaan mudah
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal mb-4">Self check-in dengan smart lock</h2>
            <p className="text-base text-sann-text-md leading-[1.85] mb-4">
              Tiada menunggu di kaunter penerimaan tetamu. Sebelum anda tiba, kami akan hantar arahan self check-in
              yang ringkas dan kod smart lock anda, supaya anda boleh terus masuk sebaik sampai di Hatyai — siang
              atau malam.
            </p>
            <ul className="flex flex-col gap-2.5 text-[0.95rem] text-sann-text-md">
              <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Kemasukan tanpa kunci (smart lock)</li>
              <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Arahan check-in dihantar lebih awal</li>
              <li className="flex items-start gap-2.5"><span className="text-sann-red mt-0.5">✓</span> Ketibaan fleksibel untuk penerbangan atau pemanduan lewat</li>
            </ul>
          </div>
        </section>

        {/* ─── 8. FAQ ──────────────────────────────────────────── */}
        <section className="bg-sann-cream/60 border-y border-sann-red/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
            <div className="text-center mb-10">
              <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
                Baik untuk diketahui
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-normal">Soalan lazim</h2>
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
          </div>
        </section>

        {/* ─── 9. BOOKING CTA ──────────────────────────────────── */}
        <section className="bg-sann-text text-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-normal leading-[1.15]">
              Tempah SANN Stay Hatyai <em className="italic text-sann-cream">terus</em>
            </h2>
            <p className="mt-4 text-white/80 leading-[1.8] max-w-xl mx-auto">
              Tempah seluruh rumah untuk keluarga atau group anda dan dapatkan kadar terus terbaik kami. Ada soalan
              dahulu? Hubungi kami di WhatsApp — kami dengan senang hati membantu merancang penginapan anda di Hatyai.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="bg-sann-red hover:bg-sann-red-dk text-white px-8 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Tempah Terus
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 hover:bg-white text-sann-text px-8 py-3.5 rounded-sm text-[0.72rem] tracking-[0.16em] uppercase font-semibold transition-colors"
              >
                Hubungi WhatsApp
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
