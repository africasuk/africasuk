// mobile/components/home/Hero.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react-native";
import type { Category } from "@africasuk/types";

const { width } = Dimensions.get("window");

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";

interface Props {
  categories: Category[];
}

export default function Hero({ categories = [] }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!categories.length) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories]);

  if (!categories.length) return null;

  const current = categories[activeIndex];

  return (
    <View style={styles.container}>
      {/* Hero Image Container */}
      <View style={styles.imageCard}>
        {current.imageUrl ? (
          <Image
            source={{ uri: current.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        {/* Gradient Overlay for Readability */}
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.65)"]}
          style={styles.gradientOverlay}
        />

        {/* Navigation Controls */}
        <TouchableOpacity
          style={[styles.navButton, { left: 12 }]}
          onPress={() =>
            setActiveIndex(
              (activeIndex - 1 + categories.length) % categories.length
            )
          }
          activeOpacity={0.8}
        >
          <ChevronLeft color="#ffffff" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { right: 12 }]}
          onPress={() =>
            setActiveIndex((activeIndex + 1) % categories.length)
          }
          activeOpacity={0.8}
        >
          <ChevronRight color="#ffffff" size={20} />
        </TouchableOpacity>

        {/* Floating Counter Badge */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {activeIndex + 1} / {categories.length}
          </Text>
        </View>
      </View>

      {/* Details & Action Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{current.name}</Text>

        {current.description && (
          <Text numberOfLines={2} style={styles.description}>
            {current.description}
          </Text>
        )}

        {/* Gradient Explore Button */}
        <Pressable
          onPress={() => router.push(`/categories/${current.slug}` as never)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={[BRAND_LIGHT, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Explore {current.name}</Text>
            <ArrowRight color="#ffffff" size={18} />
          </LinearGradient>
        </Pressable>

        {/* Carousel Pagination Dots */}
        <View style={styles.dots}>
          {categories.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafb",
    paddingVertical: 16,
  },
  imageCard: {
    width: width - 32,
    height: 280,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#111827",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  placeholderText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  counterBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  counterText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
  },
  activeDot: {
    width: 22,
    backgroundColor: BRAND_LIGHT,
  },
});