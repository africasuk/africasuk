import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShoppingBag } from "lucide-react-native";

import { useCart } from "@/store/cart";

export default function CartHeader() {
  const items = useCart((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Rounded Icon Tile */}
        <View style={styles.iconWrapper}>
          <ShoppingBag size={20} color="#18181b" strokeWidth={1.8} />
        </View>

        {/* Header Typography */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? "item" : "items"} ready for checkout
          </Text>
        </View>

        {/* Counter Pill */}
        {totalItems > 0 && (
          <View style={styles.countPill}>
            <Text style={styles.countText}>{totalItems}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
  },

  textWrapper: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    letterSpacing: -0.1,
  },

  countPill: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },

  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
  },
});