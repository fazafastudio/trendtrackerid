# TrendTracker ID

**Tool riset produk untuk affiliate TikTok Shop & Shopee.**

## Stack
- **Next.js 16** (App Router) + **Tailwind CSS v4** + **Supabase**
- TypeScript, @supabase/ssr, @supabase/supabase-js

## Struktur
```
app/
├── page.tsx              → Landing (hero, fitur, pricing)
├── navbar.tsx            → Auth-aware (belum login / sudah login + dropdown)
├── layout.tsx            → Root layout
├── login/page.tsx        → Login (email/password + Google OAuth)
├── register/page.tsx     → Register (nama, email, password + Google OAuth)
├── dashboard/page.tsx    → Dashboard (stat cards + produk trending dummy)
├── products/page.tsx     → Riset produk (30 dummy, search, filter, sort, infinite scroll, list/grid)
├── auth/callback/route.ts → OAuth callback handler
├── globals.css
└── manifest.ts
src/lib/supabase/
├── client.ts   → createBrowserClient() untuk client components
└── server.ts   → createServerSupabaseClient() untuk server/route handlers
middleware.ts   → Proteksi route: /dashboard & /products → login ; /login & /register → dashboard
```

## Design
- Background: `#0a0a0f`, Surface: `zinc-800/900`, Accent: `emerald-400/500`
- Dark theme, Tailwind only, no external UI libs

## Status Fitur
- ✅ Landing page (hero, fitur, pricing)
- ✅ Dashboard (stat cards + dummy products)
- ✅ Products (filter, sort, infinite scroll, list/grid, estimasi komisi)
- ✅ Auth (email/password + Google OAuth, route protection, callback)
- ✅ Navbar (auth-aware, avatar dropdown, logout)
- ❌ Database schema
- ❌ Data real

## Konvensi
- TypeScript strict, Tailwind only, inline SVG icons
- Client components (`"use client"`) hanya untuk interaktivitas
- Import: `@/src/lib/supabase/client` atau `/server`
- Middleware pakai `createServerClient` langsung dari `@supabase/ssr`
- Path alias `@/` = root project