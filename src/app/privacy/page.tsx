import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Notice · ประกาศความเป็นส่วนตัว",
  description:
    "Privacy Notice for SANN Stay Hatyai & SANN Thungsao Hostel — PDPA, TM.30 immigration reporting and hotel guest registration (Ror.Ror.4). ประกาศความเป็นส่วนตัว ตาม PDPA · ตม.30 · ร.ร.4",
};

// Static bilingual privacy notice. Legal bases: PDPA B.E. 2562 · Immigration Act
// B.E. 2522 s.38 (TM.30) · Hotel Act B.E. 2547 (Ror.Ror.3 / Ror.Ror.4).
export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-sann-off pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <header className="text-center mb-10">
            <p className="text-[0.63rem] tracking-[0.3em] uppercase text-sann-red font-semibold mb-2">
              Privacy Notice
            </p>
            <h1 className="font-display text-4xl text-sann-text font-normal leading-[1.1]">
              ประกาศความเป็นส่วนตัว
            </h1>
            <div className="w-9 h-0.5 bg-sann-red mx-auto my-5 opacity-40" />
            <p className="text-sm text-sann-text-md">
              SANN Stay Hatyai · SANN Thungsao Hostel ·{" "}
              <a href="#en" className="text-sann-red underline">English version below ↓</a>
            </p>
          </header>

          <article className="prose-sann text-sann-text text-[0.95rem] leading-[1.8] space-y-3">
            <p>
              <b>บริษัท ซานน์ แอสเซนต์ จำกัด</b> (&ldquo;เรา&rdquo;) ผู้ให้บริการที่พัก SANN Stay Hatyai และ SANN Thungsao Hostel
              เคารพความเป็นส่วนตัวของท่าน ประกาศฉบับนี้อธิบายว่าเราเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านอย่างไร
              ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) · ปรับปรุงล่าสุด: กรกฎาคม 2569
            </p>

            <h2 className="font-display text-2xl text-sann-red pt-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><b>ข้อมูลระบุตัวตน:</b> ชื่อ-นามสกุล สัญชาติ วันเดือนปีเกิด หมายเลขและภาพถ่ายหนังสือเดินทาง (ชาวต่างชาติ) หรือบัตรประจำตัวประชาชน (คนไทย)</li>
              <li><b>ข้อมูลติดต่อ:</b> หมายเลขโทรศัพท์ อีเมล</li>
              <li><b>ข้อมูลการเข้าพัก:</b> วันเข้า–ออก ห้อง/เตียงที่พัก จำนวนผู้เข้าพัก ลายมือชื่อดิจิทัล</li>
              <li><b>ข้อมูลการชำระเงิน:</b> ยอดชำระและช่องทางชำระ (เราไม่จัดเก็บเลขบัตรเครดิตหรือข้อมูลบัญชีธนาคารของท่าน)</li>
              <li><b>ภาพจากกล้องวงจรปิด (CCTV):</b> บริเวณทางเข้าและพื้นที่ส่วนกลางของ SANN Thungsao Hostel เพื่อความปลอดภัย (ไม่มีกล้องในห้องพักและห้องน้ำ)</li>
            </ul>

            <h2 className="font-display text-2xl text-sann-red pt-4">2. วัตถุประสงค์และฐานทางกฎหมาย</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><b>แจ้งที่พักของคนต่างด้าว (แบบ ตม.30)</b> ต่อสำนักงานตรวจคนเข้าเมือง ภายใน 24 ชั่วโมงนับแต่เข้าพัก ตามพระราชบัญญัติคนเข้าเมือง พ.ศ. 2522 มาตรา 38 — <i>หน้าที่ตามกฎหมาย</i></li>
              <li><b>จัดทำบัตรทะเบียนผู้พัก (ร.ร.3) และทะเบียนผู้พัก (ร.ร.4)</b> รวมถึงเก็บรักษาและนำส่งต่อนายทะเบียนโรงแรม ตามพระราชบัญญัติโรงแรม พ.ศ. 2547 — <i>หน้าที่ตามกฎหมาย</i></li>
              <li>รับจอง เช็คอิน ออกรหัสเข้าห้องพัก รับชำระเงิน ออกใบเสร็จ และให้บริการระหว่างเข้าพัก — <i>การปฏิบัติตามสัญญา</i></li>
              <li>ความปลอดภัยของผู้เข้าพักและทรัพย์สิน รวมถึงกล้องวงจรปิด และการป้องกันการทุจริต — <i>ประโยชน์โดยชอบด้วยกฎหมาย</i></li>
              <li>การจัดทำบัญชีและภาษี — <i>หน้าที่ตามกฎหมาย</i></li>
            </ul>
            <p className="font-semibold">หากท่านไม่ให้ข้อมูลที่กฎหมายกำหนด เราไม่สามารถให้บริการเข้าพักแก่ท่านได้</p>

            <h2 className="font-display text-2xl text-sann-red pt-4">3. การเปิดเผยข้อมูล</h2>
            <p>
              เราเปิดเผยข้อมูลของท่านเฉพาะแก่ (1) สำนักงานตรวจคนเข้าเมือง (ตม.30) (2) นายทะเบียนโรงแรมและหน่วยงานราชการตามที่กฎหมายกำหนด
              (3) ผู้ให้บริการระบบชำระเงิน (4) ผู้ให้บริการระบบจัดเก็บข้อมูลบนคลาวด์ที่เราใช้ดำเนินงาน ซึ่งเซิร์ฟเวอร์อาจตั้งอยู่ต่างประเทศ
              โดยเราคัดเลือกผู้ให้บริการที่มีมาตรการคุ้มครองข้อมูลตามมาตรฐานสากล — <b>เราไม่ขายหรือให้เช่าข้อมูลของท่านแก่บุคคลใดทั้งสิ้น</b>
            </p>

            <h2 className="font-display text-2xl text-sann-red pt-4">4. ระยะเวลาเก็บรักษา</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>ทะเบียนผู้พัก (ร.ร.3/ร.ร.4): อย่างน้อย 1 ปี ตามพระราชบัญญัติโรงแรมฯ</li>
              <li>เอกสารเกี่ยวกับการชำระเงินและบัญชี: 5 ปี ตามกฎหมายภาษีอากร</li>
              <li>ภาพถ่ายเอกสารประจำตัว: เก็บเท่าที่จำเป็นต่อหน้าที่ตามกฎหมายข้างต้น แล้วลบทำลายอย่างปลอดภัย</li>
              <li>ภาพจากกล้องวงจรปิด: ประมาณ 30 วัน เว้นแต่จำเป็นต่อการสอบสวนเหตุการณ์</li>
            </ul>

            <h2 className="font-display text-2xl text-sann-red pt-4">5. สิทธิของท่านตาม PDPA</h2>
            <p>
              ท่านมีสิทธิขอเข้าถึง ขอสำเนา ขอแก้ไข ขอลบ (เท่าที่ไม่ขัดต่อหน้าที่ตามกฎหมายของเรา) ขอคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน
              และมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)
            </p>

            <h2 className="font-display text-2xl text-sann-red pt-4">6. ติดต่อเรา</h2>
            <p>
              บริษัท ซานน์ แอสเซนต์ จำกัด<br />
              1034/141 หมู่ที่ 3 ถนนเลี่ยงเมือง (สายเอเชีย) ตำบลควนลัง อำเภอหาดใหญ่ จังหวัดสงขลา 90110<br />
              อีเมล: sannascent.co@gmail.com · WhatsApp: +66 65 634 6834
            </p>

            {/* ════════ ENGLISH ════════ */}
            <div id="en" className="border-t-2 border-sann-line mt-12 pt-10">
              <h1 className="font-display text-4xl text-sann-text text-center font-normal">Privacy Notice</h1>
              <p className="text-center text-sm text-sann-text-md mt-2 mb-6">SANN Stay Hatyai · SANN Thungsao Hostel</p>

              <p>
                <b>Sann Ascent Co., Ltd.</b> (&ldquo;we&rdquo;), the operator of SANN Stay Hatyai and SANN Thungsao Hostel, respects your privacy.
                This notice explains how we collect, use and disclose your personal data under Thailand&rsquo;s Personal Data Protection Act
                B.E. 2562 (PDPA). Last updated: July 2026.
              </p>

              <h2 className="font-display text-2xl text-sann-red pt-4">1. Data we collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><b>Identity data:</b> full name, nationality, date of birth, passport number and photo (foreign guests) or Thai national ID (Thai guests)</li>
                <li><b>Contact data:</b> phone number, email</li>
                <li><b>Stay data:</b> check-in/out dates, room or bed, number of guests, digital signature</li>
                <li><b>Payment data:</b> amounts and payment method (we never store your card or bank details)</li>
                <li><b>CCTV footage:</b> at the entrance and common areas of SANN Thungsao Hostel for security (no cameras in rooms or bathrooms)</li>
              </ul>

              <h2 className="font-display text-2xl text-sann-red pt-4">2. Why we collect it (legal bases)</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><b>Immigration reporting (Form TM.30):</b> the Immigration Act B.E. 2522, Section 38 requires us to report every foreign guest to the Immigration Bureau within 24 hours of check-in — <i>legal obligation</i></li>
                <li><b>Guest registration (Forms Ror.Ror.3 / Ror.Ror.4):</b> the Hotel Act B.E. 2547 requires us to record every guest in the official guest registration card and register, retain it, and submit it to the hotel registrar as prescribed — <i>legal obligation</i></li>
                <li>Managing your booking, check-in, door access codes, payment and receipts — <i>performance of contract</i></li>
                <li>Guest safety, property security (including CCTV) and fraud prevention — <i>legitimate interest</i></li>
                <li>Accounting and tax records — <i>legal obligation</i></li>
              </ul>
              <p className="font-semibold">If you do not provide the legally required information, we are unable to accommodate you.</p>

              <h2 className="font-display text-2xl text-sann-red pt-4">3. Who we share it with</h2>
              <p>
                Only with: (1) the Thai Immigration Bureau (TM.30); (2) the hotel registrar and government authorities as required by law;
                (3) our payment processor; (4) the cloud service providers that run our systems, whose servers may be located outside Thailand
                and are selected for international-standard data protection. <b>We never sell or rent your personal data.</b>
              </p>

              <h2 className="font-display text-2xl text-sann-red pt-4">4. How long we keep it</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Guest registers (Ror.Ror.3/4): at least 1 year (Hotel Act)</li>
                <li>Payment and accounting records: 5 years (tax law)</li>
                <li>ID document photos: only as long as needed for the legal duties above, then securely deleted</li>
                <li>CCTV footage: approximately 30 days, unless needed for an incident investigation</li>
              </ul>

              <h2 className="font-display text-2xl text-sann-red pt-4">5. Your rights (PDPA)</h2>
              <p>
                You may request access, a copy, correction, deletion (to the extent it does not conflict with our legal duties),
                or object to processing, and you may lodge a complaint with Thailand&rsquo;s Personal Data Protection Committee (PDPC).
              </p>

              <h2 className="font-display text-2xl text-sann-red pt-4">6. Contact us</h2>
              <p>
                Sann Ascent Co., Ltd.<br />
                1034/141 Moo 3, Liang Mueang Road (Asia Highway), Khuan Lang, Hat Yai District, Songkhla 90110, Thailand<br />
                Email: sannascent.co@gmail.com · WhatsApp: +66 65 634 6834
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
