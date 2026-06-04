import "server-only";

/**
 * Email notifications via Resend.
 *
 * Setup:
 *   1. Sign up at https://resend.com (free tier: 100 emails/day, no card)
 *   2. Create an API key under https://resend.com/api-keys
 *   3. In Vercel → Settings → Environment Variables add:
 *      - RESEND_API_KEY        = re_xxx...
 *      - NOTIFICATION_EMAIL    = sannascent.co@gmail.com
 *      - EMAIL_FROM (optional) = "Sann Stay <bookings@sannstay.com>"
 *        (if omitted we fall back to Resend's onboarding@resend.dev)
 *
 * If RESEND_API_KEY is not set, `sendNotificationEmail` is a no-op
 * (logs a warning) so the form submission still succeeds and the data
 * is saved to Supabase.
 */
export async function sendNotificationEmail({
  subject,
  text,
  html,
  replyTo,
}: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM || "Sann Stay <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[email] RESEND_API_KEY or NOTIFICATION_EMAIL not set — skipping email notification",
    );
    return { skipped: true as const };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html: html ?? text.replace(/\n/g, "<br>"),
      replyTo,
    });
    if (result.error) {
      console.error("[email] resend error", result.error);
      return { skipped: false, error: result.error };
    }
    return { skipped: false, id: result.data?.id };
  } catch (err) {
    console.error("[email] send failed", err);
    return { skipped: false, error: err };
  }
}

/**
 * Send a booking confirmation to the GUEST (the customer who booked).
 * From: EMAIL_FROM (bookings@sannstay.com once the domain is verified in Resend).
 * Reply-to: NOTIFICATION_EMAIL (sannascent.co@gmail.com) so replies reach the hotel.
 * No-op if RESEND_API_KEY is missing or the guest gave no email.
 */
export async function sendGuestConfirmation(params: {
  to: string;
  guestName: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  bookingRef?: string | null;
  unit?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "SANN Stay <onboarding@resend.dev>";
  const replyTo = process.env.NOTIFICATION_EMAIL; // hotel Gmail
  if (!apiKey || !params.to) {
    console.warn("[email] skip guest confirmation — no API key or guest email");
    return { skipped: true as const };
  }

  const nights =
    params.checkIn && params.checkOut
      ? Math.max(
          0,
          Math.round(
            (+new Date(params.checkOut) - +new Date(params.checkIn)) /
              86_400_000,
          ),
        )
      : 0;

  const fmtTH = (d?: string) =>
    d
      ? new Date(d + "T00:00:00").toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const subject = "ได้รับคำขอจองของคุณแล้ว · SANN Stay Hatyai";
  const html = `
  <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#3F2B22;">
    <div style="background:linear-gradient(135deg,#B23D1D,#8E2F12);color:#fff;padding:28px 24px;border-radius:16px 16px 0 0;">
      <div style="font-size:13px;letter-spacing:2px;opacity:.85;">SANN STAY · HATYAI</div>
      <h1 style="margin:8px 0 0;font-size:24px;">ขอบคุณที่จองค่ะ 🙏</h1>
    </div>
    <div style="border:1px solid #ECDFCF;border-top:none;border-radius:0 0 16px 16px;padding:24px;">
      <p>เรียน คุณ${params.guestName},</p>
      <p>ทางเราได้รับคำขอจองของคุณเรียบร้อยแล้ว รายละเอียดดังนี้:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:15px;">
        ${params.bookingRef ? `<tr><td style="padding:8px 0;color:#8B8178;">เลขจอง</td><td style="padding:8px 0;text-align:right;font-weight:700;font-family:monospace;">${params.bookingRef}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#8B8178;border-top:1px solid #F4E5D3;">เช็กอิน</td><td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #F4E5D3;">${fmtTH(params.checkIn)}</td></tr>
        <tr><td style="padding:8px 0;color:#8B8178;border-top:1px solid #F4E5D3;">เช็กเอาต์</td><td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #F4E5D3;">${fmtTH(params.checkOut)}${nights ? ` (${nights} คืน)` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#8B8178;border-top:1px solid #F4E5D3;">จำนวนผู้เข้าพัก</td><td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #F4E5D3;">${params.guests ?? "—"} ท่าน</td></tr>
        ${params.unit ? `<tr><td style="padding:8px 0;color:#8B8178;border-top:1px solid #F4E5D3;">ห้องที่สนใจ</td><td style="padding:8px 0;text-align:right;font-weight:600;border-top:1px solid #F4E5D3;">${params.unit}</td></tr>` : ""}
      </table>
      <div style="background:#FBF5EC;border:1px solid #ECDFCF;border-radius:12px;padding:14px 16px;font-size:14px;">
        <b>สถานะ: รอยืนยัน</b><br/>
        ทางเราจะติดต่อกลับเพื่อยืนยันห้องว่างและแจ้งวิธีชำระเงินโดยเร็วที่สุดค่ะ
      </div>
      <p style="font-size:13px;color:#8B8178;margin-top:20px;">
        หากมีคำถาม ตอบกลับอีเมลนี้ได้เลย หรือทักไลน์ของเราค่ะ<br/>
        — ทีมงาน SANN Stay
      </p>
    </div>
  </div>`;

  const text = `เรียน คุณ${params.guestName},
ทางเราได้รับคำขอจอง SANN Stay Hatyai ของคุณแล้วค่ะ

${params.bookingRef ? `เลขจอง: ${params.bookingRef}\n` : ""}เช็กอิน: ${fmtTH(params.checkIn)}
เช็กเอาต์: ${fmtTH(params.checkOut)}${nights ? ` (${nights} คืน)` : ""}
จำนวนผู้เข้าพัก: ${params.guests ?? "—"} ท่าน

สถานะ: รอยืนยัน — ทางเราจะติดต่อกลับเพื่อยืนยันและแจ้งวิธีชำระเงินโดยเร็วที่สุดค่ะ

— ทีมงาน SANN Stay`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject,
      text,
      html,
      replyTo,
    });
    if (result.error) {
      console.error("[email] guest confirmation error", result.error);
      return { skipped: false, error: result.error };
    }
    return { skipped: false, id: result.data?.id };
  } catch (err) {
    console.error("[email] guest confirmation failed", err);
    return { skipped: false, error: err };
  }
}

/** Format a `Record<string, unknown>` as a plain-text block for email bodies. */
export function formatFields(fields: Record<string, unknown>): string {
  return Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => {
      const label = k
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `${label}: ${String(v)}`;
    })
    .join("\n");
}
