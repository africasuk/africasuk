import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import { Heart, ShoppingCart, Search, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

import SearchBar from "@/components/layout/header/SearchBar";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";

const BADGE_RED = "#ef4444";

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
}

export default function HomeHeader({ scrollY }: HomeHeaderProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  // Live counts directly from Zustand stores
  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = useCart((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Animate the Logo & Wishlist/Cart container hiding on scroll
  const hideOnScrollStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [1, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollY.value,
      [0, 50],
      [80, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
      overflow: "hidden",
    };
  });

  const hideActionsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [1, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollY.value,
      [0, 50],
      [84, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
      overflow: "hidden",
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Full-width Search Mode when tapped */}
        {isSearching ? (
          <View style={styles.expandedSearchWrapper}>
            <View style={styles.searchFlex}>
              <SearchBar placeholder="Search products, categories..." />
            </View>

            <TouchableOpacity
              onPress={() => setIsSearching(false)}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Left: Collapsible Logo */}
            <Animated.View style={[styles.logoContainer, hideOnScrollStyle]}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </Animated.View>

            {/* Center: Search Trigger Pill (Kept Rounded) */}
            <Pressable
              style={styles.searchTriggerPill}
              onPress={() => setIsSearching(true)}
            >
              <Search size={16} color="#6b7280" style={styles.searchIcon} />
              <Text style={styles.searchText}>Search...</Text>
            </Pressable>

            {/* Right: Collapsible Actions */}
            <Animated.View style={[styles.actions, hideActionsStyle]}>
              <Pressable
                style={styles.iconButton}
                onPress={() => router.push("/wishlist" as any)}
              >
                <Heart size={18} color="#111827" />
                {wishlistCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={styles.iconButton}
                onPress={() => router.push("/cart" as any)}
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
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  row: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  searchTriggerPill: ViewStyle;
  searchIcon: ViewStyle;
  searchText: TextStyle;
  actions: ViewStyle;
  iconButton: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  expandedSearchWrapper: ViewStyle;
  searchFlex: ViewStyle;
  closeButton: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    gap: 8,
  },
  logoContainer: {
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 26,
  },
  searchTriggerPill: {
    flex: 1,
    height: 38,
    backgroundColor: "#F3F4F6",
    borderRadius: 19, // Kept rounded pill design for search
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 0, // Sharp square button
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
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
    fontWeight: "500",
  },
  expandedSearchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchFlex: {
    flex: 1,
  },
  closeButton: {
    padding: 6,
  },
});