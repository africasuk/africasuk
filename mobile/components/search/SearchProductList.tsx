import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import type { ProductWithDetails } from "@africasuk/types";

// Named import fixes TS2613 & ESLint import/no-named-as-default
import { WishlistButton } from "../products/WishlistButton";

const BRAND = "#004d26";

interface SearchProductListProps {
  products: ProductWithDetails[];
}

export default function SearchProductList({
  products,
}: SearchProductListProps) {
  const router = useRouter();

  // Flatten products across colors and variants
  const items = useMemo(() => {
    return products.flatMap((product) =>
      product.colors.map((color) => ({
        ...product,
        color,
        variant: color.variants[0],
        compositeId: `${product.id}-${color.id}`,
      }))
    );
  }, [products]);

  const handleNavigate = (slug: string, colorId: string) => {
    // Standard template literal string fixes the Expo Router type error TS2322
    router.push(`/products/${slug}?color=${colorId}` as const);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.compositeId}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const imageUrl =
          item.color.images?.[0]?.imageUrl ??
          "https://via.placeholder.com/150";

        const cartAndWishlistItem = {
          productId: item.id.toString(),
          variantId: item.variant?.id?.toString() ?? "",
          name: item.name,
          slug: item.slug,
          price: item.variant?.price ?? 0,
          stock: item.variant?.stock ?? 0,
          quantity: 1,
          allowCod: item.allowCod,
          allowOnlinePayment: item.allowOnlinePayment,
          image: imageUrl,
          options: [
            {
              optionName: "Color",
              value: item.color.name,
            },
            {
              optionName: item.variant?.optionName ?? "",
              value: item.variant?.optionValue ?? "",
            },
          ],
        };

        return (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleNavigate(item.slug, item.color.id.toString())}
          >
            {/* Main Content Row: Image + Details */}
            <View style={styles.mainRow}>
              {/* Image */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
              </View>

              {/* Details Column */}
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name} - {item.color.name}
                </Text>

                {/* Brand & Category */}
                <View style={styles.metaRow}>
                  {item.brand && (
                    <Text style={styles.metaText}>
                      Brand: <Text style={styles.metaValue}>{item.brand.name}</Text>
                    </Text>
                  )}
                  {item.category && (
                    <Text style={styles.metaText}>
                      Category:{" "}
                      <Text style={styles.metaValue}>{item.category.name}</Text>
                    </Text>
                  )}
                </View>

                {/* Badges */}
                {item.variant && (
                  <View style={styles.badgeRow}>
                    <View style={styles.secondaryBadge}>
                      <Text style={styles.secondaryBadgeText}>
                        {item.variant.optionName}: {item.variant.optionValue}
                      </Text>
                    </View>

                    <View style={styles.stockBadge}>
                      <Text style={styles.stockBadgeText}>
                        Stock: {item.variant.stock}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Price */}
                <Text style={styles.price}>
                  ${(item.variant?.price ?? 0).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Bottom Actions Row: Wishlist & Add to Cart */}
            <View
              style={styles.actionsRow}
              onStartShouldSetResponder={() => true} // Intercepts touches to prevent card navigation
            >
              <WishlistButton item={cartAndWishlistItem} />

             <TouchableOpacity
                style={styles.cartButton}
                activeOpacity={0.8}
                onPress={() => {
                    // Cast to 'any' or 'Href' to allow unmapped routes temporarily
                    router.push("/cart" as any);
                }}
                >
                <ShoppingCart size={14} color="#ffffff" />
                <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

type Styles = {
  listContainer: ViewStyle;
  card: ViewStyle;
  cardPressed: ViewStyle;
  mainRow: ViewStyle;
  imageWrapper: ViewStyle;
  image: ImageStyle;
  details: ViewStyle;
  title: TextStyle;
  metaRow: ViewStyle;
  metaText: TextStyle;
  metaValue: TextStyle;
  badgeRow: ViewStyle;
  secondaryBadge: ViewStyle;
  secondaryBadgeText: TextStyle;
  stockBadge: ViewStyle;
  stockBadgeText: TextStyle;
  price: TextStyle;
  actionsRow: ViewStyle;
  cartButton: ViewStyle;
  cartButtonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  listContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: "#f9fafb",
  },
  mainRow: {
    flexDirection: "row",
    gap: 12,
  },
  imageWrapper: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: "#6b7280",
  },
  metaValue: {
    fontWeight: "600",
    color: "#374151",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  secondaryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  secondaryBadgeText: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "500",
  },
  stockBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
    marginTop: 10,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BRAND,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cartButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});