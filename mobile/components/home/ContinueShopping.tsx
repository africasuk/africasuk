import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

import { useCart } from "@/store/cart";
import ContinueShoppingCard from "./ContinueShoppingCard";

export default function ContinueShopping() {
  const items = useCart((state) => state.items);

  if (!items || items.length === 0) {
    return null;
  }

  // Display top 4 cart items to keep home feed layout balanced
  const displayItems = items.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Continue Shopping</Text>
          <Text style={styles.description}>
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            pressed && styles.pressedState,
          ]}
          onPress={() => router.push("/cart")}
          hitSlop={6}
        >
          <ShoppingBag size={14} color="#18181b" strokeWidth={1.8} />
          <Text style={styles.outlineButtonText}>View Cart</Text>
        </Pressable>
      </View>

      {/* 2-Column Product Grid (Flex mapped to avoid nested VirtualizedList crashes) */}
      <View style={styles.grid}>
        {displayItems.map((item) => (
          <View key={item.variantId} style={styles.cardWrapper}>
            <ContinueShoppingCard item={item} />
          </View>
        ))}
      </View>

      {/* Primary Action Button */}
      <Pressable
        onPress={() => router.push("/checkout")}
        style={({ pressed }) => [
          styles.checkoutButton,
          pressed && styles.pressedState,
        ]}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        <ArrowRight size={15} color="#ffffff" strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  headerTitleContainer: {
    gap: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  description: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  outlineButton: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#f4f4f5",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  outlineButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  cardWrapper: {
    width: "48.5%",
  },

  checkoutButton: {
    height: 44,
    backgroundColor: "#18181b",
    borderRadius: 10,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});