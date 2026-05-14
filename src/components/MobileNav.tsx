"use client";

import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  onBookClick: () => void;
};

export default function MobileNav({ open, onClose, links, onBookClick }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] bg-sann-off flex flex-col gap-6 px-10 pt-20 pb-12 lg:hidden">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-3xl text-sann-red leading-none"
        aria-label="Close menu"
      >
        ×
      </button>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className="font-display text-2xl text-sann-text border-b border-sann-red/10 pb-3 hover:text-sann-red transition-colors"
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={onBookClick}
        className="font-display text-2xl text-sann-red text-left pb-3"
      >
        Book Now →
      </button>
    </div>
  );
}
