import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
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

  const imagesCount = images?.length ?? 0;

  // Reset selected index when the images prop updates (e.g. user selects a different color variant)
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? imagesCount - 1 : prev - 1));
  }, [imagesCount]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
  }, [imagesCount]);

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No image available</Text>
      </View>
    );
  }

  // Ensure selectedIndex never exceeds array bounds
  const safeIndex = selectedIndex >= images.length ? 0 : selectedIndex;

  const currentImageSrc =
    images[safeIndex]?.imageUrl &&
    images[safeIndex].imageUrl.startsWith("http")
      ? images[safeIndex].imageUrl
      : "https://via.placeholder.com/600";

  return (
    <View style={styles.container}>
      {/* 1. Main Display Card */}
      <Pressable
        onPress={() => setIsLightboxOpen(true)}
        style={styles.mainImageCard}
      >
        <Image
          source={{ uri: currentImageSrc }}
          style={styles.mainImage}
          contentFit="cover"
          transition={200}
        />

        {/* Zoom Hint Badge */}
        <View style={styles.zoomBadge}>
          <Maximize2 size={12} color="#ffffff" />
          <Text style={styles.zoomBadgeText}>Tap for full screen</Text>
        </View>

        {/* Navigation Overlay Arrows */}
        {images.length > 1 && (
          <View style={styles.navOverlay}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={styles.navButton}
            >
              <ChevronLeft size={20} color="#111827" />
            </Pressable>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={[styles.navButton, styles.primaryNavButton]}
            >
              <ChevronRight size={20} color="#ffffff" />
            </Pressable>
          </View>
        )}
      </Pressable>

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
                  onPress={() => setSelectedIndex(index)}
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
              <X size={20} color="#ffffff" />
            </Pressable>
          </View>

          {/* Full Screen Image Stage */}
          <View style={styles.lightboxStage}>
            <Image
              source={{ uri: currentImageSrc }}
              style={styles.lightboxImage}
              contentFit="contain"
            />
          </View>

          {/* Lightbox Controls */}
          {images.length > 1 && (
            <View style={styles.lightboxControls}>
              <Pressable onPress={handlePrev} style={styles.lightboxArrow}>
                <ChevronLeft size={24} color="#ffffff" />
              </Pressable>

              <Pressable onPress={handleNext} style={styles.lightboxArrow}>
                <ChevronRight size={24} color="#ffffff" />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  emptyContainer: {
    height: 320,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  mainImageCard: {
    position: "relative",
    width: "100%",
    height: 360,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  zoomBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 43, 21, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  zoomBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  primaryNavButton: {
    backgroundColor: "#002b15",
    borderColor: "#002b15",
  },
  thumbnailSection: {
    width: "100%",
    gap: 6,
  },
  thumbnailLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1,
    alignSelf: "flex-end",
  },
  thumbnailList: {
    gap: 10,
  },
  thumbnailItem: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnailItem: {
    borderColor: "#002b15",
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
    paddingHorizontal: 20,
    zIndex: 10,
  },
  counterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  lightboxImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.7,
  },
  lightboxControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  lightboxArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});