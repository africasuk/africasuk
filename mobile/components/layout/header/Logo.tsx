import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const BRAND_NAME = "AfricaSuk";
const LOGO_ALT = "AfricaSuk Logo";

interface LogoProps {
  invert?: boolean;
}

export default function Logo({ invert = false }: LogoProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  // Animated value for underline scale (0 -> 1)
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Toggle active state on timer (5s active, 3s inactive)
  useEffect(() => {
    const delay = isActive ? 5000 : 3000;

    const timeoutId = setTimeout(() => {
      setIsActive((prev) => !prev);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  // Animate underline using native driver for 60fps GPU acceleration
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isActive ? 1 : 0,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [isActive, scaleAnim]);

  const primaryColor = invert ? "#ffffff" : "#18181b";

  return (
    <Pressable
      onPress={() => router.push("/")}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      accessibilityLabel={LOGO_ALT}
      accessibilityRole="button"
      hitSlop={8}
    >
      {/* Brand Icon Frame */}
      <View
        style={[
          styles.imageWrapper,
          invert && styles.imageWrapperInvert,
        ]}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logoImage}
          contentFit="contain"
          transition={150}
          accessibilityLabel={LOGO_ALT}
        />
      </View>

      {/* Brand Wordmark & Underline */}
      <View style={styles.textContainer}>
        <Text style={[styles.brandText, { color: primaryColor }]}>
          {BRAND_NAME}
        </Text>

        <Animated.View
          style={[
            styles.underline,
            {
              backgroundColor: primaryColor,
              transform: [{ scaleX: scaleAnim }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  containerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  imageWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  imageWrapperInvert: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    position: "relative",
    paddingBottom: 3,
  },

  brandText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1.5,
    borderRadius: 1,
    transformOrigin: "left",
  },
});