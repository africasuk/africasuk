import { ProductRepository } from "@africasuk/database";
import { ProductQueryService } from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";


import { ProductTable } from "@/components/products/ProductTable";
import PageHeader from "@/components/shared/PageHeader";


export default async function ProductsPage() {
  const db = createAdminSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const products = await service.getAll();

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your products."
        actions={[
          {
            label: "New Product",
            href: "/products/new",
          },
        ]}
      />

      <ProductTable products={products} />
    </>
  );
}