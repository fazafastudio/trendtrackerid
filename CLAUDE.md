# TrendTracker ID — Master Context

## Stack
- **Next.js 16** (App Router, `"use client"` for interactivity)
- **Tailwind CSS v4** (no external UI libraries)
- **Supabase** (Auth, Postgres)
- **TypeScript** (strict mode)
- **@supabase/ssr** (middleware + server/client auth)

---

## Struktur Folder
```
root/
├── app/
│   ├── layout.tsx              # Root layout: <Navbar /> + <main>{children}</main>
│   ├── page.tsx                # Landing page (hero, fitur, pricing, footer)
│   ├── navbar.tsx              # "use client" — auth-aware navbar with dropdown
│   ├── login/page.tsx          # Login form (email/password + Google OAuth + show/hide password)
│   ├── register/page.tsx       # Register form (nama + email + password + confirm + Google OAuth)
│   ├── dashboard/page.tsx      # Dashboard (4 stat cards + 5 dummy products trending)
│   ├── products/page.tsx       # Riset produk (30 dummy, search, filter, sort, infinite scroll, list/grid)
│   ├── auth/callback/route.ts  # OAuth callback → exchangeCodeForSession → redirect /dashboard
│   ├── globals.css             # Tailwind directives
│   └── manifest.ts             # PWA manifest
├── src/lib/
│   ├── supabase/
│   │   ├── client.ts           # createBrowserClient() — for client components
│   │   └── server.ts           # createServerSupabaseClient() — for server/route handlers
│   └── supabase.ts             # DEPRECATED — re-export shim for backward compat
├── middleware.ts                # Route protection: /dashboard & /products → login ; /login & /register → dashboard
└── .env.local                   # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Design System
| Token | Value |
|---|---|
| Background | `#0a0a0f` |
| Surface | `zinc-800/900` |
| Accent | `emerald-400/500` |
| Text primary | `zinc-100` / `white` |
| Text secondary | `zinc-400` / `zinc-500` |
| Danger | `red-400` text, `red-950/50` bg |
| Border | `zinc-700/800` |
| Radius | `rounded-lg` (8px), `rounded-xl` (12px) |
| Font | default Tailwind (system sans-serif) |

---

## Supabase Auth (Completed)

### Login (`app/login/page.tsx`)
- Email + password form
- Google OAuth button (white bg, Google SVG logo, loading state)
- Divider "atau" between OAuth and form
- Show/hide password toggle (eye SVG icons)
- Error: "Invalid login credentials" → "Email atau password salah."
- Redirect to `/dashboard` after success

### Register (`app/register/page.tsx`)
- Nama lengkap + email + password + konfirmasi password
- Google OAuth button ("Daftar dengan Google")
- Validasi: password min 6 karakter, confirm must match
- Show/hide toggle on both password fields
- Sends `full_name` to `user_metadata`
- Redirect to `/dashboard` after success

### Auth Callback (`app/auth/callback/route.ts`)
- GET handler, receives `code` query param
- `exchangeCodeForSession(code)` from Supabase
- Redirect to `/dashboard` on success, `/login?error=auth_failed` on failure

### Navbar (`app/navbar.tsx`)
- `useEffect` on mount: `getUser()` + `onAuthStateChange()` subscription
- **Not logged in**: Fitur & Harga (landing only) + Login + Daftar Gratis
- **Logged in**: Avatar (initials, emerald-500 bg) → dropdown with:
  - Name & email (truncated)
  - Dashboard link
  - Logout button (red-400)
- Dropdown closes on click outside (`mousedown` listener via `useRef`)

### Middleware (`middleware.ts`)
- Uses `createServerClient` directly from `@supabase/ssr` with request/response cookie handling
- **Rule 1**: Not logged in → `/dashboard` or `/products` → redirect to `/login`
- **Rule 2**: Logged in → `/login` or `/register` → redirect to `/dashboard`
- Matcher excludes static files, images, favicon, manifest

---

## Halaman Detail

### Landing (`app/page.tsx`) — `"use client"`
- Badge "AI-Powered Affiliate Tool"
- Hero: headline with gradient text, subtitle, 2 CTA buttons (Mulai Gratis, Lihat Demo)
- 3 feature cards: Riset Produk AI, Generate Caption Otomatis, Multi Platform
- Pricing: Free (gratis, 4 features) & Pro (Rp99rb/bulan, 6 features) — Pro card has "POPULER" badge
- Footer with logo, links, copyright
- All SVG icons inline (Sparkles, Brain, PenLine, Globe, Check)

