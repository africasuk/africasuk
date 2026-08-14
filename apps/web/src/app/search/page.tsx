import type { Metadata } from "next";
import { SearchRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";
import type { ProductWithDetails } from "@africasuk/types";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import SearchProductList from "@/components/search/SearchProductList";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import SearchScrollReset from "@/components/search/SearchScrollReset";

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;

  const title = q
    ? `Search "${q}" | AfricaSuk`
    : "Search Products | AfricaSuk";
  const description = q
    ? `Browse search results for "${q}" on AfricaSuk.`
    : "Search products across AfricaSuk.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://africasuk.com/search",
    },
    openGraph: {
      title,
      description,
      url: q
        ? `https://africasuk.com/search?q=${encodeURIComponent(q)}`
        : "https://africasuk.com/search",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: q
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const supabase = await createClient();
  const repository = new SearchRepository(supabase);

  const products: ProductWithDetails[] = q
    ? await repository.search(q)
    : [];

  return (
    <Layout>
      <SearchScrollReset query={q} />
      <section className="min-h-[85vh] bg-white py-8 sm:py-14 antialiased select-none border-b border-gray-100">
        <Container className="max-w-5xl mx-auto px-3 sm:px-6">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-gray-100 pb-5 sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {q ? `Search results for "${q}"` : "Search Products"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Showing matching items across all colors and variants
              </p>
            </div>

            {q && (
              <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
                {products.length} {products.length === 1 ? "Result" : "Results"}
              </div>
            )}
          </div>

          {/* Results State */}
          {products.length === 0 ? (
            <SearchEmptyState q={q} />
          ) : (
            <SearchProductList products={products} />
          )}
        </Container>
      </section>
    </Layout>
  );
}