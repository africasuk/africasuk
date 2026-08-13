import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ShoppingCart } from "lucide-react-native";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export default function CartEmpty() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Icon Frame - Sharp Borders */}
      <View style={styles.iconWrapper}>
        <ShoppingCart size={32} color="#9ca3af" />
      </View>

      {/* Typography - Clean & Unbolded */}
      <Text style={styles.title}>Your cart is empty</Text>

      <Text style={styles.subtitle}>
        Start shopping and explore our collections to add your favorite items.
      </Text>

      {/* Button - Sharp Corners */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 260,
  },
  button: {
    marginTop: 20,
    backgroundColor: BRAND,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0, // Sharp corners
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500", // Clean regular weight
    letterSpacing: 0.3,
  },
});