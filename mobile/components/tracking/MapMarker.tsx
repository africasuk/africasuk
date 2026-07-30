import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { G, Path, Circle, Defs, Filter, FeDropShadow } from "react-native-svg";
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
  const pulseAnim = useRef(new Animated.Value(14)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 30,
            duration: 1400,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 14,
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
      {/* Animated Radar Pulse Outer Ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: Animated.multiply(pulseAnim, 2),
            height: Animated.multiply(pulseAnim, 2),
            borderRadius: pulseAnim,
            backgroundColor: color,
            opacity: opacityAnim,
          },
        ]}
      />

      {/* SVG Map Pin Teardrop Badge */}
      <Svg width={60} height={60} viewBox="-30 -35 60 60">
        <Defs>
          <Filter id={`shadow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow
              dx="0"
              dy="4"
              stdDeviation="3"
              floodColor="#002b15"
              floodOpacity="0.4"
            />
          </Filter>
        </Defs>

        <G filter={`url(#shadow-${type})`}>
          <Path
            d="M 0 -26 C -12 -26 -16 -12 0 0 C 16 -12 12 -26 0 -26 Z"
            fill={color}
            stroke="#ffffff"
            strokeWidth={2.5}
          />
          <Circle cx={0} cy={-16} r={8.5} fill="#ffffff" />
        </G>
      </Svg>

      {/* Centered Native Icon over the Pin Badge */}
      <View style={styles.iconContainer}>
        <Icon size={11} color={color} strokeWidth={3} />
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
  },
  iconContainer: {
    position: "absolute",
    top: 6,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    position: "absolute",
  },
  labelText: {
    color: "#f8fafc",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    backgroundColor: "rgba(9, 13, 22, 0.85)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
});