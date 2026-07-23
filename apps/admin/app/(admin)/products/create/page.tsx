import {
  BrandRepository,
  CategoryRepository,
} from "@africasuk/database";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

import PageHeader from "@/components/shared/PageHeader";

import CreateProductForm from "@/components/products/CreateProductForm";

export default async function CreateProductPage() {
  const supabase =
    await createServerSupabaseClient();

  const brandRepository =
    new BrandRepository(supabase);

  const categoryRepository =
    new CategoryRepository(
      supabase
    );

  const [brands, categories] =
    await Promise.all([
      brandRepository.getAll(),
      categoryRepository.getAll(),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        description="Create a new product with variants and options."
      />

      <CreateProductForm
        brands={brands}
        categories={categories}
      />
    </div>
  );
}