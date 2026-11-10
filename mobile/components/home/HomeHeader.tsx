import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import {
  Bell,
  Heart,
  ShoppingBag,
  Search,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";

import SearchBar from "@/components/layout/header/SearchBar";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { supabase } from "@/lib/supabase/client";

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
  isScrolled: boolean;
}

export default function HomeHeader({
  scrollY,
  isScrolled,
}: HomeHeaderProps) {
  const router = useRouter();

  const [isSearching, setIsSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const wishlistCount = useWishlist(
    (state) => state.items.length,
  );

  const cartCount = useCart((state) =>
    state.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    ),
  );

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
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

      if (error) {
        console.error(
          "Failed to fetch unread notifications:",
          error,
        );
        return;
      }

      setUnreadCount(count ?? 0);
    } catch (error) {
      console.error(
        "Notification count error:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    void fetchUnreadCount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void fetchUnreadCount();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUnreadCount]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, 40],
      ["rgba(255,255,255,0)", "rgba(255,255,255,0.98)"],
    ),
    borderBottomColor: interpolateColor(
      scrollY.value,
      [0, 40],
      ["rgba(255,255,255,0)", "rgba(229,231,235,1)"],
    ),
  }));

  const hideLogoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 55],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      scrollY.value,
      [0, 55],
      [86, 0],
      Extrapolation.CLAMP,
    ),
    marginRight: interpolate(
      scrollY.value,
      [0, 55],
      [10, 0],
      Extrapolation.CLAMP,
    ),
    overflow: "hidden" as const,
  }));

  const hideActionsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 55],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      scrollY.value,
      [0, 55],
      [118, 0],
      Extrapolation.CLAMP,
    ),
    marginLeft: interpolate(
      scrollY.value,
      [0, 55],
      [10, 0],
      Extrapolation.CLAMP,
    ),
    overflow: "hidden" as const,
  }));

  const searchPillAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 40],
      [38, 42],
      Extrapolation.CLAMP,
    ),
    borderColor: interpolateColor(
      scrollY.value,
      [0, 40],
      ["rgba(255,255,255,0.95)", "#e5e7eb"],
    ),
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, 40],
      ["rgba(255,255,255,0.97)", "#ffffff"],
    ),
  }));

  const openNotifications = () => {
    router.push("/notifications" as any);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        headerAnimatedStyle,
      ]}
    >
      {/* Christmas banner */}
      {isScrolled && !isSearching && (
        <View
          pointerEvents="none"
          style={styles.christmasBadge}
        >
          <Image
            source={require("@/assets/images/south-sudan-christmas.png")}
            style={styles.christmasImage}
            contentFit="cover"
            contentPosition="bottom"
            transition={200}
          />
        </View>
      )}

      <View style={styles.row}>
        {isSearching ? (
          <View style={styles.expandedSearchWrapper}>
            <View style={styles.searchFlex}>
              <SearchBar
                placeholder="Search products, brands, styles..."
              />
            </View>

            <Pressable
              onPress={() => setIsSearching(false)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <X
                size={18}
                color="#18181b"
                strokeWidth={2}
              />
            </Pressable>
          </View>
        ) : (
          <>
            {/* Africa Suk logo */}
            <Animated.View
              style={[
                styles.logoContainer,
                hideLogoStyle,
              ]}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </Animated.View>

            {/* Search */}
            <Animated.View
              style={[
                styles.searchPillWrapper,
                searchPillAnimatedStyle,
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.searchTriggerPill,
                  pressed &&
                    styles.searchTriggerPillPressed,
                ]}
                onPress={() => setIsSearching(true)}
              >
                <Search
                  size={15}
                  color="#000000"
                  strokeWidth={1.8}
                  style={styles.searchIcon}
                />

                <Text
                  numberOfLines={1}
                  style={styles.searchText}
                >
                  Search products, styles...
                </Text>
              </Pressable>
            </Animated.View>

            {/* Notifications, wishlist and cart */}
            <Animated.View
              style={[
                styles.actions,
                hideActionsStyle,
              ]}
            >
              {/* Notifications */}
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.iconButtonPressed,
                ]}
                onPress={openNotifications}
                hitSlop={6}
              >
                <Bell
                  size={19}
                  color="#ffffff"
                  strokeWidth={2}
                />

                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Wishlist */}
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.iconButtonPressed,
                ]}
                onPress={() =>
                  router.push("/wishlist" as any)
                }
                hitSlop={6}
              >
                <Heart
                  size={19}
                  color="#ffffff"
                  strokeWidth={2}
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

              {/* Cart */}
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.iconButtonPressed,
                ]}
                onPress={() =>
                  router.push("/cart" as any)
                }
                hitSlop={6}
              >
                <ShoppingBag
                  size={19}
                  color="#ffffff"
                  strokeWidth={2}
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
            </Animated.View>
          </>
        )}
      </View>
    </Animated.View>
  );
}

type Styles = {
  container: ViewStyle;
  row: ViewStyle;
  christmasBadge: ViewStyle;
  christmasImage: ImageStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  searchPillWrapper: ViewStyle;
  searchTriggerPill: ViewStyle;
  searchTriggerPillPressed: ViewStyle;
  searchIcon: ViewStyle;
  searchText: TextStyle;
  actions: ViewStyle;
  iconButton: ViewStyle;
  iconButtonPressed: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  expandedSearchWrapper: ViewStyle;
  searchFlex: ViewStyle;
  closeButton: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    overflow: "visible",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    zIndex: 1,
    elevation: 1,
  },

  christmasBadge: {
    position: "absolute",
    top: 14,
    left: 0,
    right: 0,
    height: 52,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 20,
  },

  christmasImage: {
    width: "75%",
    height: 42,
  },

  logoContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    width: 86,
    height: 24,
  },

  searchPillWrapper: {
    flex: 1,
    height: 38,
    borderRadius: 21,
  },

  searchTriggerPill: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 21,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  searchTriggerPillPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  searchIcon: {
    marginRight: 8,
  },

  searchText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: -0.1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: "100%",
    justifyContent: "flex-end",
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  iconButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ffffff",
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 11,
  },

  expandedSearchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchFlex: {
    flex: 1,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
});