import { ProductRepository } from "@africasuk/database";
import { ProductQueryService } from "@africasuk/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/ProductCard";
import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const db = await createServerSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const products = await service.getAll({
    random: true,
  });

  // Flatten products by color variant with explicit parameter typing
type ColorProduct = {
  product: (typeof products)[number];
  color: (typeof products)[number]["colors"][number];
};

const groupedProducts: ColorProduct[][] = (products ?? []).map(
  (product) => {
    type ProductColor =
      (typeof product.colors)[number];

    return (product.colors ?? [])
      .filter(
        (color: ProductColor) =>
          color.variants &&
          color.variants.length > 0
      )
      .map((color: ProductColor) => ({
        product,
        color,
      }));
  }
);

// Mix one color from each product at a time
const colorProducts = [];

const maxColors = Math.max(
  0,
  ...groupedProducts.map(
    (group) => group.length
  )
);

for (let index = 0; index < maxColors; index++) {
  for (const group of groupedProducts) {
    const item = group[index];

    if (!item) continue;

    colorProducts.push({
      ...item.product,

      id: `${item.product.id}-${item.color.id}`,

      name: `${item.product.name} - ${item.color.name}`,

      selectedColorId: item.color.id,

      colors: [item.color],
    });
  }
}


  return (
    <Layout>
      <section className="py-8 sm:py-12 select-none antialiased">
        <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">

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
              {colorProducts.length}{" "}
              {colorProducts.length === 1
                ? "Product"
                : "Products"}
            </p>
          </div>

          {/* Empty State Fallback */}
          {colorProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
              <p className="text-base font-semibold text-gray-800">
                No products found
              </p>

              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Check back later for new inventory additions.
              </p>
            </div>
          ) : (
            /* Widescreen Fluid Grid */
            <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-6">
              {colorProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

        </Container>
      </section>
    </Layout>
  );
}