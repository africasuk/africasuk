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
        {/* Icon Wrapper - Sharp Corners */}
        <View style={styles.iconWrapper}>
          <ShoppingCart size={22} color={BRAND} />
        </View>

        {/* Text Area */}
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
    paddingBottom: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 0, // Sharp corners design language
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400", // Clean regular weight
    color: "#6b7280",
    marginTop: 2,
  },
});