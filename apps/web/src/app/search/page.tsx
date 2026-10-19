
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
  const query = q?.trim();

  const title = query
    ? `Search "${query}" | AfricaSuk`
    : "Search Products | AfricaSuk";

  const description = query
    ? `Browse search results for "${query}" on AfricaSuk.`
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
      url: query
        ? `https://africasuk.com/search?q=${encodeURIComponent(query)}`
        : "https://africasuk.com/search",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: query
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

type SearchColorProduct = {
  product: ProductWithDetails;
  color: ProductWithDetails["colors"][number];
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: ProductWithDetails[] = [];

  if (query) {
    try {
      const supabase = await createClient();
      const repository = new SearchRepository(supabase);
      products = await repository.search(query);
    } catch (error) {
      console.error("Search results failed:", error);
    }
  }

  // Mix product colors across matching products.
  const groupedProducts: SearchColorProduct[][] = products.map(
    (product) =>
      (product.colors ?? [])
        .filter((color) => (color.variants ?? []).length > 0)
        .map((color) => ({
          product,
          color,
        }))
  );

  const mixedProducts: ProductWithDetails[] = [];

  const maxColors = Math.max(
    0,
    ...groupedProducts.map((group) => group.length)
  );

  for (let index = 0; index < maxColors; index++) {
    for (const group of groupedProducts) {
      const item = group[index];

      if (!item) continue;

      mixedProducts.push({
        ...item.product,
        id: `${item.product.id}-${item.color.id}`,
        name: `${item.product.name} - ${item.color.name}`,
        colors: [item.color],
      });
    }
  }

  // Preserve products that do not have colors with variants.
  const productsWithoutVariantColors = products.filter(
    (product) =>
      !(product.colors ?? []).some(
        (color) => (color.variants ?? []).length > 0
      )
  );

  const displayProducts =
    mixedProducts.length > 0
      ? [...mixedProducts, ...productsWithoutVariantColors]
      : products;

  return (
    <Layout>
      <SearchScrollReset query={query} />

      <section className="min-h-[85vh] select-none border-b border-zinc-100 bg-white pb-6 pt-28 antialiased sm:pb-10 sm:pt-32">
        <Container className="mx-auto max-w-5xl px-3 sm:px-6">
          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-zinc-200 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl md:text-3xl">
                {query ? (
                  <>
                    Results for{" "}
                    <span className="text-zinc-900">
                      &ldquo;{query}&rdquo;
                    </span>
                  </>
                ) : (
                  "Search Products"
                )}
              </h1>

              <p className="text-xs text-zinc-500 sm:text-sm">
                Showing matching products across available colors and sizes.
              </p>
            </div>

            {query && (
              <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 sm:self-auto">
                <span>{displayProducts.length}</span>

                <span className="font-normal text-zinc-500">
                  {displayProducts.length === 1
                    ? "result"
                    : "results"}
                </span>
              </div>
            )}
          </div>

          {/* Search results */}
          {displayProducts.length === 0 ? (
            <SearchEmptyState q={query} />
          ) : (
            <SearchProductList products={displayProducts} />
          )}
        </Container>
      </section>
    </Layout>
  );
}
