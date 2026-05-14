"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) throw err;
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="border-[1.5px] border-sann-red/15 px-3 py-2.5 rounded-sm text-sm outline-none focus:border-sann-red"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="border-[1.5px] border-sann-red/15 px-3 py-2.5 rounded-sm text-sm outline-none focus:border-sann-red"
        />
      </label>
      {error && (
        <p className="text-sann-red text-sm" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="bg-sann-red hover:bg-sann-red-dk text-white py-3 rounded-sm text-[0.76rem] tracking-[0.16em] uppercase font-bold transition-colors disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
