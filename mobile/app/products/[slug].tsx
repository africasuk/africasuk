import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

import { ProductDetails } from "@/components/products/ProductDetails";

type ExtendedProduct = ProductWithDetails & {
  relatedProducts: ProductWithDetails[];
};

export default function MobileProductDetailsPage() {
  const { slug, color } = useLocalSearchParams<{
    slug: string;
    color?: string;
  }>();

  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(
    () => new ProductQueryService(new ProductRepository(supabase)),
    []
  );

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const baseSlug =
          slug.includes("-") && color && slug.endsWith(`-${color}`)
            ? slug.slice(0, -(color.length + 1))
            : slug;

        const data = await service.getBySlug(baseSlug);

        if (!data) {
          throw new Error("Product not found");
        }

        const allProducts = await service.getAll();

        const relatedProducts = allProducts.filter(
          (item) =>
            item.id !== data.id && item.categoryId === data.categoryId
        );

        setProduct({
          ...data,
          relatedProducts,
        } as ExtendedProduct);
      } catch (err: unknown) {
        console.error("Error fetching product:", err);

        setError(
          err instanceof Error ? err.message : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug, color, service]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#005c2e" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Product Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            The product you are looking for does not exist or has been removed.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: "Back",
          headerTintColor: "#111827",
          headerTitleStyle: {
            fontWeight: "500", // Non-bold clean weight
            fontSize: 16,
          },
        }}
      />
      <ProductDetails
        product={product}
        selectedColorId={color}
        relatedProducts={product.relatedProducts}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  contentContainer: {
    paddingBottom: 40,
    paddingTop: 12,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },

  notFoundCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },

  notFoundTitle: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  notFoundSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
});