import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingCart, Zap } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";

import { useCart } from "../../store/cart";
import type { CartItem } from "../../types/cart";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const BRAND_BORDER = "rgba(0, 92, 46, 0.25)";

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
      {/* Primary Add To Cart Button with Brand Gradient */}
      <Pressable
        onPress={() => addItem(item)}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.addToCartWrapper,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedBtn,
        ]}
      >
        <LinearGradient
          colors={[BRAND_LIGHT, BRAND_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addToCartGradient}
        >
          <ShoppingCart size={15} color="#ffffff" />
          
          <Text 
            numberOfLines={1} 
            adjustsFontSizeToFit 
            minimumFontScale={0.8}
            style={styles.addToCartText}
          >
            ADD TO CART
          </Text>

          {quantity > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quantity}</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>

      {/* Bordered Buy Now Button */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.buyNowBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.buyNowPressedBtn,
        ]}
      >
        <Zap size={14} color={BRAND_DARK} />
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          minimumFontScale={0.85}
          style={styles.buyNowText}
        >
          BUY NOW
        </Text>
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
  addToCartWrapper: {
    flex: 1.2,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  addToCartGradient: {
    flex: 1,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  addToCartText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  badge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: BRAND_DARK,
    fontSize: 10,
    fontWeight: "900",
  },
  buyNowBtn: {
    flex: 0.9,
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BRAND_BORDER,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  buyNowText: {
    color: BRAND_DARK,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  disabledBtn: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  pressedBtn: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buyNowPressedBtn: {
    backgroundColor: "rgba(0, 43, 21, 0.05)",
    transform: [{ scale: 0.98 }],
  },
});