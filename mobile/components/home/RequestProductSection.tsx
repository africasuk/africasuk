import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Sparkles, ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function RequestProductSection() {
  const router = useRouter();

  // Subtle ambient animations (slower, smoother)
  const breath = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [breath, float]);

  const glowOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  const glowScale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const cardTranslateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <View style={styles.container}>
      {/* Deep dark background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgDark} />
      </View>

      {/* Ambient background glows */}
      <Animated.View
        style={[
          styles.ambientGlow,
          styles.glowTopRight,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.ambientGlow,
          styles.glowBottomLeft,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />

      {/* Floating Glass Card */}
      <Animated.View
        style={[
          styles.glassCard,
          { transform: [{ translateY: cardTranslateY }] },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.01)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Premium Pill Badge */}
        <View style={styles.badge}>
          <Sparkles size={12} color="#34d399" />
          <Text style={styles.badgeText}>CAN&apos;T FIND IT?</Text>
        </View>

        <Text style={styles.title}>Let us source it for you.</Text>
        
        <Text style={styles.subtitle}>
          Upload a photo or drop a brief description. Our procurement experts 
          will locate exactly what you need.
        </Text>

        <Pressable
          onPress={() => router.push("/request-product" as Href)}
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={["#059669", "#10b981"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Camera size={18} color="#ffffff" strokeWidth={2.5} />
            <Text style={styles.buttonText}>Request Custom Product</Text>
            <View style={styles.buttonIconSpacer} />
            <ArrowRight size={16} color="#ffffff" style={styles.buttonArrow} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09090b", // Deep zinc background
  },
  bgDark: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  ambientGlow: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#10b981",
    filter: [{ blur: 60 }], // Works on newer React Native versions, fallback to opacity below
  },
  glowTopRight: {
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: "#059669",
  },
  glowBottomLeft: {
    bottom: -width * 0.2,
    left: -width * 0.2,
    backgroundColor: "#0ea5e9",
  },
  glassCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    backgroundColor: "rgba(24, 24, 27, 0.65)", // Glass effect base
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 28,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
    marginBottom: 20,
  },
  badgeText: {
    color: "#34d399",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    width: "100%",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 999,
    gap: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonIconSpacer: {
    flex: 1,
    maxWidth: 8,
  },
  buttonArrow: {
    opacity: 0.8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});