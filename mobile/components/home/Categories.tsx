
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import type { Category } from "@africasuk/types";

interface Props {
  categories: (Category & { description?: string })[];
}

const BRAND_GREEN = "#005c2e";

export default function Categories({ categories = [] }: Props) {
  const handleCategoryPress = (slug: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => {},
      );
    }

    router.push(`/categories/${slug}` as never);
  };

  const handleViewAllPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => {},
      );
    }

    router.push("/(tabs)/categories" as never);
  };

  if (!categories?.length) return null;

  // Alternate categories between the two horizontal rows.
  const firstRow = categories.filter((_, index) => index % 2 === 0);
  const secondRow = categories.filter((_, index) => index % 2 !== 0);

  const renderCategory = (category: (typeof categories)[number]) => (
    <Pressable
      key={category.id}
      style={({ pressed }) => [
        styles.categoryItem,
        pressed && styles.pressed,
      ]}
      onPress={() => handleCategoryPress(category.slug)}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.name}`}
    >
      <View style={styles.imageContainer}>
        {category.imageUrl ? (
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderLetter}>
              {category.name?.charAt(0)?.toUpperCase() ?? "A"}
            </Text>
          </View>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={styles.categoryName}
      >
        {category.name}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>

        <Pressable
          onPress={handleViewAllPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.viewAllButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight
            size={13}
            color={BRAND_GREEN}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        directionalLockEnabled
        contentContainerStyle={styles.rowContent}
      >
        {firstRow.map(renderCategory)}
      </ScrollView>

      {secondRow.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          directionalLockEnabled
          contentContainerStyle={styles.rowContent}
          style={styles.secondRow}
        >
          {secondRow.map(renderCategory)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    paddingVertical: 3,
    paddingLeft: 5,
  },
  viewAllText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "500",
  },
  rowContent: {
    paddingHorizontal: 16,
    gap: 15,
  },
  secondRow: {
    marginTop: 14,
  },
  categoryItem: {
    width: 61,
    alignItems: "center",
  },
  imageContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    backgroundColor: "#F4F4F1",
    borderWidth: 1,
    borderColor: "#F0F0EB",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F1",
  },
  placeholderLetter: {
    fontSize: 19,
    fontWeight: "600",
    color: BRAND_GREEN,
  },
  categoryName: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
    width: "100%",
  },
  pressed: {
    opacity: 0.65,
  },
});
