import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ListRenderItem,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import type { ProductWithDetails } from "@africasuk/types";

import { WishlistButton } from "@/components/products/WishlistButton";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import type { CartItem } from "@/types/cart";
import { Price } from "../currency/Price";

type SearchProduct = ProductWithDetails & {
  selectedColorId?: string;
};

interface SearchProductListProps {
  products: SearchProduct[];
  contentContainerStyle?: ViewStyle;
}

export default function SearchProductList({
  products,
  contentContainerStyle,
}: SearchProductListProps) {
  const router = useRouter();

  /*
   * Flatten products by color while preserving
   * the order supplied by SearchScreen.
   */
  const items = useMemo(() => {
    return products.flatMap((product) =>
      (product.colors ?? []).map((color) => ({
        ...product,
        color,
        variant: color.variants?.[0],
        compositeId: `${product.id}-${color.id}`,
      }))
    );
  }, [products]);

  const handleNavigate = (slug: string, colorId: string) => {
    router.push(`/products/${slug}?color=${colorId}` as const);
  };

  const renderItem: ListRenderItem<(typeof items)[number]> = ({
    item,
  }) => {
    const image = item.color.images?.[0] as
      | {
          imageUrl?: string;
          image_url?: string;
        }
      | undefined;

    const imageUrl =
      image?.image_url ??
      image?.imageUrl ??
      "https://via.placeholder.com/300";

    const variant = item.variant;
    const stock = variant?.stock ?? 0;

    /*
     * Match the rating structure used by ProductCard.
     */
    const averageRating = Number(
      item.rating?.averageRating ?? 0
    );

    const reviewCount = Number(
      item.rating?.reviewCount ?? 0
    );

    const originalProductId = item.selectedColorId
      ? item.id.replace(`-${item.selectedColorId}`, "")
      : item.id;

    const cartItem: CartItem = {
      productId: originalProductId,
      variantId: variant?.id?.toString() ?? "",
      name: item.name,
      slug: item.slug,
      price: variant?.price ?? 0,
      stock,
      quantity: 1,
      allowCod: item.allowCod,
      allowOnlinePayment: item.allowOnlinePayment,
      image: imageUrl,
      options: [
        {
          optionName: "Color",
          value: item.color.name,
        },
        ...(variant
          ? [
              {
                optionName: variant.optionName ?? "",
                value: variant.optionValue ?? "",
              },
            ]
          : []),
      ],
    };

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          handleNavigate(
            item.slug,
            item.color.id.toString()
          )
        }
      >
        <View style={styles.topRow}>
          {/* Product image and wishlist */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="contain"
              transition={150}
            />

            <View style={styles.wishlistBadge}>
              <WishlistButton item={cartItem} />
            </View>
          </View>

          {/* Product details */}
          <View style={styles.details}>
            <View>
              <Text
                style={styles.title}
                numberOfLines={2}
              >
                {item.name}
              </Text>

              {/* Product rating */}
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
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
                    )
                  )}
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

              {/* Brand and category */}
              {(item.brand || item.category) && (
                <View style={styles.metaRow}>
                  {item.brand && (
                    <Text
                      style={styles.metaText}
                      numberOfLines={1}
                    >
                      {item.brand.name}
                    </Text>
                  )}

                  {item.brand && item.category && (
                    <Text style={styles.dot}>•</Text>
                  )}

                  {item.category && (
                    <Text
                      style={styles.metaText}
                      numberOfLines={1}
                    >
                      {item.category.name}
                    </Text>
                  )}
                </View>
              )}

              {/* Selected color */}
              <View style={styles.colorRow}>
                <View style={styles.colorDot} />

                <Text
                  style={styles.colorText}
                  numberOfLines={1}
                >
                  {item.color.name}
                </Text>
              </View>
            </View>

            {/* Price and stock */}
            <View style={styles.priceRow}>
              <Price
                price={Number(variant?.price ?? 0)}
                style={styles.price}
              />

              <Text
                style={[
                  styles.stockText,
                  stock <= 0 && styles.outOfStockText,
                ]}
              >
                {stock > 0
                  ? `${stock} in stock`
                  : "Out of stock"}
              </Text>
            </View>
          </View>
        </View>

        {/* Add to cart */}
        <View style={styles.actionsRow}>
          <AddToCartButton item={cartItem} />
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.compositeId}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.listContainer,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

type Styles = {
  listContainer: ViewStyle;
  card: ViewStyle;
  cardPressed: ViewStyle;
  topRow: ViewStyle;
  imageContainer: ViewStyle;
  image: ImageStyle;
  wishlistBadge: ViewStyle;
  details: ViewStyle;
  title: TextStyle;
  ratingRow: ViewStyle;
  stars: ViewStyle;
  star: TextStyle;
  filledStar: TextStyle;
  emptyStar: TextStyle;
  ratingText: TextStyle;
  noReviewsText: TextStyle;
  metaRow: ViewStyle;
  metaText: TextStyle;
  dot: TextStyle;
  colorRow: ViewStyle;
  colorDot: ViewStyle;
  colorText: TextStyle;
  priceRow: ViewStyle;
  price: TextStyle;
  stockText: TextStyle;
  outOfStockText: TextStyle;
  actionsRow: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 28,
    gap: 10,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },

  cardPressed: {
    backgroundColor: "#fafafa",
  },

  topRow: {
    flexDirection: "row",
    gap: 12,
  },

  imageContainer: {
    position: "relative",
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  wishlistBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  details: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    paddingVertical: 1,
  },

  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: "#111827",
  },

  /* Rating */
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
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
    color: "#f59e0b",
  },

  emptyStar: {
    color: "#e4e4e7",
  },

  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  noReviewsText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#a1a1aa",
  },

  /* Brand and category */
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  metaText: {
    fontSize: 11,
    color: "#6b7280",
  },

  dot: {
    fontSize: 10,
    color: "#9ca3af",
  },

  /* Color */
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#111827",
  },

  colorText: {
    fontSize: 11,
    color: "#4b5563",
    fontWeight: "500",
  },

  /* Price and stock */
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "#111827",
  },

  stockText: {
    fontSize: 11,
    color: "#16a34a",
    fontWeight: "500",
  },

  outOfStockText: {
    color: "#dc2626",
  },

  /* Actions */
  actionsRow: {
    width: "100%",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
});