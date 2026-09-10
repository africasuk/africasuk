import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

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
    <View style={styles.container}>
      {/* Total Price Hero - Prominent & Top */}
      <View style={styles.priceHeroCard}>
        <View style={styles.priceHeroLeft}>
          <Text style={styles.priceHeroLabel}>Subtotal Payable</Text>
          <Text style={styles.taxInclusiveText}>Taxes calculated at checkout</Text>
        </View>
        <Price price={total} style={styles.priceHeroValue} />
      </View>

      {/* Summary Breakdown Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Order Breakdown</Text>
          <Text style={styles.headerCount}>
            {items.length} {items.length === 1 ? "line item" : "line items"}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={styles.label}>Items Total</Text>
            <Price price={subtotal} style={styles.valueText} />
          </View>

          {/* Shipping */}
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Delivery</Text>
            <View style={styles.neutralPill}>
              <Text style={styles.neutralPillText}>FREE</Text>
            </View>
          </View>

          {/* Checkout CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.checkoutButton,
              isEmpty && styles.disabledButton,
              pressed && !isEmpty && styles.pressedState,
            ]}
            disabled={isEmpty}
            onPress={() => router.push("/checkout" as never)}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  /* Hero Price Tile */
  priceHeroCard: {
    backgroundColor: "#f4f4f5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceHeroLeft: {
    gap: 2,
  },

  priceHeroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  taxInclusiveText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#a1a1aa",
  },

  priceHeroValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.4,
  },

  /* Breakdown Card */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  headerCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  body: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 13,
    fontWeight: "400",
    color: "#71717a",
  },

  valueText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  neutralPill: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  neutralPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#27272a",
    letterSpacing: 0.4,
  },

  checkoutButton: {
    height: 46,
    backgroundColor: "#18181b",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.4,
  },

  pressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});