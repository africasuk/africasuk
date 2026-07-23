import { notFound } from "next/navigation";

import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/products/ProductForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const db = createAdminSupabaseClient();

  const productService = new ProductQueryService(
    new ProductRepository(db)
  );

  const categoryRepository = new CategoryRepository(db);
  const brandRepository = new BrandRepository(db);

  const product = await productService.getById(id);

  const [categories, brands] = await Promise.all([
    categoryRepository.getAll(),
    brandRepository.getAll(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      product={product}
      categories={categories}
      brands={brands}
    />
  );
}