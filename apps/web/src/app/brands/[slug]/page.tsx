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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const brandRepository = new BrandRepository(supabase);
  const brand = await brandRepository.getBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | AfricaSuk",
    };
  }

  const url = `https://africasuk.com/brands/${brand.slug}`;
  const description =
    brand.description ?? `Browse ${brand.name} products on AfricaSuk.`;

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
      images: brand.logoUrl ? [{ url: brand.logoUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} | AfricaSuk`,
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
      <section className="w-full bg-white py-8 sm:py-12 select-none antialiased border-b border-gray-100 min-h-screen">
        <Container className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 sm:space-y-12">
            
            {/* Minimalist 1:1 Pinterest Brand Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 border-b border-gray-100 pb-8 text-center sm:text-left">
              
              {/* Tight 1:1 Image Frame with Rounded Inner Container */}
              <div className="relative aspect-square w-24 sm:w-28 shrink-0 rounded-2xl bg-white border border-gray-100 p-2 sm:p-2.5 flex items-center justify-center">
                {brand.logoUrl ? (
                  <div className="relative w-full h-full overflow-hidden rounded-xl">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      priority
                      sizes="(max-width: 640px) 112px, 160px"
                      className="object-contain rounded-xl"
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#008744]">
                    {brand.name.slice(0, 3)}
                  </span>
                )}
              </div>

              {/* Title & Brand Metadata */}
              <div className="flex flex-col justify-center max-w-2xl space-y-1.5 pt-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744]">
                    Official Partner
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-500">
                    {products.length} {products.length === 1 ? "Product" : "Products"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
                  {brand.name}
                </h1>

                {brand.description && (
                  <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                    {brand.description}
                  </p>
                )}

                {brand.website && (
                  <div className="pt-1 flex justify-center sm:justify-start">
                    <Link
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#008744] hover:underline"
                    >
                      <span>Visit Website</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Products Layout */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center select-none">
                <h2 className="text-base font-semibold text-gray-800">
                  No products found
                </h2>
                <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500">
                  There are no products available for this brand yet. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full items-start">
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