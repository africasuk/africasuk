import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
} from "lucide-react-native";

const BRAND = "#004d26";

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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#111827" />
            </Pressable>
          ) : showLogo ? (
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          ) : null}
        </View>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.right}>
          {showWishlist && (
            <Pressable style={styles.iconButton}>
              <Heart size={21} color="#ef4444" fill="#ef4444" />
            </Pressable>
          )}

          {showCart && (
            <Pressable style={styles.iconButton}>
              <ShoppingCart size={21} color="#111827" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  left: {
    width: 90,
    justifyContent: "center",
  },

  right: {
    width: 90,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  logo: {
    width: 120,
    height: 34,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: BRAND,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});