import PageHeader from "@/components/shared/PageHeader";
import ProductProfitability from "@/components/product-profitability/ProductProfitability";

import { ProductProfitabilityRepository } from "@africasuk/database";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function ProductProfitabilityPage() {
  const db = createAdminSupabaseClient();
  const repository = new ProductProfitabilityRepository(db);

  const rawVariants = await repository.getAll();
  const variants = rawVariants ?? [];

  return (
    <main className="min-h-screen w-full bg-white text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PageHeader
          title="Product Profitability"
          description="Analyze landed costs, selling prices, gross margins, and markups."
        />

        <ProductProfitability initialVariants={variants} />
      </div>
    </main>
  );
}