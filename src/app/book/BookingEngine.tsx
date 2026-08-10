"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PhotoStrip, PhotoViewer } from "@/components/RoomGallery";

// Direct booking engine for sannstay.com. Talks to the PMS on app.sannstay.com:
//   /api/public/availability  → blocked dates + nightly rates (whole-property only)
//   /api/public/stay-options  → bookable units + prices for BOTH property types
//   /api/public/upload-slip   → PromptPay slip storage
// and creates the booking through this site's /api/booking-inquiries (which
// forwards to the PMS and archives the lead).
// Override with NEXT_PUBLIC_ADMIN_API to point local dev at a local PMS.
const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API || "https://app.sannstay.com";

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const todayISO = () => ymd(new Date());
const fmt = (n: number) => "฿" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

type Lang = "th" | "en";
type Step = "property" | "dates" | "rooms" | "details" | "review" | "done";

interface PropertyOption {
  slug: string;
  name: string;
  location: Record<Lang, string>;
  blurb: Record<Lang, string>;
  image: string;
  mapUrl: string;
  priceFrom: string;
  priceUnit: Record<Lang, string>;
  /** Whole-property stays black out a whole date once booked; a hostel does not. */
  wholeProperty: boolean;
}

const PROPERTIES: PropertyOption[] = [
  {
    slug: "hatyai",
    name: "SANN Stay Hatyai",
    location: { th: "4 นาทีถึงลีการ์เดนส์ · หาดใหญ่", en: "4 min to Lee Gardens · Hat Yai" },
    blurb: { th: "บ้านทั้งหลัง 4 ห้องนอน · พักได้ถึง 8 ท่าน", en: "Whole 4-bedroom house · sleeps up to 8" },
    image: "/images/hatyai/1.jpg",
    mapUrl: "https://www.google.com/maps/place/Sann+Stay+Hatyai/@7.00601,100.4706869,17z/data=!4m9!3m8!1s0x304d2953de62bf23:0xe80e20b508560ada!5m2!4m1!1i2!8m2!3d7.00601!4d100.4732618!16s%2Fg%2F11zb2h83ng",
    priceFrom: "฿3,200",
    priceUnit: { th: "/ คืน", en: "/ night" },
    wholeProperty: true,
  },
  {
    slug: "thungsao",
    name: "SANN Thungsao Hostel",
    location: { th: "ใกล้สถานีขนส่ง · หาดใหญ่", en: "Near the bus station · Hat Yai" },
    blurb: { th: "เตียงดอร์ม และห้องส่วนตัว", en: "Dorm beds & private rooms" },
    image: "/images/thungsao-3.jpg",
    mapUrl: "https://www.google.com/maps/place/Sann+Thungsao+Hostel/@6.996861,100.4786758,16z/data=!3m1!4b1!4m9!3m8!1s0x304d290015b65f15:0x79ae42eadb876d81!5m2!4m1!1i2!8m2!3d6.9968557!4d100.4812507!16s%2Fg%2F11njf7jt3d",
    priceFrom: "฿350",
    priceUnit: { th: "/ เตียง / คืน", en: "/ bed / night" },
    wholeProperty: false,
  },
];

interface Unit {
  key: string;
  kind: "whole" | "dorm" | "room";
  // label / bedInfo / description are authored by staff in the PMS
  // (Admin → Rooms) — never hardcode room copy here.
  label: string;
  bedInfo: string | null;
  description: string | null;
  // Uploaded in Admin → Rooms; first photo is the cover. Amenities arrive
  // already labelled by the PMS so there is no catalogue to keep in sync here.
  photos: string[];
  amenities: { key: string; th: string; en: string; icon: string }[];
  roomNumber: string | null;
  capacity: number;
  pricePerNight: number;
  total: number;
  availableCount: number;
  maxQty: number;
}
interface StayOptions {
  property: { slug: string; name: string; type: string; check_in_time: string | null; check_out_time: string | null };
  nights: number;
  closed: boolean;
  reason?: string | null;
  min_nights?: number;
  cleaning_fee: number;
  units: Unit[];
}

