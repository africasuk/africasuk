import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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
      {/* Product Image */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleNavigate}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
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
            <Trash2 size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <Price price={item.price} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddToCart}
            style={styles.cartButton}
          >
            <ShoppingCart size={14} color="#ffffff" />
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNavigate}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>View</Text>
            <ArrowRight size={14} color="#6b7280" />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
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
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  removeButton: {
    padding: 2,
  },
  priceContainer: {
    marginTop: 2,
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
    backgroundColor: BRAND_DARK,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cartButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});