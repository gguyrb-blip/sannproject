// Content for the per-property pages (sannstay.com/sann-stay-hatyai and
// /sann-thungsao-hostel). Only the things that never change live here — the
// brand copy, the address, the map. Rooms, photos, facilities and rates are
// read live from the PMS (/api/public/rooms), so adding a photo or ticking an
// amenity in Admin → Rooms updates these pages with no code change.

export type PropertyPage = {
  path: string;          // URL on sannstay.com
  apiSlug: string;       // properties.slug in the PMS
  name: string;
  kicker: string;        // small line above the title
  heroImage: string;
  gallery: string[];     // property-level shots (rooms bring their own)
  tagline: { th: string; en: string };
  intro: { th: string; en: string };
  address: string;
  areaNote: { th: string; en: string };
  mapEmbed: string;
  mapOpen: string;
  highlights: { icon: string; th: string; en: string }[];
  nearby: { name: string; desc: string }[];
  seo: { title: string; description: string; keywords: string[] };
  /** Long-form SEO article for this property, when one exists. */
  alsoSee?: { href: string; label: string };
};

export const PROPERTY_PAGES: PropertyPage[] = [
  {
    path: "/sann-stay-hatyai",
    apiSlug: "hatyai",
    name: "SANN Stay Hatyai",
    kicker: "Whole house · Hat Yai",
    heroImage: "/images/hatyai/1.jpg",
    gallery: [
      "/images/hatyai/1.jpg",
      "/images/hatyai/2.jpg",
      "/images/hatyai/3.jpg",
      "/images/hatyai/4.jpg",
      "/images/hatyai/5.jpg",
    ],
    tagline: {
      th: "บ้านทั้งหลัง 4 ห้องนอน · พักได้ถึง 8 ท่าน",
      en: "Whole 4-bedroom house · sleeps up to 8",
    },
    intro: {
      th: "บ้านส่วนตัวทั้งหลัง 3 ชั้น ใจกลางหาดใหญ่ เดิน 4 นาทีถึงลีการ์เดนส์ พลาซ่า ไม่มีพื้นที่ที่ต้องแชร์กับใคร — ทั้งบ้านเป็นของคุณคนเดียว เหมาะกับครอบครัวและกลุ่มเพื่อน มีครัวเต็มรูปแบบ เครื่องปรับอากาศทุกห้อง และเช็คอินด้วยตัวเองผ่านสมาร์ทล็อก",
      en: "A private three-storey house in the middle of Hat Yai, a four-minute walk from Lee Garden Plaza. Nothing is shared — the whole house is yours. Built for families and groups, with a full kitchen, air conditioning in every room and self check-in by smart lock.",
    },
    address: "Hat Yai, Songkhla",
    areaNote: {
      th: "เดิน 4 นาทีถึงลีการ์เดนส์ · 7 นาทีถึงตลาดกิมหยง",
      en: "4-min walk to Lee Garden Plaza · 7 min to Kim Yong Market",
    },
    mapEmbed:
      "https://www.google.com/maps?q=7.006212325779094,100.47327252883606&hl=en&z=17&output=embed",
    mapOpen: "https://maps.app.goo.gl/JM118vZqP78M8Hm88",
    highlights: [
      { icon: "🏠", th: "บ้านทั้งหลังเป็นของคุณ", en: "The whole house is yours" },
      { icon: "🛏", th: "4 ห้องนอน 3 ชั้น พักได้ 8 ท่าน", en: "4 bedrooms, 3 floors, sleeps 8" },
      { icon: "🍳", th: "ครัวเต็มรูปแบบ", en: "Full kitchen" },
      { icon: "🔑", th: "เช็คอินเองด้วยสมาร์ทล็อก", en: "Self check-in, smart lock" },
      { icon: "❄️", th: "แอร์ทุกห้อง", en: "Air conditioning in every room" },
      { icon: "🅿️", th: "ที่จอดรถบริเวณใกล้เคียง", en: "Parking nearby" },
    ],
    nearby: [
      { name: "Lee Garden Plaza", desc: "Shopping & dining · ~5-min walk" },
      { name: "Kim Yong Market", desc: "Famous local market · ~7-min walk" },
      { name: "Central Hat Yai", desc: "Department store & food court · short drive" },
      { name: "Hat Yai Municipal Park", desc: "Park & viewpoint · short drive" },
    ],
    seo: {
      title: "SANN Stay Hatyai — Whole 4-Bedroom House in Hat Yai",
      description:
        "Book SANN Stay Hatyai direct: a private 4-bedroom house for up to 8 guests, a 4-minute walk from Lee Garden Plaza. Full kitchen, air conditioning, self check-in.",
      keywords: [
        "SANN Stay Hatyai",
        "whole house Hat Yai",
        "4 bedroom house Hat Yai",
        "accommodation near Lee Garden Plaza",
        "family stay Hat Yai",
        "บ้านพักหาดใหญ่ทั้งหลัง",
        "ที่พักหาดใหญ่ใกล้ลีการ์เด้น",
      ],
    },
    alsoSee: {
      href: "/hatyai-private-house-near-lee-garden",
      label: "Read more about staying near Lee Garden Plaza",
    },
  },
  {
    path: "/sann-thungsao-hostel",
    apiSlug: "thungsao",
    name: "SANN Thungsao Hostel",
    kicker: "Hostel · Hat Yai",
    heroImage: "/images/thungsao-3.jpg",
    gallery: ["/images/thungsao-3.jpg"],
    tagline: {
      th: "เตียงดอร์ม และห้องส่วนตัว · ใกล้สถานีขนส่งหาดใหญ่",
      en: "Dorm beds & private rooms · near the Hat Yai bus terminal",
    },
    intro: {
      th: "โฮสเทลสะอาด เงียบ สบาย ย่านทุ่งเสา ใกล้สถานีขนส่งและอาเซียนไนท์บาซาร์ เลือกได้ทั้งเตียงในห้องดอร์มชาย (ขายรายเตียง มีม่านส่วนตัว ไฟอ่านหนังสือ ปลั๊กประจำเตียง และล็อกเกอร์) หรือห้องส่วนตัวพร้อมห้องน้ำในตัว",
      en: "A clean, quiet hostel in the Thung Sao area, close to the bus terminal and the ASEAN Night Bazaar. Take a bed in the male dorm — sold per bed, each with a privacy curtain, reading light, bedside socket and a personal locker — or a private room with its own bathroom.",
    },
    address: "Thung Sao, Hat Yai, Songkhla",
    areaNote: {
      th: "ใกล้สถานีขนส่งหาดใหญ่ · ใกล้อาเซียนไนท์บาซาร์",
      en: "Near the Hat Yai bus terminal · near the ASEAN Night Bazaar",
    },
    mapEmbed:
      "https://www.google.com/maps?q=6.9968557,100.4812507&hl=en&z=17&output=embed",
    mapOpen: "https://maps.app.goo.gl/qkJcvJ5UY2AhaVkT9",
    highlights: [
      { icon: "🛏", th: "เตียงดอร์ม ขายรายเตียง", en: "Dorm beds, sold per bed" },
      { icon: "🚪", th: "ห้องส่วนตัวพร้อมห้องน้ำในตัว", en: "Private rooms with en-suite bathroom" },
      { icon: "🔒", th: "ล็อกเกอร์ส่วนตัวทุกเตียง", en: "A personal locker for every bed" },
      { icon: "🚌", th: "ใกล้สถานีขนส่ง", en: "Minutes from the bus terminal" },
      { icon: "🅿️", th: "จอดรถยนต์ 2 คัน · มอเตอร์ไซค์ 10 คัน", en: "Parking for 2 cars & 10 motorbikes" },
      { icon: "🔑", th: "เช็คอินเองด้วยรหัสประตู", en: "Self check-in with a door code" },
    ],
    nearby: [
      { name: "Hat Yai Bus Terminal", desc: "Intercity coaches · minutes away" },
      { name: "ASEAN Night Bazaar", desc: "Street food & shopping · short drive" },
      { name: "Hat Yai Train Station", desc: "Main rail hub · short drive" },
      { name: "Lee Garden Plaza", desc: "Shopping & dining · short drive" },
    ],
    seo: {
      title: "SANN Thungsao Hostel — Dorm Beds & Private Rooms in Hat Yai",
      description:
        "Book SANN Thungsao Hostel direct: male dorm beds with privacy curtains and lockers, plus private rooms with en-suite bathrooms, near the Hat Yai bus terminal.",
      keywords: [
        "SANN Thungsao Hostel",
        "hostel Hat Yai",
        "dorm bed Hat Yai",
        "cheap accommodation Hat Yai",
        "hostel near Hat Yai bus terminal",
        "โฮสเทลหาดใหญ่",
        "ที่พักราคาถูกหาดใหญ่",
        "เตียงดอร์มหาดใหญ่",
      ],
    },
  },
];

export const propertyPageByPath = (path: string) =>
  PROPERTY_PAGES.find((p) => p.path === path);

// ── SEO helpers, so both property pages describe themselves the same way ──
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";

export function propertyMetadata(page: PropertyPage) {
  const url = `${SITE}${page.path}`;
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url,
      siteName: "Sann Stay",
      type: "website" as const,
      images: [{ url: `${SITE}${page.heroImage}`, width: 1200, height: 900, alt: page.name }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.seo.title,
      description: page.seo.description,
      images: [`${SITE}${page.heroImage}`],
    },
  };
}

/** schema.org LodgingBusiness — a hostel and a whole house are different types. */
export function propertyJsonLd(page: PropertyPage, kind: "Hotel" | "Hostel") {
  return {
    "@context": "https://schema.org",
    "@type": kind,
    name: page.name,
    description: page.seo.description,
    url: `${SITE}${page.path}`,
    image: `${SITE}${page.heroImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hat Yai",
      addressRegion: "Songkhla",
      addressCountry: "TH",
    },
    hasMap: page.mapOpen,
    amenityFeature: page.highlights.map((h) => ({
      "@type": "LocationFeatureSpecification",
      name: h.en,
      value: true,
    })),
  };
}
