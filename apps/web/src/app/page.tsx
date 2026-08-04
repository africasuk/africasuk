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
import FeaturedBrands from "@/components/home/FeaturedBrands";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Layout from "@/components/layout/Layout";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import { RequestProductSection } from "@/components/home/RequestProductSection";
import GenderSection from "@/components/home/GenderSection";

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
    rawBrands,
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

  const brands = (rawBrands ?? []).map((brand) => {
    const typedBrand =
      brand as typeof brand & {
        description?: string;
      };

    return {
      ...brand,
      description:
        typedBrand.description ??
        `Discover authentic products from the official ${brand.name} catalog.`,
    };
  });

  return (
    <Layout>
      <Hero categories={categories} />

      <Categories categories={categories} />

      <GenderSection />

      <FeaturedProducts products={products} />

      <FeaturedBrands brands={brands} />
      
      <RequestProductSection />
      
      <ContinueShopping />

      <ScrollIndicator />
    </Layout>
  );
}