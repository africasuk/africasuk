import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

const BRAND_DARK = "#00361a";
const BRAND_EMERALD = "#005c2e";
const FLAG_BLUE = "#0072CE";
const FLAG_RED = "#D8232A";
const FLAG_GOLD = "#FCD116";

export default function SouthSudanCtaButton() {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    router.push("/products" as never);
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Shop Now"
        style={({ pressed }) => [
          styles.buttonWrapper,
          pressed && styles.pressedState,
        ]}
        onPress={handlePress}
      >
        {/* Base Gradient: Deep Brand Emerald */}
        <LinearGradient
          colors={[BRAND_DARK, BRAND_EMERALD]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Ambient Right-Side Flag Ribbon Overlay */}
        <View style={styles.flagRibbonContainer}>
          {/* Subtle diagonal flag color strips */}
          <View style={styles.flagStripes}>
            <View style={[styles.stripe, { backgroundColor: "#111111" }]} />
            <View style={[styles.whiteSpacer]} />
            <View style={[styles.stripe, { backgroundColor: FLAG_RED }]} />
            <View style={[styles.whiteSpacer]} />
            <View style={[styles.stripe, { backgroundColor: "#007A3D" }]} />
          </View>

          {/* South Sudan Blue Triangle with Gold Star */}
          <View style={styles.triangleStage}>
            <View style={styles.triangle} />
            <Text style={styles.goldStar}>★</Text>
          </View>

          {/* Fade mask to blend flag smoothly into green brand background */}
          <LinearGradient
            colors={[BRAND_DARK, "rgba(0, 54, 26, 0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        {/* Front Content */}
        <View style={styles.contentRow}>
          <View style={styles.textGroup}>
            <Text style={styles.title}>Shop Now</Text>
            <Text style={styles.subtitle}>
              Find what you need in South Sudan
            </Text>
          </View>

          <View style={styles.iconCircle}>
            <ArrowRight size={17} color="#ffffff" strokeWidth={2.6} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  buttonWrapper: {
    width: "100%",
    height: 72,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: BRAND_DARK,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  flagRibbonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "55%",
    overflow: "hidden",
  },
  flagStripes: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    opacity: 0.45,
  },
  stripe: {
    flex: 1,
  },
  whiteSpacer: {
    height: 2,
    backgroundColor: "#ffffff",
  },
  triangleStage: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderTopWidth: 36,
    borderBottomWidth: 36,
    borderLeftWidth: 44,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: FLAG_BLUE,
    opacity: 0.85,
  },
  goldStar: {
    position: "absolute",
    left: 4,
    color: FLAG_GOLD,
    fontSize: 16,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  textGroup: {
    maxWidth: "75%",
  },
  title: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: 3,
    letterSpacing: 0.1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressedState: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});