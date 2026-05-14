# Sann Stay

Production Next.js rebuild of the Sann Stay boutique-hospitality marketing site (Hat Yai, Thailand), with a full guest-facing booking inquiry + online check-in flow and a protected admin dashboard.

The site is migrated **off** Google Apps Script and runs entirely on:

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (Postgres, Auth, Storage) — Free Plan
- **Vercel** — Free Plan
- Custom domain: **sannstay.com**

---

## Routes

| Path        | Purpose                                                                |
| ----------- | ---------------------------------------------------------------------- |
| `/`         | Marketing landing page (hero, properties, about, testimonials, FAQ)    |
| `/book`     | Booking inquiry form (also reachable from the Book Now modal anywhere) |
| `/checkin`  | Public online check-in form with ID/passport upload                    |
| `/location` | Getting Here page with Google Maps embed + nearby places               |
| `/admin`    | Protected dashboard — booking inquiries                                |
| `/admin/checkins` | Protected dashboard — check-in submissions                       |
| `/admin/login`    | Admin sign-in (Supabase email/password)                          |

---

## Local development

```bash
git clone https://github.com/gguyrb-blip/sannproject.git
cd sannproject
cp .env.local.example .env.local
# Fill in your Supabase URL + keys (see "Supabase setup" below)
npm install
npm run dev
```

Open <http://localhost:3000>.

Run typecheck / lint:

```bash
npm run typecheck
npm run lint
```

---

## Supabase setup

### 1. Create a new project

1. <https://supabase.com/dashboard/projects> → **New project** (Free tier is fine).
2. Wait for the database to come up.
3. From **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Paste those into `.env.local` (locally) and Vercel Project Settings → Environment Variables (production).

> **Never** commit the service role key, and never expose it client-side. It is only imported by `src/lib/supabase/admin.ts`, which is marked `server-only`.

### 2. Run the schema

Open **SQL Editor** in Supabase and paste/execute the contents of [`supabase/schema.sql`](./supabase/schema.sql).

This creates:

- `admins` table (membership controls who can read/update inquiries + check-ins)
- `booking_inquiries` table
- `checkins` table
- `is_admin()` helper function
- Row-Level Security policies that allow **anyone to INSERT** but **only admins to SELECT/UPDATE/DELETE**
- The private `guest-documents` storage bucket plus its policies

### 3. Create your admin user

1. In Supabase → **Authentication → Users → Add user**, create the admin's account (Email + Password). Confirm the email.
2. Copy the new user's UID.
3. In **SQL Editor**:

   ```sql
   insert into public.admins (user_id, display_name)
   values ('PASTE-USER-UID-HERE', 'Site Owner');
   ```

You can now sign in at `/admin/login`.

### 4. (Optional) Disable public sign-ups

`Authentication → Providers → Email → Allow new users to sign up` → **off**. Only the owner needs an account.

---

## Vercel deployment

1. Push this repo to GitHub.
2. <https://vercel.com/new> → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Add Environment Variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://sannstay.com`
5. **Deploy**. The first build will produce a `*.vercel.app` URL — confirm everything works there before pointing DNS.

### Attach the custom domain

1. Vercel → Project → **Settings → Domains → Add** → enter `sannstay.com` and `www.sannstay.com`.
2. Vercel will show you which DNS records to create (see GoDaddy section below).
3. Once DNS propagates (usually under 30 min, sometimes up to a few hours), Vercel issues an HTTPS certificate automatically.
4. Set `sannstay.com` as the **Production** domain so `https://sannstay.com` is the canonical URL.

---

## GoDaddy DNS setup for sannstay.com

In GoDaddy → **My Products → sannstay.com → DNS**:

