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

  const renderItem: ListRenderItem<(typeof items)[number]> = ({ item }) => {
    const image = item.color.images?.[0] as
      | { imageUrl?: string; image_url?: string }
      | undefined;

    const imageUrl =
      image?.image_url ??
      image?.imageUrl ??
      "https://via.placeholder.com/300";

    const variant = item.variant;
    const stock = variant?.stock ?? 0;

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
          handleNavigate(item.slug, item.color.id.toString())
        }
      >
        <View style={styles.topRow}>
          {/* Product Image + Floating Wishlist Badge */}
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

          {/* Product Details */}
          <View style={styles.details}>
            <View>
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>

              {(item.brand || item.category) && (
                <View style={styles.metaRow}>
                  {item.brand && (
                    <Text style={styles.metaText} numberOfLines={1}>
                      {item.brand.name}
                    </Text>
                  )}
                  {item.brand && item.category && (
                    <Text style={styles.dot}>•</Text>
                  )}
                  {item.category && (
                    <Text style={styles.metaText} numberOfLines={1}>
                      {item.category.name}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.colorRow}>
                <View style={styles.colorDot} />
                <Text style={styles.colorText} numberOfLines={1}>
                  {item.color.name}
                </Text>
              </View>
            </View>

            {/* Price & Stock */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ${(variant?.price ?? 0).toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.stockText,
                  stock <= 0 && styles.outOfStockText,
                ]}
              >
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </Text>
            </View>
          </View>
        </View>

        {/* Full-width dual CTA row */}
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

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
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

  actionsRow: {
    width: "100%",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
});