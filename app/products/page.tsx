import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { ProductWithCategory, Category } from "@/src/types/database";
import ProductsView from "./products-view";

export const revalidate = 60;

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, name, slug, icon, created_at)")
      .order("trend_score", { ascending: false })
      .limit(50),
    supabase
      .from("categories")
      .select("id, name, slug, icon, created_at")
      .order("name"),
  ]);

  return (
    <ProductsView
      initialProducts={(products ?? []) as unknown as ProductWithCategory[]}
      categories={(categories ?? []) as Category[]}
    />
  );
}
