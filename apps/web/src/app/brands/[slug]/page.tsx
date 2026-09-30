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

  const coverImage =
    (brand as { coverImageUrl?: string }).coverImageUrl ?? brand.logoUrl;

  return (
    <Layout>
      <BrandJsonLd
        name={brand.name}
        slug={brand.slug}
        description={brand.description}
        logo={brand.logoUrl}
        website={brand.website}
      />

      <section className="relative w-full overflow-hidden bg-white select-none antialiased">
        {/* =================================================
            BRAND COVER (Same scale & faded layers as Category)
        ================================================= */}
        <div className="relative h-70 sm:h-85 lg:h-100 w-full overflow-hidden bg-neutral-950">
          {coverImage ? (
            <>
              <Image
                src={coverImage}
                alt={brand.name}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center grayscale contrast-150 opacity-40"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />

              {/* Fade into products */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white/60 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-black" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white/60 to-transparent" />
            </>
          )}

          {/* Brand Info Overlay */}
          <Container className="relative z-10 h-full max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-full items-end pb-12 sm:pb-14 lg:pb-16">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                {/* Clean B&W Logo Badge */}
                {brand.logoUrl && (
                  <div className="relative flex aspect-square size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl bg-white/95 p-3 backdrop-blur-sm shadow-md">
                    <div className="relative size-full">
                      <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        fill
                        sizes="96px"
                        className="object-contain grayscale contrast-200"
                      />
                    </div>
                  </div>
                )}

                <div className="max-w-3xl">
                  {/* Brand Tag + Count */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                      Brand
                    </span>

                    <span className="text-white/50">•</span>

                    <span className="text-xs font-medium text-white/80">
                      {products.length}{" "}
                      {products.length === 1 ? "Product" : "Products"}
                    </span>
                  </div>

                  {/* Brand Name */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                    {brand.name}
                  </h1>

                  {/* Description */}
                  <p className="mt-2 max-w-2xl text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed">
                    {brand.description ||
                      `Browse authentic ${brand.name} collection on AfricaSuk.`}
                  </p>

                  {/* Optional Website Link */}
                  {brand.website && (
                    <div className="mt-3">
                      <Link
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white underline decoration-white/40 underline-offset-4"
                      >
                        <span>Visit Official Website</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* =================================================
            PRODUCTS GRID
        ================================================= */}
        <div className="relative z-10">
          <Container className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center select-none">
                <h2 className="text-base font-semibold text-gray-800">
                  No products available
                </h2>

                <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500">
                  Products from this brand are not currently available on
                  AfricaSuk. Please check back later.
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
          </Container>
        </div>
      </section>
    </Layout>
  );
}