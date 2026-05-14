"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      onClick={() =>
        start(async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          router.replace("/admin/login");
          router.refresh();
        })
      }
      className="text-[0.7rem] tracking-[0.16em] uppercase bg-sann-red hover:bg-sann-red-dk px-3 py-1.5 rounded-sm transition-colors disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
