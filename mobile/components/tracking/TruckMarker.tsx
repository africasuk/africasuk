import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle, Rect, Defs, Filter, FeDropShadow } from "react-native-svg";
import { Truck } from "lucide-react-native";

interface Props {
  label?: string;
}

export default function TruckMarker({ label = "Live Location" }: Props) {
  const labelText = label.toUpperCase();

  // Dynamic pill width calculation
  const pillWidth = Math.max(54, labelText.length * 5.2 + 18);
  const halfPill = pillWidth / 2;

  // Pulse & Indicator animations
  const auraRadius = useRef(new Animated.Value(13)).current;
  const auraOpacity = useRef(new Animated.Value(0.25)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ambient Pulse Aura Animation
    const auraAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(auraRadius, {
            toValue: 22,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(auraRadius, {
            toValue: 13,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(auraOpacity, {
            toValue: 0.05,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.25,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    // Live Dot Blinking Animation
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    auraAnimation.start();
    dotAnimation.start();

    return () => {
      auraAnimation.stop();
      dotAnimation.stop();
    };
  }, [auraRadius, auraOpacity, dotOpacity]);

  return (
    <View style={styles.container}>
      {/* Subtle Ambient Pulse Aura */}
      <Animated.View
        style={[
          styles.pulseAura,
          {
            width: Animated.multiply(auraRadius, 2),
            height: Animated.multiply(auraRadius, 2),
            borderRadius: auraRadius,
            opacity: auraOpacity,
          },
        ]}
      />

      {/* Central Vehicle Badge */}
      <View style={styles.badgeWrapper}>
        <Svg width={36} height={36} viewBox="-18 -18 36 36">
          <Defs>
            <Filter id="truck-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeDropShadow
                dx="0"
                dy="2"
                stdDeviation="2.5"
                floodColor="#002b15"
                floodOpacity="0.2"
              />
            </Filter>
          </Defs>
          <Circle
            r={13}
            fill="#005c2e"
            stroke="#ffffff"
            strokeWidth={1.8}
            filter="url(#truck-shadow)"
          />
        </Svg>
        {/* Centered Truck Icon */}
        <View style={styles.iconContainer}>
          <Truck size={11} color="#ffffff" strokeWidth={1.8} />
        </View>
      </View>

      {/* Floating Status Badge Label */}
      <View style={[styles.pillContainer, { width: pillWidth, marginLeft: -halfPill }]}>
        <Svg width={pillWidth} height={14} viewBox={`-${halfPill} -7 ${pillWidth} 14`}>
          <Rect
            x={-halfPill}
            y={-7}
            width={pillWidth}
            height={14}
            rx={7}
            fill="#002b15"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={1}
          />
        </Svg>

        {/* Live Indicator Dot */}
        <Animated.View
          style={[
            styles.liveDot,
            {
              left: 6,
              opacity: dotOpacity,
            },
          ]}
        />

        {/* Label Text */}
        <View style={styles.textWrapper}>
          <Text style={styles.labelText}>{labelText}</Text>
        </View>
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
  pulseAura: {
    position: "absolute",
    backgroundColor: "#10b981",
  },
  badgeWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  pillContainer: {
    position: "absolute",
    top: 38,
    left: "50%",
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  liveDot: {
    position: "absolute",
    width: 3.6,
    height: 3.6,
    borderRadius: 1.8,
    backgroundColor: "#34d399",
  },
  textWrapper: {
    position: "absolute",
    left: 12,
    right: 4,
    alignItems: "center",
  },
  labelText: {
    color: "#ffffff",
    fontSize: 7.5,
    fontWeight: "500",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});