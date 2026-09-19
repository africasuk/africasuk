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
      {/* Primary: Add to Cart */}
      <Pressable
        onPress={() => addItem(item)}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.primaryBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedState,
        ]}
      >
        <ShoppingBag size={14} color="#ffffff" strokeWidth={2} />
        <Text style={styles.primaryBtnText} numberOfLines={1}>
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </Text>

        {quantity > 0 && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>{quantity}</Text>
          </View>
        )}
      </Pressable>

      {/* Secondary: Buy Now */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock}
        style={({ pressed }) => [
          styles.secondaryBtn,
          isOutOfStock && styles.disabledBtn,
          pressed && !isOutOfStock && styles.pressedState,
        ]}
      >
        <Text style={styles.secondaryBtnText} numberOfLines={1}>
          Buy Now
        </Text>
        <ArrowRight size={13} color="#111827" strokeWidth={2} />
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
    flex: 1.25,
    height: 38,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  primaryBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  counterBadge: {
    backgroundColor: "#004d26",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  counterBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
  },

  secondaryBtn: {
    flex: 0.95,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  secondaryBtnText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  disabledBtn: {
    opacity: 0.4,
    backgroundColor: "#9ca3af",
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});