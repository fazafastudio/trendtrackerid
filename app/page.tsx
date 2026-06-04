"use client";

import Link from "next/link";

/* ====== Inline SVG Icons ====== */
function SparklesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4m0 10v4m-7-11h4m6 0h4m-9.5 2.5L6 18l3.5-3.5M18 6l-3.5 3.5" />
    </svg>
  );
}

function BrainIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 0-4 4c0 1.1.5 2 1.2 2.7A4 4 0 0 0 8 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4c0-1.1-.5-2-1.2-2.7A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" />
      <path d="M8 12H4m16 0h-4M8 18v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function PenLineIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function GlobeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ====== Features Data ====== */
const features = [
  {
    icon: BrainIcon,
    title: "Riset Produk AI",
    desc: "Analisis ribuan produk TikTok Shop & Shopee dalam detik. Dapatkan data komisi, tren penjualan, dan potensi revenue.",
  },
  {
    icon: PenLineIcon,
    title: "Generate Caption Otomatis",
    desc: "Buat caption promosi yang engaging dengan AI. Sesuaikan tone, target audiens, dan platform dalam satu klik.",
  },
  {
    icon: GlobeIcon,
    title: "Multi Platform",
    desc: "Pantau produk dari TikTok Shop dan Shopee dalam satu dashboard. Bandingkan performa lintas platform dengan mudah.",
  },
];

/* ====== Pricing Data ====== */
const plans = [
  {
    name: "Free",
    price: "Gratis",
    desc: "Coba fitur dasar untuk memulai riset produk.",
    features: [
      "10 produk trending/hari",
      "AI Score dasar",
      "Caption dasar",
      "1 platform",
    ],
    cta: "Mulai Gratis",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "Rp99.000",
    period: "/bulan",
    desc: "Untuk affiliate yang serius max-in komisi.",
    features: [
      "Produk trending unlimited",
      "AI Score akurat",
      "Caption premium + variasi",
      "Multi platform (TikTok & Shopee)",
      "Export data CSV",
      "Prioritas support",
    ],
    cta: "Langganan Sekarang",
    href: "/register",
    featured: true,
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* ========== HERO ========== */}
      <section className="flex flex-col items-center py-10 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1 text-xs font-medium text-emerald-400">
          <SparklesIcon size={14} />
          AI-Powered Affiliate Tool
        </div>

        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl sm:leading-tight">
          Temukan Produk Trending,
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Raih Komisi Maksimal
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base sm:leading-relaxed">
          TrendTracker ID membantu affiliate TikTok Shop & Shopee menemukan
          produk terbaik dengan analisis AI, generate caption otomatis, dan
          dashboard real-time.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto"
          >
            Mulai Gratis
          </Link>
          <Link
            href="#fitur"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-6 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100 sm:w-auto"
          >
            Lihat Demo
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-xs text-zinc-600">
          Digunakan oleh 89+ affiliate marketer aktif
        </p>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="fitur" className="scroll-mt-20 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Fitur Unggulan
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Semua yang kamu butuhkan untuk sukses jadi affiliate.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 transition duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/80 sm:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Icon />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="harga" className="scroll-mt-20 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Pilih Plan Terbaik
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Mulai gratis, upgrade kapan saja.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 transition ${
                plan.featured
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
                  : "border-zinc-800/60 bg-zinc-900/50 hover:border-zinc-700/60"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-semibold text-white">
                  POPULER
                </div>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-500">{plan.desc}</p>

              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckIcon />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-6 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 hover:bg-emerald-400"
                    : "border border-zinc-700/60 bg-zinc-800/50 text-zinc-200 hover:border-zinc-600"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-zinc-800/40 py-6 text-center text-xs text-zinc-600">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] font-bold text-white">
              T
            </div>
            <span className="text-sm font-medium text-zinc-400">
              TrendTracker ID
            </span>
          </div>
          <div className="flex gap-5">
            <a href="#fitur" className="hover:text-zinc-400">Fitur</a>
            <a href="#harga" className="hover:text-zinc-400">Harga</a>
            <a href="/dashboard" className="hover:text-zinc-400">Dashboard</a>
          </div>
        </div>
        <p className="mt-4">
          &copy; {new Date().getFullYear()} TrendTracker ID. All rights reserved.
        </p>
      </footer>
    </div>
  );
}