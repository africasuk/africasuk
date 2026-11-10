
import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Bell,
} from "lucide-react-native";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import type { SharedValue } from "react-native-reanimated";
import { supabase } from "@/lib/supabase/client";

interface Props {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
  showNotifications?: boolean;
  scroll: SharedValue<number>;
  isScrolled?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  showLogo = false,
  showCart = true,
  showWishlist = true,
  showNotifications = showLogo,
  isScrolled = false,
}: Props) {
  const router = useRouter();

  const wishlistCount = useWishlist(
    (state) => state.items.length
  );

  const cartCount = useCart((state) =>
    state.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    )
  );

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setUnreadCount(0);
        return;
      }

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setUnreadCount(count ?? 0);
    } catch (error) {
      console.error(
        "Failed to load unread notifications:",
        error
      );
    }
  }, []);

  useEffect(() => {
    void loadUnreadCount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadUnreadCount();
    });

    return () => subscription.unsubscribe();
  }, [loadUnreadCount]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.headerWrapper}>
        {/* Floating Christmas banner */}
        {isScrolled && (
          <View
            pointerEvents="none"
            style={styles.locationContainer}
          >
            <Image
              source={require("@/assets/images/south-sudan-christmas.png")}
              style={styles.locationImage}
              contentFit="contain"
              transition={200}
            />
          </View>
        )}

        {/* Header */}
        <View style={styles.container}>
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
                <ArrowLeft
                  size={18}
                  color="#18181b"
                  strokeWidth={2}
                />
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

          <View style={styles.center}>
            {title ? (
              <Text
                numberOfLines={1}
                style={styles.title}
              >
                {title}
              </Text>
            ) : null}
          </View>

          <View style={styles.right}>
            {/* Notifications */}
            {showNotifications && (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  router.push("/notifications" as Href)
                }
                hitSlop={6}
              >
                <Bell
                  size={18}
                  color={
                    unreadCount > 0
                      ? "#18181b"
                      : "#71717a"
                  }
                  strokeWidth={1.8}
                />

                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            )}

            {/* Wishlist */}
            {showWishlist && (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  router.push("/wishlist" as Href)
                }
                hitSlop={6}
              >
                <Heart
                  size={17}
                  color={
                    wishlistCount > 0
                      ? "#18181b"
                      : "#71717a"
                  }
                  fill={
                    wishlistCount > 0
                      ? "#18181b"
                      : "transparent"
                  }
                  strokeWidth={1.8}
                />

                {wishlistCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            )}

            {/* Cart */}
            {showCart && (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  router.push("/cart" as Href)
                }
                hitSlop={6}
              >
                <ShoppingBag
                  size={17}
                  color={
                    cartCount > 0
                      ? "#18181b"
                      : "#71717a"
                  }
                  strokeWidth={1.8}
                />

                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },

  headerWrapper: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  locationContainer: {
    position: "absolute",
    top: 2,
    left: 0,
    right: 0,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  locationImage: {
    width: 145,
    height: 30,
  },

  container: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
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
    width: 116,
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
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  buttonPressed: {
    backgroundColor: "#E4E4E7",
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
    borderColor: "#FFFFFF",
  },

  notificationBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#16833B",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
