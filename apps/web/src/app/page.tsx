import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import {
  BrandService,
  ProductQueryService,
} from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import Categories from "@/components/home/Categories";
import ContinueShopping from "@/components/home/ContinueShopping";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Layout from "@/components/layout/Layout";
import { RequestProductSection } from "@/components/home/RequestProductSection";
import GenderSection from "@/components/home/GenderSection";
import { ButtonSection } from "@/components/home/ButtonSection";
import AppDownloadSection from "@/components/home/AppDownloadSection";

export default async function HomePage() {
  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(supabase);

  const brandService = new BrandService(
    new BrandRepository(supabase),
  );

  const productService = new ProductQueryService(
    new ProductRepository(supabase)
  );

  const [
    rawCategories,
    products,
  ] = await Promise.all([
    categoryRepository.getAll(),
    productService.getAll(),
    brandService.getAll(),
  ]);

  const categories = (rawCategories ?? []).map(
    (category) => {
      const typedCategory =
        category as typeof category & {
          description?: string;
        };

      return {
        ...category,
        description:
          typedCategory.description ??
          `Explore our handpicked collections in ${category.name.toLowerCase()}.`,
      };
    },
  );


  return (
    <Layout>
      <Hero categories={categories} />

      <FeaturedProducts products={products} />

      <GenderSection />

      <Categories categories={categories} />

      <ButtonSection />
      
      <RequestProductSection />
      
      <ContinueShopping />

      <AppDownloadSection />
      
    </Layout>
  );
}