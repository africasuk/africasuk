import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { Camera, ArrowRight } from "lucide-react-native";

export default function RequestProductSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {/* Top Kicker */}
        <Text style={styles.kicker}>Can&apos;t Find What You Need?</Text>

        {/* Headline with Brand Green Highlight */}
        <Text style={styles.heading}>
          Can&apos;t find it?{"\n"}
          <Text style={styles.headingGreen}>Just ask us.</Text>
        </Text>

        {/* Content Row: Description and Watermark Logo */}
        <View style={styles.middleRow}>
          <Text style={styles.description}>
            Take a photo of the product or send us a link. We&apos;ll help you
            find it and arrange the purchase for you.
          </Text>

          {/* Subtly Scaled Watermark Logo */}
          <View style={styles.logoStage}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              contentFit="contain"
              transition={150}
            />
          </View>
        </View>

        {/* Full Pill Action CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={() => router.push("/request-product" as Href)}
        >
          <View style={styles.ctaLeft}>
            <Camera size={15} color="#ffffff" strokeWidth={2} />
            <Text style={styles.ctaText}>Request a Product</Text>
          </View>

          <View style={styles.arrowCircle}>
            <ArrowRight size={13} color="#ffffff" strokeWidth={2.2} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f4f4f5",
  },

  container: {
    gap: 14,
  },

  kicker: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: "#008744",
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#09090b",
    letterSpacing: -0.8,
    lineHeight: 33,
  },

  headingGreen: {
    color: "#008744",
  },

  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 4,
  },

  description: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#52525b",
    letterSpacing: -0.1,
  },

  logoStage: {
    width: 68,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  ctaButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#09090b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 18,
    paddingRight: 8,
    marginTop: 4,
  },

  ctaButtonPressed: {
    backgroundColor: "#008744",
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },

  ctaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  ctaText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});