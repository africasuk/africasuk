import {
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import Categories from "@/components/home/Categories";
import ContinueShopping from "@/components/home/ContinueShopping";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Layout from "@/components/layout/Layout";
import { RequestProductSection } from "@/components/home/RequestProductSection";
import GreenSectionDivider from "@/components/home/GreenSectionDivider";
import { ButtonSection } from "@/components/home/ButtonSection";
import AppDownloadSection from "@/components/home/AppDownloadSection";
import MobileHero from "@/components/home/MobileHero";
import MobileCategories from "@/components/home/MobileCategories";
// import GiftSomethingSection from "@/components/home/GiftSomethingSection";
// import GreenSectionDivider from "@/components/home/GreenSectionDivider";

export default async function HomePage() {
  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(supabase);



  const productService = new ProductQueryService(
    new ProductRepository(supabase)
  );

const [
  rawCategories,
  products,
] = await Promise.all([
  categoryRepository.getAll(),
  productService.getAll(),
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
    {/* Mobile and tablet hero */}
    <div className="lg:hidden">
      <MobileHero categories={categories} />
      <MobileCategories categories={categories} />
    </div>

    {/* Desktop hero — keep the existing design */}
    <div className="hidden lg:block">
      <Hero categories={categories} />
    </div>

    <FeaturedProducts products={products} />

    <GreenSectionDivider categories={categories} />

    <Categories categories={categories} />

    <ButtonSection />

    <RequestProductSection />

    <ContinueShopping />

    <AppDownloadSection />
  </Layout>
);
}