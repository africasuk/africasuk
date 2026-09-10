import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Heart } from "lucide-react-native";
import type { WishlistItem } from "@africasuk/types";

import { useWishlist } from "../../store/wishlist";

interface Props {
  item: WishlistItem;
  style?: StyleProp<ViewStyle>;
}

export function WishlistButton({ item, style }: Props) {
  const toggleItem = useWishlist((state) => state.toggleItem);
  const active = useWishlist((state) => state.isWishlisted(item.variantId));

  return (
    <Pressable
      onPress={() => toggleItem(item)}
      accessibilityLabel={active ? "Remove from wishlist" : "Add to wishlist"}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        active ? styles.activeButton : styles.inactiveButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Heart
        size={20}
        color={active ? "#e11d48" : "#374151"}
        fill={active ? "#e11d48" : "transparent"}
        strokeWidth={2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    width: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  inactiveButton: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  activeButton: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});