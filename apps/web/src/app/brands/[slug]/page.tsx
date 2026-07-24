import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { BrandJsonLd } from "@/components/seo/BrandJsonLd";

import {
  BrandRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";

import type { ProductWithDetails } from "@africasuk/types";

import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/components/products/ProductCard";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}


export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const brandRepository = new BrandRepository(supabase);

  const brand =
    await brandRepository.getBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | AfricaSuk",
    };
  }

  const url = `https://africasuk.com/brands/${brand.slug}`;

  const description =
    brand.description ??
    `Browse ${brand.name} products on AfricaSuk.`;

  return {
    title: `${brand.name} | AfricaSuk`,

    description,

    keywords: [
      brand.name,
      "AfricaSuk",
      "South Sudan",
      "Online Shopping",
      "Marketplace",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${brand.name} | AfricaSuk`,
      description,
      url,
      type: "website",
      images: brand.logoUrl
        ? [
            {
              url: brand.logoUrl,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title: `${brand.name} | AfricaSuk`,

      description,

      images: brand.logoUrl
        ? [brand.logoUrl]
        : [],
    },
  };
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

  const products: ProductWithDetails[] = (await productService.getAll()).filter(
    (product) => product.brandId === brand.id
  );

  return (
    <Layout>
      <BrandJsonLd
        name={brand.name}
        slug={brand.slug}
        description={brand.description}
        logo={brand.logoUrl}
        website={brand.website}
      />
      <section className="min-h-screen bg-[#f4f4f4] py-8 antialiased selection:bg-[#004d26]/10 lg:py-12">
        <Container>
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Brand Header Card */}
            <div className="flex flex-row items-center gap-4 rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-xs select-none sm:gap-6 sm:p-5">
              {/* Logo Container */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-neutral-200/50 bg-white p-2 sm:h-24 sm:w-24">
                {brand.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      priority
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-2xl font-black text-[#004d26] sm:text-3xl">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Typography & Details */}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-black tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">
                  {brand.name}
                </h1>

                {brand.description && (
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-normal text-neutral-500 sm:line-clamp-3 sm:text-sm sm:leading-relaxed">
                    {brand.description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 sm:text-xs">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"}
                  </span>

                  {brand.website && (
                    <Link
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative pb-0.5 text-[10px] font-bold tracking-wide text-[#004d26] transition-colors hover:text-[#003b1d] sm:text-xs"
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
              <div className="rounded-2xl border border-neutral-200/60 bg-white py-16 text-center shadow-xs select-none">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  No products found
                </h2>

                <p className="mx-auto mt-1 max-w-xs px-4 text-xs text-neutral-500 sm:text-sm">
                  There are no products available for this brand yet. Please
                  check back later.
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 justify-center gap-4 sm:gap-6 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                {products.flatMap((product) =>
                  product.colors.map((color) => {
                    const variant = color.variants[0];

                    if (!variant) return [];

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