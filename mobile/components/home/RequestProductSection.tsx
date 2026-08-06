import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, Camera } from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RequestProductSection() {
  const router = Router();

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

      {/* Video Overlays for Contrast & Depth */}
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
        {/* Sourcing Glass Badge */}
        <View style={styles.badgeContainer}>
          <Sparkles size={14} color="#6ee7b7" />
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

        {/* CTA Gradient Button */}
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
            <Camera size={18} color="#6ee7b7" strokeWidth={2.5} />
            <Text style={styles.buttonText}>Request Custom Product</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function Router() {
  return useRouter();
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    minHeight: SCREEN_HEIGHT * 0.85,
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
    transform: [{ scale: 1.05 }],
  },

  /* Overlays for readability */
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

  /* Badge Styles */
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeInner: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  /* Headline */
  headline: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: -0.5,
    /* Text Shadow Effect */
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },

  /* Subtitle */
  subtitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#f4f4f5", // text-zinc-100
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    /* Text Shadow Effect */
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },

  /* CTA Button Styles */
  buttonWrapper: {
    marginTop: 32,
    width: "100%",
    maxWidth: 320,
    borderRadius: 9999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.4)", // border-emerald-400/40
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    height: 54,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});