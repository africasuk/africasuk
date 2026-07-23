import { ProductRepository } from "@africasuk/database";
import { ProductService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import ProductsPage from "@/components/products/ProductsPage";

async function getProducts() {
  const supabase =
    await createServerSupabaseClient();

  const repository =
    new ProductRepository(supabase);

  const service =
    new ProductService(repository);

  return service.getAll();
}

export default async function Page() {
  const products =
    await getProducts();

  return (
    <ProductsPage
      products={products}
      title="Products"
      description="Manage marketplace products."
      createHref="/manager/products/new"
      basePath="/manager/products"
      canDelete={false}
    />
  );
}