import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LOGO } from "@/lib/site-data";

// /1111/ads — one screen, one offer, one button. Where paid traffic lands.
//
// WHY THIS IS NOT JUST /1111
//
// /1111 is a good page for somebody who already wants it: photographs, a FAQ,
// the terms, a redeem box for buyers who lost the email. All of that is weight
// on a first impression bought for money. Somebody arriving from an ad has
// given us about two seconds and a phone screen, and in that space there is
// room for exactly one question — is this worth ฿299 — and one way to answer.
//
// So this is the whole of it: the room, the price, the two or three facts that
// decide it, and a button. Everything a buyer needs AFTER they are interested
// lives one tap away on /1111, which is where the button goes. Selling and
// explaining are different jobs and a landing page that tries both does
// neither; the owner chose the button go to /1111 rather than open the buy
// flow here, so nobody is asked for their money before they have read the
// terms.
//
// NO HEADER, NO FOOTER, ON PURPOSE
//
// A nav bar on an ad landing page is a row of exits. The wordmark stays —
// people should know whose offer this is — and it links home for anyone who
// wants the rest of the site, but nothing else competes with the one button.

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

export const metadata: Metadata = {
  title: "เตียงดอร์ม ฿299 · 11.11 Super Sale · SANN Thungsao Hostel",
  description:
    "เตียงในห้องดอร์มชาย หาดใหญ่ คืนละ ฿299 จากปกติ ฿350 ซื้อวันนี้ เลือกวันเข้าพักทีหลังได้ถึง 31 มีนาคม 2570",
  openGraph: {
    title: "เตียงดอร์ม ฿299 · 11.11 Super Sale",
    description: "ซื้อวันนี้ เข้าพักทีหลัง · อาทิตย์–พฤหัสบดี · ใช้ได้ถึง 31 มี.ค. 70",
  },
  // An ad landing page competing with /1111 in search results helps nobody.
  robots: { index: false, follow: true },
};

// The campaign window moves, and a stale "เหลืออีก 3 วัน" on a page people are
// being paid to visit is worse than none at all.
export const revalidate = 300;

type Campaign = {
  open?: boolean; reason?: string | null;
  today?: string; opensOn?: string; closesOn?: string;
  price?: number; faceValue?: number;
};

const baht = (n: number) => "฿" + n.toLocaleString("en-US");
const thDay = (d: string) => {
  const M = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const [, m, day] = d.split("-").map(Number);
  return `${day} ${M[m - 1]}`;
};
const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: 300 } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

