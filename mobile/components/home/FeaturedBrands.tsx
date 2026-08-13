import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

import type { Brand } from "@africasuk/types";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  if (!brands.length) return null;

  const visibleBrands = brands.slice(0, 6);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.title}>Popular Brands</Text>
          <Text style={styles.subtitle}>
            Shop official collections from certified international global partners.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/brands" as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {visibleBrands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push(`/brands/${brand.slug}` as never)
            }
          >
            <View style={styles.cardInfo}>
              <Text numberOfLines={1} style={styles.brandName}>
                {brand.name}
              </Text>

              <Text numberOfLines={2} style={styles.description}>
                {brand.description ??
                  `Discover authentic products from the official ${brand.name} catalog.`}
              </Text>
            </View>

            {/* Logo / Avatar Frame - Sharp Corners */}
            {brand.logoUrl ? (
              <Image
                source={{ uri: brand.logoUrl }}
                style={styles.logo}
                contentFit="contain"
                transition={200}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {brand.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Full-width "All Brands" Button at Bottom */}
      <TouchableOpacity
        style={styles.allBrandsBtn}
        activeOpacity={0.85}
        onPress={() => router.push("/brands" as never)}
      >
        <Text style={styles.allBrandsBtnText}>All Brands</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },

  textGroup: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },

  viewAllBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },

  viewAllText: {
    color: "#111827",
    fontWeight: "500", // Non-bold clean button weight
    fontSize: 12,
    letterSpacing: 0.2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 160,
    justifyContent: "space-between",
  },

  cardInfo: {
    flex: 1,
  },

  brandName: {
    fontSize: 14,
    fontWeight: "500", // Clean regular title weight
    color: "#111827",
  },

  description: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
    lineHeight: 16,
  },

  logo: {
    width: 48,
    height: 48,
    alignSelf: "flex-end",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 0, // Sharp corners
  },

  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  placeholderText: {
    fontSize: 18,
    fontWeight: "500", // Clean weight
    color: "#005c2e",
  },

  allBrandsBtn: {
    width: "100%",
    height: 46,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 0, // Sharp corners
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  allBrandsBtnText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "500", // Unbolded clean weight
    letterSpacing: 0.3,
  },
});