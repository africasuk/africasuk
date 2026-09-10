import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react-native";

interface Props {
  images: {
    id: string;
    imageUrl: string | null;
  }[];
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const STAGE_WIDTH = SCREEN_WIDTH - 32; // Exact card width with 16px screen margins
const BRAND_COLOR = "#005c2e";

export function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const lightboxScrollViewRef = useRef<ScrollView>(null);

  const imagesCount = images?.length ?? 0;

  useEffect(() => {
    setSelectedIndex(0);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [images]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const viewSizeWidth = event.nativeEvent.layoutMeasurement.width;
      if (viewSizeWidth > 0) {
        const newIndex = Math.round(contentOffsetX / viewSizeWidth);
        if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < imagesCount) {
          setSelectedIndex(newIndex);
        }
      }
    },
    [selectedIndex, imagesCount]
  );

  const scrollToImage = useCallback((index: number) => {
    setSelectedIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * STAGE_WIDTH,
      animated: true,
    });
  }, []);

  const handlePrev = useCallback(() => {
    const nextIndex = selectedIndex === 0 ? imagesCount - 1 : selectedIndex - 1;
    scrollToImage(nextIndex);
  }, [selectedIndex, imagesCount, scrollToImage]);

  const handleNext = useCallback(() => {
    const nextIndex = selectedIndex === imagesCount - 1 ? 0 : selectedIndex + 1;
    scrollToImage(nextIndex);
  }, [selectedIndex, imagesCount, scrollToImage]);

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No image available</Text>
      </View>
    );
  }

  const safeIndex = selectedIndex >= images.length ? 0 : selectedIndex;

  return (
    <View style={styles.container}>
      {/* 1:1 Pinterest Square Display Stage */}
      <View style={styles.mainImageCard}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate="fast"
          style={styles.stageScrollView}
        >
          {images.map((img, idx) => {
            const src =
              img?.imageUrl && img.imageUrl.startsWith("http")
                ? img.imageUrl
                : "https://via.placeholder.com/600";

            return (
              <Pressable
                key={img.id ?? idx}
                onPress={() => setIsLightboxOpen(true)}
                style={styles.slideFrame}
              >
                <Image
                  source={{ uri: src }}
                  style={styles.mainImage}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Floating Top Indicators */}
        <View style={styles.topBarOverlay}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {safeIndex + 1} / {images.length}
            </Text>
          </View>

          <Pressable
            onPress={() => setIsLightboxOpen(true)}
            style={styles.zoomButton}
            hitSlop={8}
          >
            <Maximize2 size={13} color="#111827" />
          </Pressable>
        </View>

        {/* Subtle Navigation Overlay Arrows */}
        {images.length > 1 && (
          <View style={styles.navOverlay}>
            <Pressable onPress={handlePrev} style={styles.navButton} hitSlop={6}>
              <ChevronLeft size={16} color="#111827" />
            </Pressable>

            <Pressable onPress={handleNext} style={styles.navButton} hitSlop={6}>
              <ChevronRight size={16} color="#111827" />
            </Pressable>
          </View>
        )}
      </View>

      {/* 1:1 Thumbnail Strip */}
      {images.length > 1 && (
        <View style={styles.thumbnailSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          >
            {images.map((image, index) => {
              const thumbnailSrc =
                image.imageUrl && image.imageUrl.startsWith("http")
                  ? image.imageUrl
                  : "https://via.placeholder.com/150";

              const isSelected = index === safeIndex;

              return (
                <Pressable
                  key={image.id ?? index}
                  onPress={() => scrollToImage(index)}
                  style={[
                    styles.thumbnailItem,
                    isSelected && styles.selectedThumbnailItem,
                  ]}
                >
                  <Image
                    source={{ uri: thumbnailSrc }}
                    style={styles.thumbnailImage}
                    contentFit="cover"
                    transition={150}
                    cachePolicy="memory-disk"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Full-Screen Lightbox Modal */}
      <Modal
        visible={isLightboxOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLightboxOpen(false)}
      >
        <View style={styles.lightboxOverlay}>
          {/* Header Controls */}
          <View style={styles.lightboxHeader}>
            <View style={styles.lightboxCounterBadge}>
              <Text style={styles.lightboxCounterText}>
                {safeIndex + 1} of {images.length}
              </Text>
            </View>

            <Pressable
              onPress={() => setIsLightboxOpen(false)}
              style={styles.lightboxCloseButton}
              hitSlop={8}
            >
              <X size={18} color="#ffffff" />
            </Pressable>
          </View>

          {/* Full-Screen Swiper */}
          <View style={styles.lightboxStage}>
            <ScrollView
              ref={lightboxScrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
            >
              {images.map((img, idx) => {
                const src =
                  img?.imageUrl && img.imageUrl.startsWith("http")
                    ? img.imageUrl
                    : "https://via.placeholder.com/1000";

                return (
                  <View key={img.id ?? idx} style={styles.lightboxSlide}>
                    <Image
                      source={{ uri: src }}
                      style={styles.lightboxImage}
                      contentFit="contain"
                      transition={200}
                      cachePolicy="memory-disk"
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 12,
  },

  emptyContainer: {
    width: STAGE_WIDTH,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9ca3af",
  },

  /* 1:1 Pinterest Square Main Card */
  mainImageCard: {
    position: "relative",
    width: STAGE_WIDTH,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  stageScrollView: {
    width: "100%",
    height: "100%",
  },

  slideFrame: {
    width: STAGE_WIDTH,
    height: "100%",
  },

  mainImage: {
    width: "100%",
    height: "100%",
  },

  /* Floating UI Overlays */
  topBarOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    pointerEvents: "box-none",
  },

  counterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  counterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },

  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  navOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  navButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  /* 1:1 Thumbnail Rail */
  thumbnailSection: {
    width: "100%",
  },

  thumbnailList: {
    gap: 10,
    paddingVertical: 2,
  },

  thumbnailItem: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  selectedThumbnailItem: {
    borderColor: BRAND_COLOR,
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
  },

  /* Full Screen Lightbox */
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.96)",
  },

  lightboxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 54,
    paddingHorizontal: 20,
    zIndex: 10,
  },

  lightboxCounterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },

  lightboxCounterText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  lightboxCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  lightboxStage: {
    flex: 1,
    justifyContent: "center",
  },

  lightboxSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },

  lightboxImage: {
    width: SCREEN_WIDTH - 24,
    height: "100%",
  },
});