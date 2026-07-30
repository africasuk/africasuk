import { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import type { ProductWithDetails } from "@africasuk/types";

import type { CartItem } from "../../types/cart";
import { Price } from "../currency/Price";

import { WishlistButton } from "./WishlistButton";
import { AddToCartButton } from "./AddToCartButton";

type ColorWithDetails = ProductWithDetails["colors"][number];

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";

interface Props {
  product: ProductWithDetails;
  onColorChange?: (color: ColorWithDetails) => void;
}

export function VariantSelector({ product, onColorChange }: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorWithDetails>(
    product.colors[0]
  );

  const [selectedVariant, setSelectedVariant] = useState(
    product.colors[0]?.variants[0]
  );

  // Sync internal state whenever the incoming product or colors prop updates
  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      const activeColor = product.colors[0];
      setSelectedColor(activeColor);

      setSelectedVariant((prevVariant) => {
        const matchingVariant = activeColor.variants.find(
          (v) => v.optionValue === prevVariant?.optionValue
        );
        return matchingVariant ?? activeColor.variants[0];
      });
    }
  }, [product]);

  // Helper to handle color updates and inform parent gallery
  const updateSelectedColor = (color: ColorWithDetails) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const allSizes = useMemo(() => {
    const sizeMap = new Map<string, { optionName: string; value: string }>();
    product.colors.forEach((c) => {
      c.variants.forEach((v) => {
        if (!sizeMap.has(v.optionValue)) {
          sizeMap.set(v.optionValue, {
            optionName: v.optionName || "SIZE",
            value: v.optionValue,
          });
        }
      });
    });
    return Array.from(sizeMap.values());
  }, [product]);

  if (!selectedColor || !selectedVariant) {
    return null;
  }

  const handleSizeSelect = (sizeValue: string) => {
    const matchingVariantInCurrentColor = selectedColor.variants.find(
      (v) => v.optionValue === sizeValue
    );

    if (matchingVariantInCurrentColor) {
      setSelectedVariant(matchingVariantInCurrentColor);
      return;
    }

    const colorWithSize = product.colors.find((c) =>
      c.variants.some((v) => v.optionValue === sizeValue)
    );

    if (colorWithSize) {
      updateSelectedColor(colorWithSize);
      const variant = colorWithSize.variants.find(
        (v) => v.optionValue === sizeValue
      );
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  const item: CartItem = {
    variantId: selectedVariant.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(selectedVariant.price),
    stock: selectedVariant.stock,
    allowCod: product.allowCod,
    allowOnlinePayment: product.allowOnlinePayment,
    image: selectedColor.images[0]?.imageUrl ?? "https://via.placeholder.com/150",
    options: [
      {
        optionName: "Color",
        value: selectedColor.name,
      },
      {
        optionName: selectedVariant.optionName,
        value: selectedVariant.optionValue,
      },
    ],
    quantity: 1,
  };

  return (
    <View style={styles.container}>
      {/* 1. COLOR SELECTION */}
      {product.colors.length > 1 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>COLOR</Text>
            <Text style={styles.colorNameValue}>{selectedColor.name}</Text>
          </View>

          <View style={styles.chipsContainer}>
            {product.colors.map((color) => {
              const isSelected = selectedColor.id === color.id;

              return (
                <Pressable
                  key={color.id}
                  onPress={() => {
                    updateSelectedColor(color);
                    const matchingVariant = color.variants.find(
                      (v) => v.optionValue === selectedVariant.optionValue
                    );
                    setSelectedVariant(matchingVariant ?? color.variants[0]);
                  }}
                  style={({ pressed }) => [
                    styles.colorChip,
                    isSelected ? styles.selectedColorChip : styles.unselectedColorChip,
                    pressed && styles.pressedState,
                  ]}
                >
                  <View style={styles.thumbnailBubble}>
                    {color.images[0]?.imageUrl ? (
                      <Image
                        source={{ uri: color.images[0].imageUrl }}
                        style={styles.chipThumbnail}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.chipThumbnail,
                          { backgroundColor: color.hexCode ?? "#e5e7eb" },
                        ]}
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.colorChipText,
                      isSelected ? styles.selectedColorText : styles.unselectedColorText,
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

      {/* 2. SIZES */}
      {allSizes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {allSizes[0]?.optionName || "SIZE"}
          </Text>

          <View style={styles.chipsContainer}>
            {allSizes.map((size) => {
              const isSelected = selectedVariant.optionValue === size.value;
              const isAvailableInCurrentColor = selectedColor.variants.some(
                (v) => v.optionValue === size.value
              );

              return (
                <Pressable
                  key={size.value}
                  onPress={() => handleSizeSelect(size.value)}
                  style={({ pressed }) => [
                    styles.sizeButton,
                    isSelected
                      ? styles.selectedSizeButton
                      : isAvailableInCurrentColor
                      ? styles.availableSizeButton
                      : styles.unavailableSizeButton,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      isSelected
                        ? styles.selectedSizeText
                        : isAvailableInCurrentColor
                        ? styles.availableSizeText
                        : styles.unavailableSizeText,
                    ]}
                  >
                    {size.value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* 3. PRICE & STOCK DISPLAY */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Price price={Number(selectedVariant.price)} />

          <View
            style={[
              styles.stockBadgeWrapper,
              selectedVariant.stock > 0 ? styles.inStockBg : styles.outOfStockBg,
            ]}
          >
            <Text
              style={[
                styles.stockBadgeText,
                selectedVariant.stock > 0 ? styles.inStockText : styles.outOfStockText,
              ]}
            >
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock"}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. ACTIONS */}
      <View style={styles.actionsRow}>
        <View style={styles.addToCartFlex}>
          <AddToCartButton item={item} />
        </View>
        <WishlistButton item={item} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  colorNameValue: {
    fontSize: 12,
    fontWeight: "800",
    color: BRAND_DARK,
    textTransform: "capitalize",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  selectedColorChip: {
    borderColor: BRAND_LIGHT,
    backgroundColor: "#ecfdf5",
  },
  unselectedColorChip: {
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  thumbnailBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#f3f4f6",
  },
  chipThumbnail: {
    width: "100%",
    height: "100%",
  },
  colorChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  selectedColorText: {
    color: BRAND_DARK,
  },
  unselectedColorText: {
    color: "#4b5563",
  },
  sizeButton: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1.5,
  },
  selectedSizeButton: {
    backgroundColor: BRAND_DARK,
    borderColor: BRAND_DARK,
  },
  availableSizeButton: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  unavailableSizeButton: {
    backgroundColor: "#f9fafb",
    borderColor: "#f3f4f6",
  },
  sizeButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
  selectedSizeText: {
    color: "#ffffff",
  },
  availableSizeText: {
    color: "#111827",
  },
  unavailableSizeText: {
    color: "#9ca3af",
  },
  priceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stockBadgeWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  inStockBg: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  inStockText: {
    color: "#047857",
  },
  outOfStockBg: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  outOfStockText: {
    color: "#dc2626",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 4,
  },
  addToCartFlex: {
    flex: 1,
  },
  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});