// =============================================
// TrendTracker ID - P0 Verification Script
// Validates: products table flow (insert → read → update → delete)
//            using service role client.
//
// Run with:
//   npx tsx --env-file=.env.local scripts/test-scrape-flow.ts
//
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// in .env.local. scrape_logs is intentionally NOT touched here.
// =============================================

import { createServiceRoleClient } from "../src/lib/supabase/service";
import type { InsertProduct } from "../src/types/database";

const TEST_PLATFORM_ID = `TEST-P0-${Date.now()}`;

async function main() {
  const supabase = createServiceRoleClient();

  // ---------- 0. Load a valid category_id (optional) ----------
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, slug")
    .limit(1);

  if (catErr) {
    throw new Error(`[0/6] Failed to load categories: ${catErr.message}`);
  }
  const firstCategory = cats?.[0] ?? null;
  console.log(
    `[0/6] Categories loaded: ${cats?.length ?? 0} (using ${firstCategory?.slug ?? "none"} as FK)`
  );

  // ---------- 1. INSERT ----------
  const newProduct: InsertProduct = {
    platform: "shopee",
    platform_id: TEST_PLATFORM_ID,
    name: "P0 Verification Product",
    image_url: null,
    price: 100000,
    price_min: 90000,
    price_max: 110000,
    shop_name: "P0 Test Shop",
    shop_url: "https://shopee.co.id/test",
    product_url: "https://shopee.co.id/test-product",
    category_id: firstCategory?.id ?? null,
    sales_30d: 500,
    rating: 4.5,
    review_count: 100,
    commission_rate: 5.0,
    commission_estimated: 5000.0,
    is_trending: false,
    trend_score: 50,
    tags: ["test", "p0-verify"],
    raw_data: { source: "p0-test", note: "deterministic verification" },
  };

  const { data: inserted, error: insErr } = await supabase
    .from("products")
    .insert(newProduct)
    .select("id, name, platform, platform_id, sales_30d, trend_score")
    .single();

  if (insErr) {
    throw new Error(`[1/6] INSERT failed: ${insErr.message}`);
  }
  console.log(`[1/6] INSERT  ok  → id=${inserted.id.slice(0, 8)}… name="${inserted.name}"`);

  // ---------- 2. READ ----------
  const { data: read1, error: r1Err } = await supabase
    .from("products")
    .select("id, name, platform, platform_id, sales_30d, trend_score, commission_estimated")
    .eq("platform", "shopee")
    .eq("platform_id", TEST_PLATFORM_ID)
    .single();

  if (r1Err) {
    throw new Error(`[2/6] READ failed: ${r1Err.message}`);
  }
  if (read1.id !== inserted.id) {
    throw new Error(
      `[2/6] READ id mismatch: expected ${inserted.id}, got ${read1.id}`
    );
  }
  console.log(
    `[2/6] READ   ok  → sales_30d=${read1.sales_30d} trend_score=${read1.trend_score} commission=${read1.commission_estimated}`
  );

  // ---------- 3. UPSERT (test onConflict) ----------
  // Re-insert with the same (platform, platform_id) — should update, not error.
  const upsertPayload: InsertProduct = {
    ...newProduct,
    name: "P0 Verification Product (UPDATED via upsert)",
    sales_30d: 750,
    trend_score: 75,
  };

  const { data: upserted, error: upErr } = await supabase
    .from("products")
    .upsert(upsertPayload, { onConflict: "platform,platform_id" })
    .select("id, name, sales_30d, trend_score")
    .single();

  if (upErr) {
    throw new Error(`[3/6] UPSERT failed: ${upErr.message}`);
  }
  if (upserted.id !== inserted.id) {
    throw new Error(
      `[3/6] UPSERT created a new row instead of updating. old=${inserted.id} new=${upserted.id}`
    );
  }
  console.log(
    `[3/6] UPSERT ok  → same id, name="${upserted.name.slice(0, 40)}…", sales_30d=${upserted.sales_30d}`
  );

  // ---------- 4. UPDATE ----------
  const { data: updated, error: uErr } = await supabase
    .from("products")
    .update({ name: "P0 Verification Product (UPDATED via .update())" })
    .eq("platform", "shopee")
    .eq("platform_id", TEST_PLATFORM_ID)
    .select("id, name")
    .single();

  if (uErr) {
    throw new Error(`[4/6] UPDATE failed: ${uErr.message}`);
  }
  if (!updated.name.includes("UPDATED via .update()")) {
    throw new Error(
      `[4/6] UPDATE name did not change: got "${updated.name}"`
    );
  }
  console.log(`[4/6] UPDATE ok  → name="${updated.name.slice(0, 50)}…"`);

  // ---------- 5. DELETE ----------
  const { error: dErr } = await supabase
    .from("products")
    .delete()
    .eq("platform", "shopee")
    .eq("platform_id", TEST_PLATFORM_ID);

  if (dErr) {
    throw new Error(`[5/6] DELETE failed: ${dErr.message}`);
  }
  console.log(`[5/6] DELETE ok  → row removed`);

  // ---------- 6. Verify deletion ----------
  const { data: read2, error: r2Err } = await supabase
    .from("products")
    .select("id")
    .eq("platform", "shopee")
    .eq("platform_id", TEST_PLATFORM_ID)
    .maybeSingle();

  if (r2Err) {
    throw new Error(`[6/6] Verify-READ failed: ${r2Err.message}`);
  }
  if (read2 !== null) {
    throw new Error(
      `[6/6] Row still exists after DELETE: id=${read2.id}`
    );
  }
  console.log(`[6/6] VERIFY ok  → row gone (read returned null)`);

  console.log("\n✅ P0 FLOW VERIFIED");
  console.log("   service role client: working");
  console.log("   insert / read / upsert onConflict / update / delete: all passing");
  console.log(`   test platform_id used: ${TEST_PLATFORM_ID}`);
}

main().catch((err) => {
  console.error("\n❌ P0 FLOW FAILED");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});