const T: Record<Lang, Record<string, string>> = {
  th: {
    step1: "เลือกที่พัก", step2: "เลือกวันเข้าพัก", step3: "เลือกห้องพัก",
    step4: "ข้อมูลผู้จอง", step5: "ตรวจสอบและชำระเงิน",
    from: "เริ่มต้น", guests: "ผู้เข้าพัก", people: "ท่าน", nights: "คืน",
    searchRooms: "ค้นหาห้องว่าง →", checkIn: "เช็กอิน", checkOut: "เช็กเอาต์",
    booked: "จองแล้ว", pickDatesFirst: "กรุณาเลือกวันบนปฏิทิน",
    soldOut: "เต็มแล้ว", left: "เหลือ", perNight: "/ คืน", stayTotal: "รวมทั้งพัก",
    viewPhotos: "ดูรูป",
    payNow: "ชำระเงิน",
    payRedirect: "กำลังพาไปหน้าชำระเงินที่ปลอดภัย…",
    payPending: "การจองของท่านถูกบันทึกแล้ว แต่ยังไม่ได้ชำระเงิน กดปุ่มด้านล่างเพื่อชำระ",
    payChecking: "กำลังตรวจสอบการชำระเงิน…",
    payDone: "ได้รับการชำระเงินเรียบร้อยแล้ว",
    payNotYet: "ยังไม่พบการชำระเงิน — หากท่านชำระแล้ว กรุณารอสักครู่แล้วรีเฟรชหน้านี้",
    noRooms: "ไม่มีห้องว่างในช่วงวันที่เลือก กรุณาเลือกวันอื่น",
    closedRange: "ช่วงวันนี้ปิดรับเข้าพัก", selectAtLeastOne: "กรุณาเลือกห้องหรือเตียงอย่างน้อย 1 รายการ",
    cleaning: "ค่าทำความสะอาด", total: "รวมทั้งหมด", continue: "ดำเนินการต่อ →", back: "← ย้อนกลับ",
    guestName: "ชื่อผู้จอง *", phone: "เบอร์โทร / LINE", email: "อีเมล", message: "ข้อความถึงเรา",
    msgPh: "เวลาถึงโดยประมาณ คำขอพิเศษ ฯลฯ",
    errName: "กรุณากรอกชื่อผู้จอง", errContact: "กรุณากรอกอีเมลหรือเบอร์โทรอย่างน้อย 1 อย่าง",
    payTitle: "ชำระเงินผ่าน PromptPay",
    policyTitle: "นโยบายการยกเลิก",
    policyFree: "ยกเลิกได้ฟรี จนถึง 7 วันก่อนวันเข้าพัก",
    policyCharge: "หากยกเลิกภายใน 7 วันก่อนวันเข้าพัก หรือไม่เข้าพักโดยไม่แจ้งล่วงหน้า (No-show) จะถูกเรียกเก็บเต็มจำนวนของการจอง",
    payDesc: "สแกน QR ด้วยแอปธนาคาร โอนตามยอดรวม แล้วแนบสลิปพร้อมระบุยอดและเวลาที่โอน",
    payAccount: "บัญชี: บจก. ซานน์ แอสเซนต์ (SANN ASCENT)",
    slipLabel: "แนบสลิปการโอนเงิน *", slipPick: "แตะเพื่อเลือกรูปสลิปจากเครื่อง",
    slipChange: "เปลี่ยนรูปสลิป", amountLabel: "ยอดเงินที่โอน (บาท) *", timeLabel: "วันและเวลาที่โอน *",
    errSlip: "กรุณาแนบสลิปการโอนเงิน", errAmount: "กรุณาระบุยอดเงินที่โอน", errTime: "กรุณาระบุวันและเวลาที่โอน",
    confirm: "ยืนยันการจอง →", booking: "กำลังจอง…", uploading: "กำลังอัปโหลดสลิป…",
    verifyNote: "ทีมงานจะตรวจสอบยอดโอนและยืนยันการจองทางอีเมล",
    success: "จองสำเร็จแล้ว!", sentEmail: "เราได้ส่งรายละเอียดทางอีเมลแล้ว ขอบคุณค่ะ 🙏",
    bookingNo: "เลขที่การจอง", errTaken: "ห้องเพิ่งถูกจองไป กรุณาเลือกใหม่", change: "เปลี่ยน",
    viewMap: "ดูแผนที่",
  },
  en: {
    step1: "Choose your stay", step2: "Select your dates", step3: "Choose a room",
    step4: "Your details", step5: "Review & pay",
    from: "From", guests: "Guests", people: "guests", nights: "nights",
    searchRooms: "Search rooms →", checkIn: "Check-in", checkOut: "Check-out",
    booked: "Booked", pickDatesFirst: "Please pick your dates on the calendar",
    soldOut: "Sold out", left: "left", perNight: "/ night", stayTotal: "total stay",
    viewPhotos: "View photos",
    payNow: "Pay now",
    payRedirect: "Taking you to our secure payment page…",
    payPending: "Your reservation is saved but not paid yet. Tap below to pay.",
    payChecking: "Checking your payment…",
    payDone: "Payment received",
    payNotYet: "We haven't seen the payment yet — if you have just paid, wait a moment and refresh this page.",
    noRooms: "No rooms available for those dates — please try different dates.",
    closedRange: "These dates are closed", selectAtLeastOne: "Please select at least one room or bed",
    cleaning: "Cleaning fee", total: "Total", continue: "Continue →", back: "← Back",
    guestName: "Full name *", phone: "Phone / LINE", email: "Email", message: "Message",
    msgPh: "Estimated arrival time, special requests, etc.",
    errName: "Please enter your name", errContact: "Please provide an email or phone number",
    payTitle: "Pay via PromptPay",
    policyTitle: "Cancellation Policy",
    policyFree: "The guest can cancel free of charge until 7 days before arrival.",
    policyCharge: "The guest will be charged the total price of the reservation if they cancel in the 7 days before arrival and no show.",
    payDesc: "Scan the QR with any Thai banking app, pay the total, then attach your slip with the amount and time.",
    payAccount: "Account: Sann Ascent Co., Ltd. (SANN ASCENT)",
    slipLabel: "Attach transfer slip *", slipPick: "Tap to choose the slip from your photos",
    slipChange: "Change slip photo", amountLabel: "Amount transferred (THB) *", timeLabel: "Date & time of transfer *",
    errSlip: "Please attach your transfer slip", errAmount: "Please enter the transferred amount", errTime: "Please enter the transfer date & time",
    confirm: "Confirm booking →", booking: "Booking…", uploading: "Uploading slip…",
    verifyNote: "We verify the transfer and confirm your booking by email.",
    success: "Booking confirmed!", sentEmail: "We've sent the details to your email. Thank you! 🙏",
    bookingNo: "Booking number", errTaken: "That room was just taken — please choose again", change: "Change",
    viewMap: "View map",
  },
};

