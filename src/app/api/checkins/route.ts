import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail, formatFields } from "@/lib/email";

export const runtime = "nodejs";

type GuestInput = {
  full_name?: string;
  date_of_birth?: string;
  id_passport_number?: string;
};

type Payload = {
  booking_name?: string;
  booking_channel?: string;
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  phone?: string;
  email?: string;
  nationality?: string;
  estimated_arrival_time?: string;
  special_requests?: string;
  consent?: boolean;
  guests?: GuestInput[];
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  let payload: Payload;
  try {
    payload = JSON.parse(payloadRaw) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
  }

  const guests = payload.guests ?? [];
  if (guests.length < 1) {
    return NextResponse.json(
      { error: "At least one guest is required" },
      { status: 400 },
    );
  }
  if (!payload.consent) {
    return NextResponse.json({ error: "Consent is required" }, { status: 400 });
  }

  // Collect + validate one file per guest. Files keyed file_0..file_N.
  const files: File[] = [];
  for (let i = 0; i < guests.length; i += 1) {
    const f = formData.get(`file_${i}`);
    if (!(f instanceof File) || f.size === 0) {
      return NextResponse.json(
        { error: `Guest ${i + 1}: ID / passport image is required` },
        { status: 400 },
      );
    }
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `Guest ${i + 1}: file too large (max 10 MB)` },
        { status: 400 },
      );
    }
    if (f.type && !ALLOWED_TYPES.includes(f.type)) {
      return NextResponse.json(
        {
          error: `Guest ${i + 1}: unsupported file type (use JPG, PNG, WEBP, HEIC or PDF)`,
        },
        { status: 400 },
      );
    }
    if (!guests[i].full_name?.trim()) {
      return NextResponse.json(
        { error: `Guest ${i + 1}: full name is required` },
        { status: 400 },
      );
    }
    files.push(f);
  }

  const admin = createSupabaseAdminClient();
  const uploadedPaths: string[] = [];

  const cleanup = async () => {
    if (uploadedPaths.length === 0) return;
    await admin.storage.from("guest-documents").remove(uploadedPaths);
  };

  // Upload each file under date/uuid.<ext>
  const datePrefix = new Date().toISOString().slice(0, 10);
  const guestsWithFiles = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const safeExt =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) ||
      "bin";
    const path = `${datePrefix}/${crypto.randomUUID()}.${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await admin.storage
      .from("guest-documents")
      .upload(path, arrayBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) {
      console.error("guest-documents upload failed", upErr);
      await cleanup();
      return NextResponse.json(
        { error: "Could not upload guest documents — please try again." },
        { status: 500 },
      );
    }
    uploadedPaths.push(path);
    guestsWithFiles.push({
      full_name: guests[i].full_name!.trim(),
      date_of_birth: guests[i].date_of_birth || null,
      id_passport_number: guests[i].id_passport_number?.trim() || null,
      id_passport_file_path: path,
    });
  }

  // Insert the check-in row via the anon-scoped server client so RLS
  // applies as designed.
  const supabase = await createSupabaseServerClient();
  const primary = guestsWithFiles[0];
  const { error: insErr } = await supabase.from("checkins").insert({
    booking_name: payload.booking_name?.trim() || null,
    booking_channel: payload.booking_channel?.trim() || null,
    check_in_date: payload.check_in_date || null,
    check_out_date: payload.check_out_date || null,
    number_of_guests: payload.number_of_guests ?? guestsWithFiles.length,
    // Primary guest = the first row in the guests list. Kept for backwards
    // compatibility / admin list view.
    guest_full_name: primary.full_name,
    phone: payload.phone?.trim() || null,
    email: payload.email?.trim() || null,
    nationality: payload.nationality?.trim() || null,
    id_passport_number: primary.id_passport_number,
    estimated_arrival_time: payload.estimated_arrival_time?.trim() || null,
    special_requests: payload.special_requests?.trim() || null,
    id_passport_file_path: primary.id_passport_file_path,
    consent: true,
    guests: guestsWithFiles,
  });

  if (insErr) {
    console.error("checkins insert failed", insErr);
    await cleanup();
    return NextResponse.json(
      { error: "Could not save your check-in — please try again." },
      { status: 500 },
    );
  }

  // Notify the hotel inbox. Full ID documents are NOT attached — they
  // live in the private Supabase bucket and are accessible via signed
  // URLs from the admin dashboard.
  const guestSummary = guestsWithFiles
    .map(
      (g, i) =>
        `  ${i + 1}. ${g.full_name}` +
        (g.date_of_birth ? ` · DOB ${g.date_of_birth}` : "") +
        (g.id_passport_number ? ` · ID ${g.id_passport_number}` : ""),
    )
    .join("\n");

  await sendNotificationEmail({
    subject: `New online check-in — ${primary.full_name}`,
    text:
      "A guest just completed the online check-in form.\n\n" +
      formatFields({
        booking_name: payload.booking_name,
        booking_channel: payload.booking_channel,
        check_in_date: payload.check_in_date,
        check_out_date: payload.check_out_date,
        number_of_guests: payload.number_of_guests,
        phone: payload.phone,
        email: payload.email,
        nationality: payload.nationality,
        estimated_arrival_time: payload.estimated_arrival_time,
        special_requests: payload.special_requests,
      }) +
      `\n\nGuests (${guestsWithFiles.length}):\n${guestSummary}` +
      "\n\nID/passport files are stored in Supabase Storage and can be" +
      " viewed (signed link, 5-min expiry) from https://sannstay.com/admin/checkins",
    replyTo: payload.email?.trim() || undefined,
  });

  return NextResponse.json({ ok: true });
}