### Dashboard (`app/dashboard/page.tsx`) — `"use client"`
- Greeting "Selamat Datang 👋"
- 4 stat cards (grid 2x2 → 4col on lg):
  - Produk Trending: 1,284 (+12.5%)
  - Total Komisi: Rp8.4jt (+23.1%)
  - Caption Generated: 456 (+18.7%)
  - Akun Aktif: 89 (+5.2%)
- Section "🔥 Produk Trending Hari Ini" with "Lihat Semua →"
- 5 dummy products: name, platform badge (TikTok=pink, Shopee=orange), komisi %, score badge
- ScoreBadge inline component (emerald ≥9, yellow ≥8.5, zinc otherwise)

### Products (`app/products/page.tsx`) — `"use client"`
- 30 dummy products across 5 categories: Skincare, Fashion, Elektronik, Makanan, Rumah Tangga
- Each product: name, platform, komisi %, score, terjual/hari, category, gradient bg, harga, rating, jumlah review, trend (up/down/stable)
- **Filters bar** (sticky, top-14):
  - Search input with icon
  - Platform toggle: Semua / TikTok / Shopee
  - Category pills (buttons)
  - Sort dropdown: AI Score / Komisi % / Terjual
  - List/Grid toggle button (saved to localStorage)
  - Product count badge
- **List view**: thumbnail gradient, name + trend indicator, platform badge · category · rating · reviews, harga · komisi% · terjual/hari, estimated commission/day (emerald bold), AI Score badge, "Generate Caption" button
- **Grid view**: 2-3 columns, gradient banner thumbnail, name, platform badge + komisi%, terjual/hari, AI Score, Generate Caption
- **Infinite scroll**: IntersectionObserver, 10 products per load, loading spinner, progress bar
- Empty state: 🔍 "Produk tidak ditemukan"
- Helper functions: `formatTerjual()`, `formatRupiah()`, `hitungEstimasi()`

---

## Supabase Client Pattern

### Client component (navbar, login, register — files inside `app/` with `"use client"`)
```ts
import { createClient } from "@/src/lib/supabase/client";
const supabase = createClient();
```

### Server component / route handler (files inside `app/` without `"use client"`, e.g. route.ts)
```ts
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
const supabase = await createServerSupabaseClient();
```

### Middleware
```ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
// Uses request.cookies.getAll() / .set() — no import from supabase/client or /server
```

---

## Dependencies
```json
{
  "next": "16.2.7",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "@supabase/supabase-js": "^2.49.4",
  "@supabase/ssr": "^0.6.1"
}
```

---

## Konvensi Kode
- TypeScript strict mode — `noEmit`, `moduleResolution: "bundler"`, path alias `@/*`
- Tailwind CSS only — NO CSS modules, NO `@apply`, NO styled-components
- Inline SVG icons — NO icon library
- `"use client"` only where needed: form handlers, click events, `useState`, `useEffect`, `useRef`
- Semantic HTML: `<nav>`, `<section>`, `<footer>`, `<label htmlFor>`, `autoComplete`, `tabIndex={-1}`
- All imports use `@/` prefix
- Loading states: `disabled` + opacity for buttons, spinner for infinite scroll
- Error display: bordered red box with `red-950/50` bg
- Server components default, client only when interactivity needed

---

## Status Fitur
- ✅ Landing page (hero, fitur, pricing, footer)
- ✅ Dashboard (stat cards + dummy products)
- ✅ Products page (search, filter, sort, infinite scroll, list/grid toggle, estimasi komisi)
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Route protection (middleware dual logic)
- ✅ Auth callback handler
- ✅ Auth-aware navbar (avatar + dropdown)
- ❌ Database schema (belum dibuat)
- ❌ Real data integration
- ❌ Generate caption functionality (button exists, no backend yet)

---

## Catatan Penting
1. **Middleware cookies**: Wajib pakai pola `let supabaseResponse = NextResponse.next({ request })` + `setAll()` yang creates new response, bukan `cookies()` dari `next/headers`
2. **Navbar auth**: Wajib ada `getUser()` + `onAuthStateChange()` + cleanup subscription
3. **Products sorting/filtering**: Semua client-side via `useMemo` — data dummy di-hardcode
4. **View toggle**: Pakai `localStorage` dengan key `"productsView"`
5. **Path alias**: `@/` maps to root project
6. **AGENTS.md**: Ada file AGENTS.md di root yang bilang "baca docs di node_modules/next/dist/docs/ sebelum nulis kode"