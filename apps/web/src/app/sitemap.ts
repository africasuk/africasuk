
import type { MetadataRoute } from "next";

import {
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const SITE_URL = "https://africasuk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await createServerSupabaseClient();

  const productService = new ProductQueryService(
    new ProductRepository(db)
  );

  const categoryRepository = new CategoryRepository(db);

  const [products, categories] = await Promise.all([
    productService.getAll(),
    categoryRepository.getAll(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: category.updatedAt
        ? new Date(category.updatedAt)
        : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...productPages, ...categoryPages];
}
