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

// ── Reviews ────────────────────────────────────────────────────────────────
//
// What each platform scores us, read off the platforms' own pages. These are
// facts — a score and a count — and each card links to the reviews themselves,
// so a guest can read every word where it was written. Re-read them now and
// then and update `checked`: a rating the page shows has to be the rating the
// platform shows (the old "4.9 on Airbnb" outlived the listing's real 4.67).
export type ReviewPlatform = "booking" | "trip" | "airbnb" | "google";
export type ReviewProperty = "hatyai" | "thungsao";
export type PlatformScore = {
  platform: ReviewPlatform;
  property: ReviewProperty;
  score: number;
  outOf: 5 | 10;
  count: number;
  /** The platform's own word for the score ("Very good", "Amazing"). */
  label?: string;
  url: string;
  /** Sub-scores, where the platform shows them. */
  detail?: { th: string; en: string; v: number }[];
};

export const REVIEW_SCORES_CHECKED = "2026-11-16";

export const REVIEW_SCORES: PlatformScore[] = [
  { platform: "trip", property: "thungsao", score: 9.4, outOf: 10, count: 49, label: "Amazing",
    url: "https://us.trip.com/hotels/detail/?hotelId=135453140&locale=en-US",
    detail: [{ th: "ความสะอาด", en: "Cleanliness", v: 9.4 }, { th: "ทำเล", en: "Location", v: 9.2 }, { th: "สิ่งอำนวยความสะดวก", en: "Amenities", v: 9.2 }] },
  { platform: "airbnb", property: "hatyai", score: 4.67, outOf: 5, count: 12,
    url: "https://www.airbnb.com/rooms/1672362046238838999" },
  { platform: "google", property: "thungsao", score: 4.9, outOf: 5, count: 8,
    url: "https://www.google.com/maps/place/Sann+Thungsao+Hostel/@6.9968557,100.4812507,17z" },
  { platform: "booking", property: "hatyai", score: 8.2, outOf: 10, count: 5, label: "Very good",
    url: "https://www.booking.com/hotel/th/sann-stay-hatyai-4-min-walk-to-leegarden.html" },
  { platform: "booking", property: "thungsao", score: 10, outOf: 10, count: 2, label: "Exceptional",
    url: "https://www.booking.com/hotel/th/sann-thungsao-hostel-5-min-to-central-hatyai.html" },
  { platform: "google", property: "hatyai", score: 4.6, outOf: 5, count: 7,
    url: "https://www.google.com/maps/place/Sann+Stay+Hatyai/@7.00601,100.4732618,17z" },
  { platform: "airbnb", property: "thungsao", score: 5, outOf: 5, count: 3,
    url: "https://www.airbnb.com/rooms/1741805168668146639" },
  { platform: "trip", property: "hatyai", score: 8.3, outOf: 10, count: 2, label: "Very good",
    url: "https://us.trip.com/hotels/detail/?hotelId=134911455&locale=en-US" },
];

