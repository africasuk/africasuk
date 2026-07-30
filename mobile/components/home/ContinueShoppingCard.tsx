import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";

import type { CartItem } from "@/types/cart";
import { Price } from "@/components/currency/Price";

interface Props {
  item: CartItem;
}

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";

export default function ContinueShoppingCard({ item }: Props) {
  return (
    <View style={styles.card}>
      {/* Product Image */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/products/${item.slug}` as never)}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>

      {/* Content Body */}
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => router.push(`/products/${item.slug}` as never)}
          activeOpacity={0.7}
        >
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
        </TouchableOpacity>

        {/* Option Tags */}
        {item.options && item.options.length > 0 && (
          <View style={styles.options}>
            {item.options.map((option) => (
              <View
                key={`${option.optionName}-${option.value}`}
                style={styles.option}
              >
                <Text numberOfLines={1} style={styles.optionText}>
                  {option.optionName}: {option.value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Pricing Summary Box */}
        <View style={styles.summary}>
          <View style={styles.summaryCol}>
            <Text style={styles.label}>Qty</Text>
            <Text style={styles.value}>×{item.quantity}</Text>
          </View>

          <View style={[styles.summaryCol, styles.alignRight]}>
            <Text style={styles.label}>Total</Text>
            <Price price={item.price * item.quantity} />
          </View>
        </View>

        {/* Action Button */}
        <Pressable
          onPress={() => router.push("/checkout" as never)}
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.pressedState,
          ]}
        >
          <LinearGradient
            colors={[BRAND_LIGHT, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text numberOfLines={1} style={styles.buttonText}>
              Checkout
            </Text>
            <ArrowRight size={13} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_DARK,
    lineHeight: 18,
    minHeight: 36,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 4,
  },

  option: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  optionText: {
    fontSize: 10,
    color: BRAND_DARK,
    fontWeight: "700",
  },

  summary: {
    marginTop: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  summaryCol: {
    flex: 1,
  },

  alignRight: {
    alignItems: "flex-end",
  },

  label: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  value: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginTop: 1,
  },

  buttonWrapper: {
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  button: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.2,
  },

  pressedState: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});