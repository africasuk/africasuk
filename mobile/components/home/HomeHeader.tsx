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
import { Heart, ShoppingBag, Search, X } from "lucide-react-native";
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

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
}

export default function HomeHeader({ scrollY }: HomeHeaderProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = useCart((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Logo collapses on scroll to yield full width to search
  const hideLogoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 25],
      [1, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollY.value,
      [0, 35],
      [86, 0],
      Extrapolation.CLAMP
    );

    const marginRight = interpolate(
      scrollY.value,
      [0, 35],
      [10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
      marginRight,
      overflow: "hidden",
    };
  });

  // Action icons collapse on scroll so search expands 100%
  const hideActionsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 25],
      [1, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollY.value,
      [0, 35],
      [76, 0],
      Extrapolation.CLAMP
    );

    const marginLeft = interpolate(
      scrollY.value,
      [0, 35],
      [10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      width,
      marginLeft,
      overflow: "hidden",
    };
  });

  // Search pill smoothly expands and adjusts height when scrolled
  const searchPillAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 35],
      [38, 42],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {isSearching ? (
          <View style={styles.expandedSearchWrapper}>
            <View style={styles.searchFlex}>
              <SearchBar placeholder="Search products, brands, styles..." />
            </View>

            <TouchableOpacity
              onPress={() => setIsSearching(false)}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color="#18181b" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Left: Collapsible Logo */}
            <Animated.View style={[styles.logoContainer, hideLogoStyle]}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                contentFit="contain"
                transition={150}
              />
            </Animated.View>

            {/* Center: Search Trigger Pill (Expands to 100% width on scroll) */}
            <Animated.View style={[styles.searchPillWrapper, searchPillAnimatedStyle]}>
              <Pressable
                style={({ pressed }) => [
                  styles.searchTriggerPill,
                  pressed && styles.searchTriggerPillPressed,
                ]}
                onPress={() => setIsSearching(true)}
              >
                <Search
                  size={15}
                  color="#71717a"
                  strokeWidth={1.8}
                  style={styles.searchIcon}
                />
                <Text style={styles.searchText}>Search products, styles...</Text>
              </Pressable>
            </Animated.View>

            {/* Right: Borderless Action Buttons */}
            <Animated.View style={[styles.actions, hideActionsStyle]}>
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.iconButtonPressed,
                ]}
                onPress={() => router.push("/wishlist" as any)}
                hitSlop={6}
              >
                <Heart size={20} color="#18181b" strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.iconButtonPressed,
                ]}
                onPress={() => router.push("/cart" as any)}
                hitSlop={6}
              >
                <ShoppingBag size={20} color="#18181b" strokeWidth={1.8} />
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
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
  },
  logoContainer: {
    justifyContent: "center",
    height: "100%",
  },
  logo: {
    width: 86,
    height: 24,
  },
  searchPillWrapper: {
    flex: 1,
    height: 38,
  },
  searchTriggerPill: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f4f4f5",
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchTriggerPillPressed: {
    backgroundColor: "#e4e4e7",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#71717a",
    letterSpacing: -0.1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: "100%",
    justifyContent: "flex-end",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.94 }],
  },
  badge: {
    position: "absolute",
    top: 1,
    right: 1,
    backgroundColor: "#18181b",
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
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
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
});