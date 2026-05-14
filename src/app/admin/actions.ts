"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!admin) throw new Error("Not authorised");
  return supabase;
}

export async function updateBookingInquiry(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  const status = formData.get("status");
  const internal_notes = formData.get("internal_notes");

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("booking_inquiries")
    .update({
      status: status ? String(status) : undefined,
      internal_notes: internal_notes != null ? String(internal_notes) : undefined,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateCheckin(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  const status = formData.get("status");
  const internal_notes = formData.get("internal_notes");
  const locker_code = formData.get("locker_code");
  const self_checkin_note = formData.get("self_checkin_note");

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("checkins")
    .update({
      status: status ? String(status) : undefined,
      internal_notes: internal_notes != null ? String(internal_notes) : undefined,
      locker_code: locker_code != null ? String(locker_code) : undefined,
      self_checkin_note:
        self_checkin_note != null ? String(self_checkin_note) : undefined,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/checkins");
}
