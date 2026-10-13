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
import {
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
  SharedValue,
} from "react-native-reanimated";

import SearchBar from "@/components/layout/header/SearchBar";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
}

export default function HomeHeader({
  scrollY,
}: HomeHeaderProps) {
  const router = useRouter();

  const [isSearching, setIsSearching] =
    useState(false);

  const wishlistCount = useWishlist(
    (state) => state.items.length,
  );

  const cartCount = useCart((state) =>
    state.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    ),
  );

  /*
   * Header background:
   *
   * At top:
   * transparent so the Hero remains visible.
   *
   * On scroll:
   * becomes white.
   */
  const headerAnimatedStyle =
    useAnimatedStyle(() => {
      const backgroundColor =
        interpolateColor(
          scrollY.value,
          [0, 40],
          [
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.98)",
          ],
        );

      const borderBottomColor =
        interpolateColor(
          scrollY.value,
          [0, 40],
          [
            "rgba(255,255,255,0)",
            "rgba(229,231,235,1)",
          ],
        );

      return {
        backgroundColor,
        borderBottomColor,
      };
    });

  /*
   * Logo fades away as the header becomes
   * the full-width sticky search.
   */
  const hideLogoStyle =
    useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 55],
        [1, 0],
        Extrapolation.CLAMP,
      );

      const width = interpolate(
        scrollY.value,
        [0, 55],
        [86, 0],
        Extrapolation.CLAMP,
      );

      const marginRight = interpolate(
        scrollY.value,
        [0, 55],
        [10, 0],
        Extrapolation.CLAMP,
      );

      return {
        opacity,
        width,
        marginRight,
        overflow: "hidden",
      };
    });

  /*
   * Wishlist and cart fade away when scrolling.
   */
  const hideActionsStyle =
    useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollY.value,
        [0, 55],
        [1, 0],
        Extrapolation.CLAMP,
      );

      const width = interpolate(
        scrollY.value,
        [0, 55],
        [76, 0],
        Extrapolation.CLAMP,
      );

      const marginLeft = interpolate(
        scrollY.value,
        [0, 55],
        [10, 0],
        Extrapolation.CLAMP,
      );

      return {
        opacity,
        width,
        marginLeft,
        overflow: "hidden",
      };
    });

  /*
   * Search pill:
   *
   * Stays white so it matches the clean UI.
   * Only grows slightly while scrolling.
   */
  const searchPillAnimatedStyle =
    useAnimatedStyle(() => {
      const height = interpolate(
        scrollY.value,
        [0, 40],
        [38, 42],
        Extrapolation.CLAMP,
      );

      const borderColor =
        interpolateColor(
          scrollY.value,
          [0, 40],
          [
            "rgba(255,255,255,0.95)",
            "#e5e7eb",
          ],
        );

      const backgroundColor =
        interpolateColor(
          scrollY.value,
          [0, 40],
          [
            "rgba(255,255,255,0.97)",
            "#ffffff",
          ],
        );

      return {
        height,
        borderColor,
        backgroundColor,
      };
    });

  return (
    <Animated.View
      style={[
        styles.container,
        headerAnimatedStyle,
      ]}
    >
      <View style={styles.row}>
        {isSearching ? (
          /*
           * Expanded search mode
           */
          <View
            style={
              styles.expandedSearchWrapper
            }
          >
            <View
              style={styles.searchFlex}
            >
              <SearchBar
                placeholder="Search products, brands, styles..."
              />
            </View>

            <TouchableOpacity
              onPress={() =>
                setIsSearching(false)
              }
              style={styles.closeButton}
              hitSlop={{
                top: 8,
                bottom: 8,
                left: 8,
                right: 8,
              }}
            >
              <X
                size={18}
                color="#18181b"
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/*
             * Logo
             */}
            <Animated.View
              style={[
                styles.logoContainer,
                hideLogoStyle,
              ]}
            >
              <Image
                source={require(
                  "@/assets/images/logo.png",
                )}
                style={styles.logo}
                contentFit="contain"
                transition={150}
              />
            </Animated.View>

            {/*
             * Search
             */}
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
                onPress={() =>
                  setIsSearching(true)
                }
              >
                <Search
                  size={15}
                  color="#71717a"
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

            {/*
             * Wishlist + Cart
             */}
            <Animated.View
              style={[
                styles.actions,
                hideActionsStyle,
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed &&
                    styles.iconButtonPressed,
                ]}
                onPress={() =>
                  router.push(
                    "/wishlist" as any,
                  )
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
                    <Text
                      style={styles.badgeText}
                    >
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed &&
                    styles.iconButtonPressed,
                ]}
                onPress={() =>
                  router.push(
                    "/cart" as any,
                  )
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
                    <Text
                      style={styles.badgeText}
                    >
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
  /*
   * Header starts at the very top.
   *
   * The search keeps the same visual position
   * as before:
   *
   * Previous:
   * top: 50
   * paddingTop: 10
   *
   * Total: 60
   *
   * Now:
   * top: 0
   * paddingTop: 60
   *
   * Total: 60
   */
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
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
  },

  /*
   * Logo
   */
  logoContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    width: 86,
    height: 24,
  },

  /*
   * Search
   */
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

    /*
     * Clean white search pill.
     */
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",

    /*
     * Very soft shadow.
     */
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

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  searchIcon: {
    marginRight: 8,
  },

  searchText: {
    flex: 1,

    fontSize: 13,
    fontWeight: "400",

    color: "#71717a",

    letterSpacing: -0.1,
  },

  /*
   * Right actions
   */
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

    /*
     * Dark translucent circle works
     * over both light and dark hero images.
     */
    backgroundColor:
      "rgba(0,0,0,0.42)",

    justifyContent: "center",
    alignItems: "center",

    position: "relative",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.35)",

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

    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  /*
   * Badge
   */
  badge: {
    position: "absolute",

    top: -2,
    right: -2,

    minWidth: 15,
    height: 15,

    paddingHorizontal: 3,

    borderRadius: 7.5,

    backgroundColor: "#005c2e",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1.5,
    borderColor: "#ffffff",
  },

  badgeText: {
    color: "#ffffff",

    fontSize: 9,
    fontWeight: "700",

    lineHeight: 11,
  },

  /*
   * Expanded search
   */
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

    backgroundColor:
      "rgba(255,255,255,0.96)",

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