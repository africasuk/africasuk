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
      {/* Product Image Frame - Sharp Corners */}
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
            <Price price={item.price * item.quantity} style={styles.priceText} />
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
    borderRadius: 0, // Sharp corners design language
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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
    fontWeight: "500", // Non-bold clean title
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
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  optionText: {
    fontSize: 10,
    color: BRAND_DARK,
    fontWeight: "400", // Clean regular weight
  },

  summary: {
    marginTop: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 0, // Sharp corners
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  summaryCol: {
    flex: 1,
  },

  alignRight: {
    alignItems: "flex-end",
  },

  label: {
    fontSize: 9,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  value: {
    fontSize: 11,
    fontWeight: "500",
    color: "#111827",
    marginTop: 1,
  },

  priceText: {
    fontSize: 11,
    fontWeight: "500",
    color: BRAND_DARK,
    marginTop: 1,
  },

  buttonWrapper: {
    marginTop: 10,
    borderRadius: 0, // Sharp corners
    overflow: "hidden",
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
    fontWeight: "500", // Clean button text weight
    fontSize: 12,
    letterSpacing: 0.2,
  },

  pressedState: {
    opacity: 0.9,
  },
});