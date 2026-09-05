import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import {
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";
import { ProductQueryService } from "@africasuk/api";
import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import CategoryProducts from "@/components/products/CategoryProducts";
import { CategoryJsonLd } from "@/components/seo/CategoryJsonLd";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const categoryRepository = new CategoryRepository(supabase);
  const category = await categoryRepository.getBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | AfricaSuk",
    };
  }

  const url = `https://africasuk.com/categories/${category.slug}`;
  const description =
    category.description ??
    `Browse ${category.name} products on AfricaSuk.`;

  return {
    title: `${category.name} | AfricaSuk`,
    description,
    keywords: [
      category.name,
      "AfricaSuk",
      "South Sudan",
      "Online Shopping",
      "Marketplace",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} | AfricaSuk`,
      description,
      url,
      type: "website",
      images: category.imageUrl ? [{ url: category.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | AfricaSuk`,
      description,
      images: category.imageUrl ? [category.imageUrl] : [],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(supabase);
  const productService = new ProductQueryService(
    new ProductRepository(supabase)
  );

  const category = await categoryRepository.getBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = (await productService.getAll()).filter(
    (product) => product.categoryId === category.id
  );

  const totalItemsCount = products.reduce(
    (total, product) =>
      total +
      product.colors.reduce(
        (sum: number, color: { variants: unknown[] }) =>
          sum + color.variants.length,
        0
      ),
    0
  );

  return (
    <Layout>
      <CategoryJsonLd category={category} />

      <section className="w-full bg-white py-8 sm:py-12 select-none antialiased border-b border-gray-100">
        <Container className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 sm:space-y-12">
            
            {/* Minimalist 1:1 Pinterest Category Header (No Card Frames, No Shadows) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 border-b border-gray-100 pb-8 text-center sm:text-left">
              
              {/* 1:1 Clean Image Frame */}
              <div className="relative aspect-square w-24 sm:w-28 shrink-0 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#008744]">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Metadata Underneath/Beside */}
              <div className="flex flex-col justify-center max-w-2xl space-y-1.5 pt-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744]">
                    Department
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-500">
                    {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
                  {category.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                  {category.description ||
                    `Browse our authentic collection of verified items in ${category.name.toLowerCase()}.`}
                </p>
              </div>
            </div>

            {/* Seamless Catalog View (No Heavy Card Containers) */}
            <div className="w-full">
              <CategoryProducts products={products} />
            </div>

          </div>
        </Container>
      </section>
    </Layout>
  );
}