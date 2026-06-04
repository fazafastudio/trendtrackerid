// =============================================
// TrendTracker ID - Vercel Cron: Shopee Scraper
// Triggered by vercel.json → /api/cron/shopee (GET)
//
// Vercel cron jobs:
//   - Always send GET
//   - Auto-include `Authorization: Bearer ${CRON_SECRET}` if the
//     project env var `CRON_SECRET` is set in Vercel settings.
//
// This handler is a thin wrapper that verifies the request came
// from Vercel, then internally invokes the existing
// POST /api/scrape/shopee endpoint (the single source of truth for
// scraper logic). The scraper route itself is NOT modified.
// =============================================

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 55;
export const dynamic = "force-dynamic";

/** Subset of the upstream /api/scrape/shopee response shape. */
interface UpstreamResponse {
  success?: boolean;
  stats?: unknown;
  error?: string;
  message?: string;
}

export async function GET(request: NextRequest) {
  console.log('ENV CHECK:', {
    hasCronSecret: !!process.env.CRON_SECRET,
    hasScraperSecret: !!process.env.SCRAPER_SECRET,
    authHeader: request.headers.get('authorization')?.substring(0, 20),
  })

  const timestamp = new Date().toISOString();

  // 1. ── Auth: verify Vercel cron secret ─────────────────────────
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, timestamp, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. ── Env: make sure we can call the upstream scraper ──────────
  const scraperSecret = process.env.SCRAPER_SECRET;
  if (!scraperSecret) {
    return NextResponse.json(
      {
        success: false,
        timestamp,
        message: "SCRAPER_SECRET is not configured on the server",
      },
      { status: 500 }
    );
  }

  // 3. ── Invoke the existing POST /api/scrape/shopee ──────────────
  // Use the request's own origin so this works both on Vercel
  // (where request.url is https://<app>.vercel.app/api/cron/shopee)
  // and during local testing.
  const origin = new URL(request.url).origin;
  const upstreamUrl = `${origin}/api/scrape/shopee`;

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${scraperSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: 5 }),
    });

    const data = (await upstreamRes
      .json()
      .catch(() => ({}))) as UpstreamResponse;

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          success: false,
          timestamp,
          message: `Scraper failed: ${
            data?.message ?? data?.error ?? upstreamRes.statusText
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      timestamp,
      message: "Scraper invoked",
      stats: data.stats ?? null,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        timestamp,
        message: `Scraper failed: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}