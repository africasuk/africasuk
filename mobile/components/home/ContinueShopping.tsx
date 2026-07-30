import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

import { useCart } from "@/store/cart";

import ContinueShoppingCard from "./ContinueShoppingCard";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";
const BRAND_BORDER = "rgba(0, 92, 46, 0.25)";

export default function ContinueShopping() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Continue Shopping</Text>

          <Text style={styles.description}>
            You have <Text style={styles.itemCountHighlight}>{items.length}</Text>{" "}
            {items.length === 1 ? "item" : "items"} waiting in your cart.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            pressed && styles.pressedState,
          ]}
          onPress={() => router.push("/cart")}
        >
          <ShoppingBag size={14} color={BRAND_DARK} />
          <Text style={styles.outlineButtonText}>View Cart</Text>
        </Pressable>
      </View>

      {/* Product Items Grid */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.variantId}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ContinueShoppingCard item={item} />
          </View>
        )}
      />

      {/* Primary Action Gradient Button */}
      <Pressable
        onPress={() => router.push("/checkout")}
        style={({ pressed }) => [
          styles.checkoutButtonWrapper,
          pressed && styles.pressedState,
        ]}
      >
        <LinearGradient
          colors={[BRAND_LIGHT, BRAND_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.checkoutButton}
        >
          <Text style={styles.checkoutButtonText}>
            Continue to Checkout
          </Text>
          <ArrowRight size={18} color="#ffffff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    gap: 12,
  },

  headerTitleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.3,
  },

  description: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },

  itemCountHighlight: {
    color: BRAND_LIGHT,
    fontWeight: "800",
  },

  outlineButton: {
    borderWidth: 1.5,
    borderColor: BRAND_BORDER,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  outlineButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: BRAND_DARK,
  },

  list: {
    gap: 12,
  },

  row: {
    gap: 12,
    marginBottom: 12,
  },

  cardWrapper: {
    flex: 1,
  },

  checkoutButtonWrapper: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },

  checkoutButton: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },

  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  pressedState: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});