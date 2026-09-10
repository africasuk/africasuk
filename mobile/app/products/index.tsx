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
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

const BRAND_COLOR = "#005c2e";

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

  const colorProducts = useMemo(() => {
    return (products ?? []).flatMap((product) => {
      const colors = product.colors ?? [];
      if (colors.length === 0) return [product];

      return colors.map((color) => ({
        ...product,
        id: `${product.id}-${color.id}`,
        name: `${product.name} - ${color.name}`,
        selectedColorId: color.id,
        colors: [color],
      }));
    });
  }, [products]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
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
          headerStyle: { backgroundColor: "#ffffff" },
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
            <Text style={styles.badge}>Curated Collection</Text>

            <View style={styles.titleRow}>
              <Text style={styles.title}>All Products</Text>

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
                <Text style={styles.requestBtnText}>Can&apos;t Find a Product? Request It</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>

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
  badge: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
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