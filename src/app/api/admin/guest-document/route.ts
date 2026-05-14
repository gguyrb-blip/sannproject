import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Mints a short-lived signed URL for a guest-document and redirects the
 * admin's browser to it. Only callable by users in the `admins` table.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!adminRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from("guest-documents")
    .createSignedUrl(path, 60 * 5); // 5 minutes

  if (error || !data?.signedUrl) {
    console.error("createSignedUrl failed", error);
    return NextResponse.json({ error: "Could not sign URL" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
