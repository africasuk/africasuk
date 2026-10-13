import React, { useEffect, useState } from "react";

import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Home } from "lucide-react-native";

import LoadingSplash from "@/components/common/LoadingSplash";

export default function AuthWelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*
     * Auth page does not require a fixed splash timer.
     * This only represents the initial auth-section loading.
     *
     * Once your auth/session provider is ready, replace this
     * with that real loading state.
     */
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSplash />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,92,46,0.55)",
            "rgba(0,92,46,0.45)",
            "rgba(0,92,46,0.38)",
            "rgba(0,92,46,0.62)",
            "rgba(0,92,46,0.97)",
          ]}
          locations={[0, 0.2, 0.42, 0.68, 1]}
          style={styles.overlay}
        />

        <View style={styles.content}>
          {/* Top Brand */}
          <View style={styles.brand}>
            <Text style={styles.brandText}>
              AFRICA SUK
            </Text>

            <Text style={styles.tagline}>
              SHOP WITH CONFIDENCE
            </Text>
          </View>

          {/* Center Content */}
          <View style={styles.centerContent}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign In"
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.primaryButtonText}>
                Sign In
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create Account"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/auth/signup")}
            >
              <Text style={styles.secondaryButtonText}>
                Create Account
              </Text>
            </Pressable>

            <View style={styles.bottomContent}>
              <Text style={styles.title}>
                Shop with Confidence
              </Text>

              <Text style={styles.subtitle}>
                Everything you need, made easier to find.
              </Text>
            </View>
          </View>

          {/* Bottom Logo + Home */}
          <View style={styles.bottomSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.homeButtonContainer}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to Home"
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.replace("/")}
              >
                <Home
                  size={17}
                  color="#ffffff"
                  strokeWidth={2.2}
                />

                <Text style={styles.homeButtonText}>
                  Back to Home
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005c2e",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 28,
    justifyContent: "space-between",
  },

  /* Brand */

  brand: {
    alignItems: "center",
  },

  brandText: {
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 5,
  },

  tagline: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#f5c542",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  /* Center */

  centerContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },

  /* Buttons */

  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",

    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#005c2e",
  },

  secondaryButton: {
    width: "100%",
    height: 54,
    marginTop: 12,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },

  /* Welcome */

  bottomContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 26,
  },

  title: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.65)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  /* Bottom */

  bottomSection: {
    width: "100%",
    alignItems: "center",
  },

  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 125,
    height: 55,
  },

  homeButtonContainer: {
    alignItems: "center",
    marginTop: 8,
  },

  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  homeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});