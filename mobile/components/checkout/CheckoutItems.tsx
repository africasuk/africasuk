import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

export default function CheckoutItems() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <ShoppingBag size={24} color="#71717a" strokeWidth={1.75} />
        </View>

        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add items to your cart before proceeding to checkout.
        </Text>

        <Pressable
          onPress={() => router.replace("/products" as never)}
          style={({ pressed }) => [
            styles.emptyButton,
            pressed && styles.emptyButtonPressed,
          ]}
        >
          <Text style={styles.emptyButtonText}>Start Shopping</Text>
          <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <Text style={styles.itemCountText}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      <View style={styles.cardList}>
        {items.map((item, index) => (
          <View
            key={item.variantId}
            style={[
              styles.item,
              index !== items.length - 1 && styles.itemBorder,
            ]}
          >
            {/* 1:1 Pixel-locked Image */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                transition={150}
                cachePolicy="memory-disk"
              />
            </View>

            {/* Product Details */}
            <View style={styles.content}>
              {/* Top Row: Price (Always Visible at Top) & Total */}
              <View style={styles.topRow}>
                <View style={styles.priceRow}>
                  <Price
                    price={item.price * item.quantity}
                    style={styles.totalPrice}
                  />
                  {item.quantity > 1 && (
                    <Text style={styles.unitPriceText}>
                      (<Price price={item.price} style={styles.unitPrice} /> ea)
                    </Text>
                  )}
                </View>

                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
                </View>
              </View>

              {/* Product Name */}
              <Text numberOfLines={2} style={styles.name}>
                {item.name}
              </Text>

              {/* Variant Badges */}
              {item.options && item.options.length > 0 && (
                <View style={styles.options}>
                  {item.options.map((option) => (
                    <View
                      key={`${option.optionName}-${option.value}`}
                      style={styles.optionBadge}
                    >
                      <Text style={styles.optionText} numberOfLines={1}>
                        <Text style={styles.optionLabel}>
                          {option.optionName}:{" "}
                        </Text>
                        {option.value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  itemCountText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  cardList: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  item: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "flex-start",
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  imageWrapper: {
    width: 72,
    height: 72,
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
    gap: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },

  totalPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  unitPriceText: {
    fontSize: 11,
    color: "#71717a",
    fontWeight: "400",
  },

  unitPrice: {
    fontSize: 11,
    color: "#71717a",
  },

  qtyBadge: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  qtyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3f3f46",
  },

  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27272a",
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },

  optionBadge: {
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  optionLabel: {
    color: "#71717a",
    fontWeight: "500",
  },

  optionText: {
    fontSize: 10,
    color: "#27272a",
    fontWeight: "600",
  },

  /* Empty State */
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  emptySubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18,
  },

  emptyButton: {
    marginTop: 16,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  emptyButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  emptyButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },
});