
import React, {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "../currency/Price";
import { ProductImage } from "./ProductImage";

interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export const HomeProductCard = memo(function HomeProductCard({
  product,
}: Props) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const [isNavigating, setIsNavigating] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const isVeryCompact = screenWidth < 350;
  const isCompact = screenWidth < 390;

  const typography = {
    brand: isVeryCompact ? 8 : isCompact ? 9 : 10,
    title: isVeryCompact ? 10 : isCompact ? 11 : 13,
    titleLine: isVeryCompact ? 13 : isCompact ? 15 : 18,
    rating: isVeryCompact ? 8 : isCompact ? 9 : 10,
    price: isVeryCompact ? 8 : isCompact ? 9 : 12,
    contentPadding: isVeryCompact ? 5 : isCompact ? 6 : 10,
  };

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!product) return null;

  const color =
    product.colors?.find(
      (item) => item.id === product.selectedColorId
    ) ?? product.colors?.[0];

  const imageUrl =
    color?.images?.[0]?.imageUrl ??
    "https://via.placeholder.com/300";

  const basePrice =
    color?.variants?.[0]?.price ??
    product.colors?.flatMap((item) => item.variants ?? [])[0]
      ?.price ??
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

    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 1500);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={handlePress}
      disabled={isNavigating}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <ProductImage
          uri={imageUrl}
          style={styles.image}
          contentFit="cover"
        />

        {isNavigating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#166534" />
          </View>
        )}
      </View>

      {/* Product Details */}
      <View
        style={[
          styles.content,
          { paddingHorizontal: typography.contentPadding },
        ]}
      >
        {product.brand?.name ? (
          <Text
            style={[
              styles.brandText,
              { fontSize: typography.brand },
            ]}
            numberOfLines={1}
          >
            {product.brand.name}
          </Text>
        ) : null}

        <Text
          style={[
            styles.titleText,
            {
              fontSize: typography.title,
              lineHeight: typography.titleLine,
            },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>

          {reviewCount > 0 ? (
            <Text
              style={[
                styles.ratingText,
                { fontSize: typography.rating },
              ]}
              numberOfLines={1}
            >
              {averageRating.toFixed(1)} ({reviewCount})
            </Text>
          ) : (
            <Text
              style={[
                styles.noReviewsText,
                { fontSize: typography.rating },
              ]}
              numberOfLines={1}
            >
              No reviews
            </Text>
          )}
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Price
            price={Number(basePrice)}
            style={[
              styles.priceText,
              { fontSize: typography.price },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "#F6F6F4",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  content: {
    paddingTop: 7,
    paddingBottom: 9,
    gap: 4,
    width: "100%",
  },

  brandText: {
    fontWeight: "700",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  titleText: {
    fontWeight: "600",
    color: "#18181B",
    minHeight: 30,
    flexShrink: 1,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    minWidth: 0,
  },

  star: {
    fontSize: 11,
    color: "#F59E0B",
  },

  ratingText: {
    fontWeight: "600",
    color: "#71717A",
    flexShrink: 1,
  },

  noReviewsText: {
    color: "#A1A1AA",
    flexShrink: 1,
  },

  priceRow: {
    width: "100%",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    minWidth: 0,
  },

  priceText: {
    fontWeight: "800",
    color: "#14532D",
    includeFontPadding: false,
    flexShrink: 1,
  },
});
