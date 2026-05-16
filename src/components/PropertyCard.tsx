"use client";

import type { Property } from "@/lib/site-data";
import ImageSlider from "./ImageSlider";
import { useBookingModal } from "./BookingModalProvider";

export default function PropertyCard({ property }: { property: Property }) {
  const { open } = useBookingModal();
  const isOpen = property.status === "open";

  return (
    <article className="rv bg-white rounded border border-sann-red/[0.06] shadow-[0_2px_12px_rgba(42,31,24,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(42,31,24,0.1)] transition-all overflow-hidden">
      <div className="relative">
        <ImageSlider
          images={property.images}
          blur={!isOpen}
          overlay={!isOpen ? "Real photos coming soon" : undefined}
        />
        <span
          className={`absolute top-3 left-3 z-[3] text-white text-[0.55rem] tracking-[0.16em] uppercase px-2 py-1 font-bold ${
            isOpen ? "bg-sann-red" : "bg-sann-text"
          }`}
        >
          {property.tag}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-sann-text mb-1">
          {property.name}
        </h3>
        <p className="text-[0.72rem] text-sann-text-lt mb-3">
          {property.location}
        </p>
        <p className="text-[0.82rem] text-sann-text-md leading-[1.7] mb-4">
          {property.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.amenities.map((a) => (
            <span
              key={a}
              className="text-[0.62rem] bg-sann-cream px-2 py-1 rounded-sm text-sann-text-md"
            >
              {a}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-sann-red/[0.07]">
          <div>
            <strong className="font-display text-xl text-sann-red">
              {property.price}
            </strong>{" "}
            <span className="text-[0.72rem] text-sann-text-lt">
              {property.priceUnit}
            </span>
          </div>
          {isOpen ? (
            <button
              onClick={() => open()}
              className="text-[0.65rem] tracking-[0.14em] uppercase text-sann-red font-semibold border-b border-sann-red/30 pb-px"
            >
              Book Now
            </button>
          ) : (
            <span className="text-[0.65rem] tracking-[0.14em] uppercase text-sann-text-lt font-semibold opacity-60">
              Coming Soon
            </span>
          )}
        </div>
        {(property.airbnbUrl || property.bookingUrl) && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-sann-red/[0.06]">
            {property.airbnbUrl && (
              <a
                href={property.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] text-sann-text-lt hover:text-sann-red font-semibold transition-colors"
              >
                🏠 View on Airbnb
              </a>
            )}
            {property.bookingUrl && (
              <a
                href={property.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] text-sann-text-lt hover:text-sann-red font-semibold transition-colors"
              >
                📘 View on Booking.com
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
