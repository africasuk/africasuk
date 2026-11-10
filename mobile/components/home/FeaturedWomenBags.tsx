
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { HomeProductCard } from "@/components/products/HomeProductCard";
import { supabase } from "@/lib/supabase/client";

interface Props {
  products: ProductWithDetails[];
}

const BRAND_COLOR = "#005c2e";
const MAX_PRODUCTS = 6;

// Visual order: 1, 3, 2, 4, 5, 7, 6, 8, 9
const DISPLAY_ORDER = [0, 2, 1, 3, 4, 6, 5, 7, 8];

type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

type BagProduct = ProductWithDetails & {
  rating?: ProductRating;
  selectedColorId?: string;
};

function isWomenLuxuryBag(product: ProductWithDetails): boolean {
  const rawCategory = (product as any).category;
  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;

  const name = category?.name?.toLowerCase().trim() ?? "";
  const slug = category?.slug?.toLowerCase().trim() ?? "";

  return (
    name === "women's luxury bags" ||
    name === "womens luxury bags" ||
    slug === "womens-luxury-bags"
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function FeaturedWomenBagsComponent({
  products = [],
}: Props) {
  const [ratings, setRatings] = useState<
    Record<string, ProductRating>
  >({});

  const bagProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.isActive !== false &&
          isWomenLuxuryBag(product)
      ),
    [products]
  );

  // Load approved customer ratings.
  useEffect(() => {
    let cancelled = false;

    async function loadRatings() {
      const productIds = [
        ...new Set(bagProducts.map((product) => product.id)),
      ];

      if (!productIds.length) {
        setRatings({});
        return;
      }

      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("product_id, rating")
          .in("product_id", productIds)
          .eq("status", "APPROVED");

        if (error) throw error;

        const ratingMap: Record<string, ProductRating> = {};

        for (const review of data ?? []) {
          const id = review.product_id;

          if (!ratingMap[id]) {
            ratingMap[id] = {
              averageRating: 0,
              reviewCount: 0,
            };
          }

          ratingMap[id].averageRating += Number(review.rating);
          ratingMap[id].reviewCount += 1;
        }

        for (const rating of Object.values(ratingMap)) {
          rating.averageRating = Number(
            (
              rating.averageRating / rating.reviewCount
            ).toFixed(1)
          );
        }

        if (!cancelled) {
          setRatings(ratingMap);
        }
      } catch (error) {
        console.error("Failed to load bag ratings:", error);
      }
    }

    loadRatings();

    return () => {
      cancelled = true;
    };
  }, [bagProducts]);

  // Create one card for each available product color.
  const featuredBags = useMemo<BagProduct[]>(() => {
    const colorProducts: BagProduct[] = [];

    for (const product of bagProducts) {
      const availableColors = (product.colors ?? []).filter(
        (color) =>
          (color.variants ?? []).some(
            (variant) => variant.isActive !== false
          )
      );

      for (const color of availableColors) {
        colorProducts.push({
          ...product,
          selectedColorId: color.id,
          colors: [color],
          rating: ratings[product.id] ?? {
            averageRating: 0,
            reviewCount: 0,
          },
        });
      }
    }

    return shuffleArray(colorProducts).slice(0, MAX_PRODUCTS);
  }, [bagProducts, ratings]);

  // Apply the requested visual order: 1, 3, 2, 4.
  const displayedBags = useMemo(() => {
    return DISPLAY_ORDER
      .map((index) => featuredBags[index])
      .filter((item): item is BagProduct => Boolean(item));
  }, [featuredBags]);

  if (!displayedBags.length) return null;

  return (
    <View style={styles.container}>
      {/* Collection heading */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.eyebrow}>THE STYLE EDIT</Text>

          
        </View>

        <Text style={styles.title}>
          Find Your Perfect Bag.
        </Text>

        <Text style={styles.subtitle}>
          Elegant pieces that bring style and confidence to every occasion.
        </Text>

       
      </View>

      {/* Product collection */}
      <View style={styles.grid}>
        {displayedBags.map((item, index) => (
          <View
            key={`${item.id}-${item.selectedColorId}`}
            style={[
              styles.cardWrapper,
              index % 4 === 0 && styles.cardWithTopSpace,
            ]}
          >
            <HomeProductCard product={item} />
          </View>
        ))}
      </View>

      {/* Bottom collection link */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() =>
          router.push("/categories/womens-luxury-bags" as never)
        }
        activeOpacity={0.8}
      >
        <Text style={styles.bottomButtonText}>
          VIEW ALL WOMEN&apos;S BAGS
        </Text>
        <Text style={styles.bottomArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(FeaturedWomenBagsComponent);

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 14,
    backgroundColor: "#F8F7F3",
  },

  header: {
    marginBottom: 24,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  eyebrow: {
    color: BRAND_COLOR,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  collectionBadge: {
    backgroundColor: "#E9EFE9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  collectionBadgeText: {
    color: BRAND_COLOR,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  title: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
    color: "#20251F",
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 7,
    maxWidth: 300,
    fontSize: 12,
    lineHeight: 19,
    color: "#77766F",
  },

  headerButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: BRAND_COLOR,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  headerArrow: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    rowGap: 18,
  },

  cardWrapper: {
    width: "48.5%",
  },

  cardWithTopSpace: {
    marginTop: 4,
  },

  bottomButton: {
    marginTop: 26,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#D5DFD5",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  bottomButtonText: {
    color: BRAND_COLOR,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bottomArrow: {
    color: BRAND_COLOR,
    fontSize: 17,
    fontWeight: "700",
  },
});