1. **Delete** any default parked-page records on `@` or `www` that conflict.
2. Add an **A record** for the apex (`@`):
   - **Type:** A
   - **Name:** `@`
   - **Value:** `76.76.21.21` (Vercel's apex IP — Vercel will confirm the value in its dashboard)
   - **TTL:** 1 Hour
3. Add a **CNAME** for `www`:
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com.`
   - **TTL:** 1 Hour
4. (Optional but recommended) Use Vercel's redirect from `www → apex` so the canonical URL is `https://sannstay.com`.

Then back in **Vercel → Domains**, click **Refresh** until both domains show ✅.

> If you currently use any GoDaddy email forwarding or MX records (e.g. for `sannascent.co@gmail.com`-like aliases), do **not** delete the MX records. Only the A/CNAME records for web traffic should be replaced.

---

## How to update images later

All marketing imagery is referenced from one file: [`src/lib/site-data.ts`](./src/lib/site-data.ts).

- **Hero photo:** `HERO_IMAGE` (and `HERO_IMAGE_MOBILE`).
- **About photos:** `ABOUT_IMAGE_MAIN`, `ABOUT_IMAGE_SECONDARY`.
- **Gallery strip:** `GALLERY_IMAGES`.
- **Per-property photos:** the `images` array on each entry in `PROPERTIES`.

Recommended workflow:

1. Drop optimised images (≤ 200 KB each, 1600px wide) into `public/images/` — e.g. `public/images/hero.jpg`.
2. Reference them as `/images/hero.jpg` instead of the placeholder Unsplash URL.

Tailwind/Next will not need rebuilding logic — `site-data.ts` is the single source of truth.

---

## How to add more properties later

Open [`src/lib/site-data.ts`](./src/lib/site-data.ts) and append a new entry to `PROPERTIES`:

```ts
{
  id: "sann-new-property",        // unique slug
  name: "Sann New Property",
  tag: "Now Open",                // or "Opening Soon"
  location: "📍 Short description",
  description: "Long-form description shown on the card.",
  amenities: ["📶 WiFi", "❄️ AC", ...],
  price: "฿1,500",
  priceUnit: "/ night",
  images: [
    "/images/new-property/1.jpg",
    "/images/new-property/2.jpg",
    ...
  ],
  airbnbUrl: "https://www.airbnb.com/rooms/XXXXX",
  bookingUrl: "https://www.booking.com/hotel/...",
  status: "open",
},
```

Also add the new property name to `PREFERRED_UNITS` in [`src/lib/types.ts`](./src/lib/types.ts) so guests can select it in the booking form.

That's it — the grid, modal, and admin filtering all pick up the new entry automatically.

---

## How to replace the Google Maps URL

In [`src/lib/site-data.ts`](./src/lib/site-data.ts), update:

- `GOOGLE_MAPS_EMBED_URL` — the URL Google shows under **Share → Embed a map → Copy HTML** (just the `src=""` value).
- `GOOGLE_MAPS_OPEN_URL` — the plain map URL (the one Google offers under **Share → Send a link**).

Both are placeholder constants right now — no other code changes are needed.

---

## Architecture notes

### Security

- **Anonymous users can only INSERT** into `booking_inquiries`, `checkins`, and into the `guest-documents` bucket — they cannot read anything back.
- **Admins** (rows in `public.admins`) can read and update all inquiries and check-ins; the dashboard goes through the standard anon-key client, so RLS does the gating.
- The **service role key** is only used inside `src/lib/supabase/admin.ts` (marked `server-only`) for two narrow tasks:
  1. Uploading guest documents to the private bucket with an opaque, server-chosen path.
  2. Minting short-lived signed URLs (`/api/admin/guest-document`) so an admin can view a document. The URL is gated by the user's Supabase session and admin membership before being issued.
- A Next.js **middleware** at `src/middleware.ts` keeps the Supabase auth cookie fresh on every request so admin server components always see a current session.

### File layout

```
src/
├─ app/
│  ├─ layout.tsx              # Root layout + fonts + BookingModalProvider
│  ├─ page.tsx                # Home
│  ├─ globals.css
│  ├─ book/                   # /book inquiry page
│  ├─ checkin/                # /checkin online check-in
│  ├─ location/               # /location getting here
│  ├─ admin/                  # /admin protected area
│  └─ api/
│     ├─ booking-inquiries/   # POST inquiry
│     ├─ checkins/            # POST check-in (multipart with file)
│     └─ admin/guest-document # GET signed URL (admin-only)
├─ components/                # Header, Hero, modal, sliders, sections, etc.
├─ lib/
│  ├─ site-data.ts            # Single source of truth for content/images
│  ├─ types.ts                # Status enums + DB row types
│  └─ supabase/
│     ├─ client.ts            # Browser anon client
│     ├─ server.ts            # Server anon client (cookies)
│     └─ admin.ts             # service-role client (server-only!)
└─ middleware.ts              # Keeps the auth cookie fresh
supabase/
└─ schema.sql                 # DB schema + RLS + storage policies
```

### Why not Google Apps Script anymore?

- The custom domain `sannstay.com` always serves the React app — no `script.google.com` redirects.
- Form data goes to Supabase, which gives proper relational storage, query power, and a real admin UI.
- File uploads (ID/passport) live in a private Supabase bucket — Apps Script could not enforce per-document access control as cleanly.

---

## Smoke-test checklist

After deploying:

- [ ] Home page renders, sliders auto-advance, modal opens from header, sticky bar (mobile), and property cards.
- [ ] `/book` submission saves a row in `booking_inquiries`.
- [ ] `/checkin` submission uploads a file to `guest-documents` and saves a row in `checkins`.
- [ ] `/admin/login` accepts your admin email + password.
- [ ] `/admin` shows the inquiry you just submitted; status + notes can be saved.
- [ ] `/admin/checkins` shows the check-in submission, and the signed-URL link opens the uploaded file.
- [ ] Site URL stays on `https://sannstay.com/...` for every navigation.
- [ ] Layout looks good in Safari iOS, Chrome Android, and the LINE / Facebook in-app browsers.
