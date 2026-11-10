
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductJsonLd } from "@/components/seo/ProductJsonLd";

import {
  ProductRepository,
  ReviewRepository,
  OrderRepository,
  OrderItemRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
  ReviewService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { ProductDetails } from "@/components/products/ProductDetails";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const dynamic = "force-dynamic";

const SITE_URL = "https://africasuk.com";

function cleanDescription(value?: string | null): string {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const db = await createServerSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const product = await service.getBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Africa Suk",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} | Africa Suk`;

  const description =
    cleanDescription(product.description) ||
    `Discover ${product.name} on Africa Suk, South Sudan's online shopping marketplace. Shop with Confidence.`;

  const url = `${SITE_URL}/products/${product.slug}`;

  const imageUrl = `${url}/opengraph-image`;

  const keywords = [
    product.name,
    product.brand?.name,
    product.category?.name,
    "Africa Suk",
    "South Sudan online shopping",
    "South Sudan online marketplace",
    "Juba online shopping",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "Africa Suk",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - Africa Suk`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { slug } = await params;
  const { color } = await searchParams;

  const db = await createServerSupabaseClient();

  const repository = new ProductRepository(db);
  const service = new ProductQueryService(repository);

  const product = await service.getBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviewService = new ReviewService(
    new ReviewRepository(db),
    new OrderRepository(db),
    new OrderItemRepository(db)
  );

  const reviews = await reviewService.getProductReviews(
    product.id
  );

  const rating = await reviewService.getProductRating(
    product.id
  );

  const allProducts =
    (await repository.getAll({
      random: true,
    })) ?? [];

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.categoryId === product.categoryId &&
        item.id !== product.id
    )
    .slice(0, 10);

  return (
    <Layout>
      <ScrollToTop />

      <ProductJsonLd
        product={product}
        reviews={reviews}
        rating={rating}
      />

      <ProductDetails
        product={product}
        selectedColorId={color}
        relatedProducts={relatedProducts}
        reviews={reviews}
        rating={rating}
      />
    </Layout>
  );
}
