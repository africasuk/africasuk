import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Heart, ShoppingBag } from "lucide-react-native";

const BRAND_COLOR = "#005c2e";
const BRAND_DARK = "#002b15";

export default function WishlistEmpty() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Heart size={32} color="#9ca3af" />
      </View>

      <Text style={styles.title}>Your wishlist is empty</Text>
      <Text style={styles.subtitle}>
        Save products you love for later.
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => router.push("/(tabs)")}
      >
        <ShoppingBag size={18} color="#ffffff" />
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingVertical: 48,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_DARK,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9999,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
});