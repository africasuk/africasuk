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

  // Flatten products by color variant so each color gets its own grid item
  const colorProducts = (products ?? []).flatMap((product) =>
    product.colors.map((color: typeof product.colors[number]) => ({
      ...product,
      id: `${product.id}-${color.id}`,
      name: `${product.name} - ${color.name}`,
      selectedColorId: color.id,
      colors: [color],
    }))
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-2 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#002b15]">
              Curated Collection
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              All Products
            </h1>
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {colorProducts.length} {colorProducts.length === 1 ? "Item" : "Items"} Available
          </p>
        </div>

        {/* Empty State Fallback */}
        {colorProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-base font-semibold text-gray-700">No products found</p>
            <p className="mt-1 text-sm text-gray-400">
              Check back later for new inventory additions.
            </p>
          </div>
        ) : (
          /* Product Grid: 2 cols on Mobile, 3 on Tablet, 4 on Desktop */
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {colorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}