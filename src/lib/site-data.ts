/**
 * Single source of truth for property and content data shown on the
 * marketing site. Edit this file to swap images, add a new property,
 * or update amenities — no component code needs to change.
 *
 * To replace placeholder images later:
 *   1. Drop your real images into /public/images/...
 *   2. Replace the URLs below with /images/your-file.jpg
 */

export type Property = {
  id: string;
  name: string;
  /** Dedicated page for this property (see src/lib/property-pages.ts). */
  pageHref: string;
  tag: "Now Open" | "Opening Soon";
  location: string;
  description: string;
  amenities: string[];
  price: string;
  priceUnit: string;
  images: string[];
  airbnbUrl?: string;
  bookingUrl?: string;
  status: "open" | "coming-soon";
};

export const PROPERTIES: Property[] = [
  {
    id: "sann-stay-hatyai",
    name: "Sann Stay Hatyai",
    pageHref: "/sann-stay-hatyai",
    tag: "Now Open",
    location: "📍 4-min walk to Lee Garden Plaza · Heart of Hat Yai",
    description:
      "Cozy 4BR entire home — yours alone, no shared spaces. 4 bedrooms across 3 floors, sleeps up to 8. All rooms air-conditioned with fresh linens.",
    amenities: [
      "📶 High-speed WiFi",
      "❄️ AC in every room",
      "🔑 Smart lock",
      "🍳 Full kitchen",
      "🅿️ Parking nearby",
      "🧺 Fresh linens & towels",
      "🍪 Welcome snacks",
    ],
    price: "฿3,500",
    priceUnit: "/ night",
    images: [
      "/images/hatyai/1.jpg",
      "/images/hatyai/2.jpg",
      "/images/hatyai/3.jpg",
      "/images/hatyai/4.jpg",
      "/images/hatyai/5.jpg",
    ],
    airbnbUrl: "https://www.airbnb.com/rooms/1672362046238838999",
    bookingUrl:
      "https://www.booking.com/hotel/th/sann-stay-hatyai-4-min-walk-to-leegarden.en-gb.html",
    status: "open",
  },
  {
    id: "sann-thung-sao-hostel",
    name: "SANN Thungsao Hostel",
    pageHref: "/sann-thungsao-hostel",
    tag: "Now Open",
    location: "📍 Near Bus Station & ASEAN Night Bazaar · Hat Yai",
    description:
      "Comfortable and convenient hostel in the Thung Sao area. Take a bed in the 10-bed male dorm — sold per bed, each with a privacy curtain, reading light and a personal locker — or a private Double or Family room with its own bathroom.",
    amenities: [
      "📶 Free WiFi",
      "❄️ Air Con",
      "🔒 Personal lockers",
      "🍳 Shared kitchen",
      "🚌 3 min to bus station",
      "🛋 Common area",
    ],
    price: "฿350",
    priceUnit: "/ bed / night",
    images: ["/images/thungsao-3.jpg"],
    status: "open",
  },
];

// LOGO + HERO  ----------------------------------------------------
// Real PNG logo uploaded by the project owner. The header uses the
// brand-coloured wordmark; the footer uses the same on dark background
// (swap to a white variant by replacing /images/logo-light.png).
export const LOGO = {
  primary: "/images/logo.png",
  light: "/images/logo-light.png",
};

export const HERO_IMAGE = "/images/hero.jpg";
export const HERO_IMAGE_MOBILE = "/images/hero.jpg";

// Dedicated About-section photos (drop your own — independent of the
// property gallery above).
export const ABOUT_IMAGE_MAIN = "/images/about-1.jpg";
export const ABOUT_IMAGE_SECONDARY = "/images/about-2.jpg";

export const GALLERY_IMAGES = [
  { label: "Kitchenette", src: "/images/gallery-1.jpg" },
  { label: "Living Room", src: "/images/gallery-2.jpg" },
  { label: "Exterior", src: "/images/gallery-3.jpg" },
  { label: "Bedroom", src: "/images/gallery-4.jpg" },
];

// Room-by-room gallery (shown on /gallery). Six albums, each pulling EVERY photo
// from its folder under /public/images/gallery/<key>/. To refresh an album, drop
// new files in that folder (named <key>-01.jpg, <key>-02.jpg, …) and update the
// count below — nothing else to change.
export type GalleryPhoto = { src: string; title: string; description?: string };
export type GalleryCategory = { key: string; label: string; photos: GalleryPhoto[] };

const album = (key: string, label: string, count: number): GalleryCategory => ({
  key,
  label,
  photos: Array.from({ length: count }, (_, i) => ({
    src: `/images/gallery/${key}/${key}-${String(i + 1).padStart(2, "0")}.jpg`,
    title: label,
  })),
});

export const GALLERY: GalleryCategory[] = [
  album("common-area", "Common Area & Kitchenette · พื้นที่ส่วนกลาง", 7),
  album("exterior", "Exterior · ภายนอก", 4),
  album("room-1", "Room 1 · 1st floor", 13),
  album("room-2", "Room 2 · 2nd floor", 7),
  album("room-3", "Room 3 · 2nd floor", 13),
  album("room-4", "Room 4 · 3rd floor", 5),
];

