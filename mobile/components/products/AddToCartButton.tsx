import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, Href } from "expo-router";
import { ShoppingBag, Zap } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";

import { useCart } from "../../store/cart";
import type { CartItem } from "../../types/cart";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

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
      {/* Primary Add To Cart Button */}
      <Pressable
        onPress={() => addItem(item)}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.addToCartBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedBtn,
        ]}
      >
        <ShoppingBag size={16} color="#ffffff" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
        {quantity > 0 && (
          <View style={styles.inlineCount}>
            <Text style={styles.inlineCountText}>{quantity}</Text>
          </View>
        )}
      </Pressable>

      {/* Secondary Buy Now Button */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.buyNowBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.buyNowPressedBtn,
        ]}
      >
        <Zap size={15} color={BRAND_DARK} />
        <Text style={styles.buyNowText}>Buy Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  addToCartBtn: {
    flex: 1.2,
    height: 48,
    backgroundColor: BRAND,
    borderRadius: 0, // Sharp corners design language
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addToCartText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    letterSpacing: 0.2,
  },
  inlineCount: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0,
    marginLeft: 2,
  },
  inlineCountText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  },
  buyNowBtn: {
    flex: 0.9,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buyNowText: {
    color: BRAND_DARK,
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    letterSpacing: 0.2,
  },
  disabledBtn: {
    opacity: 0.45,
  },
  pressedBtn: {
    opacity: 0.85,
  },
  buyNowPressedBtn: {
    backgroundColor: "#f9fafb",
  },
});