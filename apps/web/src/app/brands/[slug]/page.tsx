import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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

  const brand = await brandRepository.getBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Africa Suk",
    };
  }

  const url = `https://africasuk.com/brands/${brand.slug}`;

  const description =
    brand.description ??
    `Explore ${brand.name} products available on Africa Suk in South Sudan.`;

  return {
    title: `${brand.name} | Africa Suk`,
    description,

    keywords: [
      brand.name,
      "Africa Suk",
      "South Sudan",
      "online shopping South Sudan",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${brand.name} | Africa Suk`,
      description,
      url,
      type: "website",
      images: brand.logoUrl
        ? [
            {
              url: brand.logoUrl,
              alt: `${brand.name} products on Africa Suk`,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: `${brand.name} | Africa Suk`,
      description,
      images: brand.logoUrl ? [brand.logoUrl] : [],
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

  const products: ProductWithDetails[] = (
    await productService.getAll()
  ).filter((product) => product.brandId === brand.id);

  return (
    <Layout>
      <BrandJsonLd
        name={brand.name}
        slug={brand.slug}
        description={brand.description}
        logo={brand.logoUrl}
        website={brand.website}
      />

      <section className="min-h-screen w-full border-b border-gray-100 bg-white py-8 antialiased select-none sm:py-12">
        <Container className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 sm:space-y-12">
            {/* Brand Header */}
            <div className="flex flex-col items-center gap-5 border-b border-gray-100 pb-8 text-center sm:flex-row sm:items-start sm:gap-7 sm:text-left">
              {/* Brand Logo */}
              <div className="relative flex aspect-square w-24 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white p-2 sm:w-28 sm:p-2.5">
                {brand.logoUrl ? (
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      fill
                      priority
                      sizes="(max-width: 640px) 96px, 112px"
                      className="rounded-xl object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-xl font-bold uppercase tracking-wider text-[#008744] sm:text-2xl">
                    {brand.name.slice(0, 3)}
                  </span>
                )}
              </div>

              {/* Brand Information */}
              <div className="flex max-w-2xl flex-col justify-center space-y-1.5 pt-1">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744]">
                    Brand
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="text-xs font-medium text-gray-500">
                    {products.length}{" "}
                    {products.length === 1 ? "Product" : "Products"}
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  {brand.name}
                </h1>

                {brand.description && (
                  <p className="text-xs font-normal leading-relaxed text-gray-500 sm:text-sm">
                    {brand.description}
                  </p>
                )}

                {brand.website && (
                  <div className="flex justify-center pt-1 sm:justify-start">
                    <Link
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#008744] hover:underline"
                    >
                      <span>Visit Brand Website</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center select-none">
                <h2 className="text-base font-semibold text-gray-800">
                  No products available
                </h2>

                <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500">
                  Products from this brand are not currently available on
                  Africa Suk. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 items-start gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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