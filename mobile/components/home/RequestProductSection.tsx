import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import {
  Camera,
  ArrowRight,
  Check,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const BRAND_GREEN = "#005c2e";
const BRAND_DARK = "#004421";
const BRAND_GOLD = "#f4c542";

const TRACK_HEIGHT = 62;
const THUMB_SIZE = 48;
const TRACK_PADDING = 6;

export default function RequestProductSection() {
  const router = useRouter();

  const [trackWidth, setTrackWidth] = useState(0);
  const [completed, setCompleted] = useState(false);

  const dragX = useRef(new Animated.Value(0)).current;
  const hintX = useRef(new Animated.Value(0)).current;
  const navigating = useRef(false);

  // Keep a mutable ref so panResponder always reads the latest drag bounds
  const maxDrag = Math.max(0, trackWidth - THUMB_SIZE - TRACK_PADDING * 2);
  const maxDragRef = useRef(maxDrag);
  maxDragRef.current = maxDrag;

  // Reset slider state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
      setCompleted(false);
      dragX.setValue(0);
      hintX.setValue(0);

      return () => {
        navigating.current = false;
      };
    }, [dragX, hintX])
  );

  // Bouncing hint animation
  useEffect(() => {
    if (completed) {
      hintX.stopAnimation();
      hintX.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(hintX, {
          toValue: 6,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(hintX, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [completed, hintX]);

  const resetSlider = useCallback(() => {
    Animated.spring(dragX, {
      toValue: 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  }, [dragX]);

  const completeRequest = useCallback(() => {
    const limit = maxDragRef.current;
    if (navigating.current || limit <= 0) return;

    navigating.current = true;
    setCompleted(true);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }

    Animated.spring(dragX, {
      toValue: limit,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start(({ finished }) => {
      if (finished) {
        router.push("/request-product" as Href);
      }
    });
  }, [dragX, router]);

  // Pan responder with responsive boundary clamping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !navigating.current,
      onStartShouldSetPanResponderCapture: () => !navigating.current,

      onMoveShouldSetPanResponder: (_, gesture) => {
        return (
          !navigating.current &&
          Math.abs(gesture.dx) > 3 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy)
        );
      },
      onMoveShouldSetPanResponderCapture: (_, gesture) => {
        return (
          !navigating.current &&
          Math.abs(gesture.dx) > 3 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy)
        );
      },

      onPanResponderGrant: () => {
        hintX.stopAnimation();
        hintX.setValue(0);
      },

      onPanResponderMove: (_, gesture) => {
        if (navigating.current) return;
        const currentMax = maxDragRef.current;
        if (currentMax <= 0) return;

        const clampedX = Math.max(0, Math.min(gesture.dx, currentMax));
        dragX.setValue(clampedX);
      },

      onPanResponderRelease: (_, gesture) => {
        if (navigating.current) return;
        const currentMax = maxDragRef.current;
        const finalDistance = Math.max(0, Math.min(gesture.dx, currentMax));

        if (currentMax > 0 && finalDistance >= currentMax * 0.75) {
          completeRequest();
        } else {
          resetSlider();
        }
      },

      onPanResponderTerminate: () => {
        if (!navigating.current) {
          resetSlider();
        }
      },
    })
  ).current;

  // Fade out label as thumb slides across
  const textOpacity = dragX.interpolate({
    inputRange: [0, Math.max(1, maxDrag * 0.5)],
    outputRange: [1, 0.15],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.section}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.goldAccent} />
          <Text style={styles.kicker}>CAN&apos;T FIND WHAT YOU NEED?</Text>
        </View>

        <Text style={styles.heading}>
          Looking for something?
          {"\n"}
          <Text style={styles.headingGreen}>We&apos;ll find it for you.</Text>
        </Text>

        <View style={styles.middleRow}>
          <Text style={styles.description}>
            Send us a photo, product link, or details of what you&apos;re looking for.
            We&apos;ll help you find it.
          </Text>

          <View style={styles.logoStage}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              contentFit="contain"
              transition={150}
            />
          </View>
        </View>

        {/* Draggable request slider */}
        <View style={styles.sliderShadow}>
          <LinearGradient
            colors={[BRAND_GREEN, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sliderTrack}
            onLayout={(event) => {
              const measuredWidth = event.nativeEvent.layout.width;
              if (measuredWidth > 0 && measuredWidth !== trackWidth) {
                setTrackWidth(measuredWidth);
              }
            }}
          >
            {/* Left Camera Icon */}
            <View style={styles.sliderIcon}>
              <Camera size={19} color="#FFFFFF" strokeWidth={2.2} />
            </View>

            {/* Slider Center Text */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.sliderLabelContainer,
                { opacity: completed ? 1 : textOpacity },
              ]}
            >
              <Text style={styles.sliderTitle}>
                {completed ? "Requesting..." : "Slide to request"}
              </Text>
              <Text style={styles.sliderSubtitle}>
                {completed ? "Opening request page" : "Drag the gold arrow →"}
              </Text>
            </Animated.View>

            {/* Arrow pulse indicator */}
            {!completed && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.dragHint,
                  {
                    transform: [{ translateX: hintX }],
                    opacity: textOpacity,
                  },
                ]}
              >
                <ArrowRight
                  size={18}
                  color="rgba(255,255,255,0.4)"
                  strokeWidth={2.5}
                />
              </Animated.View>
            )}

            {/* Draggable Thumb Button */}
            <Animated.View
              {...panResponder.panHandlers}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[
                styles.thumb,
                {
                  transform: [{ translateX: dragX }],
                },
              ]}
            >
              {completed ? (
                <Check
                  size={22}
                  color={BRAND_GREEN}
                  strokeWidth={3}
                />
              ) : (
                <ArrowRight
                  size={22}
                  color={BRAND_GREEN}
                  strokeWidth={2.8}
                />
              )}
            </Animated.View>
          </LinearGradient>
        </View>

        <Text style={styles.footerNote}>
          {completed
            ? "PLEASE WAIT..."
            : "DRAG THE GOLD ARROW TO CONTINUE"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E9F0EA",
  },
  container: {
    gap: 13,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  goldAccent: {
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: BRAND_GOLD,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: BRAND_GREEN,
  },
  heading: {
    fontSize: 25,
    fontWeight: "900",
    color: "#17231B",
    letterSpacing: -0.7,
    lineHeight: 31,
  },
  headingGreen: {
    color: BRAND_GREEN,
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  description: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#606B63",
    letterSpacing: -0.1,
  },
  logoStage: {
    width: 62,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  sliderShadow: {
    marginTop: 4,
    borderRadius: 16,
    elevation: 4,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  sliderTrack: {
    height: TRACK_HEIGHT,
    borderRadius: 16,
    paddingHorizontal: TRACK_PADDING,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  sliderIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
    zIndex: 1,
  },
  sliderLabelContainer: {
    position: "absolute",
    left: 48,
    right: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  sliderTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  sliderSubtitle: {
    color: "#D5E8D9",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
  dragHint: {
    position: "absolute",
    right: 56,
    zIndex: 1,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 14,
    backgroundColor: BRAND_GOLD,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    zIndex: 10,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  footerNote: {
    textAlign: "center",
    color: "#89958C",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 1,
  },
});