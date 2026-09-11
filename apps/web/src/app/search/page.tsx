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
      <section className="min-h-[85vh] border-b border-zinc-100 bg-white py-6 select-none antialiased sm:py-10">
        <Container className="mx-auto max-w-5xl px-3 sm:px-6">
          {/* Header Section */}
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-zinc-150 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl md:text-3xl">
                {q ? (
                  <>
                    Results for{" "}
                    <span className="text-zinc-900">&ldquo;{q}&rdquo;</span>
                  </>
                ) : (
                  "Search Products"
                )}
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm">
                Showing matching items across all verified colors and sizes
              </p>
            </div>

            {q && (
              <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 sm:self-auto">
                <span>{products.length}</span>
                <span className="font-normal text-zinc-500">
                  {products.length === 1 ? "match found" : "matches found"}
                </span>
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