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
