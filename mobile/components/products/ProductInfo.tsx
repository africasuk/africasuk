import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Share,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Share2, Copy, Check } from "lucide-react-native";

import type { ProductWithDetails } from "@africasuk/types";

interface Props {
  product: ProductWithDetails;
}

const BRAND_COLOR = "#005c2e";

export function ProductInfo({ product }: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const productUrl = `https://africasuk.com/products/${product.slug}`;

  // Reset the expanded description when the product changes.
  useEffect(() => {
    setIsExpanded(false);
    setCopied(false);
  }, [product.id]);

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        title: product.name,
        message: `${product.name} - ${productUrl}`,
        url: productUrl,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const hasDescription = Boolean(product.description?.trim());

  return (
    <View style={styles.container}>
      {/* Top Metadata & Action Buttons */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          {product.brand && (
            <View style={styles.brandPill}>
              <Text
                style={styles.brandText}
                numberOfLines={1}
              >
                {product.brand.name}
              </Text>
            </View>
          )}

          {product.category && (
            <Text
              style={styles.categoryText}
              numberOfLines={1}
            >
              {product.category.name}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGroup}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share product link"
            onPress={handleNativeShare}
            style={({ pressed }) => [
              styles.actionPill,
              pressed && styles.pressedState,
            ]}
            hitSlop={6}
          >
            <Share2
              size={13}
              color="#52525b"
              strokeWidth={2}
            />
            <Text style={styles.actionPillText}>Share</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              copied ? "Link copied" : "Copy product link"
            }
            onPress={handleCopyLink}
            style={({ pressed }) => [
              styles.actionPill,
              copied && styles.copiedPill,
              pressed && styles.pressedState,
            ]}
            hitSlop={6}
          >
            {copied ? (
              <>
                <Check
                  size={13}
                  color="#ffffff"
                  strokeWidth={2.4}
                />
                <Text style={styles.copiedPillText}>
                  Copied
                </Text>
              </>
            ) : (
              <>
                <Copy
                  size={13}
                  color="#52525b"
                  strokeWidth={2}
                />
                <Text style={styles.actionPillText}>
                  Copy
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Product Title */}
      <Text style={styles.title}>
        {product.name}
      </Text>

      {/* Product Description */}
      {hasDescription && (
        <View style={styles.descriptionBlock}>
          <Text
            numberOfLines={isExpanded ? undefined : 1}
            style={styles.descriptionText}
          >
            {product.description}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isExpanded
                ? "Show less description"
                : "Read more description"
            }
            accessibilityState={{ expanded: isExpanded }}
            onPress={() => setIsExpanded((prev) => !prev)}
            style={styles.readMoreTrigger}
            hitSlop={8}
          >
            <Text style={styles.readMoreText}>
              {isExpanded ? "Show less" : "Read more"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    gap: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },

  brandPill: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    flexShrink: 1,
  },

  brandText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
    textTransform: "capitalize",
    flexShrink: 1,
  },

  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },

  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  copiedPill: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  pressedState: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  actionPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3f3f46",
  },

  copiedPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.3,
    lineHeight: 26,
    marginTop: 2,
  },

  descriptionBlock: {
    marginTop: 2,
  },

  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#52525b",
    fontWeight: "400",
  },

  readMoreTrigger: {
    alignSelf: "flex-start",
    marginTop: 4,
  },

  readMoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLOR,
  },
});