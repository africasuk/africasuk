
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
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
  Polygon,
  Mask,
  G,
} from "react-native-svg";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

const BRAND_DARK = "#00401f";
const BRAND_GREEN = "#005c2e";
const BRAND_GOLD = "#F4C542";

export default function SouthSudanCtaButton() {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
    }

    router.push("/products" as never);
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Shop Now All Products — Shop with Confidence"
        style={({ pressed }) => [
          styles.buttonWrapper,
          pressed && styles.pressedState,
        ]}
        onPress={handlePress}
      >
        <LinearGradient
          colors={[BRAND_DARK, BRAND_GREEN]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Subtle brand highlight */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.highlight}
          pointerEvents="none"
        />

        {/* South Sudan flag on the right */}
        <View
          style={styles.flagStage}
          pointerEvents="none"
        >
          <Svg
            width={220}
            height={70}
            viewBox="0 0 220 70"
          >
            <Defs>
              <SvgGradient
                id="middleFeatherMask"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <Stop
                  offset="0"
                  stopColor="#FFFFFF"
                  stopOpacity="0"
                />
                <Stop
                  offset="0.3"
                  stopColor="#FFFFFF"
                  stopOpacity="0.45"
                />
                <Stop
                  offset="0.7"
                  stopColor="#FFFFFF"
                  stopOpacity="0.95"
                />
                <Stop
                  offset="1"
                  stopColor="#FFFFFF"
                  stopOpacity="1"
                />
              </SvgGradient>

              <Mask id="flagMask">
                <Rect
                  x="0"
                  y="0"
                  width="220"
                  height="70"
                  fill="url(#middleFeatherMask)"
                />
              </Mask>
            </Defs>

            <G mask="url(#flagMask)">
              <Rect
                x="0"
                y="0"
                width="220"
                height="20"
                fill="#000000"
              />

              <Rect
                x="0"
                y="20"
                width="220"
                height="4"
                fill="#FFFFFF"
              />

              <Rect
                x="0"
                y="24"
                width="220"
                height="22"
                fill="#DE1F27"
              />

              <Rect
                x="0"
                y="46"
                width="220"
                height="4"
                fill="#FFFFFF"
              />

              <Rect
                x="0"
                y="50"
                width="220"
                height="20"
                fill="#088738"
              />

              <Polygon
                points="220,0 162,35 220,70"
                fill="#0C84D8"
              />

              <Polygon
                points="198,24 201.2,31.2 208,31.2 202.5,35.5 204.5,42.5 198,38.2 191.5,42.5 193.5,35.5 188,31.2 194.8,31.2"
                fill="#FFCC00"
              />
            </G>
          </Svg>
        </View>

        {/* Left-aligned AfricaSuk branding */}
        <View style={styles.contentLayout}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              Click To View All Products
            </Text>

            <View style={styles.inlineArrow}>
              <ArrowRight
                size={14}
                color={BRAND_GOLD}
                strokeWidth={2.8}
              />
            </View>
          </View>

          <Text style={styles.subtitle}>
            Shop with Confidence
          </Text>

          <View style={styles.goldAccent} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  buttonWrapper: {
    width: "100%",
    height: 72,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: BRAND_DARK,
    borderWidth: 1,
    borderColor: "rgba(244,197,66,0.25)",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },

  highlight: {
    ...StyleSheet.absoluteFillObject,
  },

  flagStage: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 220,
    overflow: "hidden",
  },

  contentLayout: {
    paddingLeft: 20,
    zIndex: 10,
    maxWidth: "65%",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },

  inlineArrow: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "rgba(244,197,66,0.14)",
    borderWidth: 1,
    borderColor: "rgba(244,197,66,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    color: "rgba(255,255,255,0.94)",
    fontSize: 11.5,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0,
  },

  goldAccent: {
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: BRAND_GOLD,
    marginTop: 5,
  },

  pressedState: {
    opacity: 0.93,
    transform: [{ scale: 0.985 }],
  },
});
