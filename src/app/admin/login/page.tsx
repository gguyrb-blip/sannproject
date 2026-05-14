import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/admin");

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border border-sann-red/10 rounded p-8 shadow-[0_10px_36px_rgba(42,31,24,0.06)]">
      <p className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red font-semibold mb-2">
        Admin
      </p>
      <h1 className="font-display text-2xl text-sann-text mb-1">Sign in</h1>
      <p className="text-sm text-sann-text-md mb-6">
        Sign in with the admin email you registered in Supabase.
      </p>
      <LoginForm />
    </div>
  );
}
