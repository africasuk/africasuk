import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Sparkles } from "lucide-react-native";

export default function RequestProductSection() {
  const router = useRouter();

  const pulse = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse, float]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.25],
  });

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  return (
    <View style={styles.container}>

      {/* Animated background */}
      <LinearGradient
        colors={["#001a0d", "#00351c", "#005c32", "#002414"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.glowSmall,
          {
            transform: [{ translateY }],
          },
        ]}
      />

      {/* Decorative circles */}
      <View style={styles.circleOne} />
      <View style={styles.circleTwo} />
      <View style={styles.circleThree} />

      {/* Content */}
      <View style={styles.contentContainer}>

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Sparkles size={13} color="#6ee7b7" />

          <View style={styles.badgeInner}>
            <Text style={styles.badgeText}>
              CAN&apos;T FIND IT?
            </Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Can&apos;t Find What You Need?
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Snap a photo or share a description. Our sourcing specialists will
          locate and list it for you.
        </Text>

        {/* CTA */}
        <Pressable
          onPress={() => router.push("/request-product" as Href)}
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={["#002b15", "#065f46", "#10b981"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Camera size={17} color="#6ee7b7" strokeWidth={2.2} />

            <Text style={styles.buttonText}>
              Request Custom Product
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: 360,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(39, 39, 42, 0.6)",
  },

  /* Animated background glow */
  glow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#10b981",
    top: -120,
    right: -80,
  },

  glowSmall: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#34d399",
    bottom: -100,
    left: -70,
    opacity: 0.12,
  },

  circleOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(110,231,183,0.12)",
    top: 20,
    left: -80,
  },

  circleTwo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "rgba(110,231,183,0.08)",
    bottom: -180,
    right: -100,
  },

  circleThree: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    top: 40,
    right: 20,
  },

  contentContainer: {
    zIndex: 10,
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeInner: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.8,
  },

  headline: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 28,
    textShadowColor: "rgba(0,0,0,0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "400",
    color: "#f4f4f5",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },

  buttonWrapper: {
    marginTop: 20,
    width: "100%",
    maxWidth: 280,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.4)",
  },

  buttonGradient: {
    height: 46,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});