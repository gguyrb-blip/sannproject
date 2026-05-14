import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BOOKING_STATUSES, type BookingInquiry } from "@/lib/types";
import { updateBookingInquiry } from "./actions";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  from?: string;
  to?: string;
  status?: string;
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="max-w-md mx-auto bg-white border border-sann-red/10 rounded p-8 mt-10 text-center">
        <p className="font-display text-xl text-sann-red mb-2">Not authorised</p>
        <p className="text-sm text-sann-text-md">
          Your account is signed in but is not an admin. Ask the project owner
          to add your user id to the <code>admins</code> table.
        </p>
        <Link
          href="/admin/login"
          className="inline-block mt-5 text-[0.7rem] tracking-[0.16em] uppercase text-sann-red font-semibold border-b border-sann-red/30 pb-px"
        >
          Sign in as another user
        </Link>
      </div>
    );
  }

  let query = supabase
    .from("booking_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (sp.q) query = query.ilike("guest_name", `%${sp.q}%`);
  if (sp.from) query = query.gte("check_in_date", sp.from);
  if (sp.to) query = query.lte("check_in_date", sp.to);
  if (sp.status && sp.status !== "All") query = query.eq("status", sp.status);

  const { data, error } = await query;
  const rows = (data as BookingInquiry[]) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-[0.62rem] tracking-[0.24em] uppercase text-sann-red font-semibold mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl text-sann-text">
            Booking Inquiries
          </h1>
        </div>
        <p className="text-sm text-sann-text-md">{rows.length} shown</p>
      </div>

      <form
        method="GET"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-white border border-sann-red/10 p-4 rounded"
      >
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search guest name"
          className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm outline-none focus:border-sann-red"
        />
        <input
          name="from"
          type="date"
          defaultValue={sp.from ?? ""}
          className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm outline-none focus:border-sann-red"
        />
        <input
          name="to"
          type="date"
          defaultValue={sp.to ?? ""}
          className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm outline-none focus:border-sann-red"
        />
        <select
          name="status"
          defaultValue={sp.status ?? "All"}
          className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm outline-none focus:border-sann-red"
        >
          <option>All</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="col-span-2 md:col-span-4 flex gap-2">
          <button className="bg-sann-red hover:bg-sann-red-dk text-white px-5 py-2 rounded-sm text-[0.7rem] tracking-[0.16em] uppercase font-semibold">
            Filter
          </button>
          <Link
            href="/admin"
            className="text-[0.7rem] tracking-[0.16em] uppercase text-sann-text-md px-5 py-2 border border-sann-red/15 rounded-sm hover:bg-sann-cream"
          >
            Reset
          </Link>
        </div>
      </form>

      {error && (
        <p className="text-sann-red text-sm mb-4">{error.message}</p>
      )}

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-sann-text-md">No inquiries match.</p>
        )}
        {rows.map((row) => (
          <details
            key={row.id}
            className="bg-white border border-sann-red/10 rounded overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-5 py-4 grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr] gap-3 items-baseline hover:bg-sann-cream/40">
              <div>
                <p className="font-display text-base text-sann-text">
                  {row.guest_name}
                </p>
                <p className="text-xs text-sann-text-md">
                  {row.preferred_unit || "—"}
                </p>
              </div>
              <div className="text-sm text-sann-text-md">
                {row.check_in_date || "—"} → {row.check_out_date || "—"}
                <p className="text-xs text-sann-text-lt">
                  {row.number_of_guests ?? "?"} guests · {row.phone_line || row.email || "—"}
                </p>
              </div>
              <p className="text-[0.65rem] tracking-[0.14em] uppercase font-semibold text-sann-red">
                {row.status}
              </p>
              <p className="text-xs text-sann-text-lt md:text-right">
                {new Date(row.created_at).toLocaleString()}
              </p>
            </summary>
            <form
              action={updateBookingInquiry}
              className="px-5 pb-5 pt-2 border-t border-sann-red/10 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input type="hidden" name="id" value={row.id} />
              <div className="space-y-3">
                <p className="text-xs text-sann-text-md whitespace-pre-wrap">
                  <strong className="text-sann-text">Email:</strong>{" "}
                  {row.email || "—"}
                </p>
                <p className="text-xs text-sann-text-md whitespace-pre-wrap">
                  <strong className="text-sann-text">Message:</strong>{" "}
                  {row.message || "—"}
                </p>
              </div>
              <div className="space-y-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={row.status}
                    className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[0.6rem] tracking-[0.16em] uppercase text-sann-red font-semibold">
                    Internal notes
                  </span>
                  <textarea
                    name="internal_notes"
                    defaultValue={row.internal_notes ?? ""}
                    rows={3}
                    className="border border-sann-red/15 px-3 py-2 rounded-sm text-sm"
                  />
                </label>
                <button className="bg-sann-red hover:bg-sann-red-dk text-white px-5 py-2 rounded-sm text-[0.7rem] tracking-[0.16em] uppercase font-semibold">
                  Save
                </button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}
