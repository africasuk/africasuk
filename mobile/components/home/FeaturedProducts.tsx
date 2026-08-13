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
      {/* Header Section */}
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

      {/* Product Grid */}
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

      {/* Full-width "All Products" Button at the Bottom */}
      <TouchableOpacity
        style={styles.allProductsBtn}
        activeOpacity={0.85}
        onPress={() => router.push("/products" as never)}
      >
        <Text style={styles.allProductsBtnText}>All Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },

  viewAllBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },

  viewAllText: {
    color: "#111827",
    fontWeight: "500", // Non-bold clean button weight
    fontSize: 12,
    letterSpacing: 0.2,
  },

  listContent: {
    gap: 12, // Vertical gap between rows
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%", // Prevents items from stretching/squeezing unevenly
  },

  allProductsBtn: {
    width: "100%",
    height: 46,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 0, // Sharp corners
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  allProductsBtnText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "500", // Unbolded clean weight
    letterSpacing: 0.3,
  },
});