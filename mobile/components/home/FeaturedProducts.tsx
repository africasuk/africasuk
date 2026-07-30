import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "../products/ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export default function FeaturedProducts({ products = [] }: Props) {
  const featured = products.filter(
    (product) => product.isActive && product.colors?.length > 0
  );

  if (featured.length === 0) {
    return null;
  }

  // Flatten and filter out colors without valid variants
  const featuredColorProducts = featured
    .flatMap((product) =>
      product.colors
        .filter((color) => color.variants && color.variants.length > 0)
        .map((color) => ({
          ...product,
          id: `${product.id}-${color.id}`,
          name: `${product.name} - ${color.name}`,
          selectedColorId: color.id,
          colors: [color],
        }))
    )
    .slice(0, 12);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <View style={styles.textGroup}>
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

      <FlatList
        data={featuredColorProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
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
  sectionContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 18,
  },

  viewAllBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },

  viewAllText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 12,
  },

  listContent: {
    gap: 16, // Vertical gap between rows
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%", // Prevents items from stretching/squeezing unevenly
  },
});