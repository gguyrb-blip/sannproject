-- =============================================================
-- SANN Stay — Supabase schema, RLS policies, and storage setup
-- Run this file in Supabase SQL editor on a fresh project.
-- Safe to re-run: every statement is idempotent.
-- =============================================================

-- Required extensions ------------------------------------------------
create extension if not exists "pgcrypto";

-- =============================================================
-- 1. ADMIN ROLE
-- We model "admin" as a row in a small `admins` table keyed by the
-- authenticated user's id. Anyone in this table can read/write the
-- inquiry + check-in tables. Sign up the admin user from Supabase
-- Authentication > Users, then insert their UID here:
--
--   insert into public.admins (user_id) values ('<UUID-of-admin>');
-- =============================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text
);
alter table public.admins enable row level security;

drop policy if exists "admins can read admins" on public.admins;
create policy "admins can read admins"
  on public.admins for select
  using (auth.uid() in (select user_id from public.admins));

-- Helper function used by RLS policies below.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- =============================================================
-- 2. BOOKING INQUIRIES
-- =============================================================
create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  check_in_date date,
  check_out_date date,
  number_of_guests int,
  preferred_unit text,
  guest_name text not null,
  phone_line text,
  email text,
  message text,
  status text not null default 'New',
  internal_notes text
);
create index if not exists booking_inquiries_created_idx
  on public.booking_inquiries (created_at desc);
create index if not exists booking_inquiries_status_idx
  on public.booking_inquiries (status);

alter table public.booking_inquiries enable row level security;

drop policy if exists "public can insert booking inquiries" on public.booking_inquiries;
create policy "public can insert booking inquiries"
  on public.booking_inquiries for insert
  with check (true);

drop policy if exists "admins can read booking inquiries" on public.booking_inquiries;
create policy "admins can read booking inquiries"
  on public.booking_inquiries for select
  using (public.is_admin());

drop policy if exists "admins can update booking inquiries" on public.booking_inquiries;
create policy "admins can update booking inquiries"
  on public.booking_inquiries for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete booking inquiries" on public.booking_inquiries;
create policy "admins can delete booking inquiries"
  on public.booking_inquiries for delete
  using (public.is_admin());

-- =============================================================
-- 3. CHECK-INS
-- =============================================================
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_name text,
  booking_channel text,
  check_in_date date,
  check_out_date date,
  number_of_guests int,
  guest_full_name text not null,
  phone text,
  email text,
  nationality text,
  id_passport_number text,
  estimated_arrival_time text,
  special_requests text,
  id_passport_file_path text,
  consent boolean not null default false,
  status text not null default 'New',
  internal_notes text,
  locker_code text,
  self_checkin_note text,
  -- Per-guest details + ID/passport file path for each guest.
  -- Shape: [{ full_name, date_of_birth, id_passport_number, id_passport_file_path }, ...]
  guests jsonb not null default '[]'::jsonb
);
-- Migration for projects created before `guests` was added.
alter table public.checkins
  add column if not exists guests jsonb not null default '[]'::jsonb;
create index if not exists checkins_created_idx
  on public.checkins (created_at desc);
create index if not exists checkins_status_idx
  on public.checkins (status);

alter table public.checkins enable row level security;

drop policy if exists "public can insert checkins" on public.checkins;
create policy "public can insert checkins"
  on public.checkins for insert
  with check (true);

drop policy if exists "admins can read checkins" on public.checkins;
create policy "admins can read checkins"
  on public.checkins for select
  using (public.is_admin());

drop policy if exists "admins can update checkins" on public.checkins;
create policy "admins can update checkins"
  on public.checkins for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete checkins" on public.checkins;
create policy "admins can delete checkins"
  on public.checkins for delete
  using (public.is_admin());

-- =============================================================
-- 4. STORAGE: guest-documents bucket (PRIVATE)
-- Stores uploaded ID / passport images. The bucket is private —
-- objects can only be accessed via signed URLs minted on the server
-- using the service role key.
-- =============================================================
insert into storage.buckets (id, name, public)
values ('guest-documents', 'guest-documents', false)
on conflict (id) do nothing;

-- Anyone can UPLOAD into guest-documents (so the public /checkin
-- page works without auth) but writes are confined to that bucket
-- and to a path prefix that includes a random uuid generated by
-- the app. We do not allow public reads or listing.
drop policy if exists "public can upload guest documents" on storage.objects;
create policy "public can upload guest documents"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'guest-documents');

drop policy if exists "admins can read guest documents" on storage.objects;
create policy "admins can read guest documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'guest-documents' and public.is_admin());

drop policy if exists "admins can delete guest documents" on storage.objects;
create policy "admins can delete guest documents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'guest-documents' and public.is_admin());
