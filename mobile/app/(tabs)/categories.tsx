
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, RefreshCw } from "lucide-react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { createClient } from "@/lib/auth/client";
import LoadingScreen from "@/components/shared/LoadingScreen";
import HomeHeader from "@/components/home/HomeHeader";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

type Category = CategoryRow & {
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const BRAND = "#005c2e";
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;

export default function CategoriesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cardWidth =
    (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
  const wideCardWidth = width - HORIZONTAL_PADDING * 2;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const loadCategories = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(false);

      const supabase = createClient();

      const { data, error: queryError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (queryError) throw queryError;

      const formatted: Category[] = ((data ?? []) as CategoryRow[]).map(
        (category) => ({
          ...category,
          imageUrl: category.image_url,
          isActive: category.is_active,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
        }),
      );

      setCategories(formatted);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCategory = (category: Category) => {
    router.push(`/categories/${category.slug}` as never);
  };

  const renderCategoryCard = (
    category: Category,
    isWide: boolean,
  ) => (
    <Pressable
      key={category.id}
      onPress={() => openCategory(category)}
      style={({ pressed }) => [
        styles.card,
        { width: isWide ? wideCardWidth : cardWidth },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Every image is square, including the wide card */}
      <View style={styles.imageWrapper}>
        {category.imageUrl ? (
          <Image
            source={{ uri: category.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              {category.name}
            </Text>
          </View>
        )}

        <View style={styles.imageShade} />

        <View style={styles.imageLabel}>
          <Text style={styles.collectionLabel}>COLLECTION</Text>
          <Text numberOfLines={2} style={styles.imageTitle}>
            {category.name}
          </Text>
        </View>

        <View style={styles.arrowButton}>
          <ArrowRight size={17} color={BRAND} strokeWidth={2.4} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.cardDescription}>
          {category.description ||
            `Explore our ${category.name.toLowerCase()} collection.`}
        </Text>
        <View style={styles.bottomAccent} />
      </View>
    </Pressable>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <RefreshCw size={26} color={BRAND} />
        </View>

        <Text style={styles.stateTitle}>
          Couldn&apos;t load categories
        </Text>
        <Text style={styles.stateDescription}>
          Check your connection and try again.
        </Text>

        <Pressable
          onPress={() => loadCategories()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  // Two small cards, followed by one wide card.
  // Repeat this pattern for all categories.
  const rows: Category[][] = [];

  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      <HomeHeader scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCategories(true)}
            tintColor={BRAND}
            colors={[BRAND]}
          />
        }
      >
        <View style={styles.headingContainer}>
          <Text style={styles.eyebrow}>EXPLORE AFRICASUK</Text>
          <Text style={styles.heading}>Shop by Category</Text>
          <Text style={styles.subtitle}>
            Find what you need, all in one place.
          </Text>
        </View>

        {rows.map((row, rowIndex) => (
          <View key={`category-row-${rowIndex}`}>
            <View style={styles.row}>
              {row.slice(0, 2).map((category) =>
                renderCategoryCard(category, false),
              )}
            </View>

            {row[2] &&
              renderCategoryCard(row[2], true)}
          </View>
        ))}

        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.stateTitle}>No categories yet</Text>
            <Text style={styles.stateDescription}>
              Categories will appear here when available.
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF8",
    paddingTop: 100,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 18,
    paddingBottom: 36,
  },
  headingContainer: {
    marginBottom: 24,
  },
  eyebrow: {
    color: BRAND,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heading: {
    color: "#17251B",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#717A73",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8EEE9",
    marginBottom: CARD_GAP,
    shadowColor: "#123C24",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EDF1ED",
    overflow: "hidden",
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#E8F0E9",
  },
  placeholderText: {
    color: BRAND,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  imageLabel: {
    position: "absolute",
    left: 13,
    right: 42,
    bottom: 14,
  },
  collectionLabel: {
    color: "#E4F6E9",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  imageTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 1 },
  },
  arrowButton: {
    position: "absolute",
    right: 10,
    bottom: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 12,
    minHeight: 58,
  },
  cardDescription: {
    color: "#737B75",
    fontSize: 11,
    lineHeight: 16,
  },
  bottomAccent: {
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D6EADD",
    marginTop: 9,
  },
  stateContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  stateIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EDF7F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17251B",
    textAlign: "center",
  },
  stateDescription: {
    color: "#717A73",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: BRAND,
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 12,
    marginTop: 20,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
  },
});