const DOW: Record<Lang, string[]> = {
  th: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};
const MONTHS: Record<Lang, string[]> = {
  th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const fmtDate = (iso: string, l: Lang) => {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[l][d.getUTCMonth()]} ${l === "th" ? d.getUTCFullYear() + 543 : d.getUTCFullYear()}`;
};

export default function BookingEngine() {
  const [lang, setLang] = useState<Lang>("th");
  const tr = T[lang];
  const [step, setStep] = useState<Step>("property");
  const [property, setProperty] = useState<PropertyOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const toTop = useCallback(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), []);

  // dates
  const today = new Date();
  const [calY, setCalY] = useState(today.getUTCFullYear());
  const [calM, setCalM] = useState(today.getUTCMonth());
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [rates, setRates] = useState<Record<string, number>>({});

  // rooms
  const [options, setOptions] = useState<StayOptions | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [viewer, setViewer] = useState<{ photos: string[]; label: string; start: number } | null>(null);
  // Beam Checkout. When the gateway is live the guest pays on Beam's hosted page
  // right after booking, and the transfer-slip fields are not asked for at all.
  const [gatewayOn, setGatewayOn] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [returned, setReturned] = useState<{ ref: string; paid: boolean | null } | null>(null);

  // guest details
  const [form, setForm] = useState({ guest_name: "", phone_line: "", email: "", message: "" });

  // payment
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ refs: string[]; total: number; nights: number; summary: string | null } | null>(null);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("book_lang")) as Lang | null;
    if (saved === "en" || saved === "th") setLang(saved);
  }, []);

  useEffect(() => {
    fetch(`${ADMIN_API}/api/public/pay-link`)
      .then((r) => r.json()).then((d) => setGatewayOn(!!d?.enabled)).catch(() => {});
  }, []);

  // Beam sends the guest back as /book?paid=SANN00123. The parameter proves
  // nothing by itself, so the result comes from asking our server.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("paid");
    if (!ref) return;
    setReturned({ ref, paid: null });
    setStep("done");
    const check = () =>
      fetch(`${ADMIN_API}/api/stay/pay-status?ref=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then((d) => setReturned({ ref, paid: !!d?.paid }))
        .catch(() => setReturned({ ref, paid: false }));
    void check();
    // The webhook can land a moment after the redirect; one retry covers it.
    const t = setTimeout(check, 4000);
    return () => clearTimeout(t);
  }, []);

  // A property page links here as /book?property=thungsao — skip step 1 when it
  // already knows which stay the guest is looking at. Read from the URL rather
  // than useSearchParams so the page needs no Suspense boundary.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("property");
    const match = PROPERTIES.find((p) => p.slug === slug);
    if (match) { setProperty(match); setStep("dates"); }
  }, []);
  const setLanguage = (l: Lang) => { setLang(l); try { localStorage.setItem("book_lang", l); } catch {} };

  // Blocked dates only make sense for a whole-property stay — for the hostel a
  // single booked bed must NOT grey out the date.
  useEffect(() => {
    if (!property) return;
    setBlocked(new Set()); setRates({});
    if (!property.wholeProperty) return;
    fetch(`${ADMIN_API}/api/public/availability?property_slug=${property.slug}`)
      .then((r) => r.json())
      .then((d) => { setBlocked(new Set(d.unavailable_dates ?? [])); setRates(d.rates ?? {}); })
      .catch(() => {});
  }, [property]);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(calY, calM, 1));
    const daysIn = new Date(Date.UTC(calY, calM + 1, 0)).getUTCDate();
    const arr: (string | null)[] = [];
    for (let i = 0; i < first.getUTCDay(); i++) arr.push(null);
    for (let d = 1; d <= daysIn; d++) arr.push(ymd(new Date(Date.UTC(calY, calM, d))));
    while (arr.length % 7) arr.push(null);
    return arr;
  }, [calY, calM]);

  const nightsFree = (from: string, to: string) => {
    let t = new Date(from + "T00:00:00Z").getTime();
    const end = new Date(to + "T00:00:00Z").getTime();
    while (t < end) { if (blocked.has(new Date(t).toISOString().slice(0, 10))) return false; t += 86_400_000; }
    return true;
  };
  const inRange = (d: string) => !!(checkIn && checkOut && d >= checkIn && d < checkOut);
  // A booked day can still be a valid CHECK-OUT (turnover morning) — only the
  // nights actually slept in must be free.
  const isCheckoutCandidate = (d: string) => !!checkIn && !checkOut && d > checkIn && nightsFree(checkIn, d);

  function clickDay(d: string) {
    if (d < todayISO()) return;
    setOptions(null); setQty({});
    const isBlk = blocked.has(d);
    if (!checkIn || checkOut) { if (isBlk) return; setCheckIn(d); setCheckOut(null); return; }
    if (d <= checkIn) { if (isBlk) return; setCheckIn(d); setCheckOut(null); return; }
    if (nightsFree(checkIn, d)) setCheckOut(d);
    else if (!isBlk) { setCheckIn(d); setCheckOut(null); }
  }
  function shiftMonth(n: number) {
    let m = calM + n, y = calY;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCalM(m); setCalY(y);
  }

  async function searchRooms() {
    if (!property || !checkIn || !checkOut) { setError(tr.pickDatesFirst); return; }
    setError(null); setLoadingRooms(true);
    try {
      const r = await fetch(`${ADMIN_API}/api/public/stay-options?property_slug=${property.slug}&from=${checkIn}&to=${checkOut}&lang=${lang}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "error");
      // photos/amenities are newer fields — an older PMS deploy omits them.
      const o = d as StayOptions;
      o.units = (o.units ?? []).map((u) => ({
        ...u,
        photos: Array.isArray(u.photos) ? u.photos : [],
        amenities: Array.isArray(u.amenities) ? u.amenities : [],
      }));
      setOptions(o);
      setQty({});
      setStep("rooms");
      setTimeout(toTop, 30);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally { setLoadingRooms(false); }
  }

  const picked = useMemo(
    () => (options?.units ?? []).map((u) => ({ unit: u, n: qty[u.key] ?? 0 })).filter((p) => p.n > 0),
    [options, qty],
  );
  const roomsTotal = picked.reduce((s, p) => s + p.unit.total * p.n, 0);
  // unit.total is rooms only. The cleaning fee is charged ONCE per stay (houses
  // only — the hostel returns 0), so add it whenever something is selected.
  const cleaningFee = picked.length > 0 ? options?.cleaning_fee ?? 0 : 0;
  const grandTotal = roomsTotal + cleaningFee;

  function pickSlip(f: File | null) {
    setSlipFile(f);
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipPreview(f ? URL.createObjectURL(f) : null);
  }

  async function submit() {
    if (!property || !checkIn || !checkOut) return;
    setError(null);
    if (!gatewayOn) {
      if (!slipFile) return setError(tr.errSlip);
      if (!transferAmount || !(Number(transferAmount) > 0)) return setError(tr.errAmount);
      if (!transferTime) return setError(tr.errTime);
    }
    setSubmitting(true);
    try {
      let slipPath: string | null = null;
      if (!gatewayOn && slipFile) {
        const fd = new FormData();
        fd.append("file", slipFile);
        const up = await fetch(`${ADMIN_API}/api/public/upload-slip`, { method: "POST", body: fd });
        const upJ = await up.json().catch(() => ({}));
        if (!up.ok || !upJ.path) throw new Error(upJ.error || tr.errSlip);
        slipPath = upJ.path;
      }

      const res = await fetch("/api/booking-inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_slug: property.slug,
          // The house books as a whole; the hostel sends the picked quantities.
          units: property.wholeProperty ? undefined : picked.map((p) => ({ key: p.unit.key, qty: p.n })),
          check_in_date: checkIn, check_out_date: checkOut,
          number_of_guests: guests,
          preferred_unit: picked.map((p) => `${p.unit.label}${p.n > 1 ? ` × ${p.n}` : ""}`).join(" · "),
          guest_name: form.guest_name, phone_line: form.phone_line,
          email: form.email, message: form.message,
          slip_path: slipPath,
          transfer_amount: transferAmount ? Number(transferAmount) : null,
          transfer_time: transferTime ? transferTime.replace("T", " ") : null,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Submission failed");
      if (j.unavailable) throw new Error(tr.errTaken);
      setDone({
        refs: j.booking_refs?.length ? j.booking_refs : j.booking_ref ? [j.booking_ref] : [],
        total: j.total_amount ?? grandTotal,
        nights: options?.nights ?? 0,
        summary: j.unit_summary ?? null,
      });
      setStep("done");
      setTimeout(toTop, 30);

      // Booked — now collect the money on Beam's hosted page. If the link can't
      // be created the reservation still stands; the done screen offers a retry
      // rather than losing it.
      if (gatewayOn) {
        const refs = j.booking_refs?.length ? j.booking_refs : j.booking_ref ? [j.booking_ref] : [];
        const pr = await fetch(`${ADMIN_API}/api/public/pay-link`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_refs: refs }),
        }).then((r) => r.json()).catch(() => null);
        if (pr?.url) { setPayUrl(pr.url); window.location.href = pr.url; }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally { setSubmitting(false); }
  }

  // ────────── shared bits ──────────
  const card = "bg-white border border-sann-red/10 rounded-sann-md shadow-[0_10px_36px_rgba(42,31,24,0.06)]";
  const label = "block text-[0.7rem] tracking-[0.12em] uppercase text-sann-text-lt font-semibold mb-1.5";
  const input = "w-full border border-sann-red/15 rounded-sann-md px-3.5 py-2.5 text-sm bg-white text-sann-text focus:outline-none focus:border-sann-red";
  const btnPrimary = "px-6 py-3 rounded-sann-md bg-sann-red text-white font-semibold text-sm hover:bg-sann-red-dk transition disabled:opacity-50";
  const btnGhost = "px-5 py-3 rounded-sann-md border border-sann-red/20 text-sann-text-md text-sm hover:border-sann-red transition";

  const STEPS: { key: Step; label: string }[] = [
    { key: "property", label: tr.step1 }, { key: "dates", label: tr.step2 },
    { key: "rooms", label: tr.step3 }, { key: "details", label: tr.step4 }, { key: "review", label: tr.step5 },
  ];
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div ref={topRef} className="max-w-3xl mx-auto scroll-mt-24">
      {/* Language toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[0.7rem] text-sann-text-lt">
          {step !== "done" && STEPS.map((s, i) => (
            <span key={s.key} className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[0.6rem] font-bold ${
                i <= stepIndex ? "bg-sann-red text-white" : "bg-sann-beige text-sann-text-lt"}`}>{i + 1}</span>
              {i < STEPS.length - 1 && <span className="w-3 h-px bg-sann-line" />}
            </span>
          ))}
        </div>
        <div className="flex border border-sann-red/15 rounded overflow-hidden shrink-0">
          {(["th", "en"] as Lang[]).map((l) => (
            <button key={l} type="button" onClick={() => setLanguage(l)}
              className={`px-2.5 py-1 text-[0.65rem] font-bold ${lang === l ? "bg-sann-red text-white" : "bg-white text-sann-text-md"}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-sann-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* ══ Step 1 · property ══ */}
      {step === "property" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {PROPERTIES.map((p) => (
            // The card is a plain container: the map link must not be nested
            // inside the select button (invalid HTML + the clicks would fight).
            <div key={p.slug} className={`${card} overflow-hidden flex flex-col group hover:border-sann-red transition`}>
              <button type="button" className="text-left"
                onClick={() => { setProperty(p); setStep("dates"); setTimeout(toTop, 30); }}>
                <span className="block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover group-hover:scale-[1.03] transition duration-500" />
                </span>
                <span className="block px-4 pt-4">
                  <span className="block font-display text-xl text-sann-text leading-tight">{p.name}</span>
                  <span className="block text-[0.8rem] text-sann-text-md mt-1.5 leading-relaxed">{p.blurb[lang]}</span>
                  <span className="block mt-3 text-sann-red font-semibold">
                    <span className="text-[0.7rem] text-sann-text-lt font-normal">{tr.from} </span>
                    {p.priceFrom}<span className="text-[0.7rem] font-normal">{p.priceUnit[lang]}</span>
                  </span>
                </span>
              </button>
              <a href={p.mapUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 mb-4 mx-4 inline-flex items-start gap-1.5 text-[0.75rem] text-sann-text-lt hover:text-sann-red transition">
                <span aria-hidden>📍</span>
                <span className="underline underline-offset-2 decoration-sann-red/30">{p.location[lang]} · {tr.viewMap}</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ══ Step 2 · dates ══ */}
      {step === "dates" && property && (
        <div className={`${card} p-5 lg:p-7`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-xl text-sann-text">{property.name}</p>
              <p className="text-[0.72rem] text-sann-text-lt">{property.location[lang]}</p>
            </div>
            <button type="button" onClick={() => { setStep("property"); setCheckIn(null); setCheckOut(null); }}
              className="text-[0.72rem] text-sann-red underline underline-offset-2">{tr.change}</button>
          </div>

          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => shiftMonth(-1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">‹</button>
            <div className="font-semibold text-sann-text">{MONTHS[lang][calM]} {lang === "th" ? calY + 543 : calY}</div>
            <button type="button" onClick={() => shiftMonth(1)} className="w-9 h-9 border border-sann-red/15 rounded text-sann-red">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {DOW[lang].map((d, i) => (
              <div key={i} className={`text-center text-[0.6rem] font-bold py-1 ${i === 0 || i === 6 ? "text-sann-red" : "text-sann-text-lt"}`}>{d}</div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const isPast = d < todayISO();
              const isBlocked = blocked.has(d);
              const canCheckout = isCheckoutCandidate(d);
              const isCI = d === checkIn, isCO = !!checkOut && d === checkOut;
              const price = rates[d];
              return (
                <button key={d} type="button" disabled={isPast || (isBlocked && !canCheckout)} onClick={() => clickDay(d)}
                  className={`min-h-[46px] rounded flex flex-col items-center justify-center gap-0.5 border ${
                    isCI || isCO ? "border-2 border-sann-red" : "border-sann-red/10"
                  } ${isPast ? "bg-sann-cream/40 opacity-40" : (isBlocked && !canCheckout) ? "bg-red-50"
                    : (isCI || isCO || inRange(d)) ? "bg-sann-red/[0.08]" : "bg-white"}`}>
                  <span className={`text-xs ${isCI || isCO ? "font-extrabold" : "font-medium"} text-sann-text`}>{Number(d.slice(8, 10))}</span>
                  {isBlocked && !canCheckout
                    ? <span className="text-[0.5rem] font-bold text-red-600">{tr.booked}</span>
                    : price != null
                      ? <span className="text-[0.55rem] font-mono text-sann-red">{(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k</span>
                      : null}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="px-3 py-2 rounded-sann-md bg-sann-warm">
              <p className="text-[0.6rem] uppercase tracking-wider text-sann-text-lt">{tr.checkIn}</p>
              <p className="text-sm font-semibold text-sann-text">{checkIn ? fmtDate(checkIn, lang) : "—"}</p>
            </div>
            <div className="px-3 py-2 rounded-sann-md bg-sann-warm">
              <p className="text-[0.6rem] uppercase tracking-wider text-sann-text-lt">{tr.checkOut}</p>
              <p className="text-sm font-semibold text-sann-text">{checkOut ? fmtDate(checkOut, lang) : "—"}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className={label}>{tr.guests}</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-10 h-10 rounded-sann-md border border-sann-red/15 text-lg text-sann-red">−</button>
              <span className="text-lg font-semibold w-10 text-center text-sann-text">{guests}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))}
                className="w-10 h-10 rounded-sann-md border border-sann-red/15 text-lg text-sann-red">+</button>
              <span className="text-sm text-sann-text-lt">{tr.people}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button type="button" className={btnGhost} onClick={() => setStep("property")}>{tr.back}</button>
            <button type="button" className={btnPrimary} disabled={!checkIn || !checkOut || loadingRooms} onClick={searchRooms}>
              {loadingRooms ? "…" : tr.searchRooms}
            </button>
          </div>
        </div>
      )}

      {/* ══ Step 3 · rooms ══ */}
      {step === "rooms" && options && property && (
        <div className={`${card} p-5 lg:p-7`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-xl text-sann-text">{property.name}</p>
              <p className="text-[0.72rem] text-sann-text-lt">
                {checkIn && fmtDate(checkIn, lang)} → {checkOut && fmtDate(checkOut, lang)} · {options.nights} {tr.nights}
              </p>
            </div>
            <button type="button" onClick={() => setStep("dates")}
              className="text-[0.72rem] text-sann-red underline underline-offset-2">{tr.change}</button>
          </div>

          {options.closed || options.units.every((u) => u.availableCount < 1) ? (
            <p className="py-8 text-center text-sm text-sann-text-md">{options.closed ? tr.closedRange : tr.noRooms}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {options.units.map((u) => {
                const n = qty[u.key] ?? 0;
                const out = u.availableCount < 1;
                return (
                  <div key={u.key} className={`border rounded-sann-md overflow-hidden ${out ? "border-sann-line bg-sann-cream/40 opacity-60" : n > 0 ? "border-sann-red bg-sann-red/[0.04]" : "border-sann-red/10"}`}>
                    {u.photos.length > 0 && (
                      <PhotoStrip photos={u.photos} label={u.label} viewLabel={tr.viewPhotos}
                        className="p-1.5 bg-sann-cream/60 border-b border-sann-line/70"
                        onOpen={(i) => setViewer({ photos: u.photos, label: u.label, start: i })} />
                    )}
                    <div className="flex items-start justify-between gap-3 flex-wrap p-4">
                      <div className="min-w-[55%]">
                        <p className="font-semibold text-sann-text">{u.label}</p>
                        {u.bedInfo && (
                          <p className="text-[0.78rem] text-sann-text-md mt-1">{u.bedInfo}</p>
                        )}
                        {u.description && (
                          <p className="text-[0.75rem] text-sann-text-lt mt-1 leading-relaxed whitespace-pre-line">{u.description}</p>
                        )}
                        {u.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {u.amenities.map((a) => (
                              <span key={a.key}
                                className="inline-flex items-center gap-1 rounded-full border border-sann-line bg-white px-2 py-0.5 text-[0.68rem] text-sann-text-md">
                                <span aria-hidden>{a.icon}</span>{lang === "th" ? a.th : a.en}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[0.72rem] text-sann-text-lt mt-1.5">
                          {/* bed_info already states the sleeping arrangement when
                              set, so only the stock "sleeps N" line is dropped —
                              availability always shows. */}
                          {u.bedInfo
                            ? out ? tr.soldOut : `${tr.left} ${u.availableCount}`
                            : u.kind === "dorm"
                            ? `${lang === "th" ? "ต่อเตียง" : "per bed"} · ${out ? tr.soldOut : `${tr.left} ${u.availableCount}`}`
                            : `${lang === "th" ? "พักได้ถึง" : "sleeps"} ${u.capacity} · ${out ? tr.soldOut : `${tr.left} ${u.availableCount}`}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sann-red font-semibold">{fmt(u.pricePerNight)}<span className="text-[0.68rem] font-normal text-sann-text-lt">{tr.perNight}</span></p>
                        <p className="text-[0.68rem] text-sann-text-lt">{fmt(u.total)} {tr.stayTotal}</p>
                      </div>
                    </div>
                    {!out && (
                      <div className="flex items-center gap-3 px-4 pb-4 -mt-1">
                        <button type="button" onClick={() => setQty((q) => ({ ...q, [u.key]: Math.max(0, n - 1) }))}
                          className="w-9 h-9 rounded-sann-md border border-sann-red/15 text-sann-red">−</button>
                        <span className="w-8 text-center font-semibold text-sann-text">{n}</span>
                        <button type="button" onClick={() => setQty((q) => ({ ...q, [u.key]: Math.min(u.maxQty, n + 1) }))}
                          className="w-9 h-9 rounded-sann-md border border-sann-red/15 text-sann-red">+</button>
                        {n > 0 && <span className="text-sm text-sann-text-md ml-auto font-semibold">{fmt(u.total * n)}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {picked.length > 0 && (
            <div className="mt-5 pt-4 border-t border-sann-line flex flex-col gap-1.5">
              {picked.map((p) => (
                <div key={p.unit.key} className="flex justify-between gap-3 text-sm text-sann-text-md">
                  <span>{p.unit.label}{p.n > 1 ? ` × ${p.n}` : ""}</span>
                  <span className="font-mono">{fmt(p.unit.total * p.n)}</span>
                </div>
              ))}
              {cleaningFee > 0 && (
                <div className="flex justify-between gap-3 text-sm text-sann-text-md">
                  <span>{tr.cleaning}</span>
                  <span className="font-mono">{fmt(cleaningFee)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-sann-line">
                <span className="text-sm font-semibold text-sann-text">{tr.total}</span>
                <span className="font-display text-2xl text-sann-red">{fmt(grandTotal)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button type="button" className={btnGhost} onClick={() => setStep("dates")}>{tr.back}</button>
            <button type="button" className={btnPrimary} disabled={picked.length === 0}
              onClick={() => { if (!picked.length) return setError(tr.selectAtLeastOne); setError(null); setStep("details"); setTimeout(toTop, 30); }}>
              {tr.continue}
            </button>
          </div>
        </div>
      )}

      {/* ══ Step 4 · guest details ══ */}
      {step === "details" && (
        <div className={`${card} p-5 lg:p-7`}>
          <p className="font-display text-xl text-sann-text mb-4">{tr.step4}</p>
          <div className="flex flex-col gap-4">
            <div>
              <span className={label}>{tr.guestName}</span>
              <input className={input} value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className={label}>{tr.phone}</span>
                <input className={input} inputMode="tel" value={form.phone_line} onChange={(e) => setForm({ ...form, phone_line: e.target.value })} />
              </div>
              <div>
                <span className={label}>{tr.email}</span>
                <input className={input} type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <span className={label}>{tr.message}</span>
              <textarea className={input} rows={3} placeholder={tr.msgPh} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <button type="button" className={btnGhost} onClick={() => setStep("rooms")}>{tr.back}</button>
            <button type="button" className={btnPrimary}
              onClick={() => {
                if (!form.guest_name.trim()) return setError(tr.errName);
                if (!form.email.trim() && !form.phone_line.trim()) return setError(tr.errContact);
                setError(null);
                setTransferAmount(String(grandTotal));
                setStep("review"); setTimeout(toTop, 30);
              }}>
              {tr.continue}
            </button>
          </div>
        </div>
      )}

      {/* ══ Step 5 · review + pay ══ */}
      {step === "review" && property && options && (
        <div className={`${card} p-5 lg:p-7`}>
          <p className="font-display text-xl text-sann-text mb-4">{tr.step5}</p>

          <div className="rounded-sann-md bg-sann-warm p-4 text-sm text-sann-text-md">
            <p className="font-semibold text-sann-text">{property.name}</p>
            <p className="mt-1">{checkIn && fmtDate(checkIn, lang)} → {checkOut && fmtDate(checkOut, lang)} · {options.nights} {tr.nights} · {guests} {tr.people}</p>
            <div className="mt-3 pt-3 border-t border-sann-red/10 flex flex-col gap-1">
              {picked.map((p) => (
                <div key={p.unit.key} className="flex justify-between gap-3">
                  <span>{p.unit.label}{p.n > 1 ? ` × ${p.n}` : ""}</span>
                  <span className="font-mono">{fmt(p.unit.total * p.n)}</span>
                </div>
              ))}
              {cleaningFee > 0 && (
                <div className="flex justify-between gap-3">
                  <span>{tr.cleaning}</span>
                  <span className="font-mono">{fmt(cleaningFee)}</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-sann-red/10 flex justify-between items-baseline">
              <span className="font-semibold text-sann-text">{tr.total}</span>
              <span className="font-display text-2xl text-sann-red">{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Gateway: nothing to collect here — Beam's hosted page takes card,
              PromptPay, mobile banking and e-wallets on the next screen. */}
          {gatewayOn ? (
            <div className="mt-5 rounded-sann-md border border-sann-red/10 bg-sann-cream/40 p-4 flex items-start gap-3">
              <span aria-hidden className="text-lg leading-none">🔒</span>
              <p className="text-[0.8rem] text-sann-text-md leading-relaxed">
                {tr.payRedirect}
              </p>
            </div>
          ) : (
          /* PromptPay slip — used only while the gateway is unavailable */
          <div className="mt-5">
            <p className="font-semibold text-sann-text">{tr.payTitle}</p>
            <p className="text-[0.78rem] text-sann-text-md mt-1 leading-relaxed">{tr.payDesc}</p>
            <div className="flex justify-center my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/payment-qr.jpg" alt="PromptPay QR — SANN ASCENT"
                className="w-56 max-w-[80%] rounded-sann-md border border-sann-line" />
            </div>
            <p className="text-center text-[0.72rem] text-sann-text-lt">{tr.payAccount}</p>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <span className={label}>{tr.slipLabel}</span>
                <label className={`block border-2 border-dashed rounded-sann-md p-4 text-center cursor-pointer ${slipFile ? "border-sann-success bg-green-50/40" : "border-sann-red/20 bg-sann-cream/50"}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => pickSlip(e.target.files?.[0] ?? null)} />
                  {slipPreview ? (
                    <span className="flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slipPreview} alt="slip" className="max-h-40 rounded" />
                      <span className="text-[0.75rem] text-sann-success font-semibold">{tr.slipChange}</span>
                    </span>
                  ) : (
                    <span className="text-[0.8rem] text-sann-text-md">📎 {tr.slipPick}</span>
                  )}
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className={label}>{tr.amountLabel}</span>
                  <input className={input} inputMode="decimal" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
                </div>
                <div>
                  <span className={label}>{tr.timeLabel}</span>
                  <input className={input} type="datetime-local" value={transferTime} onChange={(e) => setTransferTime(e.target.value)} />
                </div>
              </div>
            </div>
            <p className="text-[0.72rem] text-sann-text-lt mt-3">{tr.verifyNote}</p>
          </div>
          )}

          {/* Payment providers require the cancellation terms to be visible
              before the guest pays, not only in the FAQ. */}
          <div className="mt-5 rounded-sann-md border border-sann-red/15 bg-sann-cream/60 p-4">
            <p className="text-[0.7rem] uppercase tracking-[0.12em] font-semibold text-sann-red mb-2">
              {tr.policyTitle}
            </p>
            <ul className="text-[0.78rem] text-sann-text-md leading-[1.7] list-disc pl-4 space-y-1">
              <li>{tr.policyFree}</li>
              <li>{tr.policyCharge}</li>
            </ul>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button type="button" className={btnGhost} disabled={submitting} onClick={() => setStep("details")}>{tr.back}</button>
            <button type="button" className={btnPrimary} disabled={submitting} onClick={submit}>
              {submitting ? tr.booking : tr.confirm}
            </button>
          </div>
        </div>
      )}

      {/* ══ Done ══ */}
      {/* Back from Beam's checkout. The URL says "paid"; the server says whether
          it really is. */}
      {step === "done" && returned && (
        <div className={`${card} p-10 text-center`}>
          <p className="text-4xl mb-2">{returned.paid === true ? "✅" : returned.paid === null ? "⏳" : "⚠️"}</p>
          <p className="font-display text-2xl text-sann-red mb-3">
            {returned.paid === true ? tr.payDone : returned.paid === null ? tr.payChecking : tr.success}
          </p>
          <p className="text-[0.7rem] uppercase tracking-wider text-sann-text-lt">{tr.bookingNo}</p>
          <p className="font-mono font-bold text-lg mb-2 text-sann-text">{returned.ref}</p>
          {returned.paid === false && (
            <p className="text-[0.82rem] text-sann-text-md leading-[1.7] mt-2">{tr.payNotYet}</p>
          )}
          {returned.paid === true && (
            <p className="text-sann-text-md leading-[1.7] mt-2">{tr.sentEmail}</p>
          )}
        </div>
      )}

      {step === "done" && done && !returned && (
        <div className={`${card} p-10 text-center`}>
          <p className="text-4xl mb-2">✅</p>
          <p className="font-display text-2xl text-sann-red mb-3">{tr.success}</p>
          {done.refs.length > 0 && (
            <>
              <p className="text-[0.7rem] uppercase tracking-wider text-sann-text-lt">{tr.bookingNo}</p>
              <p className="font-mono font-bold text-lg mb-2 text-sann-text">{done.refs.join(" · ")}</p>
            </>
          )}
          {done.summary && <p className="text-sm text-sann-text-md">{done.summary}</p>}
          <p className="text-sann-text-md leading-[1.7] mt-2">
            {done.nights} {tr.nights} · {fmt(done.total)}<br />{tr.sentEmail}
          </p>
          {/* The redirect to Beam didn't happen (popup blocked, or the link
              could not be created). The reservation is real, so offer the
              payment rather than stranding it. */}
          {gatewayOn && (
            <div className="mt-5 rounded-sann-md border border-sann-red/15 bg-sann-cream/60 p-4">
              <p className="text-[0.82rem] text-sann-text-md mb-3">{tr.payPending}</p>
              {payUrl ? (
                <a href={payUrl} className={btnPrimary}>{tr.payNow}</a>
              ) : (
                <button type="button" className={btnPrimary} onClick={async () => {
                  const pr = await fetch(`${ADMIN_API}/api/public/pay-link`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ booking_refs: done.refs }),
                  }).then((r) => r.json()).catch(() => null);
                  if (pr?.url) window.location.href = pr.url;
                  else setError(tr.payNotYet);
                }}>{tr.payNow}</button>
              )}
            </div>
          )}
          <div className="mt-6 text-left rounded-sann-md border border-sann-line bg-sann-cream/50 p-4">
            <p className="text-[0.7rem] uppercase tracking-[0.12em] font-semibold text-sann-red mb-2">
              {tr.policyTitle}
            </p>
            <ul className="text-[0.78rem] text-sann-text-md leading-[1.7] list-disc pl-4 space-y-1">
              <li>{tr.policyFree}</li>
              <li>{tr.policyCharge}</li>
            </ul>
          </div>
        </div>
      )}

      {viewer && (
        <PhotoViewer photos={viewer.photos} start={viewer.start} label={viewer.label}
          onClose={() => setViewer(null)} />
      )}
    </div>
  );
}
