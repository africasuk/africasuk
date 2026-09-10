import { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export function RelatedProducts({ products }: Props) {
  const validProducts = useMemo(() => {
    return (products ?? []).filter(
      (p) => p && p.isActive && (p.colors?.length ?? 0) > 0
    );
  }, [products]);

  if (!validProducts || validProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Product Count Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>You May Also Like</Text>
        <Text style={styles.countText}>{validProducts.length} Items</Text>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {validProducts.map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProductCard product={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  countText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },

  cardWrapper: {
    width: 154,
  },
});