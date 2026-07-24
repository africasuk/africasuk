import { notFound } from "next/navigation";
import Image from "next/image";

import {
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";
import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import CategoryProducts from "@/components/products/CategoryProducts";


import type { Metadata } from "next";
import { CategoryJsonLd } from "@/components/seo/CategoryJsonLd";


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
      images: category.imageUrl
        ? [
            {
              url: category.imageUrl,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: `${category.name} | AfricaSuk`,
      description,
      images: category.imageUrl
        ? [category.imageUrl]
        : [],
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
      (
        sum: number,
        color: {
          variants: unknown[];
        }
      ) => sum + color.variants.length,
      0
    ),
  0
);

  return (
    <Layout>
<CategoryJsonLd category={category} />


      <section className="py-8 lg:py-12 bg-[#f4f4f4] min-h-screen antialiased selection:bg-[#004d26]/10">
        <Container>
          {/* Centered Max-Width Wrapper */}
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Compact, Highly Responsive Category Header Card */}
            <div className="flex flex-row items-center gap-4 sm:gap-6 bg-white border border-neutral-200/60 rounded-2xl p-4 sm:p-5 select-none shadow-xs">
              
              {/* Responsive, Clean Image Showcase Container */}
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-xl border border-neutral-200/50 bg-white p-2">
                {category.imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-[#004d26]">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Compact Typography & Details */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900 truncate">
                  {category.name}
                </h1>

                {/* Safe Description Check with Elegant Fallback */}
                <p className="mt-1 text-xs sm:text-sm text-neutral-500 leading-normal sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-3">
                  {category.description || 
                    `Explore our handpicked collection of premium products in ${category.name.toLowerCase()}.`}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-neutral-600">
                    {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Marketplace Catalog Grid Container */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 sm:p-8 shadow-xs">
              <div className="mb-6 select-none flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#004d26]">
                  Curated Catalog Matrix
                </h2>
                <div className="h-1 w-12 bg-[#004d26] rounded-full" />
              </div>

              <CategoryProducts products={products} />
            </div>

          </div>
        </Container>
      </section>
    </Layout>
  );
}