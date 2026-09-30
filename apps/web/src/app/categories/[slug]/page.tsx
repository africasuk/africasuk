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

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/* -------------------------------------------------------
   Metadata
------------------------------------------------------- */

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
        ? [{ url: category.imageUrl }]
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

/* -------------------------------------------------------
   Category Page
------------------------------------------------------- */

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(
    supabase
  );

  const productService = new ProductQueryService(
    new ProductRepository(supabase)
  );

  /* -------------------------------------------------------
     Get Category
  ------------------------------------------------------- */

  const category =
    await categoryRepository.getBySlug(slug);

  if (!category) {
    notFound();
  }

  /* -------------------------------------------------------
     Get Products
     Keep random order
  ------------------------------------------------------- */

  const products = (
    await productService.getAll({
      random: true,
    })
  ).filter(
    (product) =>
      product.categoryId === category.id
  );

  /* -------------------------------------------------------
     Prepare Products By Color

     Example:

     Shirt - Black
     Bag   - Red
     Shoes - White
     Shirt - Pink
     Bag   - Blue
     Shoes - Black
  ------------------------------------------------------- */

  type ProductColor =
    (typeof products)[number]["colors"][number];

  const groupedProducts = products.map((product) => {
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
  });

  /* -------------------------------------------------------
     Mix Colors From Different Products
  ------------------------------------------------------- */

  const mixedProducts: Array<
    (typeof products)[number] & {
      selectedColorId: string;
    }
  > = [];

  const maxColors = Math.max(
    0,
    ...groupedProducts.map(
      (group) => group.length
    )
  );

  for (
    let index = 0;
    index < maxColors;
    index++
  ) {
    for (const group of groupedProducts) {
      const item = group[index];

      if (!item) continue;

      mixedProducts.push({
        ...item.product,

        id: `${item.product.id}-${item.color.id}`,

        name: `${item.product.name} - ${item.color.name}`,

        selectedColorId: item.color.id,

        colors: [item.color],
      });
    }
  }

  /* -------------------------------------------------------
     Total Items
  ------------------------------------------------------- */

  type CategoryProductColor =
    (typeof products)[number]["colors"][number];

  const totalItemsCount = products.reduce(
    (total: number, product) =>
      total +
      product.colors.reduce(
        (
          sum: number,
          color: CategoryProductColor
        ) =>
          sum + color.variants.length,
        0
      ),
    0
  );

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <Layout>
      <CategoryJsonLd category={category} />

      <section className="relative w-full overflow-hidden bg-white select-none antialiased">

        {/* =================================================
            CATEGORY COVER
        ================================================= */}

        <div className="relative h-70 sm:h-85 lg:h-100 w-full overflow-hidden">

          {category.imageUrl ? (
            <>
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/5" />

              {/* Fade into products */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white/60 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#005c2e] to-[#008744]" />
          )}

          {/* Category Content */}

          <Container className="relative z-10 h-full max-w-7xl w-full px-4 sm:px-6 lg:px-8">

            <div className="flex h-full items-end pb-12 sm:pb-14 lg:pb-16">

              <div className="max-w-3xl">

                {/* Department + Items */}

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    Department
                  </span>

                  <span className="text-white/50">
                    •
                  </span>

                  <span className="text-xs font-medium text-white/80">
                    {totalItemsCount}{" "}
                    {totalItemsCount === 1
                      ? "Item"
                      : "Items"}
                  </span>

                </div>

                {/* Category Name */}

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                  {category.name}
                </h1>

                {/* Description */}

                <p className="mt-2 max-w-2xl text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed">
                  {category.description ||
                    `Browse our authentic collection of verified items in ${category.name.toLowerCase()}.`}
                </p>

              </div>

            </div>

          </Container>
        </div>

        {/* =================================================
            PRODUCTS + FILTERS
        ================================================= */}

        <div className="relative z-10">

          <Container className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            <CategoryProducts
              products={mixedProducts}
            />

          </Container>

        </div>

      </section>
    </Layout>
  );
}