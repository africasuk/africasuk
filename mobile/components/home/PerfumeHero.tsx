
"use client";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const BRAND_GREEN = "#005c2e";
const BRAND_GOLD = "#F4C542";

export default function PerfumeHero() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/yara-perfume-hero.jpg")}
        style={styles.hero}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.02)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.76)",
          ]}
          locations={[0, 0.38, 1]}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.eyebrow}>YOUR SIGNATURE SCENT</Text>

              <Text style={styles.title}>
                Find Your{"\n"}Signature Scent
              </Text>

              <Text style={styles.description}>
                Discover fragrances that leave a lasting impression.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push("/categories/fragrance" as never)
              }
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Shop Fragrances</Text>

              <View style={styles.arrowContainer}>
                <ArrowRight
                  size={19}
                  color={BRAND_GREEN}
                  strokeWidth={2.5}
                />
              </View>
            </Pressable>

            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>
                SHOP WITH CONFIDENCE
              </Text>
              <View style={styles.footerLine} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  hero: {
    height: 500,
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: "#E8E8E8",
  },

  image: {
    borderRadius: 20,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    borderRadius: 20,
  },

  content: {
    gap: 22,
  },

  textContainer: {
    gap: 10,
  },

  eyebrow: {
    color: BRAND_GOLD,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 35,
    lineHeight: 41,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  description: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 270,
  },

  button: {
    minHeight: 58,
    paddingLeft: 20,
    paddingRight: 7,
    borderRadius: 14,
    backgroundColor: BRAND_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: BRAND_GOLD,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  footerLine: {
    height: 1,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  footerText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
