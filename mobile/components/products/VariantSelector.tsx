import { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ruler } from "lucide-react-native";
import type { ProductWithDetails } from "@africasuk/types";

import type { CartItem } from "../../types/cart";
import { Price } from "../currency/Price";

import { WishlistButton } from "./WishlistButton";
import { AddToCartButton } from "./AddToCartButton";

type ColorWithDetails = ProductWithDetails["colors"][number];

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

  const isOutOfStock = selectedVariant.stock <= 0;

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
      {/* 1. TOP HEADER: PRICE & AVAILABILITY STATUS FIRST */}
      <View style={styles.topPriceRow}>
        <View style={styles.priceGroup}>
          <Price
            price={Number(selectedVariant.price)}
            style={styles.priceValue}
          />
        </View>

        <View
          style={[
            styles.stockTag,
            isOutOfStock ? styles.outOfStockTag : styles.inStockTag,
          ]}
        >
          <View
            style={[
              styles.stockDot,
              isOutOfStock ? styles.outOfStockDot : styles.inStockDot,
            ]}
          />
          <Text
            style={[
              styles.stockText,
              isOutOfStock ? styles.outOfStockText : styles.inStockText,
            ]}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2. COLOR PICKER: PURE 1:1 VISUAL TILES */}
      {product.colors.length > 1 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Color</Text>
            <Text style={styles.selectedMetaText}>{selectedColor.name}</Text>
          </View>

          <View style={styles.colorGrid}>
            {product.colors.map((color) => {
              const isSelected = selectedColor.id === color.id;
              const colorImage = color.images?.[0]?.imageUrl;

              return (
                <Pressable
                  key={color.id}
                  onPress={() => {
  updateSelectedColor(color);
  setSelectedVariant(color.variants[0]);
}}
                  style={({ pressed }) => [
                    styles.colorCard,
                    isSelected ? styles.selectedColorCard : styles.unselectedColorCard,
                    pressed && styles.pressedState,
                  ]}
                >
                  <View style={styles.imageBox}>
                    {colorImage ? (
                      <Image
                        source={{ uri: colorImage }}
                        style={styles.cardImage}
                        contentFit="cover"
                        transition={150}
                        cachePolicy="memory-disk"
                      />
                    ) : (
                      <View
                        style={[
                          styles.fallbackColor,
                          { backgroundColor: color.hexCode ?? "#e4e4e7" },
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* 3. SIZE SELECTOR WITH HELPER NOTICE */}
      {allSizes.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {allSizes[0]?.optionName || "Size"}
            </Text>
            <Text style={styles.selectedMetaText}>
              Selected: <Text style={styles.boldText}>{selectedVariant.optionValue}</Text>
            </Text>
          </View>

          {/* Clean Neutral Fit Guidance Notice */}
          <View style={styles.sizeNoticeBox}>
            <Ruler size={14} color="#52525b" strokeWidth={1.75} />
            <Text style={styles.sizeNoticeText}>
              Make sure to select your accurate size before checkout.
            </Text>
          </View>

          <View style={styles.sizeRow}>
            {allSizes.map((size) => {
              const isSelected = selectedVariant.optionValue === size.value;
              const isAvailable = selectedColor.variants.some(
                (v) => v.optionValue === size.value
              );

              return (
                <Pressable
                  key={size.value}
                  onPress={() => handleSizeSelect(size.value)}
                  style={({ pressed }) => [
                    styles.sizePill,
                    isSelected
                      ? styles.selectedSizePill
                      : isAvailable
                      ? styles.availableSizePill
                      : styles.unavailableSizePill,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      isSelected
                        ? styles.selectedSizeText
                        : isAvailable
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

      {/* 4. ACTIONS (ADD TO CART & WISHLIST) */}
      <View style={styles.actionRow}>
        <View style={styles.ctaWrapper}>
          <AddToCartButton item={item} />
        </View>
        <WishlistButton item={item} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  /* Price & Stock Header */
  topPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceGroup: {
    justifyContent: "center",
  },

  priceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.5,
  },

  stockTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },

  inStockTag: {
    backgroundColor: "#f4f4f5",
    borderColor: "#e4e4e7",
  },

  outOfStockTag: {
    backgroundColor: "#fef2f2",
    borderColor: "#fee2e2",
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  inStockDot: {
    backgroundColor: "#16a34a",
  },

  outOfStockDot: {
    backgroundColor: "#dc2626",
  },

  stockText: {
    fontSize: 12,
    fontWeight: "600",
  },

  inStockText: {
    color: "#27272a",
  },

  outOfStockText: {
    color: "#dc2626",
  },

  divider: {
    height: 1,
    backgroundColor: "#f4f4f5",
  },

  /* Section Styles */
  section: {
    gap: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  selectedMetaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  boldText: {
    fontWeight: "700",
    color: "#18181b",
  },

  /* Pure Visual 1:1 Color Grid */
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  colorCard: {
    width: 60,
    height: 60,
    padding: 2,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: "#ffffff",
  },

  selectedColorCard: {
    borderColor: "#18181b",
  },

  unselectedColorCard: {
    borderColor: "#e4e4e7",
  },

  imageBox: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  fallbackColor: {
    width: "100%",
    height: "100%",
  },

  /* Sizing Notice & Pills */
  sizeNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },

  sizeNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#52525b",
    lineHeight: 16,
  },

  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  sizePill: {
    minWidth: 48,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedSizePill: {
    backgroundColor: "#18181b",
    borderColor: "#18181b",
  },

  availableSizePill: {
    backgroundColor: "#ffffff",
    borderColor: "#e4e4e7",
  },

  unavailableSizePill: {
    backgroundColor: "#fafafa",
    borderColor: "#f4f4f5",
    opacity: 0.5,
  },

  sizeText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  selectedSizeText: {
    color: "#ffffff",
  },

  availableSizeText: {
    color: "#18181b",
  },

  unavailableSizeText: {
    color: "#a1a1aa",
    textDecorationLine: "line-through",
  },

  /* Bottom Actions */
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
  },

  ctaWrapper: {
    flex: 1,
  },

  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});