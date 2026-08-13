import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react-native";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";

const BADGE_RED = "#ef4444";

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

  // Live counts directly from Zustand stores
  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = useCart((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <SafeAreaView style={styles.safe}>
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
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>
          ) : showLogo ? (
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          ) : null}
        </View>

        {/* Title Header - Clean Weight */}
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {/* Right Actions Area */}
        <View style={styles.right}>
          {showWishlist && (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/wishlist" as Href)}
            >
              <Heart
                size={18}
                color={wishlistCount > 0 ? BADGE_RED : "#111827"}
                fill={wishlistCount > 0 ? BADGE_RED : "transparent"}
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
            >
              <ShoppingCart size={18} color="#111827" />
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
    borderBottomColor: "#e5e7eb",
  },

  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },

  left: {
    width: 80,
    justifyContent: "center",
  },

  right: {
    width: 80,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    letterSpacing: 0.2,
  },

  logo: {
    width: 100,
    height: 30,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: BADGE_RED,
    minWidth: 16,
    height: 16,
    borderRadius: 0, // Sharp square badge
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "500", // Clean regular weight
  },
});