export default async function AdsPage() {
  // Both are decorations on a page whose point is the price: if either call
  // fails the page still sells, with a stock background and no countdown,
  // rather than showing an error to traffic we paid for.
  const [camp, rooms] = await Promise.all([
    getJson<Campaign>(`${ADMIN_API}/api/public/voucher`),
    getJson<{ units?: { kind?: string; photos?: string[] }[] }>(
      `${ADMIN_API}/api/public/rooms?property_slug=thungsao`,
    ),
  ]);

  const photo = (rooms?.units ?? []).find(u => u.kind === "dorm")?.photos?.[0] ?? null;
  const price = camp?.price ?? 299;
  const face = camp?.faceValue ?? 350;

  const window_ =
    camp?.today && camp?.opensOn && camp?.closesOn
      ? camp.reason === "not_started"
        ? { lead: `เปิดขาย ${thDay(camp.opensOn)}`, sub: `อีก ${daysBetween(camp.today, camp.opensOn)} วัน` }
        : camp.reason === "sales_closed"
          ? { lead: `ปิดการขายแล้ว`, sub: `เมื่อ ${thDay(camp.closesOn)}` }
          : {
              lead: `เหลืออีก ${Math.max(0, daysBetween(camp.today, camp.closesOn)) + 1} วัน`,
              sub: `ขายถึง ${thDay(camp.closesOn)} เท่านั้น`,
            }
      : null;
  const closed = camp?.reason === "sales_closed";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-sann-text">
      {/* The room itself, full bleed. A bed is what is being sold and a photo
         of it argues better than any adjective. */}
      {photo ? (
        <Image
          src={photo}
          alt="ห้องดอร์มชาย SANN Thungsao Hostel"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-sann-text" />
      )}

      {/* TWO layers, and both are needed.
         The dorm photographs are bright — cream walls, white bedding, daylight
         — and the first draft used a bottom-up gradient that faded to 35% at
         the top. On this page that put white text on an almost-white ceiling:
         the property line and the struck-through ฿350 were invisible.
         So: a flat wash that guarantees a floor of contrast whatever photo the
         API hands us, and a gradient on top of it that deepens towards the
         words. Any one picture can be fixed by choosing a darker one; the
         wash is what makes the NEXT picture safe too. */}
      <div className="absolute inset-0 bg-[#2a1b16]/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#2a1b16] via-[#2a1b16]/75 to-[#2a1b16]/40"
        aria-hidden
      />

      <div className="relative flex min-h-[100dvh] flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        {/* The real wordmark, in the variant drawn for dark grounds.
           The first draft reached for logo.svg and inverted it, which is a
           lettering fallback reading "SANN stay" rather than the mark itself —
           on the one page where the brand gets two seconds to be recognised. */}
        <Link href="/" className="mx-auto block w-[104px]" aria-label="SANN">
          <Image
            src={LOGO.light}
            alt="SANN"
            width={600}
            height={120}
            className="h-auto w-full"
            priority
          />
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center text-center text-white">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.3em] text-white/85">
            Thungsao Hostel · ทุ่งเสา หาดใหญ่
          </div>

          <div className="mt-4 font-display text-[72px] leading-none tracking-tight sm:text-[88px]">
            11<span className="text-sann-terracotta-soft">.</span>11
          </div>

          <h1 className="mt-2 font-display text-[30px] leading-tight sm:text-[38px]">
            เตียงดอร์ม <em className="italic text-sann-terracotta-soft">ราคาพิเศษ</em>
          </h1>

          <div className="mt-6 flex items-baseline justify-center gap-3.5">
            <span className="text-[19px] text-white/70 line-through decoration-sann-terracotta-soft decoration-2">{baht(face)}</span>
            <span className="font-display text-[64px] leading-none sm:text-[76px]">
              {baht(price)}
              <span className="font-sans text-[20px] text-white/70">/คืน</span>
            </span>
          </div>
          <div className="mt-1 text-[13px] text-white/75">
            ประหยัด {baht(face - price)} ต่อเตียง
            <span className="ml-1.5 text-white/55">· save {baht(face - price)} a bed</span>
          </div>

          {window_ && (
            <div
              className={`mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-full
                px-4 py-2 text-[13px] backdrop-blur-sm ${
                  closed ? "bg-white/10 text-white/70" : "bg-white/15 text-white"
                }`}
            >
              <b className="font-semibold">{window_.lead}</b>
              <span className="text-white/70">· {window_.sub}</span>
            </div>
          )}

          <p className="mt-7 max-w-[23rem] text-[14.5px] leading-relaxed text-white/85">
            ซื้อวันนี้ เลือกวันเข้าพักทีหลัง · อาทิตย์–พฤหัสบดี · ใช้ได้ถึง 31 มี.ค. 70
            <span className="mt-1 block text-[12.5px] text-white/60">
              Buy now, choose your dates later · Sunday to Thursday nights · valid until 31 March 2027
            </span>
          </p>
        </div>

        {/* One button, at the bottom, thumb height. */}
        <div className="mx-auto w-full max-w-[26rem]">
          <Link
            href="/1111"
            className="block rounded-2xl bg-sann-red px-6 py-[18px] text-center text-[17px]
              font-medium leading-tight text-white shadow-sann-md transition-colors hover:bg-sann-red-dk"
          >
            {closed ? "ดูรายละเอียดโปรโมชั่น" : `ซื้อ Voucher — ${baht(price)}`}
            <span className="mt-0.5 block text-[11.5px] font-normal opacity-80">
              {closed ? "See the campaign" : "Buy a voucher · PromptPay QR"}
            </span>
          </Link>
          <p className="mt-3 text-center text-[11.5px] text-white/65">
            1 Voucher = 1 เตียง 1 คืน · ห้องดอร์มชาย · ชำระผ่าน QR PromptPay
          </p>
        </div>
      </div>
    </main>
  );
}
