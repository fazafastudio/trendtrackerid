"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import type { ProductWithCategory, Category } from "@/src/types/database";

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

/* ====== Display Type ====== */
type DisplayProduct = {
  id: string;
  name: string;
  platform: "Shopee" | "TikTok" | "Tokopedia";
  komisi: number;
  score: number;
  terjual: number;
  category: string;
  gradient: string;
  imageUrl: string | null;
  harga: number;
  rating: number;
  jumlahReview: string;
  trend: "up" | "down" | "stable";
};

interface ProductsViewProps {
  initialProducts: ProductWithCategory[];
  categories: Category[];
}

/* ====== Gradients (deterministic placeholder colors) ====== */
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

/* ====== Mapping: DB → Display ====== */
function mapDbToDisplay(
  db: ProductWithCategory,
  gradients: readonly string[]
): DisplayProduct {
  const platformLabel: DisplayProduct["platform"] =
    db.platform === "shopee" ? "Shopee" :
    db.platform === "tiktok" ? "TikTok" : "Tokopedia";

  const hash = db.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const gradient = gradients[hash % gradients.length];

  const rawScore = db.trend_score;
  const score = Math.min(10, Math.max(0, Math.round(rawScore / 10)));

  const trend: DisplayProduct["trend"] =
    rawScore >= 70 ? "up" : rawScore <= 30 ? "down" : "stable";

  return {
    id: db.id,
    name: db.name,
    platform: platformLabel,
    komisi: db.commission_rate,
    score,
    terjual: db.sales_30d,
    category: db.category?.name ?? "Lainnya",
    gradient,
    imageUrl: db.image_url,
    harga: db.price ?? 0,
    rating: db.rating ?? 0,
    jumlahReview: formatTerjual(db.review_count),
    trend,
  };
}

const PER_LOAD = 10;

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

export default function ProductsView({ initialProducts, categories }: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"Semua" | "TikTok" | "Shopee" | "Tokopedia">("Semua");
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
  const [captionModal, setCaptionModal] = useState<{
    open: boolean;
    loading: boolean;
    captions: string[];
    productId: string;
    remainingToday: number;
  }>({ open: false, loading: false, captions: [], productId: "", remainingToday: 3 });

  async function handleGenerateCaption(product: DisplayProduct) {
    setCaptionModal({
      open: true,
      loading: true,
      captions: [],
      productId: product.id,
      remainingToday: 3,
    });

    // 30s timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          harga: product.harga,
          terjual: product.terjual,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setCaptionModal((prev) => ({
        ...prev,
        loading: false,
        captions: data.captions ?? [],
        remainingToday: data.remaining_today ?? 0,
      }));
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        console.error("[Caption] Request timed out after 30s");
      } else {
        console.error("[Caption] Failed to generate:", err);
      }
      setCaptionModal((prev) => ({ ...prev, loading: false, open: false }));
    }
  }

  const products: DisplayProduct[] = useMemo(
    () => initialProducts.map((p) => mapDbToDisplay(p, gradients)),
    [initialProducts]
  );

  const filterCategories = useMemo(
    () => ["Semua", ...categories.map((c) => c.name)],
    [categories]
  );

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
  }, [search, platformFilter, categoryFilter, sort, products]);

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

  const handleFilterChange = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => (value: T) => {
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
          {filterCategories.map((cat) => (
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
            {visible.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/40 transition hover:border-zinc-700/50 hover:bg-zinc-900/70"
              >
                <div
                  className={`relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br ${product.gradient} sm:h-36`}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white/30 sm:text-4xl">
                      {product.name.charAt(0)}
                    </span>
                  )}
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
                    <button
                      onClick={() => handleGenerateCaption(product)}
                      disabled={captionModal.loading && captionModal.productId === product.id}
                      className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {captionModal.loading && captionModal.productId === product.id
                        ? "Generating…"
                        : "Generate Caption"}
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
          {visible.map((product) => {
            const estKomisi = hitungEstimasi(product.harga, product.komisi, product.terjual);
            return (
              <div
                key={product.id}
                className="flex items-start gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-3 transition hover:border-zinc-700/50 hover:bg-zinc-900/70 sm:gap-4 sm:p-4"
              >
                {/* Thumbnail 64x64 */}
                <div
                  className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${product.gradient} sm:h-16 sm:w-16`}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-lg font-bold text-white/30 sm:text-xl">
                      {product.name.charAt(0)}
                    </span>
                  )}
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
                  <button
                    onClick={() => handleGenerateCaption(product)}
                    disabled={captionModal.loading && captionModal.productId === product.id}
                    className="whitespace-nowrap rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {captionModal.loading && captionModal.productId === product.id
                      ? "Generating…"
                      : "Generate Caption"}
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

      {/* ====== Caption Modal ====== */}
      {captionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setCaptionModal({ open: false, loading: false, captions: [], productId: "", remainingToday: 3 })}
              className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
              aria-label="Tutup"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-1 text-lg font-bold text-white">AI Caption</h2>
            <p className="mb-4 text-xs text-zinc-500">
              {captionModal.remainingToday} caption tersisa hari ini
            </p>

            {captionModal.loading && (
              <div className="flex items-center justify-center py-10">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <SpinnerIcon />
                  Generating captions…
                </div>
              </div>
            )}

            {!captionModal.loading && captionModal.captions.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">
                Gagal menghasilkan caption. Coba lagi nanti.
              </p>
            )}

            {!captionModal.loading &&
              captionModal.captions
                .filter((c): c is string => typeof c === "string" && c.length > 0)
                .map((caption, idx) => (
                <div
                  key={idx}
                  className="mb-3 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 last:mb-0"
                >
                  <p className="text-sm leading-relaxed text-zinc-200">
                    {caption}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(caption).catch(() => {});
                    }}
                    className="mt-2 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    Copy Caption
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}