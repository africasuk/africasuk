import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react-native";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";

interface Props {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  showLogo = false,
  showCart = true,
  showWishlist = true,
}: Props) {
  const router = useRouter();

  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = useCart((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        {/* Left Action Area */}
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
            </Pressable>
          ) : showLogo ? (
            <Pressable
              onPress={() => router.push("/" as Href)}
              style={({ pressed }) => [
                styles.logoWrapper,
                pressed && styles.logoPressed,
              ]}
              hitSlop={6}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                contentFit="contain"
                transition={150}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Center Title */}
        <View style={styles.center}>
          {title ? (
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          ) : null}
        </View>

        {/* Right Action Icons */}
        <View style={styles.right}>
          {showWishlist && (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/wishlist" as Href)}
              hitSlop={6}
            >
              <Heart
                size={17}
                color={wishlistCount > 0 ? "#18181b" : "#71717a"}
                fill={wishlistCount > 0 ? "#18181b" : "transparent"}
                strokeWidth={1.8}
              />
              {wishlistCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}

          {showCart && (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/cart" as Href)}
              hitSlop={6}
            >
              <ShoppingBag
                size={17}
                color={cartCount > 0 ? "#18181b" : "#71717a"}
                strokeWidth={1.8}
              />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  container: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },

  left: {
    width: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  right: {
    width: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
    textAlign: "center",
  },

  logoWrapper: {
    height: 28,
    width: 80,
    justifyContent: "center",
  },

  logoPressed: {
    opacity: 0.8,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  buttonPressed: {
    backgroundColor: "#e4e4e7",
    transform: [{ scale: 0.97 }],
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#18181b",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});