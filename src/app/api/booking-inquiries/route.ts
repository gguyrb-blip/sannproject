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

  const supabase = await createSupabaseServerClient();
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

  if (error) {
    console.error("booking_inquiries insert failed", error);
    return NextResponse.json(
      { error: "Could not save your inquiry — please try again." },
      { status: 500 },
    );
  }

  // Fire-and-forget email notification to the hotel inbox.
  await sendNotificationEmail({
    subject: `New booking inquiry — ${guest_name}`,
    text:
      "A new booking inquiry was submitted on sannstay.com.\n\n" +
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

  return NextResponse.json({ ok: true });
}
