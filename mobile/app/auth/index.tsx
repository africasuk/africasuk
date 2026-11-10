
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

import LoadingSplash from "@/components/common/LoadingSplash";

export default function AuthWelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSplash />;

  return (
    <View style={styles.container}>
      {/* Brand */}
      <View style={styles.brand}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>AFRICA SUK</Text>
        <Text style={styles.tagline}>SHOP WITH CONFIDENCE</Text>
      </View>

      {/* Main UI artwork */}
      <View
        style={[
          styles.imageContainer,
          {
            height: Math.min(height * 0.48, width * 1.05, 440),
          },
        ]}
      >
        <Image
          source={require("@/assets/ui.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Welcome text */}
      <View style={styles.welcome}>
        <Text style={styles.title}>Shop with Confidence</Text>

        <Text style={styles.subtitle}>
          Everything you need, all in one place.
        </Text>
      </View>

      {/* Authentication buttons */}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/auth/login")}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/auth/signup")}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>
            Create Account
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Your trusted shopping destination.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#006341",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },

  brand: {
    alignItems: "center",
    gap: 3,
  },

  logo: {
    width: 48,
    height: 48,
    tintColor: "#ffffff",
  },

  brandName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 2,
  },

  tagline: {
    color: "#e8c95c",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
  },

  imageContainer: {
    width: "100%",
    maxWidth: 430,
    alignItems: "center",
    justifyContent: "center",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  welcome: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.6,
  },

  subtitle: {
    color: "#d8eee2",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },

actions: {
  width: "100%",
  maxWidth: 430,
  gap: 12,
  marginBottom: 50,
},

  primaryButton: {
    height: 54,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#005c2e",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryButton: {
    height: 54,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  footer: {
    color: "#c8e5d5",
    fontSize: 10,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
