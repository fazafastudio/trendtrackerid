-- =============================================
-- TrendTracker ID - Initial Schema Migration
-- Database: Supabase (PostgreSQL)
-- Description: Create core tables for product
-- research tool for TikTok Shop & Shopee affiliates
-- =============================================

-- ----------------------------
-- 1. Categories
-- ----------------------------
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  icon        text,                     -- emoji or icon name
  created_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE categories IS 'Product categories for affiliate products';
COMMENT ON COLUMN categories.name IS 'Display name e.g. Fashion, Kecantikan';
COMMENT ON COLUMN categories.slug IS 'URL-safe identifier e.g. fashion, kecantikan';
COMMENT ON COLUMN categories.icon IS 'Emoji or icon name for UI display';

-- ----------------------------
-- 2. Products
-- ----------------------------
CREATE TABLE products (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform             text NOT NULL CHECK (platform IN ('shopee', 'tiktok', 'tokopedia')),
  platform_id          text,                       -- ID produk di platform aslinya
  name                 text NOT NULL,
  image_url            text,
  price                numeric(12,2),
  price_min            numeric(12,2),
  price_max            numeric(12,2),
  shop_name            text,
  shop_url             text,
  product_url          text,
  category_id          uuid REFERENCES categories(id) ON DELETE SET NULL,
  sales_30d            integer DEFAULT 0,          -- estimasi penjualan 30 hari
  rating               numeric(3,2),
  review_count         integer DEFAULT 0,
  commission_rate      numeric(5,2) DEFAULT 0,     -- persen, misal 5.00 = 5%
  commission_estimated numeric(12,2),              -- price * commission_rate / 100
  is_trending          boolean DEFAULT false,
  trend_score          integer DEFAULT 0,          -- 0-100, untuk sorting
  tags                 text[] DEFAULT '{}',
  raw_data             jsonb,                      -- raw response dari scraper
  scraped_at           timestamptz DEFAULT now(),
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now(),

  -- satu produk tidak boleh duplikat per platform
  UNIQUE (platform, platform_id)
);

COMMENT ON TABLE products IS 'Scraped products from affiliate platforms';
COMMENT ON COLUMN products.platform IS 'Platform asal produk: shopee, tiktok, tokopedia';
COMMENT ON COLUMN products.platform_id IS 'Original product ID from the platform';
COMMENT ON COLUMN products.sales_30d IS 'Estimated sales in the last 30 days';
COMMENT ON COLUMN products.trend_score IS 'Trending score 0-100 for sorting';
COMMENT ON COLUMN products.commission_rate IS 'Commission percentage e.g. 5.00 = 5%';
COMMENT ON COLUMN products.commission_estimated IS 'Computed commission amount = price * rate / 100';
COMMENT ON COLUMN products.raw_data IS 'Raw scraper response stored as JSON';
COMMENT ON COLUMN products.tags IS 'Array of text tags for filtering';

-- Indexes for products
CREATE INDEX idx_products_platform    ON products(platform);
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_trend_score ON products(trend_score DESC);
CREATE INDEX idx_products_scraped_at  ON products(scraped_at DESC);

-- ----------------------------
-- 3. Scrape Logs
-- ----------------------------
CREATE TABLE scrape_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        text NOT NULL,
  status          text NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  products_found  integer DEFAULT 0,
  products_new    integer DEFAULT 0,
  products_updated integer DEFAULT 0,
  error_message   text,
  started_at      timestamptz DEFAULT now(),
  finished_at     timestamptz,
  metadata        jsonb
);

COMMENT ON TABLE scrape_logs IS 'Logs for each scraping job run';
COMMENT ON COLUMN scrape_logs.status IS 'Job status: running, success, or failed';

-- ----------------------------
-- 4. User Bookmarks
-- ----------------------------
CREATE TABLE user_bookmarks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  notes       text,
  created_at  timestamptz DEFAULT now(),

  UNIQUE (user_id, product_id)
);

COMMENT ON TABLE user_bookmarks IS 'Saved/favorited products by users';

-- ----------------------------
-- 5. Trigger: auto-update updated_at
-- ----------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON FUNCTION update_updated_at_column() IS 'Sets updated_at to current timestamp on row update';

-- ----------------------------
-- 6. Row Level Security (RLS)
-- ----------------------------

-- Products: semua orang bisa SELECT
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

-- Categories: semua orang bisa SELECT
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

-- Scrape Logs: SELECT untuk semua, INSERT/UPDATE hanya service_role
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scrape logs are viewable by everyone"
  ON scrape_logs
  FOR SELECT
  USING (true);

CREATE POLICY "Only service_role can insert scrape logs"
  ON scrape_logs
  FOR INSERT
  WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Only service_role can update scrape logs"
  ON scrape_logs
  FOR UPDATE
  USING (current_setting('role') = 'service_role');

-- User Bookmarks: hanya user yang owns row tersebut
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON user_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON user_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON user_bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON user_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------
-- 7. Seed Data: Categories
-- ----------------------------
INSERT INTO categories (name, slug, icon) VALUES
  ('Fashion',               'fashion',                '👗'),
  ('Kecantikan & Skincare', 'kecantikan-skincare',    '💄'),
  ('Elektronik',            'elektronik',             '📱'),
  ('Makanan & Minuman',     'makanan-minuman',        '🍜'),
  ('Rumah & Taman',         'rumah-taman',            '🏠'),
  ('Olahraga',              'olahraga',               '🏃'),
  ('Ibu & Bayi',            'ibu-bayi',               '👶'),
  ('Otomotif',              'otomotif',               '🚗');