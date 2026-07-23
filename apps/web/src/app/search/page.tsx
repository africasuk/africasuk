import { SearchRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import type { ProductWithDetails } from "@africasuk/types";
import SearchProductList from "@/components/search/SearchProductList";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: Props) {
  const { q } = await searchParams;

  const supabase = await createClient();

  const repository = new SearchRepository(supabase);

  const products: ProductWithDetails[] = q
    ? await repository.search(q)
    : [];

  return (
    <Layout>
      <section className="min-h-screen bg-muted/20 py-8 lg:py-12 antialiased selection:bg-[#004d26]/10">
        <Container>
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {q ? `Search results for "${q}"` : "Search products"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing matching items across all colors and variants
              </p>
            </div>

            {products.length === 0 ? (
              <SearchEmptyState q={q} />
            ) : (
              <SearchProductList products={products} />
            )}
          </div>
        </Container>
      </section>
    </Layout>
  );
}