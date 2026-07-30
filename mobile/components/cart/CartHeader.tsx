import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShoppingCart } from "lucide-react-native";

import { useCart } from "@/store/cart";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export default function CartHeader() {
  const items = useCart((state) => state.items);

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <ShoppingCart size={28} color={BRAND} />
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.title}>Shopping Cart</Text>

          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },
});