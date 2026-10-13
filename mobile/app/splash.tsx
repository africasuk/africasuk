import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

const DARK_GREEN = "#003b1d";
const BRAND_GREEN = "#005c2e";
const BRIGHT_GREEN = "#20c95c";
const YELLOW = "#d4a017";

export default function SplashPage() {
  const router = useRouter();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.65)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;

  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    let mounted = true;

    const startSplash = async () => {
      /*
       * Hide the native Android/Expo splash.
       * This allows this professional React Native splash
       * to become visible.
       */
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Unable to hide native splash:", error);
      }

      /*
       * Professional entrance animation.
       */
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.spring(logoScale, {
            toValue: 1,
            friction: 5,
            tension: 55,
            useNativeDriver: true,
          }),

          Animated.timing(glowScale, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(brandOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),

          Animated.timing(brandY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      /*
       * IMPORTANT:
       *
       * For now we wait for the splash animation to finish.
       *
       * Later this should be connected directly to:
       * - Hero
       * - Categories
       * - Products
       * - Brands
       *
       * so Home only opens when everything is ready.
       */
      const timer = setTimeout(() => {
        if (!mounted) return;

        router.replace("/(tabs)");
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
    };

    startSplash();

    return () => {
      mounted = false;
    };
  }, [
    router,
    logoOpacity,
    logoScale,
    brandOpacity,
    brandY,
    loadingOpacity,
    glowScale,
  ]);

  return (
    <View style={styles.container}>
      {/* Main green gradient */}
      <LinearGradient
        colors={[
          DARK_GREEN,
          BRAND_GREEN,
          "#08783d",
          BRIGHT_GREEN,
        ]}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Soft green glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [
              {
                scale: glowScale,
              },
            ],
          },
        ]}
      />

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <View style={styles.logoGlow} />

          <View style={styles.logoCircle}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Brand */}
        <Animated.View
          style={[
            styles.brandSection,
            {
              opacity: brandOpacity,
              transform: [
                {
                  translateY: brandY,
                },
              ],
            },
          ]}
        >
          <Text style={styles.brand}>
            Africa Suk
          </Text>

          <Text style={styles.tagline}>
            SHOP WITH CONFIDENCE
          </Text>

          <Text style={styles.description}>
            Making shopping easier in South Sudan
          </Text>
        </Animated.View>

        {/* Loading */}
        <Animated.View
          style={[
            styles.loadingSection,
            {
              opacity: loadingOpacity,
            },
          ]}
        >
          <View style={styles.dots}>
            <View style={styles.dot} />

            <View
              style={[
                styles.dot,
                styles.yellowDot,
              ]}
            />

            <View style={styles.dot} />
          </View>

          <Text style={styles.loadingText}>
            Preparing your shopping experience
          </Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        AfricaSuk
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_GREEN,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#20c95c",
    opacity: 0.16,
    top: "25%",
  },

  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  logoSection: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: "rgba(32,201,92,0.20)",
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 10,
  },

  logo: {
    width: 92,
    height: 92,
  },

  brandSection: {
    alignItems: "center",
    marginTop: 28,
  },

  brand: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  tagline: {
    marginTop: 7,
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2.4,
  },

  description: {
    marginTop: 15,
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
  },

  loadingSection: {
    alignItems: "center",
    marginTop: 45,
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },

  yellowDot: {
    backgroundColor: YELLOW,
  },

  loadingText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.65)",
    fontSize: 10,
    fontWeight: "500",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});