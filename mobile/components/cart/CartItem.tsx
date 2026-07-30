import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Minus, Plus, Trash2 } from "lucide-react-native";

import type { CartItem as CartItemType } from "@/types/cart";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

const BRAND_DARK = "#002b15";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const router = useRouter();

  const removeItem = useCart((state) => state.removeItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  function increase() {
    increaseQuantity(item.variantId);
  }

  function decrease() {
    decreaseQuantity(item.variantId);
  }

  function handleNavigate() {
    if (item.slug) {
      router.push(`/products/${item.slug}` as const);
    }
  }

  const isAtMaxStock = item.quantity >= item.stock;

  return (
    <View style={styles.card}>
      {/* Product Image */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleNavigate}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        <View>
          {/* Title */}
          <TouchableOpacity activeOpacity={0.7} onPress={handleNavigate}>
            <Text style={styles.title} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {/* Options / Variants */}
          {item.options && item.options.length > 0 && (
            <View style={styles.optionsContainer}>
              {item.options.map((option) => (
                <View
                  key={`${option.optionName}-${option.value}`}
                  style={styles.optionRow}
                >
                  <Text style={styles.optionName}>{option.optionName}:</Text>
                  <Text style={styles.optionValue}>{option.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer: Stepper & Price/Remove */}
        <View style={styles.footer}>
          {/* Quantity Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              activeOpacity={0.7}
              onPress={decrease}
            >
              <Minus size={14} color="#374151" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={[
                styles.stepperButton,
                isAtMaxStock && styles.disabledStepperButton,
              ]}
              activeOpacity={0.7}
              onPress={increase}
              disabled={isAtMaxStock}
            >
              <Plus
                size={14}
                color={isAtMaxStock ? "#d1d5db" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* Price & Remove Button */}
          <View style={styles.priceAndRemoveContainer}>
            <Text style={styles.priceText}>
              <Price price={item.price * item.quantity} />
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              activeOpacity={0.7}
              onPress={() => removeItem(item.variantId)}
            >
              <Trash2 size={13} color="#ef4444" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 12,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_DARK,
    lineHeight: 18,
  },
  optionsContainer: {
    marginTop: 6,
    gap: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  optionName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  optionValue: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  stepperButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledStepperButton: {
    opacity: 0.5,
  },
  quantityText: {
    width: 28,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  priceAndRemoveContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },
  removeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
  },
});