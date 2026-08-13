import { View, Text, ScrollView, StyleSheet } from "react-native";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export function RelatedProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Title - Clean & Unbolded */}
      <Text style={styles.title}>Related Products</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
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
    marginVertical: 18,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrapper: {
    width: 156,
  },
});