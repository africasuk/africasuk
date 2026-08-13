import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "../currency/Price";

interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export function ProductCard({ product }: Props) {
  const color =
    product.colors?.find((c) => c.id === product.selectedColorId) ??
    product.colors?.[0];

  const imageUrl =
    color?.images?.[0]?.imageUrl ??
    "https://via.placeholder.com/300";

  const basePrice =
    color?.variants?.[0]?.price ??
    product.colors?.flatMap((c) => c.variants ?? [])[0]?.price ??
    0;

  // Real product rating from backend
  const averageRating = product.rating?.averageRating ?? 0;
  const reviewCount = product.rating?.reviewCount ?? 0;

  return (
    <Link
      href={{
        pathname: "/products/[slug]",
        params: {
          slug: product.slug,
          ...(color?.id ? { color: color.id } : {}),
        },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <View style={styles.swatchPill}>
              {product.colors.slice(0, 4).map((c) => (
                <View
                  key={c.id}
                  style={[
                    styles.swatchDot,
                    {
                      backgroundColor:
                        c.hexCode ?? c.name.toLowerCase(),
                    },
                    c.id === color?.id && styles.activeSwatchDot,
                  ]}
                />
              ))}

              {product.colors.length > 4 && (
                <Text style={styles.moreColorsText}>
                  +{product.colors.length - 4}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerGroup}>
            {product.brand?.name ? (
              <Text style={styles.brandText} numberOfLines={1}>
                {product.brand.name}
              </Text>
            ) : null}

            <Text style={styles.titleText} numberOfLines={1}>
              {product.name}
            </Text>

            {/* ⭐ Real Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.star,
                      index < Math.round(averageRating)
                        ? styles.filledStar
                        : styles.emptyStar,
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>

              {reviewCount > 0 ? (
                <Text style={styles.ratingText}>
                  {averageRating.toFixed(1)} ({reviewCount})
                </Text>
              ) : (
                <Text style={styles.noReviewsText}>
                  No reviews
                </Text>
              )}
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Price
              price={Number(basePrice)}
              style={styles.priceText}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  imageContainer: {
    position: "relative",
    height: 160,
    width: "100%",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  swatchPill: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  swatchDot: {
    width: 8,
    height: 8,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },

  activeSwatchDot: {
    borderWidth: 1.5,
    borderColor: "#002b15",
  },

  moreColorsText: {
    fontSize: 8,
    fontWeight: "400",
    color: "#6b7280",
    marginLeft: 1,
  },

  content: {
    paddingTop: 8,
    paddingHorizontal: 2,
    gap: 4,
  },

  headerGroup: {
    gap: 2,
  },

  brandText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  titleText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },

  // ⭐ Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 3,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontSize: 12,
    lineHeight: 14,
  },

  filledStar: {
    color: "#fbbf24",
  },

  emptyStar: {
    color: "#e5e7eb",
  },

  ratingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
  },

  noReviewsText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9ca3af",
  },

  priceRow: {
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },

  priceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#002b15",
    letterSpacing: 0.2,
  },
});