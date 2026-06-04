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

  // 2. ── Parse body ───────────────────────────
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

  // 3. ── Generate captions ────────────────────
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

  // 4. ── Log to caption_history ───────────────
  await supabase.from("caption_history").insert({
    user_id: user.id,
    product_id,
  });

  // 5. ── Upsert caption_usage ─────────────────
  const today = new Date().toISOString().slice(0, 10);

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
  } else {
    await supabase
      .from("caption_usage")
      .insert({ user_id: user.id, usage_date: today, count: 1 });
  }

  // 6. ── Compute remaining (free tier = 3/day) ─
  const currentCount = existing ? existing.count + 1 : 1;
  const remainingToday = Math.max(0, 3 - currentCount);

  return NextResponse.json({ captions, remaining_today: remainingToday });
}