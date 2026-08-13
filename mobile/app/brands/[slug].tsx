import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Globe, ArrowLeft } from "lucide-react-native";

import type { Brand, ProductWithDetails } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import { ProductCard } from "@/components/products/ProductCard";

const BRAND_COLOR = "#005c2e";
const BRAND_DARK = "#002b15";

export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrandData = useCallback(async () => {
    if (!slug) return;

    try {
      setError(null);

      const supabase = createClient();

      // =========================
      // BRAND
      // =========================
      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .single();

      if (brandError || !brandData) {
        setError("Brand not found.");
        return;
      }

      // DB uses snake_case, app uses camelCase
      const brand: Brand = {
        ...(brandData as any),
        logoUrl: (brandData as any).logo_url ?? null,
      };

      // =========================
      // PRODUCTS + COLORS + IMAGES
      // =========================
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          colors:product_colors(
            *,
            images:product_images(*)
          )
        `)
        .eq("brand_id", brand.id);

      if (productError) throw productError;

      // Convert DB fields to mobile TypeScript fields
      const mappedProducts: ProductWithDetails[] = (productData ?? []).map(
        (product: any) => ({
          ...product,

          colors: (product.colors ?? []).map((color: any) => ({
            ...color,

            // product_images uses snake_case in Supabase
            images: (color.images ?? []).map((image: any) => ({
              ...image,
              imageUrl: image.image_url ?? image.url ?? null,
            })),
          })),
        })
      );

      setBrand(brand);
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Failed to fetch brand:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBrandData();
  };

  const handleOpenWebsite = (url: string) => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = `https://${url}`;
    }
    Linking.openURL(formattedUrl).catch(() => {
      // Fallback handling if URL fails to open
    });
  };

  // Flatten products by color variants for the grid layout
  const flattenedVariants = products.flatMap((product) =>
    product.colors.map((color) => ({
      key: `${product.id}-${color.id}`,
      product: {
        ...product,
        name: `${product.name} - ${color.name}`,
        colors: [color],
      },
    }))
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
      </View>
    );
  }

  if (error || !brand) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Brand Not Found" }} />
        <Text style={styles.errorTitle}>
          {error ?? "Brand could not be found"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <ArrowLeft size={16} color="#ffffff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Brand Header Card - Sharp Corners */}
      <View style={styles.brandCard}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          {brand.logoUrl ? (
            <Image
              source={{
                uri: String(brand.logoUrl).trim(),
              }}
              style={styles.logoImage}
              contentFit="contain"
              cachePolicy="disk"
              transition={200}
            />
          ) : (
            <Text style={styles.logoFallback}>
              {brand.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        {/* Brand Meta */}
        <View style={styles.brandDetails}>
          <Text style={styles.brandName} numberOfLines={1}>
            {brand.name}
          </Text>

          {brand.description && (
            <Text style={styles.brandDescription} numberOfLines={3}>
              {brand.description}
            </Text>
          )}

          <View style={styles.tagsRow}>
            <View style={styles.productBadge}>
              <Text style={styles.productBadgeText}>
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </Text>
            </View>

            {brand.website && (
              <TouchableOpacity
                style={styles.websiteButton}
                activeOpacity={0.7}
                onPress={() => handleOpenWebsite(brand.website!)}
              >
                <Globe size={12} color={BRAND_COLOR} />
                <Text style={styles.websiteText}>Visit Website</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: brand.name,
          headerTitleStyle: { fontWeight: "500", color: BRAND_DARK },
        }}
      />

      <FlatList
        data={flattenedVariants}
        numColumns={2}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[BRAND_COLOR]}
            tintColor={BRAND_COLOR}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              There are no products available for this brand yet. Please check
              back later.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard product={item.product} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridItem: {
    width: "48.5%",
  },
  headerContainer: {
    marginBottom: 16,
  },
  brandCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    gap: 14,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  logoFallback: {
    fontSize: 24,
    fontWeight: "500", // Clean weight
    color: BRAND_COLOR,
  },
  brandDetails: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "500", // Clean regular weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  brandDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
    lineHeight: 16,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  productBadge: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0, // Sharp corners
  },
  productBadgeText: {
    fontSize: 11,
    fontWeight: "500", // Clean weight
    color: "#4b5563",
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  websiteText: {
    fontSize: 11,
    fontWeight: "500", // Clean weight
    color: BRAND_COLOR,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 18,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 0, // Sharp corners design language
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "500", // Clean weight
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});