import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Rect, Defs, Filter, FeDropShadow } from "react-native-svg";
import {
  Building2,
  Factory,
  Home,
  ShieldCheck,
} from "lucide-react-native";

interface Props {
  type: "supplier" | "warehouse" | "border" | "customer";
  label: string;
  color: string;
  offsetDirection?: "top" | "bottom" | "left" | "right";
}

export default function MapMarker({
  type,
  label,
  color,
  offsetDirection = "top",
}: Props) {
  const Icon =
    type === "supplier"
      ? Factory
      : type === "warehouse"
      ? Building2
      : type === "border"
      ? ShieldCheck
      : Home;

  // Pulsing animation for radar ring
  const pulseAnim = useRef(new Animated.Value(28)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 46,
            duration: 1400,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 28,
            duration: 1400,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.05,
            duration: 1400,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 1400,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim, opacityAnim]);

  // Compute text offsets relative to the pin center
  const getOffsetStyles = () => {
    switch (offsetDirection) {
      case "bottom":
        return { top: 40, alignSelf: "center" as const };
      case "left":
        return { right: 35, top: 12, alignItems: "flex-end" as const };
      case "right":
        return { left: 35, top: 12, alignItems: "flex-start" as const };
      case "top":
      default:
        return { bottom: 42, alignSelf: "center" as const };
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Radar Pulse Outer Square */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: pulseAnim,
            height: pulseAnim,
            borderRadius: 0, // Sharp square pulse
            backgroundColor: color,
            opacity: opacityAnim,
          },
        ]}
      />

      {/* SVG Square Pin Badge */}
      <Svg width={60} height={60} viewBox="-30 -30 60 60">
        <Defs>
          <Filter id={`shadow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow
              dx="0"
              dy="2"
              stdDeviation="2.5"
              floodColor="#002b15"
              floodOpacity="0.25"
            />
          </Filter>
        </Defs>

        <Rect
          x={-14}
          y={-14}
          width={28}
          height={28}
          rx={0} // Sharp corners
          fill={color}
          stroke="#ffffff"
          strokeWidth={1.5}
          filter={`url(#shadow-${type})`}
        />
        <Rect
          x={-9}
          y={-9}
          width={18}
          height={18}
          rx={0}
          fill="#ffffff"
        />
      </Svg>

      {/* Centered Icon over the Pin Badge */}
      <View style={styles.iconContainer}>
        <Icon size={12} color={color} strokeWidth={2} />
      </View>

      {/* High-Precision Label */}
      <View style={[styles.labelWrapper, getOffsetStyles()]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    borderRadius: 0,
  },
  iconContainer: {
    position: "absolute",
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    position: "absolute",
  },
  labelText: {
    color: "#f8fafc",
    fontSize: 9.5,
    fontWeight: "500", // Non-bold clean typography
    letterSpacing: 0.5,
    textTransform: "uppercase",
    backgroundColor: "rgba(9, 13, 22, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0, // Sharp border
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
});