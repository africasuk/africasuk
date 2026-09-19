import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";
import SearchBar from "@/components/layout/header/SearchBar";

import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

const BRAND_COLOR = "#005c2e";

type ColorProduct = ProductWithDetails & {
  selectedColorId?: string;
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const service = useMemo(
    () => new ProductQueryService(new ProductRepository(supabase)),
    []
  );

  const fetchProducts = useCallback(async () => {
    try {
      const data = await service.getAll();
      setProducts(data ?? []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [service]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  /*
   * Same color ordering logic as the web.
   *
   * Product A - Color 1
   * Product B - Color 1
   * Product C - Color 1
   * Product A - Color 2
   * Product B - Color 2
   * Product C - Color 2
   */
  const colorProducts = useMemo<ColorProduct[]>(() => {
    type ProductColor = ProductWithDetails["colors"][number];

    type GroupedColorProduct = {
      product: ProductWithDetails;
      color: ProductColor;
    };

    const groupedProducts: GroupedColorProduct[][] = (
      products ?? []
    ).map((product) => {
      const colors = product.colors ?? [];

      return colors
        .filter(
          (color) =>
            color.variants &&
            color.variants.length > 0
        )
        .map((color) => ({
          product,
          color,
        }));
    });

    const result: ColorProduct[] = [];

    const maxColors = Math.max(
      0,
      ...groupedProducts.map(
        (group) => group.length
      )
    );

    // Interleave colors across products.
    for (
      let index = 0;
      index < maxColors;
      index++
    ) {
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

  /*
   * Search the already-prepared color products.
   *
   * SearchBar handles the actual search UI/navigation.
   * This list can be extended later if SearchBar exposes
   * its query value directly.
   */

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={BRAND_COLOR}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Products",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
        }}
      />

      <FlatList
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
        removeClippedSubviews={true}
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
            {/* Search */}
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Search products, brands, styles..."
              />
            </View>

            {/* Heading */}
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
                {colorProducts.length === 1
                  ? "Item"
                  : "Items"}
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
                onPress={() =>
                  router.push("/requests" as never)
                }
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
              Check back later for new inventory
              additions.
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
    paddingTop: 50,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  listContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 4,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  searchContainer: {
    marginBottom: 16,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  },
});