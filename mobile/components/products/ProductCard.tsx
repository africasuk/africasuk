import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "../currency/Price";

interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export const ProductCard = memo(function ProductCard({ product }: Props) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear loading state when returning to this screen
  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!product) return null;

  const color =
    product.colors?.find((c) => c.id === product.selectedColorId) ??
    product.colors?.[0];

  const imageUrl =
    color?.images?.[0]?.imageUrl ?? "https://via.placeholder.com/300";

  const basePrice =
    color?.variants?.[0]?.price ??
    product.colors?.flatMap((c) => c.variants ?? [])[0]?.price ??
    0;

  const averageRating = product.rating?.averageRating ?? 0;
  const reviewCount = product.rating?.reviewCount ?? 0;

  const handlePress = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    router.push({
      pathname: "/products/[slug]",
      params: {
        slug: product.slug,
        ...(color?.id ? { color: color.id } : {}),
      },
    });

    // Safety fallback: reset after 1.5s in case navigation is interrupted
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 1500);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={isNavigating}
    >
      {/* 1:1 Media Frame */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* Loading Overlay */}
        {isNavigating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#18181b" />
          </View>
        )}

        {/* Swatches */}
        {product.colors && product.colors.length > 1 && !isNavigating && (
          <View style={styles.swatchPill}>
            {product.colors.slice(0, 4).map((c) => (
              <View
                key={c.id}
                style={[
                  styles.swatchDot,
                  {
                    backgroundColor:
                      c.hexCode ?? c.name?.toLowerCase() ?? "#000",
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

          {/* Rating */}
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
              <Text style={styles.noReviewsText}>No reviews</Text>
            )}
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Price price={Number(basePrice)} style={styles.priceText} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  swatchPill: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },

  swatchDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },

  activeSwatchDot: {
    borderWidth: 1.5,
    borderColor: "#18181b",
  },

  moreColorsText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#71717a",
    marginLeft: 1,
  },

  content: {
    paddingTop: 8,
    paddingHorizontal: 2,
    gap: 3,
  },

  headerGroup: {
    gap: 2,
  },

  brandText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  titleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 1,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontSize: 11,
    lineHeight: 12,
  },

  filledStar: {
    color: "#f59e0b",
  },

  emptyStar: {
    color: "#e4e4e7",
  },

  ratingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#71717a",
  },

  noReviewsText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#a1a1aa",
  },

  priceRow: {
    paddingTop: 2,
  },

  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },
});