// Real guest reviews from Sann Stay Hatyai.
export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
  via: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The property is very convenient for us — massage, shopping and food are all surrounding the property. The property is nice and clean to stay. Highly recommend, nice place!",
    author: "Yoke Lin",
    location: "Perak, Malaysia",
    rating: 5,
    via: "Airbnb",
  },
  {
    quote:
      "Robin is a great host — friendly, responsive, and always willing to help. The location is excellent, just a short walk from Lee Garden Plaza, with many massage shops nearby. The house is spacious and well-equipped, with one bedroom on the ground floor — ideal for elderly guests. Our family of eight stayed comfortably, and the air conditioning in every room was very cold and refreshing. With four bedrooms, there's plenty of room for groups of 8–9. Highly recommend to families and friends visiting Hat Yai. 😊",
    author: "Shermin",
    location: "Selangor, Malaysia",
    rating: 4,
    via: "Airbnb",
  },
  {
    quote:
      "Highly recommended! A very pleasant stay. Before check-in, the owner sent clear instructions and replied to messages very quickly — everything was smooth and hassle-free. The property is a 3-storey house with a modern design; the rooms are really huge and spacious, beds very comfortable, and everything feels new and well-kept. Location is perfect too — only a 5-minute walk to Lee Garden, yet the neighbourhood stays quiet and peaceful at night. Highly suitable for families or groups, great value for money. We'll definitely come back when we return to Hat Yai!",
    author: "Lai",
    location: "Singapore",
    rating: 5,
    via: "Airbnb",
  },
  {
    quote:
      "Great place to stay with a family and we can enjoy it together as there is a living hall and it's very spacious and clean. Near to Lee Garden. And also not forgetting to rate the owner 10/10 — the service provided was very friendly.",
    author: "Ahh",
    location: "Teluk Intan, Malaysia",
    rating: 5,
    via: "Airbnb",
  },
];

// Ordered by importance for a first-time guest: how to book → check in
// → enter → arrival logistics → policies.
export const FAQS = [
  {
    q: "How can I book?",
    a: "You can book via Airbnb, Booking.com, LINE @245qdfzu, or the Book Now button on this website. Direct bookings get the best rates!",
  },
  {
    q: "How do I check in?",
    a: "Before your stay, guests are required to complete an online pre check-in form. We will send the check-in link to your email or through the booking platform you used, such as Airbnb or Booking.com. You will be asked to provide your guest details and upload a valid ID card or passport.\n\nFor Thai guests, a national ID card is required. For international guests, a passport is required.\n\nThis information is needed for guest registration and accommodation reporting in accordance with Thai regulations, including TM.30 reporting for foreign guests and guest register records where applicable.",
  },
  {
    q: "How do I enter the house?",
    a: "SANN Stay Hatyai uses a self check-in system with a digital door lock.\n\nYour personal door lock code will be sent to you 1 day before your check-in date. Once you arrive, you can enter the house by using the code on the digital door lock.\n\nPlease keep your code private and do not share it with anyone outside your booking group.",
  },
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in from 15:00 onwards. Check-out before 12:00 noon. Early check-in or late check-out can be arranged — just let us know in advance and subject to availability.",
  },
  {
    q: "Is there parking available?",
    a: "Street parking is available. We have one reserved space in front of the house, with additional parking along the nearby street when available. Please ask us for parking guidance before arrival.",
  },
  {
    q: "Is the WiFi fast enough for working?",
    a: "Yes! We have high-speed WiFi (100+ Mbps) — perfect for video calls and remote work.",
  },
  {
    q: "Are pets allowed?",
    a: "We're sorry, pets are not allowed at any Sann Stay property to ensure cleanliness for all guests.",
  },
  {
    q: "What's the cancellation policy?",
    a: "For direct bookings on this website: the guest can cancel free of charge until 7 days before arrival. The guest will be charged the total price of the reservation if they cancel in the 7 days before arrival and no show. For Airbnb and Booking.com, please refer to the policy displayed on each platform before confirming your stay.",
  },
];

// LINE Official Account: @245qdfzu
// Both add-friend and chat links use the standard line.me URL with the
// %40 (URL-encoded "@") prefix so it works on iOS / Android / desktop.
// WhatsApp: wa.me wants the number in full international form with no "+",
// no spaces and no leading zero — +66 65 634 6834 → 66656346834.
export const CONTACT = {
  email: "sannascent.co@gmail.com",
  lineUrl: "https://line.me/R/ti/p/%40245qdfzu",
  lineChatUrl: "https://line.me/R/ti/p/%40245qdfzu",
  lineHandle: "@245qdfzu",
  whatsappNumber: "+66 65 634 6834",
  whatsappUrl: "https://wa.me/66656346834",
};

// Sann Stay Hatyai — 7.006212325779094, 100.47327252883606
// Update by replacing the q= coordinates if the property moves.
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=7.006212325779094,100.47327252883606&hl=en&z=17&output=embed";
export const GOOGLE_MAPS_OPEN_URL = "https://maps.app.goo.gl/JM118vZqP78M8Hm88";

export const NEARBY_PLACES = [
  { name: "Lee Garden Plaza", desc: "Shopping & dining · ~5-min walk" },
  { name: "Kim Yong Market", desc: "Famous local market · ~7-min walk" },
  { name: "Central Hat Yai", desc: "Department store & food court · short drive" },
  { name: "Asean Night Bazaar", desc: "Street food & shopping · short drive" },
  { name: "Hat Yai Municipal Park", desc: "Park & scenic viewpoint · short drive" },
  { name: "Hat Yai Train Station", desc: "Main rail hub · short drive" },
];
