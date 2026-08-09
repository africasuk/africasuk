import { ProductRepository } from "@africasuk/database";
import { ProductQueryService } from "@africasuk/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";

export default async function ProductsPage() {
  const db = await createServerSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const products = await service.getAll();

  // Flatten products by color variant with explicit parameter typing
  const colorProducts = (products ?? []).flatMap((product) => {
    type ProductColor = (typeof product.colors)[number];

    return (product.colors ?? [])
      .filter((color: ProductColor) => color.variants && color.variants.length > 0)
      .map((color: ProductColor) => ({
        ...product,
        id: `${product.id}-${color.id}`,
        name: `${product.name} - ${color.name}`,
        selectedColorId: color.id,
        colors: [color],
      }));
  });

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 select-none antialiased">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-2 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              All Products
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Explore our full collection of authentic items and color variants.
            </p>
          </div>

          <p className="text-xs font-semibold text-gray-500">
            {colorProducts.length} {colorProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Empty State Fallback */}
        {colorProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
            <p className="text-base font-semibold text-gray-800">No products found</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Check back later for new inventory additions.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {colorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}