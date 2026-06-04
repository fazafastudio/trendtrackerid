// =============================================
// TrendTracker ID - Database TypeScript Types
// Generated from supabase/migrations/001_initial_schema.sql
// =============================================

// ---------- JSON Types ----------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------- Row Types ----------
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  platform: "shopee" | "tiktok" | "tokopedia";
  platform_id: string | null;
  name: string;
  image_url: string | null;
  price: number | null;
  price_min: number | null;
  price_max: number | null;
  shop_name: string | null;
  shop_url: string | null;
  product_url: string | null;
  category_id: string | null;
  sales_30d: number;
  rating: number | null;
  review_count: number;
  commission_rate: number;
  commission_estimated: number | null;
  is_trending: boolean;
  trend_score: number;
  tags: string[];
  raw_data: Json | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface ScrapeLog {
  id: string;
  platform: string;
  status: "running" | "success" | "failed";
  products_found: number;
  products_new: number;
  products_updated: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
  metadata: Json | null;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  product_id: string;
  notes: string | null;
  created_at: string;
}

// ---------- Join Types ----------
export interface ProductWithCategory extends Product {
  category: Category | null;
}

// ---------- Insert Types (for mutations) ----------
export type InsertProduct = Omit<
  Product,
  "id" | "scraped_at" | "created_at" | "updated_at"
> & {
  id?: string;
  scraped_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type UpdateProduct = Partial<InsertProduct>;

export type InsertCategory = Omit<Category, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type InsertScrapeLog = Omit<ScrapeLog, "id"> & {
  id?: string;
};

export type InsertUserBookmark = Omit<UserBookmark, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// ---------- Supabase-style Database Type ----------
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category & Record<string, unknown>;
        Insert: InsertCategory & Record<string, unknown>;
        Update: Partial<InsertCategory> & Record<string, unknown>;
        Relationships: [];
      };

      products: {
        Row: Product & Record<string, unknown>;
        Insert: InsertProduct & Record<string, unknown>;
        Update: UpdateProduct & Record<string, unknown>;
        Relationships: [];
      };

      scrape_logs: {
        Row: ScrapeLog & Record<string, unknown>;
        Insert: InsertScrapeLog & Record<string, unknown>;
        Update: Partial<InsertScrapeLog> & Record<string, unknown>;
        Relationships: [];
      };

      user_bookmarks: {
        Row: UserBookmark & Record<string, unknown>;
        Insert: InsertUserBookmark & Record<string, unknown>;
        Update: Partial<InsertUserBookmark> & Record<string, unknown>;
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}