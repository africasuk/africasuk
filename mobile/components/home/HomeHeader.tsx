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

import SearchBar from "@/components/layout/header/SearchBar";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";

const BADGE_RED = "#ef4444";

export default function HomeHeader() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  // Live counts directly from your Zustand stores
  const wishlistCount = useWishlist((state) => state.items.length);
  const cartCount = useCart((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Full-width Search Mode */}
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
            {/* Left: Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            {/* Center: Search Trigger Pill */}
            <Pressable
              style={styles.searchTriggerPill}
              onPress={() => setIsSearching(true)}
            >
              <Search size={16} color="#6b7280" style={styles.searchIcon} />
              <Text style={styles.searchText}>Search...</Text>
            </Pressable>

            {/* Right Actions: Real Wishlist & Cart Badges */}
            <View style={styles.actions}>
              {/* Wishlist Button */}
              <Pressable
                style={styles.iconButton}
                onPress={() => router.push("/wishlist" as any)}
              >
                <Heart size={20} color="#111827" />
                {wishlistCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Cart Button */}
              <Pressable
                style={styles.iconButton}
                onPress={() => router.push("/cart" as any)}
              >
                <ShoppingCart size={20} color="#111827" />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? "99+" : cartCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
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
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    gap: 10,
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
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchText: {
    fontSize: 13,
    fontWeight: "500",
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
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: BADGE_RED,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
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