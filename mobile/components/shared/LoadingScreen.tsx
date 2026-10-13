import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Refined Light E-commerce Palette
const PURE_WHITE = "#ffffff";
const OFF_WHITE = "#fbfdfc";
const ACCENT_MINT = "#f0f8f4";
const DEEP_EMERALD = "#054225";
const SHARP_GREEN = "#0e8a45";
const WARM_GOLD = "#d49b14";
const SUBTLE_SLATE = "#5f7568";

export default function LoadingScreen() {
  // Entrance Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  // Infinite 360° Circular Spinning Animation
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Ambient gentle floating glow animation
  const orbFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Infinite Continuous Circular Rotation (Unpredictable Spinner)
    const spinnerLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinnerLoop.start();

    // 3. Subtle floating background ambient orb
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(orbFloat, {
          toValue: 12,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orbFloat, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    return () => {
      spinnerLoop.stop();
      floatLoop.stop();
    };
  }, );

  // Map 0 -> 1 into degrees for 360° rotation
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Pristine Clean Background */}
      <LinearGradient
        colors={[PURE_WHITE, OFF_WHITE, ACCENT_MINT]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Subtle Ambient Corner Glows (Organic light, no borders) */}
      <Animated.View
        style={[
          styles.topOrb,
          {
            transform: [{ translateY: orbFloat }],
          },
        ]}
      />
      <View style={styles.bottomOrb} />

      <SafeAreaView style={styles.safeContainer}>
        {/* Top spacer for balanced vertical optical weight */}
        <View style={styles.headerSpacer} />

        {/* Central Brand Identity */}
        <Animated.View
          style={[
            styles.mainCenter,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo completely transparent & borderless */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Typography - Strict 1 line */}
          <View style={styles.textStack}>
            <Text
              style={styles.brandTitle}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.8}
            >
              Africa Suk
            </Text>

            <View style={styles.taglineWrapper}>
              <View style={styles.taglineLine} />
              <Text style={styles.tagline}>SHOP WITH CONFIDENCE</Text>
              <View style={styles.taglineLine} />
            </View>

            <Text style={styles.description}>
              Making shopping easier in South Sudan
            </Text>
          </View>
        </Animated.View>

        {/* Bottom Loading Progress & Footer */}
        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
          {/* Natural Unpredictable Circular Spinner */}
          <View style={styles.spinnerWrapper}>
            <Animated.View
              style={[
                styles.spinnerRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              {/* This draws a rotating custom arc track using borders */}
              <View style={styles.spinnerArc} />
            </Animated.View>
          </View>

          <Text style={styles.loadingStatus}>Preparing your shopping experience...</Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerBrand}>AfricaSuk</Text>
            <Text style={styles.footerBullet}>•</Text>
            <Text style={styles.footerRegion}>South Sudan</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURE_WHITE,
  },
  safeContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSpacer: {
    height: 30,
  },

  /* Ambient Blur Orbs for visual richness */
  topOrb: {
    position: "absolute",
    top: -60,
    right: -40,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: "rgba(212, 155, 20, 0.05)",
  },
  bottomOrb: {
    position: "absolute",
    bottom: -80,
    left: -50,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: "rgba(14, 138, 69, 0.05)",
  },

  /* Center Stage */
  mainCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 104,
    height: 104,
  },

  /* Typography Stack */
  textStack: {
    alignItems: "center",
    width: "100%",
  },
  brandTitle: {
    color: DEEP_EMERALD,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    includeFontPadding: false,
    width: "100%",
  },
  taglineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  taglineLine: {
    width: 24,
    height: 1,
    backgroundColor: "rgba(212, 155, 20, 0.35)",
  },
  tagline: {
    color: WARM_GOLD,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.2,
    textAlign: "center",
  },
  description: {
    marginTop: 12,
    color: SUBTLE_SLATE,
    fontSize: 13.5,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 19,
  },

  /* Unpredictable Circular Spinner Section */
  bottomSection: {
    width: "100%",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 18 : 28,
    paddingHorizontal: 36,
  },
  spinnerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  spinnerRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerArc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3.5,
    borderColor: "rgba(14, 138, 69, 0.12)", // Transparent light Green track
    borderTopColor: SHARP_GREEN,           // Primary Green forward sweep
    borderRightColor: WARM_GOLD,           // Gold trailing arc edge
  },
  loadingStatus: {
    color: "#6d8677",
    fontSize: 11.5,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 20,
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerBrand: {
    color: "#97ada1",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  footerBullet: {
    color: "#b9cbbf",
    fontSize: 9,
  },
  footerRegion: {
    color: "#97ada1",
    fontSize: 11,
    fontWeight: "500",
  },
});