"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
// It also has to STOP. The bar was hardcoded, so on 17 November it would have
// gone on advertising ฿299 for a sale that had closed the night before —
// a price the redeem page would then refuse. The campaign window lives in the
// PMS, which is the only clock that counts; when the server says the sale is
// over, this renders nothing and nobody has to remember to delete it.
const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

type Camp = { open?: boolean; reason?: string | null; opensOn?: string };

const thDay = (d: string) => {
  const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const [, m, day] = d.split("-").map(Number);
  return `${day} ${M[m - 1]}`;
};

export default function PromoStrip() {
  // null while we do not know yet. Shown on trust until the server answers,
  // because a bar that flickers in on every page load is worse than one that
  // is a second late to leave.
  const [camp, setCamp] = useState<Camp | null>(null);

  useEffect(() => {
    fetch(`${ADMIN_API}/api/public/voucher`)
      .then(r => r.json())
      .then((d: Camp) => setCamp(d ?? null))
      .catch(() => {});
  }, []);

  // Gone once the sale is over. Still here before it starts — the campaign is
  // announced for days before it sells, and the strip is how somebody who
  // dismissed the pop-up can still find it.
  if (camp?.reason === "sales_closed") return null;
  const soon = camp?.reason === "not_started";

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
        {/* Before it opens the bar must not say "buy today". */}
        <span className="hidden sm:inline">
          {soon
            ? ` · เปิดขาย ${camp?.opensOn ? thDay(camp.opensOn) : "เร็ว ๆ นี้"}`
            : " · ซื้อวันนี้ เข้าพักทีหลัง"}
        </span>
      </span>
      <span className="text-[13px] font-semibold opacity-90 transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
