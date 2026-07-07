import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNotificationEmail, formatFields } from "@/lib/email";

export const runtime = "nodejs";

type Payload = {
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  preferred_unit?: string;
  guest_name?: string;
  phone_line?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const guest_name = body.guest_name?.trim();
  if (!guest_name) {
    return NextResponse.json(
      { error: "Guest name is required" },
      { status: 400 },
    );
  }

  // ── Create the real booking first (forward to the PMS booking engine) ──
  // This is the primary action. It creates a confirmed booking in
  // app.sannstay.com/admin/bookings, and the engine sends the guest
  // confirmation + hotel notification (with booking ref + total).
  let adminBookingRef: string | null = null;
  let adminUnavailable = false;
  let adminErrored = false;
  if (body.check_in_date && body.check_out_date) {
    try {
      const adminApi =
        process.env.ADMIN_BOOKING_API || "https://app.sannstay.com";
      const note = [
        body.preferred_unit ? `ห้องที่สนใจ: ${body.preferred_unit}` : null,
        body.message?.trim() || null,
      ]
        .filter(Boolean)
        .join(" · ");
      const res = await fetch(`${adminApi}/api/public/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_slug: "hatyai",
          check_in_date: body.check_in_date,
          check_out_date: body.check_out_date,
          num_guests: body.number_of_guests ?? 1,
          guest: {
            full_name: guest_name,
            phone: body.phone_line?.trim() || undefined,
            email: body.email?.trim() || undefined,
          },
          note: note || undefined,
        }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        booking_ref?: string;
      };
      if (res.ok && j?.booking_ref) adminBookingRef = j.booking_ref;
      else if (res.status === 409) adminUnavailable = true;
      else adminErrored = true;
    } catch (e) {
      console.error("forward to admin PMS failed", e);
      adminErrored = true;
    }
  }

  // ── Best-effort: archive the lead in booking_inquiries ──
  // Never blocks the booking. If the table doesn't exist (or RLS denies),
  // we just log it — the real booking above is what matters.
  const supabase = await createSupabaseServerClient();
  let inquirySaved = false;
  try {
    const { error } = await supabase.from("booking_inquiries").insert({
      check_in_date: body.check_in_date || null,
      check_out_date: body.check_out_date || null,
      number_of_guests: body.number_of_guests ?? null,
      preferred_unit: body.preferred_unit?.trim() || null,
      guest_name,
      phone_line: body.phone_line?.trim() || null,
      email: body.email?.trim() || null,
      message: body.message?.trim() || null,
    });
    if (error) console.error("booking_inquiries insert failed (non-fatal)", error.message);
    else inquirySaved = true;
  } catch (e) {
    console.error("booking_inquiries insert threw (non-fatal)", e);
  }

  // If nothing was saved anywhere — the booking engine errored AND we couldn't
  // archive the lead — surface a real error so the guest knows to retry.
  if (adminErrored && !adminBookingRef && !adminUnavailable && !inquirySaved) {
    return NextResponse.json(
      { error: "Could not complete your booking — please try again or contact us on WhatsApp." },
      { status: 502 },
    );
  }

  // Notify the hotel inbox ONLY when the admin booking engine did NOT create a
  // booking (dates unavailable, or forward failed but the lead was archived).
  // Successful bookings are already announced by the engine with the real ref.
  if (!adminBookingRef) {
    await sendNotificationEmail({
      subject: adminUnavailable
        ? `Booking attempt (dates unavailable) — ${guest_name}`
        : `New booking inquiry — ${guest_name}`,
      text:
        (adminUnavailable
          ? "A guest tried to book on sannstay.com but the dates were unavailable.\n\n"
          : "A new booking inquiry was submitted on sannstay.com.\n\n") +
        formatFields({
          guest_name,
          phone_line: body.phone_line,
          email: body.email,
          preferred_unit: body.preferred_unit,
          check_in_date: body.check_in_date,
          check_out_date: body.check_out_date,
          number_of_guests: body.number_of_guests,
          message: body.message,
        }) +
        "\n\nView all inquiries: https://sannstay.com/admin",
      replyTo: body.email?.trim() || undefined,
    });
  }

  // Note: the guest confirmation email is now sent by the booking engine
  // (app.sannstay.com /api/public/booking) when the booking is auto-confirmed,
  // so we no longer send sendGuestConfirmation here to avoid duplicate emails.

  return NextResponse.json({
    ok: true,
    booking_ref: adminBookingRef,
    unavailable: adminUnavailable,
  });
}
