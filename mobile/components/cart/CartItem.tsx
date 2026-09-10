import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Minus, Plus, Trash2 } from "lucide-react-native";

import type { CartItem as CartItemType } from "@/types/cart";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const router = useRouter();

  const removeItem = useCart((state) => state.removeItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  function handleNavigate() {
    if (item.slug) {
      router.push(`/products/${item.slug}` as const);
    }
  }

  const isAtMaxStock = item.quantity >= item.stock;

  return (
    <View style={styles.card}>
      {/* 1:1 Image Frame */}
      <Pressable
        onPress={handleNavigate}
        style={({ pressed }) => [
          styles.imageWrapper,
          pressed && styles.pressedState,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
      </Pressable>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Top Section: Title & Variants */}
        <View style={styles.headerBlock}>
          <Pressable
            onPress={handleNavigate}
            style={({ pressed }) => pressed && styles.pressedState}
          >
            <Text style={styles.title} numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>

          {item.options && item.options.length > 0 && (
            <View style={styles.optionsContainer}>
              {item.options.map((option) => (
                <View
                  key={`${option.optionName}-${option.value}`}
                  style={styles.optionBadge}
                >
                  <Text style={styles.optionText} numberOfLines={1}>
                    <Text style={styles.optionLabel}>{option.optionName}: </Text>
                    {option.value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer: Stepper & Price/Remove */}
        <View style={styles.footer}>
          {/* Quantity Stepper */}
          <View style={styles.stepperContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.stepperButton,
                pressed && styles.stepperButtonPressed,
              ]}
              hitSlop={4}
              onPress={() => decreaseQuantity(item.variantId)}
            >
              <Minus size={12} color="#18181b" strokeWidth={2} />
            </Pressable>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.stepperButton,
                pressed && !isAtMaxStock && styles.stepperButtonPressed,
                isAtMaxStock && styles.disabledStepperButton,
              ]}
              hitSlop={4}
              onPress={() => increaseQuantity(item.variantId)}
              disabled={isAtMaxStock}
            >
              <Plus
                size={12}
                color={isAtMaxStock ? "#a1a1aa" : "#18181b"}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* Price & Remove */}
          <View style={styles.priceAndRemoveContainer}>
            <Price
              price={item.price * item.quantity}
              style={styles.priceText}
            />

            <Pressable
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.pressedState,
              ]}
              hitSlop={6}
              onPress={() => removeItem(item.variantId)}
            >
              <Trash2 size={12} color="#dc2626" strokeWidth={1.8} />
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 12,
  },

  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  headerBlock: {
    gap: 4,
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },

  optionBadge: {
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  optionLabel: {
    color: "#71717a",
    fontSize: 10,
    fontWeight: "500",
  },

  optionText: {
    fontSize: 10,
    color: "#27272a",
    fontWeight: "600",
  },

  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    height: 30,
  },

  stepperButton: {
    width: 28,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  stepperButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  disabledStepperButton: {
    opacity: 0.4,
  },

  quantityText: {
    width: 24,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
  },

  priceAndRemoveContainer: {
    alignItems: "flex-end",
    gap: 4,
  },

  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },

  removeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#dc2626",
    letterSpacing: -0.1,
  },

  pressedState: {
    opacity: 0.8,
  },
});