// =============================================
// TrendTracker ID - Shopee Scraper
// Scraping produk trending dari Shopee Indonesia
// =============================================

import { InsertProduct } from "@/src/types/database";

export interface ShopeeRawProduct {
  itemid: number;
  shopid: number;
  name: string;
  image: string;
  price: number;
  price_min: number;
  price_max: number;
  shop_name?: string;
  sold?: number;
  historical_sold?: number;
  item_rating?: {
    rating_star: number;
    rating_count: number[];
  };
  [key: string]: unknown;
}

interface ShopeeSearchResponse {
  items?: Array<{ item_basic: ShopeeRawProduct }>;
  error?: number;
  error_msg?: string;
}

const SHOPEE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://shopee.co.id",
  "x-api-source": "pc",
  "af-ac-enc-dat": "aa0a",
};

export class ShopeeScraperClass {
  async fetchTrendingByKeyword(keyword: string): Promise<ShopeeRawProduct[]> {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://shopee.co.id/api/v4/search/search_items?by=sales&limit=30&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2&keyword=${encodedKeyword}`;

    try {
      console.log(`[Shopee] Fetching keyword: ${keyword}`);
      const response = await fetch(url, {
        headers: SHOPEE_HEADERS,
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(
          `[Shopee] HTTP error ${response.status} for keyword: ${keyword}`
        );
        return [];
      }

      const data: ShopeeSearchResponse = await response.json();

      if (data.error && data.error !== 0) {
        console.error(`[Shopee] API error: ${data.error_msg}`);
        return [];
      }

      const items = data.items ?? [];
      console.log(`[Shopee] Found ${items.length} products for: ${keyword}`);
      return items.map((i) => i.item_basic);
    } catch (err) {
      console.error(`[Shopee] Fetch failed for keyword ${keyword}:`, err);
      return [];
    }
  }

  parseProduct(raw: ShopeeRawProduct, categoryId?: string): InsertProduct {
    // Shopee API biasanya return price dalam format IDR * 100000
    // Contoh: Rp85.000 → 8500000, dibagi 100000 jadi 85
    const price = (raw.price ?? 0) / 100000;
    const priceMin = (raw.price_min ?? raw.price ?? 0) / 100000;
    const priceMax = (raw.price_max ?? raw.price ?? 0) / 100000;
    const sales = raw.sold ?? raw.historical_sold ?? 0;
    const rating = raw.item_rating?.rating_star ?? 0;
    const reviewCount = raw.item_rating?.rating_count?.[0] ?? 0;
    const commissionRate = 5.0;
    const commissionEstimated = parseFloat(
      (price * commissionRate / 100).toFixed(2)
    );
    const trendRaw = sales * 0.6 + rating * 8 + reviewCount * 0.01;
    const trendScore = Math.min(Math.round(trendRaw), 100);

    // Generate slug untuk product URL
    const slug = raw.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 100);
    const productUrl = `https://shopee.co.id/${slug}-i.${raw.shopid}.${raw.itemid}`;

    // Extract simple tags dari nama produk
    const stopwords = [
      "dan",
      "dengan",
      "untuk",
      "yang",
      "ke",
      "di",
      "the",
      "and",
      "for",
      "of",
    ];
    const tags = raw.name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopwords.includes(w))
      .slice(0, 5);

    return {
      platform: "shopee",
      platform_id: String(raw.itemid),
      name: raw.name,
      image_url: raw.image
        ? `https://cf.shopee.co.id/file/${raw.image}`
        : null,
      price,
      price_min: priceMin,
      price_max: priceMax,
      shop_name: raw.shop_name ?? null,
      shop_url: `https://shopee.co.id/shop/${raw.shopid}`,
      product_url: productUrl,
      category_id: categoryId ?? null,
      sales_30d: sales,
      rating,
      review_count: reviewCount,
      commission_rate: commissionRate,
      commission_estimated: commissionEstimated,
      is_trending: sales > 100,
      trend_score: trendScore,
      tags,
      raw_data: JSON.parse(JSON.stringify(raw)),
      scraped_at: new Date().toISOString(),
    };
  }
}

export const ShopeeScraper = new ShopeeScraperClass();