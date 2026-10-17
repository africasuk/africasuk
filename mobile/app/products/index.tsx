
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";
import HomeHeader from "@/components/home/HomeHeader";

const BRAND_COLOR = "#005c2e";
const BRAND_DARK = "#002b15";

type ColorProduct = ProductWithDetails & {
  selectedColorId?: string;
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const service = useMemo(
    () => new ProductQueryService(new ProductRepository(supabase)),
    [],
  );

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setLoadError(false);

    try {
      const data = await service.getAll();
      setProducts(data ?? []);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [service]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    void fetchProducts(true);
  }, [fetchProducts]);

  // Display each product color as its own card, interleaved by color.
  const colorProducts = useMemo<ColorProduct[]>(() => {
    type ProductColor = ProductWithDetails["colors"][number];

    type GroupedColorProduct = {
      product: ProductWithDetails;
      color: ProductColor;
    };

    const groupedProducts: GroupedColorProduct[][] = products.map(
      (product) => {
        const colors = product.colors ?? [];

        return colors
          .filter(
            (color) =>
              (color.variants?.length ?? 0) > 0,
          )
          .map((color) => ({
            product,
            color,
          }));
      },
    );

    const result: ColorProduct[] = [];

    const maxColors = Math.max(
      0,
      ...groupedProducts.map((group) => group.length),
    );

    for (let index = 0; index < maxColors; index++) {
      for (const group of groupedProducts) {
        const item = group[index];
        if (!item) continue;

        result.push({
          ...item.product,
          id: `${item.product.id}-${item.color.id}`,
          name: `${item.product.name} - ${item.color.name}`,
          selectedColorId: item.color.id,
          colors: [item.color],
        });
      }
    }

    return result;
  }, [products]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />

        <Text style={styles.loadingTitle}>
          Loading products
        </Text>

        <Text style={styles.loadingSubtitle}>
          Getting the latest products for you...
        </Text>
      </View>
    );
  }

  if (loadError && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>
          Couldn&apos;t load products
        </Text>

        <Text style={styles.loadingSubtitle}>
          Please check your connection and try again.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.85}
          onPress={() => void fetchProducts()}
        >
          <Text style={styles.retryButtonText}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader scrollY={scrollY} />

      <Animated.FlatList
        key="products-grid-2-col"
        data={colorProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BRAND_COLOR]}
            tintColor={BRAND_COLOR}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headingSection}>
              <View style={styles.titleGroup}>
                <Text style={styles.badge}>
                  Curated Collection
                </Text>

                <Text style={styles.title}>
                  All Products
                </Text>
              </View>

              <Text style={styles.itemCount}>
                {colorProducts.length}{" "}
                {colorProducts.length === 1 ? "Item" : "Items"}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          colorProducts.length > 0 ? (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.requestBtn}
                activeOpacity={0.85}
                onPress={() => router.push("/requests" as never)}
              >
                <Text style={styles.requestBtnText}>
                  Can&apos;t Find a Product? Request It
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptySubtitle}>
              Check back later for new inventory additions.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: BRAND_DARK,
  },

  loadingSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#6b7280",
    textAlign: "center",
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BRAND_DARK,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: BRAND_COLOR,
  },

  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 8,
    paddingTop: 120,
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 4,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  headingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  titleGroup: {
    flex: 1,
  },

  badge: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },

  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardWrapper: {
    width: "49%",
  },

  footerContainer: {
    marginTop: 18,
    paddingHorizontal: 4,
    paddingBottom: 20,
    width: "100%",
  },

  requestBtn: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },

  requestBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: -0.2,
  },

  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    marginTop: 20,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
});
