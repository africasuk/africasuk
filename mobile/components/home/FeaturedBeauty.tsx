
import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ProductWithDetails } from "@africasuk/types";
import { HomeProductCard } from "@/components/products/HomeProductCard";

interface Props {
  products: ProductWithDetails[];
}

type BeautyProduct = ProductWithDetails & {
  selectedColorId?: string;
};

const MAX_PRODUCTS = 10;
const BRAND_COLOR = "#005c2e";

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function isBeautyCategory(
  product: ProductWithDetails
): boolean {
  const rawCategory = (product as any).category;

  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;

  const name = category?.name?.toLowerCase().trim() ?? "";
  const slug = category?.slug?.toLowerCase().trim() ?? "";

  return (
    slug === "beauty-and-skin-care" ||
    name === "beauty and skin care"
  );
}

const FeaturedBeautyComponent = ({
  products = [],
}: Props) => {
  const insets = useSafeAreaInsets();

  const beautyProducts = useMemo<BeautyProduct[]>(() => {
    const cards = products
      .filter(
        (product) =>
          product.isActive !== false &&
          isBeautyCategory(product)
      )
      .flatMap(
        (product): BeautyProduct[] =>
          (product.colors ?? []).flatMap((color) => {
            const hasActiveVariant = (
              color.variants ?? []
            ).some(
              (variant) => variant.isActive !== false
            );

            if (!hasActiveVariant) return [];

            return [
              {
                ...product,
                selectedColorId: color.id,
              },
            ];
          })
      );

    return shuffleArray(cards).slice(0, MAX_PRODUCTS);
  }, [products]);

  if (!beautyProducts.length) return null;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: 90 + insets.bottom,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.badge}>
            BEAUTY COLLECTION
          </Text>

          <Text style={styles.title}>
            Beauty & Skin Care
          </Text>

          <Text style={styles.subtitle}>
            Discover your everyday beauty essentials
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() =>
            router.push(
              "/categories/beauty-and-skin-care" as never
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <View style={styles.grid}>
        {beautyProducts.map((product, index) => {
          const isFeatured = index === 4 || index === 5;

          return (
            <View
              key={`${product.id}-${product.selectedColorId}`}
              style={[
                styles.cardWrapper,
                isFeatured
                  ? styles.featuredCard
                  : styles.smallCard,
              ]}
            >
              <HomeProductCard product={product} />
            </View>
          );
        })}
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() =>
          router.push(
            "/categories/beauty-and-skin-care" as never
          )
        }
        activeOpacity={0.8}
      >
        <Text style={styles.bottomButtonText}>
          Explore All Beauty Products
        </Text>

        <Text style={styles.bottomArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(FeaturedBeautyComponent);

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
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

  viewAll: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLOR,
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
