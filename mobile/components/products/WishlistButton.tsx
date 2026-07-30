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
      style={({ pressed }) => [
        styles.button,
        active ? styles.activeButton : styles.inactiveButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Heart
        size={18}
        color={active ? "#f43f5e" : "#6b7280"}
        fill={active ? "#f43f5e" : "transparent"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});