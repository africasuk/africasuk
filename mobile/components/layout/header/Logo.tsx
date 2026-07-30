import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "@/components/providers/LanguageProvider";



interface LogoProps {
  invert?: boolean;
}

export default function Logo({ invert = false }: LogoProps) {
  const router = useRouter();
  const { dictionary } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  // Animated value for smoothly animating the underline width (0 -> 100%)
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Toggle active state on timer (5s active, 3s inactive)
  useEffect(() => {
    const delay = isActive ? 5000 : 3000;

    const timeoutId = setTimeout(() => {
      setIsActive((prev) => !prev);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  // Animate the underline whenever isActive changes
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isActive ? 1 : 0,
      duration: 1000,
      useNativeDriver: false, // Layout property (width) requires false
    }).start();
  }, [isActive, widthAnim]);

  // Interpolate animated value to percentage string
  const underlineWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const primaryColor = invert ? "#ffffff" : "#004d26";

  return (
    <Pressable
      onPress={() => router.push("/")}
      style={styles.container}
      accessibilityLabel={dictionary.common.logoAlt}
      accessibilityRole="button"
    >
      {/* Brand Icon */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel={dictionary.common.logoAlt}
        />
      </View>

      {/* Brand Text & Animated Underline */}
      <View style={styles.textContainer}>
        <Text style={[styles.brandText, { color: primaryColor }]}>
          {dictionary.common.brandName}
        </Text>

        {/* Animated Underline */}
        <Animated.View
          style={[
            styles.underline,
            {
              backgroundColor: primaryColor,
              width: underlineWidth,
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
    gap: 12,
  },
  imageWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "relative",
    paddingBottom: 4,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  underline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 2,
  },
});