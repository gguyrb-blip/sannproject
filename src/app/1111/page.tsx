import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sale from "./Sale";

// /1111 — the campaign's own page.
//
// Its own route rather than a section bolted onto the Thung Sao page: it is
// what every ad, every story and the strip on the front page points at, it
// ends when the campaign does, and a page that can be taken down in one commit
// is worth more in February than a block somebody has to remember to delete.
export const metadata: Metadata = {
  title: "11.11 Super Sale · เตียงดอร์ม ฿299",
  description:
    "โปรโมชั่น 11.11 ของ SANN Thungsao Hostel หาดใหญ่ — เตียงดอร์มคืนละ ฿299 จากปกติ ฿350 " +
    "ซื้อวันนี้ เลือกวันเข้าพักทีหลังได้ถึง 31 มีนาคม 2570 เข้าพักได้คืนวันอาทิตย์ถึงพฤหัสบดี ส่วนคืนศุกร์เสาร์เพิ่มคืนละ 30 บาท",
  openGraph: {
    title: "11.11 Super Sale · เตียงดอร์ม ฿299 · SANN Thungsao Hostel",
    description: "ซื้อวันนี้ เข้าพักทีหลัง · อาทิตย์–พฤหัสบดี · ศุกร์เสาร์ +30 · ใช้ได้ถึง 31 มี.ค. 70",
  },
  // A campaign page should not outlive the campaign in search results.
  robots: { index: true, follow: true },
};

export default function ElevenElevenPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sann-off pt-24">
        <Sale />
      </main>
      <Footer />
    </>
  );
}