// Guest quotes shown on the home page. Each one is a guest's own words, so add
// only reviews you are happy to republish, credited to the guest's first name
// and the platform it came from.
export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
  via: string;
  property?: ReviewProperty;
  /** The scale `rating` is on: 5 (stars, the default) or 10 (Trip.com,
   *  Booking.com). Shown as the platform gave it, never converted. */
  outOf?: 5 | 10;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The property is very convenient for us — massage, shopping and food are all surrounding the property. The property is nice and clean to stay. Highly recommend, nice place!",
    author: "Yoke Lin",
    location: "Perak, Malaysia",
    rating: 5,
    via: "Airbnb",
    property: "hatyai",
  },
  {
    quote:
      "Robin is a great host — friendly, responsive, and always willing to help. The location is excellent, just a short walk from Lee Garden Plaza, with many massage shops nearby. The house is spacious and well-equipped, with one bedroom on the ground floor — ideal for elderly guests. Our family of eight stayed comfortably, and the air conditioning in every room was very cold and refreshing. With four bedrooms, there's plenty of room for groups of 8–9. Highly recommend to families and friends visiting Hat Yai. 😊",
    author: "Shermin",
    location: "Selangor, Malaysia",
    rating: 4,
    via: "Airbnb",
    property: "hatyai",
  },
  {
    quote:
      "Highly recommended! A very pleasant stay. Before check-in, the owner sent clear instructions and replied to messages very quickly — everything was smooth and hassle-free. The property is a 3-storey house with a modern design; the rooms are really huge and spacious, beds very comfortable, and everything feels new and well-kept. Location is perfect too — only a 5-minute walk to Lee Garden, yet the neighbourhood stays quiet and peaceful at night. Highly suitable for families or groups, great value for money. We'll definitely come back when we return to Hat Yai!",
    author: "Lai",
    location: "Singapore",
    rating: 5,
    via: "Airbnb",
    property: "hatyai",
  },
  {
    quote:
      "Great place to stay with a family and we can enjoy it together as there is a living hall and it's very spacious and clean. Near to Lee Garden. And also not forgetting to rate the owner 10/10 — the service provided was very friendly.",
    author: "Ahh",
    location: "Teluk Intan, Malaysia",
    rating: 5,
    via: "Airbnb",
    property: "hatyai",
  },
  // SANN Thungsao Hostel — Google and Trip.com reviews the owner chose to
  // republish (17 Nov 2026), in English as each platform shows them. Scores
  // on the platform's own scale (Google 5, Trip.com 10). Guests are credited
  // by first name or the name they posted under; "Anonymous" is how Trip.com
  // lists those who gave none.
  {
    quote: "Had a lovely stay at this hostel! The place is cosy, clean and aesthetically pleasing, with a warm and welcoming atmosphere. The facilities are well equipped too. Apart from the shower room, they also provide a hair dryer and an iron, which is a nice plus. They also offer free drinking water from a Coway water dispenser.\n\nThe location is another highlight. It’s close to Hatyai Bus Station, within walking distance of ASEAN Night Market and has plenty of convenient options nearby, including 7-11 and affordable halal food spots like Nureehan and Fateehah.\n\nOverall, a comfortable and pleasant stay. Definitely a place I’d recommend if you’re visiting Hatyai!",
    author: "Fay", location: "Nov 2026", rating: 5, via: "Google", property: "thungsao",
  },
  {
    quote: "Malaysians who want to stay can afford it. I suggest you stay here, comfortable beds, clean lockers, clean toilets, clean rooms👍. I swear I didn't expect a cheap price but got everything complete",
    author: "Asna", location: "Trip with friends · Nov 2026", rating: 5, via: "Google", property: "thungsao",
  },
  {
    quote: "Great value for money, very clean rooms, cold air conditioning, and free drinking water. I loved it, and the housekeeping staff were very kind.",
    author: "Anonymous", location: "Dorm bed · Nov 2026", rating: 9.5, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "I loved both Hat Yai and the hostel so much that I decided to extend my stay. The staff accommodated my request so I didn't have to change beds, which I really appreciated.",
    author: "nick29", location: "Dorm bed · Nov 2026", rating: 9.5, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "Self check-in, close to Central Hatyai, and close to food spots.",
    author: "Shumet", location: "Dorm bed · Oct 2026", rating: 10, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "Easy check-in with staff available to help all the time. The housekeeper was very polite and extremely friendly, making it feel just like home. I was here for work so I booked 3 nights, and the sleep was so, so comfortable!",
    author: "Anonymous", location: "Dorm bed · Oct 2026", rating: 9.5, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "Looking for a budget-friendly shared room, perfect for solo travelers or groups? Check out this style of accommodation! 😊 The room features bunk beds with partitioned sleeping areas, privacy curtains, and includes pillows, blankets, and towels. The interior is decorated in warm, clean colors. There are lockers for storing belongings and a central aisle for easy access.",
    author: "HopJai Pai Tiew", location: "Dorm bed · Oct 2026", rating: 10, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "Everything is fully equipped, and the environment, restrooms, and dining area are very clean. Shower gel is provided, and with the air conditioning, it's all very comfortable. The best choice for solo travelers! 😊😊",
    author: "Boon Sheng", location: "Dorm bed · Oct 2026", rating: 10, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "As a stopover, my friend and I stayed at Sann Thungsao for a night. We appreciate the convenience of the self check-in, which gave us a key for our locker. When I opened my locker, a clean blanket and pillow was there for my bed. We are very impressed by how everything was organized.",
    author: "Anonymous", location: "Dorm bed · Sep 2026", rating: 10, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "This hostel was booked at the last moment, but it was easy to book because it's self check in. I scanned and provided my information. The system provided my key code and the code for the door. I like to self check in since the Wi-Fi worked well.",
    author: "Anonymous", location: "Dorm bed · Oct 2026", rating: 9.5, outOf: 10, via: "Trip.com", property: "thungsao",
  },
  {
    quote: "Very good, they even have online check-in service, and it's close to the mall and transportation.",
    author: "Kong", location: "Dorm bed · Aug 2026", rating: 10, outOf: 10, via: "Trip.com", property: "thungsao",
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
    // The house's facts as the check-in form and Stay Pass give them (kiosk-app
    // lib/hatyai-parking): the space is in a lot about 200 m away, not at the
    // door. Where exactly, and its key, come with the Stay Pass after check-in.
    a: "Sann Stay Hatyai: your stay includes one reserved parking space, in a lot about 200 m from the house. Need room for another car? Add it on the online check-in form — THB 300 per car per night. SANN Thungsao Hostel: parking for 2 cars and 10 motorbikes.",
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
