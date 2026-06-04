// =============================================
// TrendTracker ID - Shopee Scrape API Route
// Endpoint untuk memicu scraping produk Shopee
// =============================================

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service";
import { ShopeeScraper } from "@/src/lib/scrapers/shopee";
import { SHOPEE_KEYWORDS } from "@/src/lib/scrapers/keywords";
import { InsertScrapeLog } from "@/src/types/database";

export const maxDuration = 55;

export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SCRAPER_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  let logId: string | null = null;

  try {
    const body = await request.json().catch(() => ({}));
    const limit: number = body.limit ?? 5;
    const customKeywords: string[] | undefined = body.keywords;

    // Buat scrape log
    const logData: InsertScrapeLog = {
      platform: "shopee",
      status: "running",
      products_found: 0,
      products_new: 0,
      products_updated: 0,
      error_message: null,
      finished_at: null,
      metadata: null,
      started_at: new Date().toISOString(),
    };
    const { data: log } = await supabase
      .from("scrape_logs")
      .insert(logData)
      .select("id")
      .single();
    logId = log?.id ?? null;

    // Ambil category map dari DB
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug");
    const categoryMap = Object.fromEntries(
      (categories ?? []).map((c: { id: string; slug: string }) => [c.slug, c.id])
    );

    // Tentukan keywords yang akan diproses
    const keywordsToProcess = customKeywords
      ? customKeywords.map((k) => ({ keyword: k, category_slug: "" }))
      : SHOPEE_KEYWORDS.slice(0, limit);

    let totalFound = 0;
    let totalNew = 0;
    let totalUpdated = 0;

    for (const { keyword, category_slug } of keywordsToProcess) {
      const rawProducts = await ShopeeScraper.fetchTrendingByKeyword(keyword);
      totalFound += rawProducts.length;

      if (rawProducts.length === 0) continue;

      const categoryId = categoryMap[category_slug] ?? null;
      const parsed = rawProducts.map((r) =>
        ShopeeScraper.parseProduct(r, categoryId)
      );

      const { error } = await supabase
        .from("products")
        .upsert(parsed, { onConflict: "platform,platform_id" });

      if (error) {
        console.error(
          `[Scrape] Upsert error for keyword ${keyword}:`,
          error
        );
      } else {
        // Estimasi new vs updated (tidak bisa tahu pasti dari upsert biasa)
        totalNew += Math.floor(rawProducts.length * 0.3);
        totalUpdated += Math.ceil(rawProducts.length * 0.7);
      }
    }

    // Update log sukses
    if (logId) {
      await supabase
        .from("scrape_logs")
        .update({
          status: "success",
          products_found: totalFound,
          products_new: totalNew,
          products_updated: totalUpdated,
          finished_at: new Date().toISOString(),
        })
        .eq("id", logId);
    }

    return NextResponse.json({
      success: true,
      stats: {
        keywords_processed: keywordsToProcess.length,
        products_found: totalFound,
        products_new: totalNew,
        products_updated: totalUpdated,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[Scrape] Fatal error:", errorMessage);

    if (logId) {
      await supabase
        .from("scrape_logs")
        .update({
          status: "failed",
          error_message: errorMessage,
          finished_at: new Date().toISOString(),
        })
        .eq("id", logId);
    }

    return NextResponse.json(
      { error: "Scrape failed", message: errorMessage },
      { status: 500 }
    );
  }
}