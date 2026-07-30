import React from "react";
import { View, StyleSheet } from "react-native";

import WishlistEmpty from "./WishlistEmpty";
import WishlistItem from "./WishlistItem";

import { useWishlist } from "@/store/wishlist";

export default function WishlistList() {
  const items = useWishlist((state) => state.items);

  if (items.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <WishlistItem key={item.variantId} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});