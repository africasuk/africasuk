import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";

import { useWishlist } from "@/store/wishlist";

const BRAND_DARK = "#002b15";

export default function WishlistHeader() {
  const totalItems = useWishlist((state) => state.items.length);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Heart size={24} color="#ef4444" fill="#ef4444" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? "item" : "items"} saved
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },
});