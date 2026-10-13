import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import {
  ArrowRight,
  Check,
  House,
  Mail,
  PackageCheck,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const DARK_GREEN = "#003b1d";
const BRAND_GREEN = "#005c2e";
const BRIGHT_GREEN = "#20c95c";
const YELLOW = "#d4a017";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useLocalSearchParams<{
        orderNumber?: string;
        orderId?: string;
    }>();

  // Supports the new orderNumber route and keeps old links working.


  const iconScale = useRef(new Animated.Value(0.65)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(25)).current;

  const emailOpacity = useRef(new Animated.Value(0)).current;
  const emailTranslate = useRef(new Animated.Value(20)).current;

  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      // Success icon
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Main message
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Email notice
      Animated.parallel([
        Animated.timing(emailOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(emailTranslate, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Buttons
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslate, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    buttonsOpacity,
    buttonsTranslate,
    contentOpacity,
    contentTranslate,
    emailOpacity,
    emailTranslate,
    iconOpacity,
    iconScale,
  ]);

const handleViewOrder = () => {
  router.replace("/(tabs)/orders" as Href);
};

  const handleContinueShopping = () => {
    router.replace("/products" as Href);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={require("@/assets/images/order-success-bg.png")}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      >
        {/* Dark green top → green bottom */}
        <LinearGradient
          colors={[
            "rgba(0,59,29,0.96)",
            "rgba(0,92,46,0.84)",
            "rgba(0,92,46,0.62)",
            "rgba(0,125,58,0.78)",
          ]}
          locations={[0, 0.28, 0.62, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Soft bottom glow */}
        <LinearGradient
          colors={[
            "rgba(0,92,46,0)",
            "rgba(32,201,92,0.18)",
          ]}
          locations={[0.35, 1]}
          style={styles.bottomGlow}
        />
      </ImageBackground>

      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 18, 30),
            paddingBottom: Math.max(insets.bottom + 18, 28),
          },
        ]}
      >
        {/* SUCCESS ICON */}
        <Animated.View
          style={[
            styles.successIconArea,
            {
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <View style={styles.successGlow} />

          <View style={styles.packageCircle}>
            <PackageCheck
              size={42}
              color="#ffffff"
              strokeWidth={1.8}
            />
          </View>

          <View style={styles.checkBadge}>
            <Check
              size={20}
              color="#ffffff"
              strokeWidth={3}
            />
          </View>
        </Animated.View>

        {/* MAIN MESSAGE */}
        <Animated.View
          style={[
            styles.message,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <Text style={styles.title}>Order Placed</Text>

          <Text style={styles.titleAccent}>
            Successfully!
          </Text>

          <Text style={styles.thankYou}>
            Thank you for ordering with AfricaSuk!
          </Text>

          <Text style={styles.description}>
            Your order has been received and we’re getting
            it ready for you. We’ll keep you updated
            every step of the way.
          </Text>
        </Animated.View>

        {/* EMAIL NOTICE — NO CARD / NO BORDER */}
        <Animated.View
          style={[
            styles.emailNotice,
            {
              opacity: emailOpacity,
              transform: [{ translateY: emailTranslate }],
            },
          ]}
        >
          <Mail
            size={24}
            color={YELLOW}
            strokeWidth={2}
          />

          <View style={styles.emailText}>
            <Text style={styles.emailTitle}>
              Check your email
            </Text>

            <Text style={styles.emailDescription}>
              We’ve sent your order confirmation and
              details to your email address.
            </Text>
          </View>
        </Animated.View>

        {/* ACTIONS */}
        <Animated.View
          style={[
            styles.actions,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslate }],
            },
          ]}
        >
          <Pressable
            onPress={handleViewOrder}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              View Order Details
            </Text>

            <ArrowRight
              size={19}
              color="#ffffff"
              strokeWidth={2.4}
            />
          </Pressable>

          <Pressable
            onPress={handleContinueShopping}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <House
              size={19}
              color={YELLOW}
              strokeWidth={2}
            />

            <Text style={styles.secondaryButtonText}>
              Continue Shopping
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.footerText}>
          Thank you for choosing AfricaSuk
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_GREEN,
  },

  bottomGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.55,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* SUCCESS ICON */

  successIconArea: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  successGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(32,201,92,0.22)",
  },

  packageCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: BRAND_GREEN,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  checkBadge: {
    position: "absolute",
    right: 8,
    bottom: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BRIGHT_GREEN,
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  /* MESSAGE */

  message: {
    width: "100%",
    alignItems: "center",
    marginTop: -2,
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.8,
  },

  titleAccent: {
    color: YELLOW,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },

  thankYou: {
    marginTop: 15,
    color: "#ffffff",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    marginTop: 9,
    maxWidth: 350,
    color: "rgba(255,255,255,0.80)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
    textAlign: "center",
  },

  /* EMAIL — CLEAN / TRANSPARENT */

  emailNotice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 8,
  },

  emailText: {
    flex: 1,
    marginLeft: 12,
  },

  emailTitle: {
    color: YELLOW,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },

  emailDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    lineHeight: 17,
  },

  /* BUTTONS */

  actions: {
    width: "100%",
    gap: 11,
    marginTop: 8,
  },

  primaryButton: {
    height: 53,
    borderRadius: 27,
    backgroundColor: BRAND_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 51,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  footerText: {
    color: "#ffff",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
});