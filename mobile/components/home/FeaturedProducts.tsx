import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "../products/ProductCard";
import { supabase } from "@/lib/supabase/client";

interface Props {
  products: ProductWithDetails[];
}

const BRAND_COLOR = "#005c2e";

type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

type RatedProduct = ProductWithDetails & {
  rating?: ProductRating;
};

type ColorProduct = RatedProduct & {
  selectedColorId?: string;
};

export default function FeaturedProducts({
  products = [],
}: Props) {
  const [ratings, setRatings] = useState<
    Record<string, ProductRating>
  >({});

  /*
   * Load approved ratings for the products.
   */
  useEffect(() => {
    async function loadRatings() {
      if (products.length === 0) {
        setRatings({});
        return;
      }

      try {
        const productIds = products.map(
          (product) => product.id
        );

        const { data, error } = await supabase
          .from("reviews")
          .select("product_id, rating")
          .in("product_id", productIds)
          .eq("status", "APPROVED");

        if (error) {
          console.error(
            "Failed to load product ratings:",
            error
          );
          return;
        }

        const ratingMap: Record<
          string,
          ProductRating
        > = {};

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

        for (const productId of Object.keys(
          ratingMap
        )) {
          const rating = ratingMap[productId];

          rating.averageRating = Number(
            (
              rating.averageRating /
              rating.reviewCount
            ).toFixed(1)
          );
        }

        setRatings(ratingMap);
      } catch (error) {
        console.error(
          "Failed to load product ratings:",
          error
        );
      }
    }

    loadRatings();
  }, [products]);

  const featured = useMemo(() => {
    return products.filter(
      (product) =>
        product.isActive &&
        (product.colors?.length ?? 0) > 0
    );
  }, [products]);

  const featuredColorProducts = useMemo(() => {
    const groupedProducts = featured.map(
      (product) => {
        return (product.colors ?? [])
          .filter(
            (color) =>
              color.variants &&
              color.variants.length > 0
          )
          .map((color) => ({
            product,
            color,
          }));
      }
    );

    const result: ColorProduct[] = [];

    const maxColors = Math.max(
      0,
      ...groupedProducts.map(
        (group) => group.length
      )
    );

    /*
     * Same ordering:
     *
     * Product A - Color 1
     * Product B - Color 1
     * Product C - Color 1
     * Product A - Color 2
     * Product B - Color 2
     * Product C - Color 2
     */
    for (
      let index = 0;
      index < maxColors;
      index++
    ) {
      for (const group of groupedProducts) {
        const item = group[index];

        if (!item) continue;

        const productRating =
          ratings[item.product.id] ?? {
            averageRating: 0,
            reviewCount: 0,
          };

        result.push({
          ...item.product,

          id: `${item.product.id}-${item.color.id}`,

          name: `${item.product.name} - ${item.color.name}`,

          selectedColorId: item.color.id,

          colors: [item.color],

          rating: productRating,
        });
      }
    }

    return result.slice(0, 12);
  }, [featured, ratings]);

  if (featuredColorProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>
            Curated Drops
          </Text>

          <Text style={styles.title}>
            Featured Products
          </Text>

          <Text style={styles.subtitle}>
            Explore products available from Africa Suk.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() =>
            router.push("/products" as never)
          }
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products */}
      <View style={styles.grid}>
        {featuredColorProducts.map((item) => (
          <View
            key={item.id}
            style={styles.cardWrapper}
          >
            <ProductCard product={item} />
          </View>
        ))}
      </View>

      {/* Explore All */}
      <TouchableOpacity
        style={styles.allProductsBtn}
        activeOpacity={0.85}
        onPress={() =>
          router.push("/products" as never)
        }
      >
        <Text
          style={styles.allProductsBtnText}
        >
          Explore All Products
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 4,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  badge: {
    fontSize: 10,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },

  viewAllBtn: {
    paddingVertical: 4,
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
    rowGap: 8,
  },

  cardWrapper: {
    width: "49%",
  },

  allProductsBtn: {
    width: "100%",
    height: 46,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  allProductsBtnText: {
    color: BRAND_COLOR,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});