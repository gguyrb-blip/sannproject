import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// /1111/thanks — where Beam sends a buyer back after they have paid.
//
// This page is not a nicety. The PMS has been handing Beam
// `${SITE}/1111/thanks?ref=…` as its redirectUrl since the campaign shipped,
// and nobody built it: the first real purchase, on 9 Nov 2026, ended on a bare
// Next.js 404 half a second after ฿299 left the buyer's bank. The voucher was
// issued and the email was sent, so nothing was actually lost — but the last
// thing that buyer saw was a page saying their money had gone nowhere.
//
// WHAT IT DELIBERATELY DOES NOT DO
//
// It does not show the voucher code. The only thing in the URL is the order
// reference, which is a date and four characters, and no public endpoint looks
// a voucher up by it — nor should one, because a code is worth ฿299 to whoever
// holds it and that reference is short enough to guess at. The code goes to
// the buyer's email, which is the one place we know belongs to them.
//
// It also does not claim the email has already arrived. The payment webhook
// and the email are both in flight when this renders; promising an inbox that
// is still empty is how a working system looks broken.
export const metadata: Metadata = {
  title: "ชำระเงินสำเร็จ · 11.11 Super Sale",
  description: "ขอบคุณสำหรับการสั่งซื้อ Voucher 11.11 ของ SANN Thungsao Hostel",
  // A receipt is for one buyer, not for search results.
  robots: { index: false, follow: false },
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sann-off pt-24">
        <div className="mx-auto max-w-[460px] px-4 pb-20 pt-4 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full
              bg-sann-success text-[30px] leading-none text-white"
            aria-hidden
          >
            ✓
          </div>

          <h1 className="mt-5 font-display text-[34px] leading-tight">
            ชำระเงินสำเร็จ
          </h1>
          <p className="mt-1 font-serif text-[17px] italic text-sann-muted">
            Payment received — thank you
          </p>

          <div className="my-6 mx-auto h-0.5 w-9 bg-sann-red opacity-40" />

          <div className="rounded-sann-lg border border-sann-line bg-white p-[18px] text-left">
            <p className="text-[14.5px] leading-relaxed">
              รหัส Voucher กำลังถูกส่งไปที่อีเมลของท่าน
              <span className="mt-1 block text-[13px] text-sann-muted">
                Your voucher code is on its way to your email.
              </span>
            </p>

            <p className="mt-3.5 border-t border-sann-line pt-3.5 text-[13.5px] leading-relaxed text-sann-muted">
              ปกติใช้เวลาไม่เกิน 2–3 นาที หากไม่พบ กรุณาตรวจในกล่องจดหมายขยะ
              <span className="mt-1 block">
                It usually takes a minute or two. If you cannot find it, check your spam folder.
              </span>
            </p>

            {ref && (
              <p className="mt-3.5 border-t border-sann-line pt-3.5 text-[12.5px] text-sann-muted">
                เลขที่คำสั่งซื้อ · Order reference
                <span className="mt-1 block font-mono text-[14px] tracking-wide text-sann-text">
                  {ref}
                </span>
              </p>
            )}
          </div>

          <div className="mt-5 space-y-2.5">
            {/* The redeem box lives at the bottom of the campaign page, and it
               is the one route back in for a buyer whose email never arrives. */}
            <Link
              href="/1111#use"
              className="block rounded-2xl bg-sann-red px-6 py-4 text-base font-medium
                leading-tight text-white shadow-sann-md transition-colors hover:bg-sann-red-dk"
            >
              ใช้ Voucher เลือกวันเข้าพัก
              <span className="block text-[11px] font-normal opacity-80">
                Use your voucher · choose your dates
              </span>
            </Link>
            <Link
              href="/"
              className="block rounded-2xl border border-sann-line bg-white px-6 py-4
                text-[15px] font-medium leading-tight text-sann-text transition-colors hover:bg-sann-warm"
            >
              กลับหน้าแรก
              <span className="block text-[11px] font-normal text-sann-muted">
                Back to the home page
              </span>
            </Link>
          </div>

          <p className="mt-6 text-[12.5px] leading-relaxed text-sann-muted">
            เข้าพักได้คืนวันอาทิตย์ถึงพฤหัสบดี · คืนศุกร์และเสาร์เพิ่มคืนละ ฿30 จ่ายตอนเลือกวัน ·
            ใช้ได้ถึง 31 มีนาคม 2570
            <span className="mt-1 block">
              Sunday to Thursday nights · Friday and Saturday for ฿30 more, paid when you book ·
              valid until 31 March 2027
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
