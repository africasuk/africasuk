// mobile/components/home/Categories.tsx

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
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
            Explore products across a wide range of categories, all in one
            place.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/categories" as never)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Category Grid */}
      <View style={styles.grid}>
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.cardContainer}
            activeOpacity={0.85}
            onPress={() =>
              router.push(`/categories/${category.slug}` as never)
            }
            accessibilityRole="button"
            accessibilityLabel={`Browse ${category.name}`}
          >
            {/* Image */}
            <View style={styles.imageBox}>
              {category.imageUrl ? (
                <Image
                  source={{ uri: category.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                  accessibilityLabel={`${category.name} products`}
                />
              ) : (
                <View
                  style={styles.placeholder}
                  accessibilityElementsHidden
                />
              )}
            </View>

            {/* Details */}
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
      <Pressable
        style={({ pressed }) => [
          styles.allCategoriesBtn,
          pressed && styles.allCategoriesBtnPressed,
        ]}
        onPress={() => router.push("/(tabs)/categories" as never)}
        accessibilityRole="button"
        accessibilityLabel="Explore all categories"
      >
        <Text style={styles.allCategoriesBtnText}>
          Explore All Categories
        </Text>

        <ArrowRight
          size={14}
          color="#18181b"
          strokeWidth={2}
        />
      </Pressable>
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
    fontWeight: "500",
    color: "#111827",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 17,
  },

  viewAll: {
    color: "#002b15",
    fontSize: 13,
    fontWeight: "500",
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
    borderRadius: 0,
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
    fontWeight: "500",
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
    height: 44,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },

  allCategoriesBtnPressed: {
    backgroundColor: "#e4e4e7",
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  allCategoriesBtnText: {
    color: "#18181b",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});