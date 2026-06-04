import type { ProductWithCategory } from "@/src/types/database";

/* ====== Inline SVG Icons ====== */
function TrendingUpIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function DollarSignIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function MessageSquareIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UsersIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

type TopProductDisplay = {
  id: string;
  name: string;
  platform: "Shopee" | "TikTok" | "Tokopedia";
  komisi: number;
  score: number;
  platformColor: string;
  platformBg: string;
};

interface DashboardViewProps {
  trendingCount: number;
  totalKomisi: number;
  topProducts: ProductWithCategory[];
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "jt";
  if (n >= 1_000) return n.toLocaleString("id-ID");
  return String(n);
}

function formatRupiah(n: number): string {
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "jt";
  if (n >= 1_000) return "Rp " + n.toLocaleString("id-ID");
  return "Rp " + n;
}

function mapTopProduct(db: ProductWithCategory): TopProductDisplay {
  const platformLabel: TopProductDisplay["platform"] =
    db.platform === "shopee" ? "Shopee" :
    db.platform === "tiktok" ? "TikTok" : "Tokopedia";
  const isShopee = platformLabel === "Shopee";
  const score = Math.min(10, Math.max(0, Math.round(db.trend_score / 10)));
  return {
    id: db.id,
    name: db.name,
    platform: platformLabel,
    komisi: db.commission_rate,
    score,
    platformColor: isShopee ? "text-orange-400" : "text-pink-400",
    platformBg: isShopee ? "bg-orange-500/10" : "bg-pink-500/10",
  };
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 8.5
        ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
        : "text-zinc-400 border-zinc-600/30 bg-zinc-700/30";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${color}`}
    >
      {score.toFixed(1)}
    </span>
  );
}

export default function DashboardView({ trendingCount, totalKomisi, topProducts }: DashboardViewProps) {
  const display: TopProductDisplay[] = topProducts.map(mapTopProduct);

  const cardStats = [
    { label: "Produk Trending", value: formatCount(trendingCount), change: "—", positive: true, icon: TrendingUpIcon },
    { label: "Total Komisi", value: formatRupiah(totalKomisi), change: "—", positive: true, icon: DollarSignIcon },
    { label: "Caption Generated", value: "0", change: "—", positive: false, icon: MessageSquareIcon },
    { label: "Akun Aktif", value: formatCount(1), change: "—", positive: true, icon: UsersIcon },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Header Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Selamat Datang 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pantau produk trending dan komisi afiliasi kamu hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 transition duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/80"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/70 text-emerald-400">
                  <Icon />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Section: Produk Trending */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white sm:text-lg">
          🔥 Produk Trending Hari Ini
        </h2>
        <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10">
          Lihat Semua →
        </button>
      </div>

      {/* Product List */}
      {display.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          Belum ada produk trending. Jalankan scraper untuk mengisi data.
        </p>
      ) : (
        <div className="space-y-2">
          {display.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-3.5 transition hover:border-zinc-700/50 hover:bg-zinc-900/70 sm:gap-4 sm:p-4"
            >
              {/* Product Image Placeholder */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 text-lg font-bold text-zinc-500 sm:h-14 sm:w-14">
                {product.name.charAt(0)}
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white sm:text-base">
                  {product.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${product.platformBg} ${product.platformColor}`}
                  >
                    {product.platform}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Komisi {product.komisi}%
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <ScoreBadge score={product.score} />
                <span className="text-[10px] text-zinc-600">AI Score</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}