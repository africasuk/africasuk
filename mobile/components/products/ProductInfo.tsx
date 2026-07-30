import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Share,
  StyleSheet,
  Clipboard, // <-- React Native built-in
} from "react-native";
import { Share2, Copy, Check } from "lucide-react-native";

import type { ProductWithDetails } from "@africasuk/types";

interface Props {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: Props) {
  const [copied, setCopied] = useState(false);

  const productUrl = `https://africasuk.com/products/${product.slug}`;

    const handleCopyLink = async () => {
      try {
        await Clipboard.setString(productUrl);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
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

  return (
    <View style={styles.container}>
      {/* Category / Brand Row & Actions */}
      <View style={styles.headerRow}>
        <View style={styles.metadataContainer}>
          {product.category && (
            <Text style={styles.metadataText}>{product.category.name}</Text>
          )}
          {product.brand && product.category && (
            <Text style={styles.dotSeparator}>•</Text>
          )}
          {product.brand && (
            <Text style={styles.metadataText}>{product.brand.name}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Native Share */}
          <Pressable
            onPress={handleNativeShare}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Share2 size={14} color="#6b7280" />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>

          {/* Copy Link */}
          <Pressable
            onPress={handleCopyLink}
            style={({ pressed }) => [
              styles.actionButton,
              copied && styles.copiedButton,
              pressed && styles.buttonPressed,
            ]}
          >
            {copied ? (
              <>
                <Check size={14} color="#ffffff" />
                <Text style={styles.copiedButtonText}>Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#6b7280" />
                <Text style={styles.actionButtonText}>Copy Link</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* Product Title */}
      <Text style={styles.title}>{product.name}</Text>

      {/* Description */}
      {product.description ? (
        <Text style={styles.description}>{product.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  metadataText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dotSeparator: {
    fontSize: 11,
    color: "#9ca3af",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  copiedButton: {
    backgroundColor: "#002b15",
    borderColor: "#002b15",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
  },
  copiedButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
    fontWeight: "500",
  },
});