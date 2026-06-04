// =============================================
// TrendTracker ID - AI Caption Usage Endpoint
// GET: Check remaining daily caption usage for user
// =============================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export async function GET(request: NextRequest) {
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

  // 2. ── Query today's usage ──────────────────
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from("caption_usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .maybeSingle();

  const remainingToday = usage ? Math.max(0, 3 - usage.count) : 3;

  return NextResponse.json({ remaining_today: remainingToday });
}