
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";

import { HomeProductCard } from "../products/HomeProductCard";
import { supabase } from "@/lib/supabase/client";

interface Props {
  products: ProductWithDetails[];
}

const BRAND_COLOR = "#005c2e";
const MAX_PRODUCTS = 10;

type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

type PerfumeProduct = ProductWithDetails & {
  rating?: ProductRating;
  selectedColorId?: string;
};

function isFragranceCategory(product: ProductWithDetails) {
  const rawCategory = (product as any).category;

  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;

  const name = category?.name?.toLowerCase()?.trim() ?? "";
  const slug = category?.slug?.toLowerCase()?.trim() ?? "";

  return name === "fragrance" || slug === "fragrance";
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function FeaturedPerfumesComponent({
  products = [],
}: Props) {
  const [ratings, setRatings] = useState<
    Record<string, ProductRating>
  >({});

  // Filter fragrance products.
  const fragranceProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.isActive && isFragranceCategory(product)
    );
  }, [products]);

  // Load approved fragrance reviews.
  useEffect(() => {
    let cancelled = false;

    async function loadRatings() {
      const productIds = [
        ...new Set(
          fragranceProducts.map((product) => product.id)
        ),
      ];

      if (productIds.length === 0) {
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
          const productId = review.product_id;

          if (!ratingMap[productId]) {
            ratingMap[productId] = {
              averageRating: 0,
              reviewCount: 0,
            };
          }

          ratingMap[productId].averageRating += Number(
            review.rating
          );

          ratingMap[productId].reviewCount += 1;
        }

        Object.values(ratingMap).forEach((rating) => {
          rating.averageRating = Number(
            (
              rating.averageRating / rating.reviewCount
            ).toFixed(1)
          );
        });

        if (!cancelled) {
          setRatings(ratingMap);
        }
      } catch (error) {
        console.error(
          "Failed to load fragrance ratings:",
          error
        );
      }
    }

    loadRatings();

    return () => {
      cancelled = true;
    };
  }, [fragranceProducts]);

  // Create one product card per available color.
  const featuredPerfumes = useMemo(() => {
    const colorProducts: PerfumeProduct[] = [];

    for (const product of fragranceProducts) {
      const availableColors = (product.colors ?? []).filter(
        (color) =>
          (color.variants ?? []).some(
            (variant) => variant.isActive
          )
      );

      for (const color of availableColors) {
        colorProducts.push({
          ...product,
          selectedColorId: color.id,
          rating: ratings[product.id] ?? {
            averageRating: 0,
            reviewCount: 0,
          },
        });
      }
    }

    return shuffleArray(colorProducts).slice(
      0,
      MAX_PRODUCTS
    );
  }, [fragranceProducts, ratings]);

  if (featuredPerfumes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>
            THE FRAGRANCE EDIT
          </Text>

          <Text style={styles.title}>
            Discover Fragrances
          </Text>

          <Text style={styles.subtitle}>
            Find your signature scent.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push("/categories/fragrance" as never)
          }
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mosaic Product Grid */}
      <View style={styles.grid}>
        {featuredPerfumes.map((item, index) => {
          // Positions 5 and 6 are larger.
          const isFeatured = index === 4 || index === 5;

          return (
            <View
              key={`${item.id}-${item.selectedColorId}`}
              style={[
                styles.cardWrapper,
                isFeatured
                  ? styles.featuredCard
                  : styles.smallCard,
              ]}
            >
              <HomeProductCard product={item} />
            </View>
          );
        })}
      </View>

      {/* Explore All */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() =>
          router.push("/categories/fragrance" as never)
        }
        activeOpacity={0.8}
      >
        <Text style={styles.bottomButtonText}>
          Explore All Fragrances
        </Text>

        <Text style={styles.bottomArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(FeaturedPerfumesComponent);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: BRAND_COLOR,
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 4,
    color: "#777777",
    fontSize: 12,
    lineHeight: 17,
  },

  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  viewAllText: {
    color: BRAND_COLOR,
    fontWeight: "700",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    rowGap: 12,
  },

  cardWrapper: {
    marginBottom: 2,
  },

  smallCard: {
    width: "23.5%",
  },

  featuredCard: {
    width: "48.5%",
  },

  bottomButton: {
    marginTop: 20,
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#DCE8DF",
    borderRadius: 12,
    backgroundColor: "#F8FBF8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  bottomButtonText: {
    color: BRAND_COLOR,
    fontSize: 13,
    fontWeight: "700",
  },

  bottomArrow: {
    color: BRAND_COLOR,
    fontSize: 17,
    fontWeight: "700",
  },
});
