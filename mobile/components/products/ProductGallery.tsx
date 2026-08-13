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

export function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const lightboxScrollViewRef = useRef<ScrollView>(null);

  const imagesCount = images?.length ?? 0;

  // Reset selected index & scroll position when images prop updates
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
      x: index * (SCREEN_WIDTH - 32),
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
      {/* 1. Swipeable Main Display Stage */}
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
                />
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Zoom Hint Badge */}
        <View style={styles.zoomBadge}>
          <Maximize2 size={11} color="#ffffff" />
          <Text style={styles.zoomBadgeText}>Tap for full screen</Text>
        </View>

        {/* Subtle Navigation Overlay Arrows */}
        {images.length > 1 && (
          <View style={styles.navOverlay}>
            <Pressable onPress={handlePrev} style={styles.navButton}>
              <ChevronLeft size={16} color="#ffffff" />
            </Pressable>

            <Pressable onPress={handleNext} style={styles.navButton}>
              <ChevronRight size={16} color="#ffffff" />
            </Pressable>
          </View>
        )}
      </View>

      {/* 2. Thumbnail Selector Bar */}
      {images.length > 1 && (
        <View style={styles.thumbnailSection}>
          <Text style={styles.thumbnailLabel}>PRODUCT VIEW</Text>

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
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 3. Full-Screen Lightbox Modal */}
      <Modal
        visible={isLightboxOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLightboxOpen(false)}
      >
        <View style={styles.lightboxOverlay}>
          {/* Header Controls */}
          <View style={styles.lightboxHeader}>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {safeIndex + 1} / {images.length}
              </Text>
            </View>

            <Pressable
              onPress={() => setIsLightboxOpen(false)}
              style={styles.closeButton}
            >
              <X size={18} color="#ffffff" />
            </Pressable>
          </View>

          {/* Full Screen Image Stage */}
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
                    : "https://via.placeholder.com/600";

                return (
                  <View key={img.id ?? idx} style={styles.lightboxSlide}>
                    <Image
                      source={{ uri: src }}
                      style={styles.lightboxImage}
                      contentFit="contain"
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
    gap: 12,
  },
  emptyContainer: {
    height: 320,
    width: "100%",
    borderRadius: 0, // Sharp corners
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#9ca3af",
  },
  mainImageCard: {
    position: "relative",
    width: "100%",
    height: 340,
    borderRadius: 0, // Sharp corners design language
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  stageScrollView: {
    width: "100%",
    height: "100%",
  },
  slideFrame: {
    width: SCREEN_WIDTH - 32, // Adjusted for screen padding
    height: 340,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  zoomBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(17, 24, 39, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0, // Sharp corners
  },
  zoomBadgeText: {
    fontSize: 10,
    fontWeight: "400", // Clean regular weight
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  navOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 0, // Sharp corners
    backgroundColor: "rgba(17, 24, 39, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailSection: {
    width: "100%",
    gap: 6,
  },
  thumbnailLabel: {
    fontSize: 9,
    fontWeight: "500", // Clean regular weight
    color: "#6b7280",
    letterSpacing: 0.8,
    alignSelf: "flex-end",
  },
  thumbnailList: {
    gap: 8,
  },
  thumbnailItem: {
    width: 56,
    height: 56,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedThumbnailItem: {
    borderColor: "#004d26",
    borderWidth: 2,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },

  // Lightbox Modal
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "space-between",
  },
  lightboxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  counterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0, // Sharp corners
  },
  counterText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 0, // Sharp corners
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxImage: {
    width: SCREEN_WIDTH - 32,
    height: "100%",
  },
});