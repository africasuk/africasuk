import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import type { ProductWithDetails } from "@africasuk/types";

import ProductCard from "@/components/products/ProductCard";

interface Props {
  products?: ProductWithDetails[];
}

export default function FeaturedProducts({ products = [] }: Props) {
  const featured = products.filter(
    (product) => product.isActive && product.colors?.length
  );

  const featuredProducts = featured
    .flatMap((product) =>
      product.colors
        .filter((color) => color.variants?.length)
        .map((color) => ({
          ...product,
          id: `${product.id}-${color.id}`,
          name: `${product.name} - ${color.name}`,
          selectedColorId: color.id,
          colors: [color],
        }))
    )
    .slice(0, 12);

  if (!featuredProducts.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Products</Text>

        <Pressable onPress={() => router.push("/products" as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <FlatList
        data={featuredProducts}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  viewAll: {
    color: "#005c2e",
    fontWeight: "700",
  },
});