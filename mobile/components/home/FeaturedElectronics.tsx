
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

type ElectronicsProduct = ProductWithDetails & {
  rating?: ProductRating;
  selectedColorId?: string;
};

function isElectronicsCategory(product: ProductWithDetails) {
  const rawCategory = (product as any).category;

  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;

  const name = category?.name?.toLowerCase()?.trim() ?? "";
  const slug = category?.slug?.toLowerCase()?.trim() ?? "";

  return name === "electronics" || slug === "electronics";
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function FeaturedElectronicsComponent({
  products = [],
}: Props) {
  const [ratings, setRatings] = useState<
    Record<string, ProductRating>
  >({});

  // Filter active electronics products.
  const electronicsProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.isActive &&
          isElectronicsCategory(product)
      ),
    [products]
  );

  // Load approved customer ratings.
  useEffect(() => {
    let cancelled = false;

    async function loadRatings() {
      const productIds = [
        ...new Set(
          electronicsProducts.map((product) => product.id)
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
        console.error(
          "Failed to load electronics ratings:",
          error
        );
      }
    }

    loadRatings();

    return () => {
      cancelled = true;
    };
  }, [electronicsProducts]);

  // Create one card per available product color.
  const featuredElectronics = useMemo(() => {
    const colorProducts: ElectronicsProduct[] = [];

    for (const product of electronicsProducts) {
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
  }, [electronicsProducts, ratings]);

  if (featuredElectronics.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>
            TECHNOLOGY COLLECTION
          </Text>

          <Text style={styles.title}>
            Explore Electronics
          </Text>

          <Text style={styles.subtitle}>
            Discover the latest electronics and gadgets.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push("/categories/electronics" as never)
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
        {featuredElectronics.map((item, index) => {
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
          router.push("/categories/electronics" as never)
        }
        activeOpacity={0.8}
      >
        <Text style={styles.bottomButtonText}>
          Explore All Electronics
        </Text>

        <Text style={styles.bottomArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(FeaturedElectronicsComponent);

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
    width: "24%",
  },

  featuredCard: {
    width: "49%",
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
