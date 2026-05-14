import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Payload = {
  booking_name?: string;
  booking_channel?: string;
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  guest_full_name?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  id_passport_number?: string;
  estimated_arrival_time?: string;
  special_requests?: string;
  consent?: boolean;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "ID / passport image is required" },
      { status: 400 },
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type (use JPG, PNG, WEBP, HEIC or PDF)" },
      { status: 400 },
    );
  }

  let payload: Payload;
  try {
    payload = JSON.parse(payloadRaw) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
  }

  if (!payload.guest_full_name?.trim()) {
    return NextResponse.json(
      { error: "Guest full name is required" },
      { status: 400 },
    );
  }
  if (!payload.consent) {
    return NextResponse.json(
      { error: "Consent is required" },
      { status: 400 },
    );
  }

  // Use the service role client server-side for the upload so we can
  // keep the bucket fully private (no anon read access). Anon could
  // also insert per RLS, but admin client keeps the path opaque.
  const admin = createSupabaseAdminClient();

  const safeExt =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) ||
    "bin";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await admin.storage
    .from("guest-documents")
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (upErr) {
    console.error("guest-documents upload failed", upErr);
    return NextResponse.json(
      { error: "Could not upload your document — please try again." },
      { status: 500 },
    );
  }

  // Insert the check-in row. We use the anon-scoped server client so the
  // INSERT is governed by the existing public-insert RLS policy.
  const supabase = await createSupabaseServerClient();
  const { error: insErr } = await supabase.from("checkins").insert({
    booking_name: payload.booking_name?.trim() || null,
    booking_channel: payload.booking_channel?.trim() || null,
    check_in_date: payload.check_in_date || null,
    check_out_date: payload.check_out_date || null,
    number_of_guests: payload.number_of_guests ?? null,
    guest_full_name: payload.guest_full_name.trim(),
    phone: payload.phone?.trim() || null,
    email: payload.email?.trim() || null,
    nationality: payload.nationality?.trim() || null,
    id_passport_number: payload.id_passport_number?.trim() || null,
    estimated_arrival_time: payload.estimated_arrival_time?.trim() || null,
    special_requests: payload.special_requests?.trim() || null,
    id_passport_file_path: path,
    consent: true,
  });

  if (insErr) {
    console.error("checkins insert failed", insErr);
    // Best-effort cleanup of the orphan file.
    await admin.storage.from("guest-documents").remove([path]);
    return NextResponse.json(
      { error: "Could not save your check-in — please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
