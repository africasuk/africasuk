import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Image } from "expo-image";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  // Logo animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoTranslateY = useRef(new Animated.Value(50)).current;

  // Subtle logo breathing animation
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo enters from bottom + fades in + expands
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle continuous breathing effect
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [logoOpacity, logoScale, logoTranslateY, pulse]);

  // Loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((current) =>
        current.length >= 3 ? "" : current + "."
      );
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>

      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              { translateY: logoTranslateY },
              { scale: logoScale },
              { scale: pulse },
            ],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>

      {/* Loading text */}
      <Animated.Text
        style={[
          styles.loadingText,
          {
            opacity: logoOpacity,
          },
        ]}
      >
        Loading{dots}
      </Animated.Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 260,
    height: 260,
  },

  loadingText: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
    color: "#024F25",
    letterSpacing: 1,
  },
});