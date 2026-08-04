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
    <div className="container mx-auto space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl">
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

      <div className="w-full">
        <ProductTable products={products} />
      </div>
    </div>
  );
}