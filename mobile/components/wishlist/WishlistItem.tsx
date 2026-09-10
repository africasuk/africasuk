import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react-native";
import type { WishlistItem as WishlistItemType } from "@africasuk/types";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Price } from "../currency/Price";

interface Props {
  item: WishlistItemType;
}

export default function WishlistItem({ item }: Props) {
  const router = useRouter();
  const removeItem = useWishlist((state) => state.removeItem);
  const addItem = useCart((state) => state.addItem);

  const handleNavigate = () => {
    router.push(`/products/${item.slug}` as const);
  };

  const handleAddToCart = () => {
    addItem({
      ...item,
      quantity: 1,
    });
  };

  return (
    <View style={styles.card}>
      {/* 1:1 Aspect Frame */}
      <Pressable
        onPress={handleNavigate}
        style={({ pressed }) => [
          styles.imageWrapper,
          pressed && styles.pressedState,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
      </Pressable>

      {/* Item Details & Actions */}
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={handleNavigate}
              style={({ pressed }) => [
                styles.titleContainer,
                pressed && styles.pressedState,
              ]}
            >
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>

            {/* Trash Button */}
            <Pressable
              onPress={() => removeItem(item.variantId)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.pressedState,
              ]}
              hitSlop={8}
            >
              <Trash2 size={15} color="#71717a" strokeWidth={1.75} />
            </Pressable>
          </View>

          {/* Pricing */}
          <Price price={item.price} style={styles.priceText} />
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.cartButton,
              pressed && styles.cartButtonPressed,
            ]}
          >
            <ShoppingBag size={13} color="#ffffff" strokeWidth={2} />
            <Text style={styles.cartButtonText}>Move to Cart</Text>
          </Pressable>

          <Pressable
            onPress={handleNavigate}
            style={({ pressed }) => [
              styles.viewButton,
              pressed && styles.viewButtonPressed,
            ]}
          >
            <Text style={styles.viewButtonText}>View</Text>
            <ArrowRight size={13} color="#18181b" strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#ffffff",
    padding: 12,
  },

  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  topSection: {
    gap: 4,
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
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f5",
  },

  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },

  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 8,
  },

  cartButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  cartButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 8,
  },

  viewButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  viewButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  pressedState: {
    opacity: 0.8,
  },
});