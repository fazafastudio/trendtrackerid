-- =============================================
-- TrendTracker ID - Seed Data
-- Description: 5 contoh produk dummy realistic
-- untuk testing (platform shopee)
-- =============================================
--
-- Cara pakai:
--   1. Jalankan migration dulu (001_initial_schema.sql)
--   2. Jalankan file ini untuk seed data
--   3. Atau gabung: psql -f 001_initial_schema.sql -f seed.sql
--
-- =============================================

-- Insert dummy products (asumsikan categories sudah diisi dari migration)
-- Gunakan subquery untuk mengambil category_id berdasarkan slug

INSERT INTO products (
  platform,
  platform_id,
  name,
  image_url,
  price,
  price_min,
  price_max,
  shop_name,
  shop_url,
  product_url,
  category_id,
  sales_30d,
  rating,
  review_count,
  commission_rate,
  commission_estimated,
  is_trending,
  trend_score,
  tags,
  raw_data,
  scraped_at
) VALUES
(
  'shopee',
  'SH1234567890',
  'Serum Vitamin C Wajah Brightening 30ml - Skincare Korea',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/01/15/abc123.jpg',
  85000,
  75000,
  95000,
  'SkincareGlow Official Shop',
  'https://shopee.co.id/skincareglow',
  'https://shopee.co.id/serum-vitamin-c-30ml-i.123456.7890123',
  (SELECT id FROM categories WHERE slug = 'kecantikan-skincare'),
  12500,
  4.80,
  8920,
  10.00,
  8500.00,
  true,
  92,
  ARRAY['skincare', 'vitamin c', 'brightening', 'korea'],
  '{"source": "shopee_api", "scraper_version": "1.0", "raw_rating_count": 8920, "raw_sold": 12500}'::jsonb,
  now() - interval '2 hours'
),
(
  'shopee',
  'SH9876543210',
  'Smartwatch Xiaomi Mi Band 8 Original - Fitness Tracker',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/02/20/def456.jpg',
  349000,
  329000,
  399000,
  'Xiaomi Official Store',
  'https://shopee.co.id/xiaomi-official',
  'https://shopee.co.id/xiaomi-mi-band-8-i.654321.9876543',
  (SELECT id FROM categories WHERE slug = 'elektronik'),
  8750,
  4.70,
  15300,
  5.00,
  17450.00,
  true,
  88,
  ARRAY['smartwatch', 'xiaomi', 'fitness', 'wearable'],
  '{"source": "shopee_api", "scraper_version": "1.0", "raw_rating_count": 15300, "raw_sold": 8750}'::jsonb,
  now() - interval '3 hours'
),
(
  'shopee',
  'SH5551237777',
  'Baju Muslim Wanita Gamis Syari Premium - Fashion Hijab',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/03/10/ghi789.jpg',
  NULL,
  120000,
  250000,
  'HijabFashionID',
  'https://shopee.co.id/hijabfashionid',
  'https://shopee.co.id/gamis-syari-premium-i.111222.3334444',
  (SELECT id FROM categories WHERE slug = 'fashion'),
  22300,
  4.60,
  27500,
  12.50,
  NULL,
  true,
  95,
  ARRAY['muslimah', 'gamis', 'hijab', 'fashion'],
  '{"source": "shopee_api", "scraper_version": "1.0", "raw_rating_count": 27500, "raw_sold": 22300}'::jsonb,
  now() - interval '1 hour'
),
(
  'shopee',
  'SH3334445556',
  'Snack Sehat Granola Bar Rendah Kalori - 12pcs',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/04/05/jkl012.jpg',
  32000,
  28000,
  35000,
  'HealthySnack Official',
  'https://shopee.co.id/healthysnack',
  'https://shopee.co.id/granola-bar-sehat-12pcs-i.777888.9990001',
  (SELECT id FROM categories WHERE slug = 'makanan-minuman'),
  45000,
  4.50,
  31200,
  15.00,
  4800.00,
  false,
  78,
  ARRAY['snack', 'sehat', 'granola', 'diet'],
  '{"source": "shopee_api", "scraper_version": "1.0", "raw_rating_count": 31200, "raw_sold": 45000}'::jsonb,
  now() - interval '30 minutes'
),
(
  'shopee',
  'SH7778889990',
  'Mainan Edukasi Anak Montessori - Puzzle Kayu Huruf & Angka',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/06/15/mno345.jpg',
  NULL,
  45000,
  85000,
  'EduKids Toys',
  'https://shopee.co.id/edukids',
  'https://shopee.co.id/mainan-edukasi-montessori-i.444555.6667778',
  (SELECT id FROM categories WHERE slug = 'ibu-bayi'),
  18900,
  4.90,
  15600,
  8.00,
  NULL,
  false,
  72,
  ARRAY['mainan edukasi', 'montessori', 'puzzle', 'anak'],
  '{"source": "shopee_api", "scraper_version": "1.0", "raw_rating_count": 15600, "raw_sold": 18900}'::jsonb,
  now() - interval '45 minutes'
);