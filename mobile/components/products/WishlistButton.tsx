import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Heart } from "lucide-react-native";
import type { WishlistItem } from "@africasuk/types";

import { useWishlist } from "../../store/wishlist";

interface Props {
  item: WishlistItem;
  size?: "xs" | "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
}

export function WishlistButton({ item, size = "xs", style }: Props) {
  const toggleItem = useWishlist((state) => state.toggleItem);
  const active = useWishlist((state) => state.isWishlisted(item.variantId));

  const iconSizes = {
    xs: 13,
    sm: 15,
    md: 17,
    lg: 20,
  };

  return (
    <Pressable
      onPress={() => toggleItem(item)}
      accessibilityLabel={active ? "Remove from wishlist" : "Add to wishlist"}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        active ? styles.activeButton : styles.inactiveButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Heart
        size={iconSizes[size]}
        color={active ? "#e11d48" : "#4b5563"}
        fill={active ? "#e11d48" : "transparent"}
        strokeWidth={2.2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  xs: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sm: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  md: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  lg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
});