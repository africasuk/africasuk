import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import type { CartItem } from "@/types/cart";
import { Price } from "@/components/currency/Price";

interface Props {
  item: CartItem;
}

export default function ContinueShoppingCard({ item }: Props) {
  const navigateToProduct = () => {
    router.push(`/products/${item.slug}` as never);
  };

  const navigateToCheckout = () => {
    router.push("/checkout" as never);
  };

  return (
    <View style={styles.card}>
      {/* 1:1 Clean Image Container */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={navigateToProduct}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
      </TouchableOpacity>

      {/* Body Content */}
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          {/* Price Prominent at the Top */}
          <View style={styles.priceRow}>
            <Price
              price={item.price * item.quantity}
              style={styles.totalPrice}
            />
            {item.quantity > 1 && (
              <Text style={styles.unitDetail}>
                (<Price price={item.price} style={styles.unitPrice} /> ea)
              </Text>
            )}
          </View>

          {/* Product Title */}
          <TouchableOpacity
            onPress={navigateToProduct}
            activeOpacity={0.7}
          >
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {/* Selected Variant Options */}
          {item.options && item.options.length > 0 && (
            <View style={styles.optionsRow}>
              {item.options.map((option) => (
                <View
                  key={`${option.optionName}-${option.value}`}
                  style={styles.optionPill}
                >
                  <Text numberOfLines={1} style={styles.optionText}>
                    {option.value}
                  </Text>
                </View>
              ))}

              <View style={styles.qtyPill}>
                <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Clean Neutral Checkout Action */}
        <Pressable
          onPress={navigateToCheckout}
          style={({ pressed }) => [
            styles.checkoutBtn,
            pressed && styles.pressedState,
          ]}
        >
          <Text numberOfLines={1} style={styles.checkoutBtnText}>
            Checkout
          </Text>
          <ArrowRight size={13} color="#ffffff" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f4f4f5",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
  },

  headerBlock: {
    gap: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },

  totalPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  unitDetail: {
    fontSize: 11,
    color: "#71717a",
    fontWeight: "400",
  },

  unitPrice: {
    fontSize: 11,
    color: "#71717a",
  },

  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27272a",
    lineHeight: 16,
    letterSpacing: -0.1,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },

  optionPill: {
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  optionText: {
    fontSize: 10,
    color: "#52525b",
    fontWeight: "500",
  },

  qtyPill: {
    backgroundColor: "#fafafa",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  qtyText: {
    fontSize: 10,
    color: "#71717a",
    fontWeight: "600",
  },

  checkoutBtn: {
    height: 36,
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  checkoutBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: -0.1,
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});