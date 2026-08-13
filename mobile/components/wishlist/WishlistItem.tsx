import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react-native";
import type { WishlistItem as WishlistItemType } from "@africasuk/types";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Price } from "../currency/Price";

interface Props {
  item: WishlistItemType;
}

const BRAND_DARK = "#002b15";
const BRAND_GREEN = "#005c2e";

export default function WishlistItem({ item }: Props) {
  const router = useRouter();
  const removeItem = useWishlist((state) => state.removeItem);
  const addItem = useCart((state) => state.addItem);

  const handleNavigate = () => {
    router.push(`/products/${item.slug}`);
  };

  const handleAddToCart = () => {
    addItem({
      ...item,
      quantity: 1,
    });
  };

  return (
    <View style={styles.card}>
      {/* Product Image - Sharp Corners */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleNavigate}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>

      {/* Item Details & Actions */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigate}
            style={styles.titleContainer}
          >
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {/* Quick Remove Button */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => removeItem(item.variantId)}
            style={styles.removeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={15} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <Price price={item.price} style={styles.priceText} />
        </View>

        {/* Action Buttons - Sharp Corners */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddToCart}
            style={styles.cartButton}
          >
            <ShoppingCart size={13} color="#ffffff" />
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNavigate}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>View</Text>
            <ArrowRight size={13} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 12,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 0, // Sharp corners
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
  },
  removeButton: {
    padding: 2,
  },
  priceContainer: {
    marginTop: 2,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    color: BRAND_GREEN,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0, // Sharp corners
  },
  cartButtonText: {
    fontSize: 11,
    fontWeight: "500", // Clean regular weight
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0, // Sharp corners
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
});