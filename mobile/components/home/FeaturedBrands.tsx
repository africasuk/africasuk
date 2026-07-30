import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import type { Brand } from "@africasuk/types";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({
  brands = [],
}: Props) {
  if (!brands.length) return null;

  const visibleBrands = brands.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Popular Brands</Text>

          <Text style={styles.subtitle}>
            Shop official collections from certified international global
            partners.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/brands" as never)}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {visibleBrands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/brands/${brand.slug}` as never)
            }
          >
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.brandName}>
                {brand.name}
              </Text>

              <Text numberOfLines={2} style={styles.description}>
                {brand.description ??
                  `Discover authentic products from the official ${brand.name} catalog.`}
              </Text>
            </View>

            {brand.logoUrl ? (
              <Image
                source={{ uri: brand.logoUrl }}
                style={styles.logo}
                resizeMode="contain"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fafafa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  viewAll: {
    color: "#005c2e",
    fontWeight: "700",
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ececec",
    minHeight: 170,
    justifyContent: "space-between",
  },

  brandName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
  },

  description: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },

  logo: {
    width: 56,
    height: 56,
    alignSelf: "flex-end",
  },

  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  placeholderText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#005c2e",
  },
});