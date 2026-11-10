import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { ShoppingBag, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { createClient } from "@/lib/auth/client";
import { useCart } from "../../store/cart";
import type { CartItem } from "../../types/cart";

const PRIMARY_GREEN = "#004d32";
const ACCENT_MINT = "#E8F5E9";
const MUTED_BORDER = "#E5E5E5";

interface Props {
  item: CartItem;
}

export function AddToCartButton({ item }: Props) {
  const router = useRouter();

  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addItem = useCart((state) => state.addItem);
  const buyNow = useCart((state) => state.buyNow);
  const quantity = useCart((state) => state.getQuantity(item.variantId));

  const isOutOfStock = item.stock <= 0;

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || buying) return;

    setBuying(true);
    triggerHaptic();

    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/auth" as Href);
        return;
      }

      buyNow(item);
      router.push("/checkout" as Href);
    } catch (error) {
      console.error("Buy now failed:", error);
    } finally {
      setBuying(false);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    triggerHaptic();
    addItem(item);
    setAdded(true);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setAdded(false);
      resetTimer.current = null;
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Mini Cart Action */}
      <Pressable
        onPress={handleAddToCart}
        disabled={isOutOfStock}
        accessibilityRole="button"
        accessibilityLabel="Add to cart"
        style={({ pressed }) => [
          styles.cartButton,
          added && styles.cartButtonSuccess,
          pressed && styles.pressedScale,
          isOutOfStock && styles.disabled,
        ]}
      >
        {added ? (
          <Check size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
        ) : (
          <ShoppingBag size={16} color="#1a1a1a" strokeWidth={2} />
        )}

        {quantity > 0 && !added && (
          <View style={styles.quantityDot}>
            <Text style={styles.quantityText}>
              {quantity > 9 ? "9+" : quantity}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Mini Buy Now Action */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock || buying}
        accessibilityRole="button"
        accessibilityLabel={isOutOfStock ? "Out of stock" : "Buy now"}
        style={({ pressed }) => [
          styles.buyNowButton,
          pressed && styles.pressedOpacity,
          isOutOfStock && styles.buyNowDisabled,
        ]}
      >
        {buying ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buyNowText}>
            {isOutOfStock ? "Sold Out" : "Buy Now"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },

  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MUTED_BORDER,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cartButtonSuccess: {
    backgroundColor: ACCENT_MINT,
    borderColor: PRIMARY_GREEN,
  },

  quantityDot: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    color: "#FFFFFF",
    fontSize: 8.5,
    fontWeight: "700",
    lineHeight: 10,
  },

  buyNowButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  buyNowDisabled: {
    backgroundColor: "#EBEBEB",
  },

  buyNowText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  pressedScale: {
    transform: [{ scale: 0.94 }],
  },

  pressedOpacity: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.45,
  },
});