import { SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/auth/client";

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import ContinueShopping from "@/components/home/ContinueShopping";
import RequestProductSection from "@/components/home/RequestProductSection";
import HomeHeader from "@/components/home/HomeHeader";

export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [
        { data: rawCategories, error: categoriesError },
        { data: rawBrands, error: brandsError },
        { data: rawProducts, error: productsError },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true }),

        supabase
          .from("brands")
          .select("*")
          .order("name"),

        supabase
          .from("products")
          .select(`
            *,
            category:categories(*),
            brand:brands(*),
            colors:product_colors(
              *,
              images:product_images(*),
              variants:product_variants(*)
            )
          `)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (categoriesError) throw categoriesError;
      if (brandsError) throw brandsError;
      if (productsError) throw productsError;

      const formattedCategories = (rawCategories ?? []).map(
        (category: any) => ({
          ...category,
          imageUrl: category.image_url,
          isActive: category.is_active,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
          description:
            category.description ??
            `Explore our handpicked collections in ${category.name.toLowerCase()}.`,
        })
      );

      const formattedBrands = (rawBrands ?? []).map((brand: any) => ({
        ...brand,
        logoUrl: brand.logo_url,
        isActive: brand.is_active,
        createdAt: brand.created_at,
        updatedAt: brand.updated_at,
        description:
          brand.description ??
          `Discover authentic products from the official ${brand.name} catalog.`,
      }));

      const formattedProducts = (rawProducts ?? []).map(
        (product: any) => ({
          ...product,

          allowCod: product.allow_cod,
          allowOnlinePayment: product.allow_online_payment,

          categoryId: product.category_id,
          brandId: product.brand_id,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,

          category: product.category
            ? {
                ...product.category,
                imageUrl: product.category.image_url,
                isActive: product.category.is_active,
                createdAt: product.category.created_at,
                updatedAt: product.category.updated_at,
              }
            : null,

          brand: product.brand
            ? {
                ...product.brand,
                logoUrl: product.brand.logo_url,
                isActive: product.brand.is_active,
                createdAt: product.brand.created_at,
                updatedAt: product.brand.updated_at,
              }
            : null,

          colors: (product.colors ?? []).map((color: any) => ({
            ...color,

            productId: color.product_id,
            hexCode: color.hex_code,
            createdAt: color.created_at,
            updatedAt: color.updated_at,

            images: (color.images ?? []).map((image: any) => ({
              ...image,
              productColorId: image.product_color_id,
              imageUrl: image.image_url,
              sortOrder: image.sort_order,
              createdAt: image.created_at,
            })),

            variants: (color.variants ?? []).map((variant: any) => ({
              ...variant,
              productColorId: variant.product_color_id,
              optionName: variant.option_name,
              optionValue: variant.option_value,
              isActive: variant.is_active,
              price: Number(variant.price),
              stock: variant.stock,
              createdAt: variant.created_at,
              updatedAt: variant.updated_at,
            })),
          })),
        })
      );

      setCategories(formattedCategories);
      setBrands(formattedBrands);
      setProducts(formattedProducts);
    }

    load().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />

        <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Hero categories={categories} />
        <Categories categories={categories} />
        <FeaturedProducts products={products} />
        <FeaturedBrands brands={brands} />
        <RequestProductSection />
        <ContinueShopping />
      </ScrollView>
    </SafeAreaView>
  );
}