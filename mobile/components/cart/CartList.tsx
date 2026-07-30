import React from "react";
import { View, StyleSheet } from "react-native";

import CartEmpty from "./CartEmpty";
import CartItem from "./CartItem";

import { useCart } from "@/store/cart";

export default function CartList() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <CartItem key={item.variantId} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});