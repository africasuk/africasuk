import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Rect, Defs, Filter, FeDropShadow } from "react-native-svg";
import { Truck } from "lucide-react-native";

interface Props {
  label?: string;
}

export default function TruckMarker({ label = "Live Location" }: Props) {
  const labelText = label.toUpperCase();

  // Dynamic label width calculation
  const pillWidth = Math.max(54, labelText.length * 5.2 + 18);
  const halfPill = pillWidth / 2;

  // Pulse & Indicator animations
  const auraSize = useRef(new Animated.Value(26)).current;
  const auraOpacity = useRef(new Animated.Value(0.25)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ambient Pulse Aura Animation
    const auraAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(auraSize, {
            toValue: 44,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(auraSize, {
            toValue: 26,
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
  }, [auraSize, auraOpacity, dotOpacity]);

  return (
    <View style={styles.container}>
      {/* Sharp Ambient Pulse Aura */}
      <Animated.View
        style={[
          styles.pulseAura,
          {
            width: auraSize,
            height: auraSize,
            borderRadius: 0, // Sharp square
            opacity: auraOpacity,
          },
        ]}
      />

      {/* Central Vehicle Square Badge */}
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
          <Rect
            x={-13}
            y={-13}
            width={26}
            height={26}
            rx={0} // Sharp corners
            fill="#005c2e"
            stroke="#ffffff"
            strokeWidth={1.5}
            filter="url(#truck-shadow)"
          />
        </Svg>
        {/* Centered Truck Icon */}
        <View style={styles.iconContainer}>
          <Truck size={12} color="#ffffff" strokeWidth={1.5} />
        </View>
      </View>

      {/* Floating Status Badge Label with Sharp Corners */}
      <View style={[styles.pillContainer, { width: pillWidth, marginLeft: -halfPill }]}>
        <Svg width={pillWidth} height={14} viewBox={`-${halfPill} -7 ${pillWidth} 14`}>
          <Rect
            x={-halfPill}
            y={-7}
            width={pillWidth}
            height={14}
            rx={0} // Sharp corners
            fill="#002b15"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={1}
          />
        </Svg>

        {/* Live Indicator Dot (Sharp Square) */}
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
    borderRadius: 0,
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
    top: 40,
    left: "50%",
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  liveDot: {
    position: "absolute",
    width: 3.5,
    height: 3.5,
    borderRadius: 0, // Sharp square indicator
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
    fontWeight: "400", // Non-bold clean typography
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});