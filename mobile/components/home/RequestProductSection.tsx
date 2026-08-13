import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Search } from "lucide-react-native";

export default function RequestProductSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={{
          uri: "https://gzfhrrnvstoeoaxdsbxc.supabase.co/storage/v1/object/public/videos/Video%20Project%2012.mp4",
        }}
        style={styles.videoBackground}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        useNativeControls={false}
      />

      {/* Video Overlays for Contrast & Depth (Colors Retained) */}
      <View style={styles.flatOverlay} />
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.8)",
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.6)",
        ]}
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />

      {/* Hero Content Container */}
      <View style={styles.contentContainer}>
        {/* Sourcing Glass Badge - Retained Colors + Sharp Borders */}
       <View style={styles.badgeContainer}>
          <Search size={12} color="#6ee7b7" />
          <View style={styles.badgeInner}>
            <Text style={styles.badgeText}>CAN&apos;T FIND IT?</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Can&apos;t Find What You Need?</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Snap a photo or share a description. Our sourcing specialists will
          locate and list it for you.
        </Text>

        {/* CTA Gradient Button - Retained Original Colors + Sharp Borders */}
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
            <Camera size={16} color="#6ee7b7" strokeWidth={2} />
            <Text style={styles.buttonText}>Request Custom Product</Text>
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
    borderColor: "rgba(39, 39, 42, 0.6)", // border-zinc-800/60
  },

  /* Video Layer */
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  /* Overlays for readability (Retained) */
  flatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Content Alignment */
  contentContainer: {
    zIndex: 10,
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  /* Badge Styles (Original Colors + Sharp Corners) */
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeInner: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500", // Unbolded clean weight
    letterSpacing: 0.8,
  },

  /* Headline */
  headline: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "500", // Unbolded clean weight
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.2,
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  /* Subtitle */
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "400",
    color: "#f4f4f5", // text-zinc-100
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  /* CTA Button Styles (Original Colors + Sharp Corners) */
  buttonWrapper: {
    marginTop: 20,
    width: "100%",
    maxWidth: 280,
    borderRadius: 0, // Sharp corners
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.4)", // border-emerald-400/40
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
    fontWeight: "500", // Unbolded clean weight
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});