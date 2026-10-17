import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

import { ProductDetails } from "@/components/products/ProductDetails";
import LoadingScreen from "@/components/shared/LoadingScreen";
import HomeHeader from "@/components/home/HomeHeader";

type ExtendedProduct = ProductWithDetails & {
  relatedProducts: ProductWithDetails[];
};

const BRAND = "#005c2e";

export default function MobileProductDetailsPage() {
  const { slug, color } = useLocalSearchParams<{
    slug: string;
    color?: string;
  }>();

  const scrollY = useSharedValue(0);

  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const service = useMemo(
    () => new ProductQueryService(new ProductRepository(supabase)),
    [],
  );

  const loadProduct = useCallback(
    async (isRefresh = false) => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

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
            item.id !== data.id &&
            item.categoryId === data.categoryId,
        );

        setProduct({
          ...data,
          relatedProducts,
        } as ExtendedProduct);
      } catch (err: unknown) {
        console.error("Error fetching product:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug, color, service],
  );

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>
            Product Not Found
          </Text>

          <Text style={styles.notFoundSubtitle}>
            The product you are looking for does not exist or has
            been removed.
          </Text>

          <Text
            onPress={() => loadProduct()}
            style={styles.retryText}
          >
            Try again
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Same animated header used on the Categories screen */}
      <HomeHeader scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProduct(true)}
            tintColor={BRAND}
            colors={[BRAND]}
          />
        }
      >
        <ProductDetails
          product={product}
          selectedColorId={color}
          relatedProducts={product.relatedProducts}
        />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 100,
  },

  contentContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
    paddingBottom: 24,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
    borderRadius: 16,
  },

  notFoundTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },

  notFoundSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },

  retryText: {
    marginTop: 18,
    color: BRAND,
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 8,
  },
});