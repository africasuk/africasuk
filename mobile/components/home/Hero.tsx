import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import type { Category } from "@africasuk/types";
import SouthSudanButtonBackground from "./SouthSudanButtonBackground";
import SouthSudanCtaButton from "./SouthSudanButtonBackground";



// Dynamic background loader integration


const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_HEIGHT = 340;
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

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
    return () => {
      stopTimer();
    };
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

      if (
        index !== activeIndex &&
        index >= 0 &&
        index < categories.length
      ) {
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


  if (!categories || categories.length === 0) {
    return null;
  }

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
              onPress={() =>
                router.push(`/categories/${item.slug}` as never)
              }
            >
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

                {/* Bottom readability overlay */}
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.14)",
                    "rgba(0,0,0,0.52)",
                    "rgba(0,0,0,0.72)",
                  ]}
                  locations={[0, 0.38, 0.74, 1]}
                  style={styles.bottomOverlay}
                />

                {/* Hero content */}
                <View style={styles.heroContent}>
                  <View style={styles.textStack}>
                    <Text style={styles.kicker}>Curated Collection</Text>

                    <Text numberOfLines={2} style={styles.title}>
                      {item.name}
                    </Text>

                    <Text numberOfLines={2} style={styles.subtitle}>
                      Discover something{"\n"}special for you.
                    </Text>
                  </View>

                  <View style={styles.actionCircle}>
                    <ArrowUpRight
                      size={18}
                      color="#18181b"
                      strokeWidth={2.2}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

      {/* Pagination indicators */}
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
                  isActive
                    ? styles.indicatorActive
                    : styles.indicatorInactive,
                ]}
              />
            );
          })}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingBottom: 14,
  },

  slideFrame: {
    width: SCREEN_WIDTH,
  },

  cardPressable: {
    width: SCREEN_WIDTH,
  },

  imageStage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    backgroundColor: "#f4f4f5",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },

  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
  },

  heroContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  textStack: {
    flex: 1,
    paddingRight: 16,
  },

  kicker: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  title: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.6,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
    color: "rgba(255,255,255,0.92)",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
    width: 22,
    backgroundColor: "#18181b",
  },

  indicatorInactive: {
    width: 6,
    backgroundColor: "#e4e4e7",
  },

  /* Enhanced Flag CTA Area */
  ctaContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },

  ctaWrapper: {
    width: "100%",
    height: 64, // Firm height to enforce proper flex padding and shape
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#005c2e",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  ctaContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  ctaTextGroup: {
    justifyContent: "center",
  },

  ctaHeading: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.15,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  ctaSubtext: {
    color: "rgba(255,255,255,0.92)", // Enhanced high-contrast ivory overlay
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  ctaIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  pressedState: {
    opacity: 0.96,
  },

  ctaPressedState: {
    opacity: 0.92,
    transform: [{ scale: 0.988 }],
  },
});