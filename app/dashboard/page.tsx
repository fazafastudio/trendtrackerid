import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { ProductWithCategory } from "@/src/types/database";
import DashboardView from "./dashboard-view";

export const revalidate = 60;

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient();

  // ── Auth ──
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Parallel data fetching ──
  const [trendingRes, topProductsRes, komisiRes, usersRes, captionsRes] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_trending", true),
    supabase
      .from("products")
      .select("*, category:categories(id, name, slug, icon, created_at)")
      .order("trend_score", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("commission_estimated")
      .not("commission_estimated", "is", null),
    supabase.rpc("get_active_user_count"),
    user
      ? supabase
          .from("caption_history")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
      : Promise.resolve({ count: 0 }),
  ]);

  const trendingCount = trendingRes.count ?? 0;
  const topProducts = (topProductsRes.data ?? []) as unknown as ProductWithCategory[];
  const totalKomisi = (komisiRes.data ?? []).reduce(
    (sum, r) => sum + (r.commission_estimated ?? 0),
    0
  );
  const activeUserCount = (usersRes.data as number | null) ?? 0;
  const captionGenerated = captionsRes.count ?? 0;

  return (
    <DashboardView
      trendingCount={trendingCount}
      totalKomisi={totalKomisi}
      topProducts={topProducts}
      activeUserCount={activeUserCount}
      captionGenerated={captionGenerated}
    />
  );
}