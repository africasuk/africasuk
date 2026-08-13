import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export default function CartSummary() {
  const router = useRouter();

  const items = useCart((state) => state.items);

  const subtotal = items.reduce(
    (total: number, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.section}>
        {/* Subtotal Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Price price={subtotal} style={styles.valueText} />
        </View>

        {/* Shipping Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.freeBadge}>Free</Text>
        </View>

        {/* Total Divider & Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Price price={total} style={styles.totalValueText} />
        </View>

        {/* Checkout Button - Sharp Corners */}
        <TouchableOpacity
          style={[styles.checkoutButton, isEmpty && styles.disabledButton]}
          activeOpacity={0.85}
          disabled={isEmpty}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  section: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
  },
  valueText: {
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
  },
  freeBadge: {
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    color: BRAND,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
  },
  totalValueText: {
    fontSize: 16,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
  },
  checkoutButton: {
    backgroundColor: BRAND,
    paddingVertical: 12,
    borderRadius: 0, // Sharp corners
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500", // Clean regular button weight
    letterSpacing: 0.3,
  },
});