// mobile/components/home/Hero.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import type { Category } from "@africasuk/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

const BRAND_LIGHT = "#008744";

interface Props {
  categories: Category[];
}

export default function Hero({ categories = [] }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // 1. Fixed setTimeout ref type
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-slide every 5 seconds (pauses on swipe)
  useEffect(() => {
    if (!categories.length || isInteracting) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % categories.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [categories.length, isInteracting]);

  const handleTouchStart = () => {
    setIsInteracting(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  };

  const handleTouchEnd = () => {
    interactionTimer.current = setTimeout(() => {
      setIsInteracting(false);
    }, 4000);
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / CARD_WIDTH);
      if (index !== activeIndex && index >= 0 && index < categories.length) {
        setActiveIndex(index);
      }
    },
    [activeIndex, categories.length]
  );

  const scrollTo = (index: number) => {
    if (index >= 0 && index < categories.length) {
      setActiveIndex(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  if (!categories.length) return null;

  return (
    <View style={styles.container}>
      {/* Swipeable FlatList */}
      <View style={styles.sliderWrapper}>
        <FlatList
          ref={flatListRef}
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onScrollBeginDrag={handleTouchStart}
          onScrollEndDrag={handleTouchEnd}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
          renderItem={({ item }) => (
            /* 2. Fixed Pressable state styling */
            <Pressable
              style={({ pressed }) => [
                styles.slideCard,
                pressed && styles.slideCardPressed,
              ]}
              onPress={() => router.push(`/categories/${item.slug}` as never)}
            >
              {/* Background Image */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.slideImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.placeholder} />
              )}

              {/* Clean Subtle Gradient Overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradientOverlay}
              >
                <View style={styles.slideDetails}>
                  <Text numberOfLines={1} style={styles.slideTitle}>
                    {item.name}
                  </Text>

                  <View style={styles.actionRow}>
                    <Text style={styles.actionText}>Explore Collection</Text>
                    <ArrowRight size={14} color="#ffffff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          )}
        />
      </View>

      {/* Minimal Dots Indicator */}
      <View style={styles.dotsRow}>
        {categories.map((_, idx) => (
          <Pressable
            key={idx}
            onPress={() => scrollTo(idx)}
            style={[styles.dot, idx === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
  },
  sliderWrapper: {
    width: CARD_WIDTH,
    height: 220,
    alignSelf: "center",
  },
  slideCard: {
    width: CARD_WIDTH,
    height: 220,
    backgroundColor: "#f3f4f6",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    position: "relative",
  },
  slideCardPressed: {
    opacity: 0.9,
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
  },
  slideDetails: {
    gap: 4,
  },
  slideTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.9,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 0,
    backgroundColor: "#e5e7eb",
  },
  activeDot: {
    width: 18,
    backgroundColor: BRAND_LIGHT,
  },
});