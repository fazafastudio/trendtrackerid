"use client";

import { useState, useMemo, useEffect, useRef } from "react";

/* ====== Inline SVG Icons ====== */
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function SpinnerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ====== Data Dummy ====== */
interface Product {
  name: string;
  platform: "TikTok" | "Shopee";
  komisi: number;
  score: number;
  terjual: number;
  category: string;
  gradient: string;
  harga: number;
  rating: number;
  jumlahReview: string;
  trend: "up" | "down" | "stable";
}

const gradients = [
  "from-rose-600 to-pink-600",
  "from-violet-600 to-purple-600",
  "from-cyan-600 to-blue-600",
  "from-amber-600 to-orange-600",
  "from-emerald-600 to-teal-600",
  "from-fuchsia-600 to-pink-600",
  "from-sky-600 to-indigo-600",
  "from-lime-600 to-green-600",
  "from-red-600 to-rose-600",
  "from-teal-600 to-cyan-600",
  "from-purple-600 to-violet-600",
  "from-orange-600 to-amber-600",
  "from-indigo-600 to-purple-600",
  "from-pink-600 to-rose-600",
  "from-green-600 to-emerald-600",
  "from-blue-600 to-cyan-600",
  "from-yellow-600 to-amber-600",
  "from-slate-600 to-zinc-600",
  "from-neutral-600 to-stone-600",
  "from-red-700 to-orange-700",
  "from-violet-700 to-fuchsia-700",
  "from-teal-700 to-emerald-700",
  "from-cyan-700 to-sky-700",
  "from-rose-700 to-pink-700",
  "from-amber-700 to-yellow-700",
  "from-lime-700 to-green-700",
  "from-purple-700 to-indigo-700",
  "from-blue-700 to-violet-700",
  "from-orange-700 to-red-700",
  "from-emerald-700 to-teal-700",
];

