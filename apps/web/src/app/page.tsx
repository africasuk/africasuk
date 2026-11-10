
import type { Metadata } from "next";

import {
  CategoryRepository,
  ProductRepository,
} from "@africasuk/database";

import { ProductQueryService } from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import Categories from "@/components/home/Categories";
import ContinueShopping from "@/components/home/ContinueShopping";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Layout from "@/components/layout/Layout";
import { RequestProductSection } from "@/components/home/RequestProductSection";
import GreenSectionDivider from "@/components/home/GreenSectionDivider";
import AppDownloadSection from "@/components/home/AppDownloadSection";
import MobileHero from "@/components/home/MobileHero";
import MobileCategories from "@/components/home/MobileCategories";
import HomeSEOIntro from "@/components/home/HomeSEOIntro";

export const metadata: Metadata = {
  title: "Africa Suk | South Sudan's Online Shopping Marketplace",
  description:
    "Shop online with Africa Suk, South Sudan's online shopping marketplace. Discover electronics, fashion, beauty, home products, and everyday essentials in one convenient place.",

  keywords: [
    "Africa Suk",
    "South Sudan online shopping",
    "South Sudan online marketplace",
    "online shopping in South Sudan",
    "online store South Sudan",
    "shop online South Sudan",
    "Juba online shopping",
    "buy products online South Sudan",
    "electronics South Sudan",
    "fashion South Sudan",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    title: "Africa Suk | South Sudan's Online Shopping Marketplace",
    description:
      "Discover and shop for products through South Sudan's online shopping marketplace. Shop with Confidence.",
    url: "/",
    siteName: "Africa Suk",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Africa Suk | South Sudan's Online Shopping Marketplace",
    description:
      "Discover and shop for electronics, fashion, beauty, home products, and more with Africa Suk.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(supabase);

  const productService = new ProductQueryService(
    new ProductRepository(supabase)
  );

  const [rawCategories, products] = await Promise.all([
    categoryRepository.getAll(),
    productService.getAll({ random: true }),
  ]);

  const categories = (rawCategories ?? []).map((category) => {
    const typedCategory = category as typeof category & {
      description?: string;
    };

    return {
      ...category,
      description:
        typedCategory.description ??
        `Explore our handpicked collections in ${category.name.toLowerCase()}.`,
    };
  });

  return (
    <Layout>
      <HomeSEOIntro />
      {/* Mobile and tablet hero */}
      <div className="lg:hidden">
        <MobileHero categories={categories} />
        <MobileCategories categories={categories} />
      </div>

      {/* Desktop hero */}
      <div className="hidden lg:block">
        <Hero categories={categories} />
      </div>

      <FeaturedProducts products={products ?? []} />

      <GreenSectionDivider categories={categories} />

      <Categories categories={categories} />

      <RequestProductSection />

      <ContinueShopping />

      <AppDownloadSection />
    </Layout>
  );
}
