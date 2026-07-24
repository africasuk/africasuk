import type { MetadataRoute } from "next";

import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await createServerSupabaseClient();

  const productService = new ProductQueryService(
    new ProductRepository(db)
  );

  const categoryRepository = new CategoryRepository(db);

  const brandRepository = new BrandRepository(db);

  const [products, categories, brands] =
    await Promise.all([
      productService.getAll(),
      categoryRepository.getAll(),
      brandRepository.getAll(),
    ]);

  const baseUrl = "https://africasuk.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),

    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...brands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}`,
      lastModified: new Date(brand.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}