import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "../currency/Price";

// If you ported your custom Price component to React Native, import it here:
// import { Price } from "@/components/currency/Price";

interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export function ProductCard({ product }: Props) {
  // Determine selected color or default to first color option safely
  const color =
    product.colors?.find((c) => c.id === product.selectedColorId) ??
    product.colors?.[0];

  const imageUrl =
    color?.images?.[0]?.imageUrl ?? "https://via.placeholder.com/300";

  // Safely extract price from the active color's variants or fall back across colors
  const basePrice =
    color?.variants?.[0]?.price ??
    product.colors?.flatMap((c) => c.variants ?? [])[0]?.price ??
    0;

  return (
    <Link
      href={{
        pathname: "/products/[slug]",
        params: {
          slug: product.slug, // Uses raw product slug for getBySlug on backend
          ...(color?.id ? { color: color.id } : {}),
        },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        {/* 1. Image Showcase Frame */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Minimalist Color Swatch Preview Pill */}
          {product.colors && product.colors.length > 1 && (
            <View style={styles.swatchPill}>
              {product.colors.slice(0, 4).map((c) => (
                <View
                  key={c.id}
                  style={[
                    styles.swatchDot,
                    {
                      backgroundColor: c.hexCode ?? c.name.toLowerCase(),
                    },
                    c.id === color?.id && styles.activeSwatchDot,
                  ]}
                />
              ))}
              {product.colors.length > 4 && (
                <Text style={styles.moreColorsText}>
                  +{product.colors.length - 4}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* 2. Content & Metadata Section */}
        <View style={styles.content}>
          <View style={styles.headerGroup}>
            {product.brand?.name ? (
              <Text style={styles.brandText} numberOfLines={1}>
                {product.brand.name}
              </Text>
            ) : null}

            <Text style={styles.titleText} numberOfLines={1}>
              {product.name}
            </Text>
          </View>

          {/* 3. Price Display */}
          <View style={styles.priceRow}>
            <Price
              price={Number(basePrice)}
              style={styles.priceText}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6", // border-gray-100
  },
  imageContainer: {
    position: "relative",
    height: 160, // Scaled for mobile card layout
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#f9fafb", // bg-gray-50
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  swatchPill: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // bg-white/90
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  swatchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  activeSwatchDot: {
    borderWidth: 1.5,
    borderColor: "#002b15", // ring-[#002b15]
  },
  moreColorsText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#9ca3af", // text-gray-400
    marginLeft: 1,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 2,
    gap: 4,
  },
  headerGroup: {
    gap: 2,
  },
  brandText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9ca3af", // text-gray-400
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827", // text-gray-900
  },
  priceRow: {
    paddingTop: 2,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#002b15", // text-[#002b15]
    letterSpacing: -0.3,
  },
});