const products: Product[] = [
  { name: "Serum Vitamin C Brightening 30ml", platform: "TikTok", komisi: 25, score: 9.2, terjual: 342, category: "Skincare", gradient: gradients[0], harga: 75000, rating: 4.8, jumlahReview: "1.2rb", trend: "up" },
  { name: "Tumbler Stainless 1L Insulated", platform: "Shopee", komisi: 15, score: 8.7, terjual: 567, category: "Rumah Tangga", gradient: gradients[1], harga: 85000, rating: 4.6, jumlahReview: "856", trend: "up" },
  { name: "Sandal Jepit Emoji Lucu", platform: "TikTok", komisi: 30, score: 8.5, terjual: 891, category: "Fashion", gradient: gradients[2], harga: 25000, rating: 4.3, jumlahReview: "2.1rb", trend: "up" },
  { name: "Alat Pel Multifungsi 360°", platform: "Shopee", komisi: 20, score: 7.8, terjual: 234, category: "Rumah Tangga", gradient: gradients[3], harga: 65000, rating: 4.5, jumlahReview: "456", trend: "stable" },
  { name: "Snack Sehat Granola Bar 12pcs", platform: "TikTok", komisi: 35, score: 9.5, terjual: 1203, category: "Makanan", gradient: gradients[4], harga: 45000, rating: 4.7, jumlahReview: "3.4rb", trend: "up" },
  { name: "Charger Wireless Fast Charging", platform: "Shopee", komisi: 12, score: 7.2, terjual: 456, category: "Elektronik", gradient: gradients[5], harga: 120000, rating: 4.2, jumlahReview: "678", trend: "stable" },
  { name: "Masker Wajah Collagen Sheet 10pcs", platform: "TikTok", komisi: 28, score: 8.9, terjual: 678, category: "Skincare", gradient: gradients[6], harga: 35000, rating: 4.9, jumlahReview: "2.3rb", trend: "up" },
  { name: "Sepatu Running Ringan Pria", platform: "Shopee", komisi: 18, score: 8.1, terjual: 189, category: "Fashion", gradient: gradients[7], harga: 150000, rating: 4.4, jumlahReview: "312", trend: "stable" },
  { name: "Camilan Sehat Almond Roasted 500g", platform: "TikTok", komisi: 32, score: 9.0, terjual: 756, category: "Makanan", gradient: gradients[8], harga: 55000, rating: 4.7, jumlahReview: "1.8rb", trend: "up" },
  { name: "Kabel Data USB-C Braided 2M", platform: "Shopee", komisi: 10, score: 6.8, terjual: 1102, category: "Elektronik", gradient: gradients[9], harga: 25000, rating: 4.1, jumlahReview: "4.5rb", trend: "down" },
  { name: "Parfum Pria Long Lasting 100ml", platform: "TikTok", komisi: 22, score: 8.3, terjual: 423, category: "Fashion", gradient: gradients[10], harga: 135000, rating: 4.6, jumlahReview: "987", trend: "up" },
  { name: "Panci Listrik Serbaguna 3-in-1", platform: "Shopee", komisi: 16, score: 7.5, terjual: 312, category: "Elektronik", gradient: gradients[11], harga: 200000, rating: 4.3, jumlahReview: "234", trend: "stable" },
  { name: "Lip Cream Matte Tahan Lama 12 Jam", platform: "TikTok", komisi: 27, score: 8.8, terjual: 523, category: "Skincare", gradient: gradients[12], harga: 40000, rating: 4.8, jumlahReview: "1.5rb", trend: "up" },
  { name: "Organizer Kosmetik Akrilik", platform: "Shopee", komisi: 14, score: 7.0, terjual: 345, category: "Rumah Tangga", gradient: gradients[13], harga: 55000, rating: 4.4, jumlahReview: "678", trend: "stable" },
  { name: "Jaket Hoodie Oversize Casual", platform: "TikTok", komisi: 20, score: 8.2, terjual: 678, category: "Fashion", gradient: gradients[14], harga: 110000, rating: 4.5, jumlahReview: "1.1rb", trend: "up" },
  { name: "Air Fryer Digital 5.5L", platform: "Shopee", komisi: 8, score: 6.5, terjual: 234, category: "Elektronik", gradient: gradients[15], harga: 350000, rating: 4.2, jumlahReview: "456", trend: "down" },
  { name: "Kopi Arabika Premium 250g", platform: "TikTok", komisi: 30, score: 9.1, terjual: 890, category: "Makanan", gradient: gradients[16], harga: 65000, rating: 4.9, jumlahReview: "2.8rb", trend: "up" },
  { name: "Set Peralatan Masak Anti Lengket", platform: "Shopee", komisi: 12, score: 7.3, terjual: 167, category: "Rumah Tangga", gradient: gradients[17], harga: 180000, rating: 4.3, jumlahReview: "345", trend: "down" },
  { name: "Toner Wajah Dengan Salicylic Acid", platform: "TikTok", komisi: 24, score: 8.6, terjual: 445, category: "Skincare", gradient: gradients[18], harga: 60000, rating: 4.7, jumlahReview: "934", trend: "up" },
  { name: "Gantungan Kunci Custom Nama", platform: "Shopee", komisi: 40, score: 7.9, terjual: 1123, category: "Fashion", gradient: gradients[19], harga: 15000, rating: 4.1, jumlahReview: "5.6rb", trend: "up" },
  { name: "Mie Instan Premium Rasa Kaldu", platform: "TikTok", komisi: 38, score: 8.4, terjual: 1567, category: "Makanan", gradient: gradients[20], harga: 20000, rating: 4.5, jumlahReview: "7.8rb", trend: "up" },
  { name: "Speaker Bluetooth Portable 20W", platform: "Shopee", komisi: 11, score: 7.1, terjual: 334, category: "Elektronik", gradient: gradients[21], harga: 160000, rating: 4.3, jumlahReview: "567", trend: "stable" },
  { name: "Sunscreen SPF 50 PA++++", platform: "TikTok", komisi: 26, score: 9.3, terjual: 789, category: "Skincare", gradient: gradients[22], harga: 55000, rating: 4.9, jumlahReview: "3.2rb", trend: "up" },
  { name: "Rak Dinding Minimalis Kayu", platform: "Shopee", komisi: 18, score: 6.9, terjual: 456, category: "Rumah Tangga", gradient: gradients[23], harga: 45000, rating: 4.0, jumlahReview: "789", trend: "stable" },
  { name: "Cincin Emas Imitasi Wanita", platform: "TikTok", komisi: 33, score: 8.0, terjual: 567, category: "Fashion", gradient: gradients[24], harga: 35000, rating: 4.2, jumlahReview: "1.3rb", trend: "up" },
  { name: "Robot Vacuum Cleaner Lantai", platform: "Shopee", komisi: 7, score: 6.2, terjual: 123, category: "Elektronik", gradient: gradients[25], harga: 500000, rating: 4.1, jumlahReview: "189", trend: "down" },
  { name: "Sereal Sarapan Tinggi Serat 500g", platform: "TikTok", komisi: 29, score: 8.7, terjual: 678, category: "Makanan", gradient: gradients[26], harga: 48000, rating: 4.6, jumlahReview: "1.6rb", trend: "up" },
  { name: "Tissue Basah Antibakteri 60s", platform: "Shopee", komisi: 35, score: 7.6, terjual: 2345, category: "Rumah Tangga", gradient: gradients[27], harga: 18000, rating: 4.4, jumlahReview: "9.2rb", trend: "up" },
  { name: "Body Lotion Melembabkan 24 Jam", platform: "TikTok", komisi: 23, score: 8.1, terjual: 456, category: "Skincare", gradient: gradients[28], harga: 52000, rating: 4.5, jumlahReview: "1.1rb", trend: "stable" },
  { name: "Topi Baseball Oversize Unisex", platform: "Shopee", komisi: 25, score: 7.4, terjual: 789, category: "Fashion", gradient: gradients[29], harga: 38000, rating: 4.3, jumlahReview: "2.2rb", trend: "down" },
];

