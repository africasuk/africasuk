import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  BrandRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductColor } from "../../../../../../packages/types/product";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const brandRepository = new BrandRepository(supabase);

const productService = new ProductQueryService(
  new ProductRepository(supabase)
);

  const brand = await brandRepository.getBySlug(slug);

  if (!brand) {
    notFound();
  }
const products = (await productService.getAll()).filter(
  (product) => product.brandId === brand.id
);

  return (
    <Layout>
      <section className="py-8 lg:py-12 bg-[#f4f4f4] min-h-screen antialiased selection:bg-[#004d26]/10">
        <Container>
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Brand Header Card */}
            <div className="flex flex-row items-center gap-4 sm:gap-6 bg-white border border-neutral-200/60 rounded-2xl p-4 sm:p-5 select-none shadow-xs">
              
              {/* Logo Container */}
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-xl border border-neutral-200/50 bg-white p-2">
                {brand.logoUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-[#004d26]">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Typography & Details */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900 truncate">
                  {brand.name}
                </h1>

                {brand.description && (
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 leading-normal sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-3">
                    {brand.description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-neutral-600">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>

                  {brand.website && (
                    <Link
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-[10px] sm:text-xs font-bold tracking-wide text-[#004d26] transition-colors hover:text-[#003b1d] pb-0.5"
                    >
                      Visit Website
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#004d26] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200/60 bg-white py-16 text-center select-none shadow-xs">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  No products found
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto px-4">
                  There are no products available for this brand yet. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 sm:gap-6 w-full justify-center">
                {products.flatMap((product) =>
                  product.colors.map((color: ProductColor) => {
                    const variant = color.variants[0];

                    if (!variant) return null;

                    return (
                      <ProductCard
                          key={`${product.id}-${color.id}`}
                          product={{
                            ...product,
                            name: `${product.name} - ${color.name}`,
                            colors: [color],
                          }}
                        />
                    );
                  })
                )}
              </div>
            )}

          </div>
        </Container>
      </section>
    </Layout>
  );
}