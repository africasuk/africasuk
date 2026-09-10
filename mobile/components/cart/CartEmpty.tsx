import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

export default function CartEmpty() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Icon Frame */}
      <View style={styles.iconWrapper}>
        <ShoppingBag size={24} color="#71717a" strokeWidth={1.75} />
      </View>

      {/* Typography */}
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subtitle}>
        Start exploring our collections and discover items curated for you.
      </Text>

      {/* CTA Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/products" as never)}
      >
        <Text style={styles.buttonText}>Explore Collections</Text>
        <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 44,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
    maxWidth: 260,
  },

  button: {
    marginTop: 20,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});