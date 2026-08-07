import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";

import {
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

import { ProductDetails } from "@/components/products/ProductDetails";
import Layout from "@/components/layout/Layout";

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
      title: "Product Not Found | AfricaSuk",
    };
  }


  const title = `${product.name} | AfricaSuk`;

  const description =
    product.description ??
    `Buy ${product.name} online on AfricaSuk.`;

  const url = `https://africasuk.com/products/${product.slug}`;

  return {
    
    title,

    description,

    keywords: [
      product.name,
      product.brand?.name ?? "",
      product.category?.name ?? "",
      "AfricaSuk",
      "South Sudan",
      "Online Shopping",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `https://africasuk.com/products/${product.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },

twitter: {
  card: "summary_large_image",
  title,
  description,
  images: [
    `https://africasuk.com/products/${product.slug}/opengraph-image`,
  ],
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

const allProducts = (await repository.getAll()) ?? [];

const relatedProducts = allProducts
  .filter(
    (item) =>
      item.categoryId === product.categoryId &&
      item.id !== product.id
  )
  .slice(0, 10);

return (
  <Layout>
    <ProductJsonLd product={product} />

    <ProductDetails
      product={product}
      selectedColorId={color}
      relatedProducts={relatedProducts}
    />
  </Layout>
);
}