const categories = ["Semua", "Skincare", "Fashion", "Elektronik", "Makanan", "Rumah Tangga"];

const PER_LOAD = 10;

/* ====== Helpers ====== */
function formatTerjual(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "rb";
  return n.toString();
}

function formatRupiah(n: number) {
  if (n >= 1000000) return "Rp" + (n / 1000000).toFixed(1) + "jt";
  if (n >= 1000) return "Rp" + n.toLocaleString("id-ID");
  return "Rp" + n;
}

function hitungEstimasi(harga: number, komisi: number, terjual: number) {
  const total = harga * (komisi / 100) * terjual;
  if (total >= 1000000) return "Rp" + (total / 1000000).toFixed(1) + "jt";
  return "Rp" + Math.round(total).toLocaleString("id-ID");
}

/* ====== Score Badge ====== */
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 8
        ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
        : "text-zinc-400 border-zinc-600/30 bg-zinc-700/30";
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

/* ====== Platform Badge ====== */
function PlatformBadge({ platform }: { platform: string }) {
  const isTikTok = platform === "TikTok";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        isTikTok ? "bg-pink-500/10 text-pink-400" : "bg-orange-500/10 text-orange-400"
      }`}
    >
      {platform}
    </span>
  );
}

/* ====== Trend Indicator ====== */
function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <span className="text-emerald-400 text-xs font-medium">↑</span>;
  if (trend === "down") return <span className="text-red-400 text-xs font-medium">↓</span>;
  return <span className="text-zinc-500 text-xs">→</span>;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"Semua" | "TikTok" | "Shopee">("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [sort, setSort] = useState<"score" | "komisi" | "terjual">("score");
  const [view, setView] = useState<"list" | "grid">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("productsView") as "list" | "grid") || "list";
    }
    return "list";
  });
  const [visibleCount, setVisibleCount] = useState(PER_LOAD);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("productsView", view);
  }, [view]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (platformFilter !== "Semua") {
      result = result.filter((p) => p.platform === platformFilter);
    }

    if (categoryFilter !== "Semua") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "komisi") return b.komisi - a.komisi;
      return b.terjual - a.terjual;
    });

    return result;
  }, [search, platformFilter, categoryFilter, sort]);

  useEffect(() => {
    setVisibleCount(PER_LOAD);
  }, [search, platformFilter, categoryFilter, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore || loading) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + PER_LOAD);
            setLoading(false);
          }, 400);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleFilterChange = (setter: any) => (value: any) => {
    setter(value);
    setVisibleCount(PER_LOAD);
  };

  const toggleView = () => {
    setView((v) => (v === "grid" ? "list" : "grid"));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {/* ====== Header ====== */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Riset Produk</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Temukan produk potensial dari TikTok Shop & Shopee dengan analisis AI.
        </p>
      </div>

      {/* ====== Sticky Filter Bar ====== */}
      <div className="sticky top-14 z-40 -mx-4 -mt-2 mb-6 border-b border-zinc-800/40 bg-[#0a0a0f]/95 px-4 py-3 backdrop-blur-lg sm:top-14 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
              className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-zinc-700 focus:bg-zinc-900"
            />
          </div>

          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
            {(["Semua", "TikTok", "Shopee"] as const).map((p) => (
              <button
                key={p}
                onClick={() => handleFilterChange(setPlatformFilter)(p)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  platformFilter === p
                    ? "bg-zinc-800 text-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              title="Urutkan produk"
              value={sort}
              onChange={(e) => handleFilterChange(setSort)(e.target.value as typeof sort)}
              className="h-9 appearance-none rounded-lg border border-zinc-800 bg-zinc-900/60 pl-3 pr-8 text-sm text-zinc-300 outline-none transition focus:border-zinc-700"
            >
              <option value="score">AI Score</option>
              <option value="komisi">Komisi %</option>
              <option value="terjual">Terjual</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-500">
              <ChevronDownIcon />
            </div>
          </div>

          <button
            onClick={toggleView}
            aria-label={view === "grid" ? "Tampilan list" : "Tampilan grid"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:text-zinc-200"
          >
            {view === "grid" ? <ListIcon /> : <GridIcon />}
          </button>

          <span className="text-xs text-zinc-600">
            {filtered.length} produk
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(setCategoryFilter)(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                categoryFilter === cat
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-800/60 text-zinc-500 border border-transparent hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ====== Product Display ====== */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="text-sm font-medium text-zinc-400">Produk tidak ditemukan</p>
          <p className="text-xs text-zinc-600">Coba ubah kata kunci atau filter</p>
        </div>
      ) : view === "grid" ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {visible.map((product, i) => (
              <div
                key={i}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/40 transition hover:border-zinc-700/50 hover:bg-zinc-900/70"
              >
                <div
                  className={`flex h-28 items-center justify-center bg-gradient-to-br ${product.gradient} sm:h-36`}
                >
                  <span className="text-3xl font-bold text-white/30 sm:text-4xl">
                    {product.name.charAt(0)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-white sm:text-base">
                    {product.name}
                  </h3>

                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <PlatformBadge platform={product.platform} />
                    <span className="text-[11px] text-zinc-500">
                      {product.komisi}%
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>📦 {formatTerjual(product.terjual)}/hari</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <ScoreBadge score={product.score} />
                    </div>
                    <button className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition hover:bg-emerald-500/20">
                      Generate Caption
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ====== LIST VIEW ====== */
        <div className="space-y-2">
          {visible.map((product, i) => {
            const estKomisi = hitungEstimasi(product.harga, product.komisi, product.terjual);
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-3 transition hover:border-zinc-700/50 hover:bg-zinc-900/70 sm:gap-4 sm:p-4"
              >
                {/* Thumbnail 64x64 */}
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient} sm:h-16 sm:w-16`}
                >
                  <span className="text-lg font-bold text-white/30 sm:text-xl">
                    {product.name.charAt(0)}
                  </span>
                </div>

                {/* Info center */}
                <div className="min-w-0 flex-1">
                  {/* Baris 1: Nama + Trend */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-medium text-white sm:text-base">
                      {product.name}
                    </h3>
                    <TrendIndicator trend={product.trend} />
                  </div>

                  {/* Baris 2: Platform · Kategori · Rating */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                    <PlatformBadge platform={product.platform} />
                    <span>{product.category}</span>
                    <span className="text-zinc-600">·</span>
                    <span>⭐ {product.rating.toFixed(1)}</span>
                    <span className="text-zinc-600">·</span>
                    <span>{product.jumlahReview} review</span>
                  </div>

                  {/* Baris 3: Harga · Komisi · Terjual */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                    <span>Harga: {formatRupiah(product.harga)}</span>
                    <span className="text-zinc-600">·</span>
                    <span>Komisi {product.komisi}%</span>
                    <span className="text-zinc-600">·</span>
                    <span>📦 {formatTerjual(product.terjual)}/hari</span>
                  </div>

                  {/* Baris 4: Est. komisi/hari */}
                  <div className="mt-1 text-xs font-bold text-emerald-400">
                    Est. komisi/hari: {estKomisi}
                  </div>
                </div>

                {/* Score + CTA (kanan) */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <ScoreBadge score={product.score} />
                  <button className="whitespace-nowrap rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition hover:bg-emerald-500/20">
                    Generate Caption
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====== Infinite Scroll Sentinel ====== */}
      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <SpinnerIcon />
              Memuat produk...
            </div>
          ) : (
            <div className="h-1 w-full max-w-xs rounded-full bg-zinc-800">
              <div
                className="h-1 rounded-full bg-emerald-500/30 transition-all"
                style={{ width: `${(visibleCount / filtered.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {!hasMore && filtered.length > 0 && (
        <p className="py-6 text-center text-xs text-zinc-600">
          Menampilkan semua {filtered.length} produk
        </p>
      )}
    </div>
  );
}