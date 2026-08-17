import { PROPERTIES, TESTIMONIALS, CONTACT, HERO_IMAGE } from "@/lib/site-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sannstay.com";
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p}`);

// schema.org LodgingBusiness — helps Google show rich results / Google Hotel.
export default function StructuredData() {
  const h = PROPERTIES.find((p) => p.id === "sann-stay-hatyai") ?? PROPERTIES[0];
  const ratings = TESTIMONIALS.map((t) => t.rating).filter((n) => n > 0);
  const avg = ratings.length ? ratings.reduce((s, n) => s + n, 0) / ratings.length : 0;
  const priceNum = Number((h.price || "").replace(/[^\d]/g, "")) || undefined;

  const ld = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE}/#lodging`,
    name: "Sann Stay Hatyai",
    description: h.description,
    url: SITE,
    image: [abs(HERO_IMAGE), abs("/images/exterior-2.jpg"), abs("/images/hatyai/1.jpg")],
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
    checkinTime: "15:00",
    checkoutTime: "12:00",
    petsAllowed: false,
    numberOfRooms: 4,
    amenityFeature: [
      "High-speed WiFi",
      "Air conditioning in every room",
      "Smart lock self check-in",
      "Full kitchen",
      "Parking nearby",
      "Fresh linens & towels",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    ...(priceNum
      ? { makesOffer: { "@type": "Offer", priceCurrency: "THB", price: priceNum, name: "Entire 4-bedroom house · per night" } }
      : {}),
    ...(ratings.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(2), reviewCount: ratings.length, bestRating: 5, worstRating: 1 } }
      : {}),
    review: TESTIMONIALS.slice(0, 5).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.author },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.quote,
    })),
    sameAs: [h.airbnbUrl, h.bookingUrl, CONTACT.lineUrl].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
