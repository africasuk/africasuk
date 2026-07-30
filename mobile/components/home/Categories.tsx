// mobile/components/home/Categories.tsx

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { Category } from "@africasuk/types";

interface Props {
  categories: (Category & { description?: string })[];
}

export default function Categories({ categories = [] }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SHOP BY CATEGORY</Text>
          <Text style={styles.subtitle}>
            Discover verified premium brands across our curated departments.
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/categories" as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/categories/${category.slug}` as never)
            }
          >
            {category.imageUrl ? (
              <Image
                source={{ uri: category.imageUrl }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholder} />
            )}

            <View style={styles.overlay}>
              <Text numberOfLines={1} style={styles.name}>
                {category.name}
              </Text>

              <Text numberOfLines={2} style={styles.description}>
                {category.description ??
                  `Explore ${category.name.toLowerCase()} collection.`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fafafa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
    maxWidth: 250,
  },

  viewAll: {
    color: "#005c2e",
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#eee",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#ddd",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  name: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  description: {
    color: "#f3f4f6",
    fontSize: 12,
    marginTop: 4,
  },
});