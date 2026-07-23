import { notFound } from "next/navigation";

import {
  BrandRepository,
  CategoryRepository,
} from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/products/ProductForm";

export default async function NewProductPage() {
  const db = await createServerSupabaseClient();

  const categoryRepository = new CategoryRepository(db);
  const brandRepository = new BrandRepository(db);

  const [categories, brands] = await Promise.all([
    categoryRepository.getAll(),
    brandRepository.getAll(),
  ]);

  if (!categories || !brands) {
    notFound();
  }

  return (
    <ProductForm
      categories={categories}
      brands={brands}
    />
  );
}