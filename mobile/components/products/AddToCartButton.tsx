
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { ShoppingBag, ArrowRight, Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { createClient } from "@/lib/auth/client";
import { useCart } from "../../store/cart";
import type { CartItem } from "../../types/cart";

const GREEN = "#005c2e";
const DARK_GREEN = "#00401f";
const GOLD = "#F4C542";

interface Props {
  item: CartItem;
}

export function AddToCartButton({ item }: Props) {
  const router = useRouter();

  const [buying, setBuying] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCart((state) => state.addItem);
  const buyNow = useCart((state) => state.buyNow);
  const quantity = useCart((state) => state.getQuantity(item.variantId));

  const isOutOfStock = item.stock <= 0;

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => {}
      );
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
    if (isOutOfStock || adding) return;

    setAdding(true);
    triggerHaptic();

    try {
      addItem(item);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1200);
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Buy Now */}
      <Pressable
        onPress={handleBuyNow}
        disabled={isOutOfStock || buying}
        accessibilityRole="button"
        accessibilityLabel={
          isOutOfStock ? "Out of stock" : "Buy now"
        }
        style={({ pressed }) => [
          styles.buyNowButton,
          pressed && styles.pressed,
          isOutOfStock && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={[GREEN, DARK_GREEN]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buyNowGradient}
        >
          {buying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buyNowText}>
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </Text>

              {!isOutOfStock && (
                <ArrowRight
                  size={16}
                  color={GOLD}
                  strokeWidth={2.5}
                />
              )}
            </>
          )}
        </LinearGradient>
      </Pressable>

      {/* Add to Cart */}
      <Pressable
        onPress={handleAddToCart}
        disabled={isOutOfStock || adding}
        accessibilityRole="button"
        accessibilityLabel="Add to cart"
        style={({ pressed }) => [
          styles.addToCartButton,
          pressed && styles.pressed,
          isOutOfStock && styles.disabled,
        ]}
      >
        {adding ? (
          <ActivityIndicator size="small" color={GREEN} />
        ) : added ? (
          <Check size={17} color={GREEN} strokeWidth={2.5} />
        ) : (
          <ShoppingBag size={17} color={GREEN} strokeWidth={2} />
        )}

        <Text style={styles.addToCartText}>
          {added ? "Added" : "Add to Cart"}
        </Text>

        {quantity > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>
              {quantity > 99 ? "99+" : quantity}
            </Text>
          </View>
        )}
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

  buyNowButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 10,
    overflow: "hidden",
  },

  buyNowGradient: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  buyNowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  addToCartButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
  },

  addToCartText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },

  quantityBadge: {
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    color: DARK_GREEN,
    fontSize: 10,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },

  disabled: {
    opacity: 0.5,
  },
});
