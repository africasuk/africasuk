import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductQueryService } from "@/services/ProductQueryService";
import { supabase } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const service = useMemo(
    () =>
      new ProductQueryService(
        new ProductRepository(supabase)
      ),
    []
  );

  // FIXED: Wrapped fetchProducts in useCallback
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

  // FIXED: Added fetchProducts to the dependency array
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const colorProducts = (products ?? []).flatMap((product) =>
    (product.colors ?? []).map((color) => ({
      ...product,
      id: `${product.id}-${color.id}`,
      name: `${product.name} - ${color.name}`,
      selectedColorId: color.id,
      colors: [color],
    }))
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#005c2e"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={colorProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#005c2e"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.badge}>
              CURATED COLLECTION
            </Text>

            <View style={styles.titleRow}>
              <Text style={styles.title}>
                All Products
              </Text>

              <Text style={styles.itemCount}>
                {colorProducts.length}{" "}
                {colorProducts.length === 1
                  ? "Item"
                  : "Items"}
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#002b15",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },
  itemCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
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