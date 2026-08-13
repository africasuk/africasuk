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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>SHOP BY CATEGORY</Text>
          <Text style={styles.subtitle}>
            Discover verified premium brands across our curated departments.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/categories" as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.cardContainer}
            activeOpacity={0.85}
            onPress={() =>
              router.push(`/categories/${category.slug}` as never)
            }
          >
            {/* Image Box - No rounded borders */}
            <View style={styles.imageBox}>
              {category.imageUrl ? (
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>

            {/* Name under every card - Non-bold */}
            <View style={styles.details}>
              <Text numberOfLines={1} style={styles.name}>
                {category.name}
              </Text>
              {category.description && (
                <Text numberOfLines={1} style={styles.description}>
                  {category.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* All Categories Button */}
      <TouchableOpacity
        style={styles.allCategoriesBtn}
        activeOpacity={0.85}
        onPress={() => router.push("/(tabs)/categories" as never)}
      >
        <Text style={styles.allCategoriesBtnText}>All Categories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean weight
    color: "#111827",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400", // Regular
  },

  viewAll: {
    color: "#002b15",
    fontSize: 13,
    fontWeight: "500", // Clean regular
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardContainer: {
    width: "48%",
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },

  imageBox: {
    width: "100%",
    height: 170,
    backgroundColor: "#f3f4f6",
    borderRadius: 0, // Explicitly no rounded borders
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },

  details: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },

  name: {
    color: "#111827",
    fontWeight: "500", // Regular/medium weight (not bold)
    fontSize: 14,
  },

  description: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
  },

  allCategoriesBtn: {
    width: "100%",
    height: 46,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 0, // No rounded corners
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  allCategoriesBtnText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "500", // Unbolded, clean
    letterSpacing: 0.3,
  },
});