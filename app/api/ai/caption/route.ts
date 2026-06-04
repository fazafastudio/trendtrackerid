// =============================================
// TrendTracker ID - AI Caption API Route
// POST: Generate 3 FOMO captions for a product
// =============================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { generateCaptions } from "@/src/lib/ai/caption";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  // 1. ── Auth ─────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. ── Check daily usage BEFORE generation ────
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from("caption_usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .maybeSingle();

  if (usage && usage.count >= 3) {
    return NextResponse.json(
      { error: "Batas harian tercapai", remaining_today: 0 },
      { status: 429 }
    );
  }

  // 3. ── Parse body ───────────────────────────
  const body = await request.json().catch(() => ({}));
  const { product_id, product_name, category, harga, terjual } = body as {
    product_id?: string;
    product_name?: string;
    category?: string;
    harga?: number;
    terjual?: number;
  };

  if (!product_id || !product_name) {
    return NextResponse.json(
      { error: "Missing required fields: product_id, product_name" },
      { status: 400 }
    );
  }

  // 4. ── Generate captions ────────────────────
  let captions: string[];
  try {
    captions = await generateCaptions({
      name: product_name,
      category: category ?? "Lainnya",
      harga: harga ?? 0,
      terjual: terjual ?? 0,
    });
  } catch (err) {
    console.error("[Caption] Generation failed:", err);
    return NextResponse.json(
      { error: "Caption generation failed" },
      { status: 500 }
    );
  }

  // 5. ── Log to caption_history (non-blocking) ──
  try {
    await supabase.from("caption_history").insert({
      user_id: user.id,
      product_id,
    });
  } catch (err) {
    console.error("[Caption] Failed to log history:", err);
    // Don't fail the request — history is best-effort
  }

  // 6. ── Atomic increment caption_usage via RPC ─
  let currentCount = 1;
  try {
    const { data: rpcCount, error: rpcErr } = await supabase.rpc(
      "increment_caption_usage",
      { p_user_id: user.id, p_date: today }
    );
    if (rpcErr) throw rpcErr;
    currentCount = (rpcCount as number) ?? 1;
  } catch (err) {
    console.error("[Caption] RPC increment failed, falling back to manual upsert:", err);
    // Fallback to manual upsert if RPC doesn't exist yet
    const { data: existing } = await supabase
      .from("caption_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("usage_date", today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("caption_usage")
        .update({ count: existing.count + 1 })
        .eq("user_id", user.id)
        .eq("usage_date", today);
      currentCount = existing.count + 1;
    } else {
      await supabase
        .from("caption_usage")
        .insert({ user_id: user.id, usage_date: today, count: 1 });
      currentCount = 1;
    }
  }

  // 7. ── Compute remaining (free tier = 3/day) ─
  const remainingToday = Math.max(0, 3 - currentCount);

  return NextResponse.json({ captions, remaining_today: remainingToday });
}