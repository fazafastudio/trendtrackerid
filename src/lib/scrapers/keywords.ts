// =============================================
// TrendTracker ID - Shopee Keywords Configuration
// Keywords untuk scraping produk affiliate Indonesia
// =============================================

// Slug values MUST match categories.slug in supabase/migrations/001_initial_schema.sql
// (P0 fix: harmonized with seed data on 2026-06-04)
export const SHOPEE_KEYWORDS: { keyword: string; category_slug: string }[] = [
  { keyword: "gamis terbaru", category_slug: "fashion" },
  { keyword: "baju korea wanita", category_slug: "fashion" },
  { keyword: "celana jogger pria", category_slug: "fashion" },
  { keyword: "serum vitamin c", category_slug: "kecantikan-skincare" },
  { keyword: "sunscreen spf50", category_slug: "kecantikan-skincare" },
  { keyword: "moisturizer korea", category_slug: "kecantikan-skincare" },
  { keyword: "earphone wireless", category_slug: "elektronik" },
  { keyword: "powerbank 20000mah", category_slug: "elektronik" },
  { keyword: "lampu led strip", category_slug: "elektronik" },
  { keyword: "granola sehat", category_slug: "makanan-minuman" },
  { keyword: "madu asli", category_slug: "makanan-minuman" },
  { keyword: "snack diet", category_slug: "makanan-minuman" },
  { keyword: "matras yoga", category_slug: "olahraga" },
  { keyword: "dumbbell set", category_slug: "olahraga" },
  { keyword: "sepatu lari", category_slug: "olahraga" },
  { keyword: "mainan edukasi bayi", category_slug: "ibu-bayi" },
  { keyword: "pompa asi elektrik", category_slug: "ibu-bayi" },
  { keyword: "rak dinding minimalis", category_slug: "rumah-taman" },
  { keyword: "lampu tidur aesthetic", category_slug: "rumah-taman" },
  { keyword: "sarung tangan motor", category_slug: "otomotif" },
];
