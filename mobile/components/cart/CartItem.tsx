import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
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
      {/* Product Image Frame - Sharp Corners */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleNavigate}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
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
          {/* Quantity Stepper - Sharp Corners */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              activeOpacity={0.7}
              onPress={decrease}
            >
              <Minus size={12} color="#374151" />
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
                size={12}
                color={isAtMaxStock ? "#d1d5db" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* Price & Remove Button */}
          <View style={styles.priceAndRemoveContainer}>
            <Price
              price={item.price * item.quantity}
              style={styles.priceText}
            />

            <TouchableOpacity
              style={styles.removeButton}
              activeOpacity={0.7}
              onPress={() => removeItem(item.variantId)}
            >
              <Trash2 size={12} color="#ef4444" />
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
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 13,
    fontWeight: "500", // Non-bold clean weight
    color: BRAND_DARK,
    lineHeight: 18,
  },
  optionsContainer: {
    marginTop: 4,
    gap: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  optionName: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
  },
  optionValue: {
    fontSize: 11,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
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
    borderColor: "#e5e7eb",
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f9fafb",
  },
  stepperButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledStepperButton: {
    opacity: 0.5,
  },
  quantityText: {
    width: 26,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
  },
  priceAndRemoveContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },
  removeText: {
    fontSize: 11,
    fontWeight: "400", // Clean weight
    color: "#ef4444",
  },
});