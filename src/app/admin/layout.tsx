import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-sann-off">
      <header className="bg-sann-text text-white px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-display text-lg">
          Sann <span className="italic text-sann-red-lt">Admin</span>
        </Link>
        <nav className="flex items-center gap-4">
          {data.user && (
            <>
              <Link
                href="/admin"
                className="text-[0.7rem] tracking-[0.16em] uppercase hover:text-sann-beige transition-colors"
              >
                Inquiries
              </Link>
              <Link
                href="/admin/checkins"
                className="text-[0.7rem] tracking-[0.16em] uppercase hover:text-sann-beige transition-colors"
              >
                Check-ins
              </Link>
              <LogoutButton />
            </>
          )}
        </nav>
      </header>
      <main className="px-4 lg:px-10 py-8">{children}</main>
    </div>
  );
}
