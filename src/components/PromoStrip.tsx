import Link from "next/link";

// The 11.11 bar, directly under the sticky header and above the hero.
//
// It was under the hero first, which is where a promotion belongs on a hotel
// site: the brand says who it is, then it sells. Measured on a phone that put
// it 1,095px down — the hero alone is 1,030px, about one and a quarter
// screens — so a campaign that ends on the 11th was sitting a full scroll
// below anything anyone saw.
//
// So it moved up, and it got smaller in exchange. One line, the height of a
// toolbar: enough to carry the price and the deadline, not enough to make the
// front page look like a coupon site. The selling is still done on /1111.
export default function PromoStrip() {
  return (
    <Link
      href="/1111"
      aria-label="โปรโมชั่น 11.11 — เตียงดอร์ม ฿299 ต่อคืน"
      className="group flex items-center justify-center gap-2 bg-sann-red px-4 py-2.5
        text-white no-underline transition-colors hover:bg-sann-red-dk"
    >
      <span className="font-display text-[19px] leading-none tracking-tight">
        11<span className="text-sann-terracotta-soft">.</span>11
      </span>
      <span className="h-3.5 w-px bg-white/30" aria-hidden />
      <span className="text-[13px] leading-tight">
        เตียงดอร์ม <b className="font-semibold">฿299</b>
        <s className="ml-1 opacity-60">฿350</s>
        <span className="hidden sm:inline"> · ซื้อวันนี้ เข้าพักทีหลัง</span>
      </span>
      <span className="text-[13px] font-semibold opacity-90 transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
