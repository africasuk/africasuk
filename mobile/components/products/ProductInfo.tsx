import { useState } from "react";
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
              <Text style={styles.brandText} numberOfLines={1}>
                {product.brand.name}
              </Text>
            </View>
          )}

          {product.category && (
            <Text style={styles.categoryText} numberOfLines={1}>
              {product.category.name}
            </Text>
          )}
        </View>

        {/* Action Pills */}
        <View style={styles.actionsGroup}>
          <Pressable
            onPress={handleNativeShare}
            style={({ pressed }) => [
              styles.actionPill,
              pressed && styles.pressedState,
            ]}
            hitSlop={6}
          >
            <Share2 size={13} color="#4b5563" />
            <Text style={styles.actionPillText}>Share</Text>
          </Pressable>

          <Pressable
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
                <Check size={13} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.copiedPillText}>Copied</Text>
              </>
            ) : (
              <>
                <Copy size={13} color="#4b5563" />
                <Text style={styles.actionPillText}>Copy</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Product Title */}
      <Text style={styles.title}>{product.name}</Text>

      {/* Product Description */}
      {hasDescription && (
        <View style={styles.descriptionBlock}>
          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={styles.descriptionText}
          >
            {product.description}
          </Text>

          {product.description && product.description.length > 140 && (
            <Pressable
              onPress={() => setIsExpanded((prev) => !prev)}
              style={styles.readMoreTrigger}
              hitSlop={8}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },

  brandPill: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },

  brandText: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textTransform: "capitalize",
  },

  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  copiedPill: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  pressedState: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  actionPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4b5563",
  },

  copiedPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
    lineHeight: 28,
    marginTop: 2,
  },

  descriptionBlock: {
    marginTop: 4,
  },

  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4b5563",
    fontWeight: "400",
  },

  readMoreTrigger: {
    alignSelf: "flex-start",
    marginTop: 6,
  },

  readMoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLOR,
  },
});