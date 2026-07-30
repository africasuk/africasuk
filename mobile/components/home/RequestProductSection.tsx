import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Search, FileText, Truck, ArrowRight } from "lucide-react-native";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#E6F0EB";

const CARD_WIDTH = 210;
const CARD_GAP = 12;
const CARD_ITEM_SIZE = CARD_WIDTH + CARD_GAP;

export default function RequestProductSection() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Upload Photo",
      description: "Upload a picture of the product you want to source.",
      icon: Camera,
    },
    {
      number: "02",
      title: "Describe Details",
      description: "Tell us details like preferred color, size, and quantity.",
      icon: FileText,
    },
    {
      number: "03",
      title: "We Source It",
      description: "Our team searches trusted suppliers and notifies you.",
      icon: Truck,
    },
  ];

  // Auto-scroll loop
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % steps.length;
      setCurrentIndex(nextIndex);

      scrollViewRef.current?.scrollTo({
        x: nextIndex * CARD_ITEM_SIZE,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, steps.length]);

  // Track manual swipes so timer stays synchronized
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / CARD_ITEM_SIZE);
      if (index !== currentIndex && index >= 0 && index < steps.length) {
        setCurrentIndex(index);
      }
    },
    [currentIndex, steps.length]
  );

  return (
    <View style={styles.container}>
      {/* Badge Header */}
      <View style={styles.badge}>
        <Search size={13} color={BRAND_LIGHT} />
        <Text style={styles.badgeText}>CAN&apos;T FIND A PRODUCT?</Text>
      </View>

      <Text style={styles.title}>Request Any Product</Text>

      <Text style={styles.description}>
        Looking for a product not listed on AfricaSuk? Upload a photo, tell us
        what you need, and our sourcing team will find it for you.
      </Text>

      {/* Primary Action Button with Brand Gradient */}
      <Pressable
        onPress={() => router.push("/request-product" as Href)}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={[BRAND_LIGHT, BRAND_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Camera size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Request a Product</Text>
          <ArrowRight size={16} color="#ffffff" />
        </LinearGradient>
      </Pressable>

      {/* Auto-sliding Steps Cards */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_ITEM_SIZE}
        decelerationRate="fast"
        contentContainerStyle={styles.stepsContainer}
      >
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <View key={step.number} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.iconBox}>
                  <Icon size={20} color={BRAND_LIGHT} />
                </View>
                <Text style={styles.number}>{step.number}</Text>
              </View>

              <Text style={styles.stepTitle}>{step.title}</Text>

              <Text numberOfLines={3} style={styles.stepDescription}>
                {step.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  badge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    gap: 6,
  },
  badgeText: {
    color: BRAND_DARK,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.3,
  },
  description: {
    marginTop: 8,
    textAlign: "center",
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  stepsContainer: {
    paddingTop: 24,
    paddingBottom: 4,
    gap: CARD_GAP,
  },
  stepCard: {
    width: CARD_WIDTH,
    backgroundColor: "#f9fafb",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: "900",
    color: BRAND_LIGHT,
    letterSpacing: -0.5,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
    marginBottom: 4,
  },
  stepDescription: {
    color: "#6b7280",
    lineHeight: 18,
    fontSize: 12,
  },
});