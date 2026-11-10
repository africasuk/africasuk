
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "../products/ProductCard";
import SouthSudanCtaButton from "../home/SouthSudanCtaButton";
import { supabase } from "@/lib/supabase/client";

interface Props {
  products: ProductWithDetails[];
}

const BRAND_COLOR = "#005c2e";
const MAX_FEATURED_PRODUCTS = 12;

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

  // Load approved product ratings.
  useEffect(() => {
    let cancelled = false;

    async function loadRatings() {
      const productIds = [
        ...new Set(products.map((product) => product.id)),
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
        console.error("Failed to load product ratings:", error);
      }
    }

    loadRatings();

    return () => {
      cancelled = true;
    };
  }, [products]);

  // Only active products with colors.
  const featured = useMemo(() => {
    return products.filter(
      (product) =>
        product.isActive &&
        (product.colors?.length ?? 0) > 0
    );
  }, [products]);

  // Create one card for each product color.
  const featuredColorProducts = useMemo<ColorProduct[]>(() => {
    const colorProducts: ColorProduct[] = [];

    for (const product of featured) {
      const availableColors = (product.colors ?? []).filter(
        (color) =>
          (color.variants ?? []).some(
            (variant) => variant.isActive
          )
      );

      for (const color of availableColors) {
        const rating = ratings[product.id] ?? {
          averageRating: 0,
          reviewCount: 0,
        };

        colorProducts.push({
          ...product,
          id: `${product.id}-${color.id}`,
          name: `${product.name} ${color.name}`,
          selectedColorId: color.id,
          colors: [color],
          rating,
        });
      }
    }

    // Randomize product-color cards.
    for (let i = colorProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [colorProducts[i], colorProducts[j]] = [
        colorProducts[j],
        colorProducts[i],
      ];
    }

    return colorProducts.slice(0, MAX_FEATURED_PRODUCTS);
  }, [featured, ratings]);

  if (featuredColorProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>Curated Drops</Text>

          <Text style={styles.title}>
            Featured Products
          </Text>

          <Text style={styles.subtitle}>
            Explore products available from Africa Suk.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/products" as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Three Products Per Row */}
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

      {/* South Sudan CTA */}
      <View style={styles.bottomCtaWrapper}>
        <SouthSudanCtaButton />
      </View>
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
    rowGap: 12,
  },

  cardWrapper: {
    width: "32%",
  },

  bottomCtaWrapper: {
    marginTop: 14,
    marginHorizontal: -4,
  },
});
