import Link from "next/link";
import { ABOUT_IMAGE_MAIN, ABOUT_IMAGE_SECONDARY } from "@/lib/site-data";

const features = [
  "Self check-in with smart lock — arrive anytime",
  "High-speed WiFi — perfect for remote work",
  "Kitchenette available in select properties",
  "Prime locations near shopping, food & transport",
  "Responsive host — we're always just a message away",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-sann-off px-6 lg:px-20 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
    >
      <div className="rv relative h-[280px] lg:h-[480px]">
        <div
          className="absolute top-0 left-0 w-[75%] h-[78%] rounded bg-cover bg-center shadow-[0_10px_36px_rgba(42,31,24,0.12)]"
          style={{ backgroundImage: `url('${ABOUT_IMAGE_MAIN}')` }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded bg-cover bg-center border-[5px] border-sann-off shadow-[0_8px_24px_rgba(42,31,24,0.12)]"
          style={{ backgroundImage: `url('${ABOUT_IMAGE_SECONDARY}')` }}
        />
        <div className="absolute top-12 right-8 w-16 h-16 border-[1.5px] border-sann-red/20 rounded-full" />
      </div>
      <div className="rv">
        <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
          Our Story
        </p>
        <h2 className="font-display text-3xl lg:text-4xl text-sann-text font-normal leading-[1.15]">
          More Than
          <br />
          Just a <em className="italic text-sann-red">Room</em>
        </h2>
        <div className="w-9 h-0.5 bg-sann-red my-5 opacity-40" />
        <p className="text-[0.9rem] text-sann-text-md leading-[1.85] mb-3">
          Sann Stay was born from the belief that a true getaway should feel
          like home — whether you&apos;re travelling for business, leisure, or
          just need a break.
        </p>
        <p className="text-[0.9rem] text-sann-text-md leading-[1.85] mb-3">
          Every property is designed and maintained with attention to detail,
          from bed linens to the scent in the room.
        </p>
        <ul className="flex flex-col gap-2 my-6 list-none">
          {features.map((f) => (
            <li
              key={f}
              className="flex gap-3 items-start text-[0.85rem] text-sann-text"
            >
              <span className="text-sann-red text-[0.4rem] mt-2 flex-shrink-0">
                ◆
              </span>
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="#properties"
          className="inline-block bg-sann-red hover:bg-sann-red-dk text-white px-7 py-3 rounded-sm text-[0.73rem] tracking-[0.16em] uppercase font-semibold transition-colors"
        >
          Explore Our Stays
        </Link>
      </div>
    </section>
  );
}
