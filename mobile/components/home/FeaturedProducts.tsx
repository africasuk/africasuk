import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "../products/ProductCard";

interface Props {
  products: ProductWithDetails[];
}

const BRAND_COLOR = "#005c2e";

export default function FeaturedProducts({ products = [] }: Props) {
  const featured = useMemo(() => {
    return products.filter(
      (product) => product.isActive && (product.colors?.length ?? 0) > 0
    );
  }, [products]);

  const featuredColorProducts = useMemo(() => {
    return featured
      .flatMap((product) =>
        (product.colors ?? [])
          .filter((color) => (color.variants?.length ?? 0) > 0)
          .map((color) => ({
            ...product,
            id: `${product.id}-${color.id}`,
            name: `${product.name} - ${color.name}`,
            selectedColorId: color.id,
            colors: [color],
          }))
      )
      .slice(0, 12);
  }, [featured]);

  if (featuredColorProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>Curated Drops</Text>
          <Text style={styles.title}>Featured Products</Text>
          <Text style={styles.subtitle}>
            Hand-picked premium selections curated exclusively for you.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/products" as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* 2-Column Pinterest Grid (Zero VirtualizedList crashes) */}
      <View style={styles.grid}>
        {featuredColorProducts.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <ProductCard product={item} />
          </View>
        ))}
      </View>

      {/* Clean Pinterest-Style Pill Button */}
      <TouchableOpacity
        style={styles.allProductsBtn}
        activeOpacity={0.85}
        onPress={() => router.push("/products" as never)}
      >
        <Text style={styles.allProductsBtnText}>Explore All Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 4,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  badge: {
    fontSize: 10,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },

  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  viewAllText: {
    color: BRAND_COLOR,
    fontWeight: "700",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  cardWrapper: {
    width: "49%",
  },

  allProductsBtn: {
    width: "100%",
    height: 46,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  allProductsBtnText: {
    color: BRAND_COLOR,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});