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
          <Text style={styles.valueText}>
            <Price price={subtotal} />
          </Text>
        </View>

        {/* Shipping Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.freeBadge}>Free</Text>
        </View>

        {/* Total Divider & Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValueText}>
            <Price price={total} />
          </Text>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.checkoutButton, isEmpty && styles.disabledButton]}
          activeOpacity={0.8}
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_DARK,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  freeBadge: {
    fontSize: 14,
    fontWeight: "700",
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
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  totalValueText: {
    fontSize: 18,
    fontWeight: "900",
    color: BRAND_DARK,
  },
  checkoutButton: {
    backgroundColor: BRAND,
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});