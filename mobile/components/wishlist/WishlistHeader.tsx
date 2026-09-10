import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";

import { useWishlist } from "@/store/wishlist";

export default function WishlistHeader() {
  const totalItems = useWishlist((state) => state.items.length);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Rounded Icon Tile */}
        <View style={styles.iconWrapper}>
          <Heart size={20} color="#18181b" strokeWidth={1.8} />
        </View>

        {/* Header Typography */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? "item" : "items"} saved for later
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

  textContainer: {
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