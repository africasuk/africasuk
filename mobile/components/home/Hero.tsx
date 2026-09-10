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
import { ArrowUpRight, ArrowRight } from "lucide-react-native";
import type { Category } from "@africasuk/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;
const AUTO_PLAY_INTERVAL = 5500;

interface Props {
  categories: Category[];
}

export default function Hero({ categories = [] }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isInteracting = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (categories.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isInteracting.current) {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % categories.length;
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * SCREEN_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }
    }, AUTO_PLAY_INTERVAL);
  }, [categories.length]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleScrollBegin = () => {
    isInteracting.current = true;
    stopTimer();
  };

  const handleScrollEnd = () => {
    setTimeout(() => {
      isInteracting.current = false;
      startTimer();
    }, 3000);
  };

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      if (index !== activeIndex && index >= 0 && index < categories.length) {
        setActiveIndex(index);
      }
    },
    [activeIndex, categories.length]
  );

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleMomentumEnd}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slideFrame}>
            <Pressable
              style={({ pressed }) => [
                styles.cardPressable,
                pressed && styles.pressedState,
              ]}
              onPress={() => router.push(`/categories/${item.slug}` as never)}
            >
              {/* 1:1 Pixel-Locked Canvas */}
              <View style={styles.imageStage}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    transition={250}
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <View style={styles.placeholder} />
                )}
              </View>

              {/* Editorial Lower Meta Bar */}
              <View style={styles.metaRow}>
                <View style={styles.textStack}>
                  <Text style={styles.kicker}>Curated Collection</Text>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>
                </View>

                <View style={styles.actionCircle}>
                  <ArrowUpRight size={15} color="#18181b" strokeWidth={2} />
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

      {/* Fluid Pill Indicators */}
      {categories.length > 1 && (
        <View style={styles.indicatorContainer}>
          {categories.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <Pressable
                key={idx}
                onPress={() => handleDotPress(idx)}
                hitSlop={8}
                style={[
                  styles.indicator,
                  isActive ? styles.indicatorActive : styles.indicatorInactive,
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Start Shopping Button */}
      <View style={styles.ctaContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.startShoppingBtn,
            pressed && styles.ctaPressedState,
          ]}
          onPress={() => router.push("/products" as never)}
        >
          <Text style={styles.startShoppingText}>Start Shopping</Text>
          <ArrowRight size={15} color="#ffffff" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingTop: 8,
    paddingBottom: 16,
  },

  slideFrame: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: CARD_PADDING,
  },

  cardPressable: {
    width: CARD_WIDTH,
    gap: 12,
  },

  imageStage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    gap: 12,
  },

  textStack: {
    flex: 1,
    gap: 2,
  },

  kicker: {
    fontSize: 10,
    fontWeight: "600",
    color: "#71717a",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  actionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },

  indicator: {
    height: 4,
    borderRadius: 2,
  },

  indicatorActive: {
    width: 20,
    backgroundColor: "#18181b",
  },

  indicatorInactive: {
    width: 6,
    backgroundColor: "#e4e4e7",
  },

  ctaContainer: {
    paddingHorizontal: CARD_PADDING,
    marginTop: 14,
  },

  startShoppingBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#18181b",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  startShoppingText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  pressedState: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },

  ctaPressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});