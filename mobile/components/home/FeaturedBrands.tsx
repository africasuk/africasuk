import { StyleSheet, Text, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import type { Brand } from "@africasuk/types";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  const router = useRouter();

  if (!brands.length) return null;

  const visibleBrands = brands.slice(0, 6);

  const handleNavigateAllBrands = () => {
    try {
      // Try push to brands route
      router.push("/brands" as never);
    } catch {
      // Fallback in case route is nested inside (tabs)
      try {
        router.push("/(tabs)/brands" as never);
      } catch (err) {
        console.warn("Could not route to brands:", err);
      }
    }
  };

  const handleNavigateBrand = (slug: string) => {
    router.push(`/brands/${slug}` as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Featured Brands</Text>
        <Text style={styles.subtitle}>
          Verified collections from global partners
        </Text>
      </View>

      {/* 3-Column Grid */}
      <View style={styles.grid}>
        {visibleBrands.map((brand) => (
          <Pressable
            key={brand.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleNavigateBrand(brand.slug)}
          >
            {/* Logo Frame */}
            <View style={styles.imageContainer}>
              {brand.logoUrl ? (
                <Image
                  source={{ uri: brand.logoUrl }}
                  style={styles.logo}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    {brand.name.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Brand Name */}
            <Text numberOfLines={1} style={styles.brandName}>
              {brand.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Bottom Explore Action */}
      <Pressable
        style={({ pressed }) => [
          styles.allBrandsBtn,
          pressed && styles.allBrandsBtnPressed,
        ]}
        onPress={handleNavigateAllBrands}
      >
        <Text style={styles.allBrandsBtnText}>Explore All Brands</Text>
        <ArrowRight size={14} color="#18181b" strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },

  header: {
    marginBottom: 16,
    gap: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  subtitle: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "400",
  },

  /* 3-Column Layout */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  card: {
    width: "31.5%",
    alignItems: "center",
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#52525b",
    letterSpacing: 0.5,
  },

  brandName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#27272a",
    textAlign: "center",
    width: "100%",
    letterSpacing: -0.1,
  },

  allBrandsBtn: {
    width: "100%",
    height: 44,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },

  allBrandsBtnPressed: {
    backgroundColor: "#e4e4e7",
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  allBrandsBtnText: {
    color: "#18181b",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});