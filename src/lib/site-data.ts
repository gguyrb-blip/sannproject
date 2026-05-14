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

const UNSPLASH = "https://images.unsplash.com/";

export const PROPERTIES: Property[] = [
  {
    id: "sann-stay-hatyai",
    name: "Sann Stay Hatyai",
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
    price: "฿2,500",
    priceUnit: "/ night",
    images: [
      `${UNSPLASH}photo-1505693416388-ac5ce068fe85?w=1200&q=80`,
      `${UNSPLASH}photo-1522708323590-d24dbb6b0267?w=1200&q=80`,
      `${UNSPLASH}photo-1560448204-e02f11c3d0e2?w=1200&q=80`,
      `${UNSPLASH}photo-1556909114-f6e7ad7d3136?w=1200&q=80`,
      `${UNSPLASH}photo-1502672260266-1c1ef2d93688?w=1200&q=80`,
      `${UNSPLASH}photo-1493809842364-78817add7ffb?w=1200&q=80`,
      `${UNSPLASH}photo-1564013799919-ab600027ffc6?w=1200&q=80`,
    ],
    airbnbUrl: "https://www.airbnb.com/rooms/1672362046238838999",
    bookingUrl:
      "https://www.booking.com/hotel/th/sann-stay-hatyai-4-min-walk-to-leegarden.en-gb.html",
    status: "open",
  },
  {
    id: "sann-thung-sao-hostel",
    name: "Sann Thung Sao Hostel",
    tag: "Opening Soon",
    location: "📍 Near Bus Station & ASEAN Night Bazaar · Hat Yai",
    description:
      "Comfortable and convenient hostel in the Thung Sao area. Choose between bunkbed dorms (sold per bed, 2 rooms available) or a Family Room with 2 queen beds for up to 4 guests.",
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
    images: [
      `${UNSPLASH}photo-1555854877-bab0e564b8d5?w=1200&q=80`,
      `${UNSPLASH}photo-1559599189-fe84dea4eb79?w=1200&q=80`,
      `${UNSPLASH}photo-1540541338287-41700207dee6?w=1200&q=80`,
      `${UNSPLASH}photo-1611892440504-42a792e24d32?w=1200&q=80`,
    ],
    status: "coming-soon",
  },
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&q=80";
export const HERO_IMAGE_MOBILE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80";

export const ABOUT_IMAGE_MAIN =
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80";
export const ABOUT_IMAGE_SECONDARY =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80";

export const GALLERY_IMAGES = [
  {
    label: "Bedroom",
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
  },
  {
    label: "Living Room",
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
  },
  {
    label: "Kitchen",
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
  },
  {
    label: "Suite",
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Super clean, beautifully decorated. Felt like a real home. The host was very attentive and responsive. Highly recommended!",
    author: "Natthawut K.",
    property: "Sann Stay Hatyai",
  },
  {
    quote:
      "Bigger than expected! The bed was so comfy, WiFi was fast. Perfect for remote working. Will definitely come back.",
    author: "Ploy S.",
    property: "Sann Stay Hatyai",
  },
  {
    quote:
      "Great location, just steps from Lee Garden. Smart lock check-in was super convenient. The place looked exactly like the photos!",
    author: "Krit M.",
    property: "Sann Stay Hatyai",
  },
];

export const FAQS = [
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in from 15:00 onwards. Check-out before 12:00 noon. Early check-in or late check-out can be arranged — just let us know in advance.",
  },
  {
    q: "Is there parking available?",
    a: "Street parking is available near the property. We recommend asking us for specific parking tips before your arrival.",
  },
  {
    q: "Are pets allowed?",
    a: "We're sorry, pets are not allowed at any Sann Stay property to ensure cleanliness for all guests.",
  },
  {
    q: "How can I book?",
    a: "You can book via Airbnb, Booking.com, LINE @sannstay, or the Book Now button on this website. Direct bookings get the best rates!",
  },
  {
    q: "What's the cancellation policy?",
    a: "Free cancellation up to 3 days before check-in for direct bookings. For Airbnb/Booking.com, their respective policies apply.",
  },
  {
    q: "Is the WiFi fast enough for working?",
    a: "Yes! We have high-speed WiFi (100+ Mbps) — perfect for video calls and remote work.",
  },
];

export const CONTACT = {
  email: "sannascent.co@gmail.com",
  lineUrl: "https://lin.ee/OTkI5J5",
  lineChatUrl: "https://lin.ee/pM1OqtX",
  lineHandle: "@sannstay",
};

// Replace these with your real Google Maps embed + open URL.
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Hat+Yai,+Songkhla,+Thailand&output=embed";
export const GOOGLE_MAPS_OPEN_URL =
  "https://www.google.com/maps?q=Hat+Yai,+Songkhla,+Thailand";

export const NEARBY_PLACES = [
  { name: "Lee Garden Plaza", desc: "Shopping & dining · 4-min walk" },
  { name: "Kim Yong Market", desc: "Famous local market · 8-min walk" },
  { name: "Hat Yai local food area", desc: "Street food heaven · nearby" },
  { name: "Cafés and local restaurants", desc: "Within walking distance" },
];
