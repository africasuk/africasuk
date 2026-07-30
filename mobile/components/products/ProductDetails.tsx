import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";

interface Props {
  product: ProductWithDetails;
  selectedColorId?: string;
  relatedProducts?: ProductWithDetails[];
}

export function ProductDetails({
  product,
  selectedColorId,
  relatedProducts = [],
}: Props) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.find((color) => color.id === selectedColorId) ??
      product.colors?.[0]
  );

  // Sync internal state when route parameters or product changes
  useEffect(() => {
    const targetColor =
      product.colors?.find((color) => color.id === selectedColorId) ??
      product.colors?.[0];
    setSelectedColor(targetColor);
  }, [selectedColorId, product]);

  return (
    <View style={styles.container}>
      {/* Product Gallery Section */}
      <View style={styles.galleryContainer}>
        <ProductGallery images={selectedColor?.images ?? []} />
      </View>

      {/* Product Info Section */}
      <View style={styles.infoContainer}>
        <ProductInfo product={product} />
      </View>

      {/* Options Section: Color Palette & Variant Selector */}
      <View style={styles.optionsContainer}>
        {/* Color Palette Selector */}
        {product.colors && product.colors.length > 0 && (
          <View style={styles.colorGroup}>
            <Text style={styles.sectionLabel}>Color</Text>
            <View style={styles.colorPillsContainer}>
              {product.colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <Pressable
                    key={color.id}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorPill,
                      isSelected ? styles.selectedPill : styles.unselectedPill,
                    ]}
                  >
                    <Text
                      style={[
                        styles.colorPillText,
                        isSelected
                          ? styles.selectedPillText
                          : styles.unselectedPillText,
                      ]}
                    >
                      {color.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Variant / Size Selector */}
        <View style={styles.variantContainer}>
          <VariantSelector
            product={{
              ...product,
              colors: selectedColor ? [selectedColor] : [],
            }}
          />
        </View>
      </View>

      {/* Bottom Section: Related Products */}
      {relatedProducts.length > 0 && (
        <View style={styles.relatedContainer}>
          <Text style={styles.relatedTitle}>Recommended For You</Text>
          <RelatedProducts products={relatedProducts} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  galleryContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 24,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
    gap: 20,
  },
  colorGroup: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  colorPillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedPill: {
    backgroundColor: "#002b15",
    borderColor: "#002b15",
  },
  unselectedPill: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  colorPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  selectedPillText: {
    color: "#ffffff",
  },
  unselectedPillText: {
    color: "#374151",
  },
  variantContainer: {
    marginTop: 4,
  },
  relatedContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 24,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
});