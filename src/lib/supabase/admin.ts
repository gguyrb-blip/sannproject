import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client.
 *
 * RULES:
 * - This module imports "server-only" — Next.js will throw at build time if
 *   it is ever imported into a Client Component.
 * - Use ONLY for trusted server-side operations: minting signed URLs for the
 *   private `guest-documents` bucket, etc.
 * - Never expose the service role key to the browser.
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
