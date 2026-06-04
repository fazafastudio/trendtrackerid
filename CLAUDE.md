# TrendTracker ID

Tool riset produk trending untuk affiliate TikTok Shop & Shopee Indonesia.
Dual purpose: pakai sendiri + demo kredibilitas untuk apply API resmi TikTok Shop.

## Stack
- Next.js 16 App Router + Tailwind CSS v4 + Supabase + TypeScript
- Auth: Supabase (email/password + Google OAuth)
- DB: PostgreSQL via Supabase (raw SQL migrations, no ORM)
- Deploy: Vercel

## Struktur
app/
├── page.tsx                    → Landing
├── layout.tsx + navbar.tsx     → Root layout + auth-aware navbar
├── login/ + register/          → Auth pages
├── dashboard/                  → Stat cards + top trending
├── products/                   → Riset produk (filter, sort, infinite scroll, grid/list)
├── auth/callback/route.ts      → OAuth callback
└── api/scrape/shopee/route.ts  → Scraper endpoint (Bearer token auth, maxDuration 55s)

src/lib/supabase/
├── client.ts   → createBrowserClient()
├── server.ts   → createServerClient()
└── service.ts  → service-role singleton (scraper, scripts)

middleware.ts → /dashboard & /products → redirect login jika belum auth

## Design System
- Background #0a0a0f, Surface zinc-800/900, Accent emerald-400/500
- Dark theme, Tailwind only, inline SVG, no UI lib

## Env Keys
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SCRAPER_SECRET

## Roadmap
[1] STABILISASI     ← CURRENT PHASE
[2] AI FEATURE      (caption generator, AI score real)
[3] GROWTH & POLISH (TikTok scraper, bookmark, analytics)
[4] MONETISASI      (Midtrans, subscription gate) ← LAST

## Phase 1 — Stabilisasi
- [X] 1.1 PWA icons (icon-192.png + icon-512.png di public/)
- [X] 1.2 Vercel cron untuk auto-scraper
- [ ] 1.3 Fix hardcoded stats dashboard (Caption=0, Akun Aktif=1)
- [ ] 1.4 Product image dari Shopee (image_url → UI)
- [ ] 1.5 next.config.ts → remotePatterns untuk cf.shopee.co.id
- [ ] 1.6 Hapus deprecated src/lib/supabase.ts shim

## Phase 2 — AI Feature
- [ ] 2.1 Integrasi AI API (Gemini/OpenAI) untuk generate caption TikTok
- [ ] 2.2 Sambungkan tombol Generate Caption di products-view
- [ ] 2.3 Fix AI Score (ganti heuristic jadi formula transparan)
- [ ] 2.4 Rate limit caption (Free: 3/hari, Pro: unlimited — siapkan logic)

## Phase 3 — Growth & Polish
- [ ] 3.1 TikTok Shop scraper
- [ ] 3.2 Bookmark produk (tabel sudah ada di DB)
- [ ] 3.3 Analytics (Posthog/Umami)
- [ ] 3.4 README.md update + dokumentasi deploy

## Phase 4 — Monetisasi
- [ ] 4.1 Tabel subscriptions di Supabase
- [ ] 4.2 Integrasi Midtrans
- [ ] 4.3 Feature gate Free vs Pro
- [ ] 4.4 Halaman billing + webhook

## Status Terakhir
Phase 1 aktif. Task 1.1 (PWA icons) — NEXT.
Dashboard & Products sudah terhubung ke Supabase (bukan dummy).
Scraper Shopee sudah ada, belum ada cron otomatis.