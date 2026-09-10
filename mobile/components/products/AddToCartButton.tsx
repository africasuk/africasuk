import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, Href } from "expo-router";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";

import { useCart } from "../../store/cart";
import type { CartItem } from "../../types/cart";

interface Props {
  item: CartItem;
}

export function AddToCartButton({ item }: Props) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const buyNow = useCart((state) => state.buyNow);
  const quantity = useCart((state) => state.getQuantity(item.variantId));

  const isOutOfStock = item.stock <= 0;

  const handleBuyNow = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login" as Href);
      return;
    }

    buyNow(item);
    router.push("/checkout" as Href);
  };

  return (
    <View style={styles.container}>
      {/* Primary Clean Solid CTA */}
      <Pressable
        onPress={() => addItem(item)}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.primaryBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedState,
        ]}
      >
        <ShoppingBag size={15} color="#ffffff" strokeWidth={1.8} />
        <Text style={styles.primaryBtnText}>
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </Text>
        {quantity > 0 && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>{quantity}</Text>
          </View>
        )}
      </Pressable>

      {/* Secondary Neutral Pill */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.secondaryBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedState,
        ]}
      >
        <Text style={styles.secondaryBtnText}>Buy Now</Text>
        <ArrowRight size={14} color="#18181b" strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },

  primaryBtn: {
    flex: 1.3,
    height: 46,
    backgroundColor: "#18181b",
    borderRadius: 23,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  primaryBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  counterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 1,
  },

  counterBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },

  secondaryBtn: {
    flex: 0.9,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 23,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  secondaryBtnText: {
    color: "#18181b",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  disabledBtn: {
    opacity: 0.35,
  },

  pressedState: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});