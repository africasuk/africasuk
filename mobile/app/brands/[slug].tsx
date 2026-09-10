import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Globe, ArrowLeft, AlertCircle, Package } from "lucide-react-native";

import type { Brand, ProductWithDetails } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import { ProductCard } from "@/components/products/ProductCard";

export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

      // Fetch Brand
      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .single();

      if (brandError || !brandData) {
        setError("Brand not found.");
        return;
      }

      const mappedBrand: Brand = {
        ...(brandData as any),
        logoUrl: (brandData as any).logo_url ?? null,
      };

      // Fetch Products with colors and images
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          colors:product_colors(
            *,
            images:product_images(*)
          )
        `)
        .eq("brand_id", mappedBrand.id);

      if (productError) throw productError;

      const mappedProducts: ProductWithDetails[] = (productData ?? []).map(
        (product: any) => ({
          ...product,
          colors: (product.colors ?? []).map((color: any) => ({
            ...color,
            images: (color.images ?? []).map((image: any) => ({
              ...image,
              imageUrl: image.image_url ?? image.url ?? null,
            })),
          })),
        })
      );

      setBrand(mappedBrand);
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Failed to fetch brand:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    Linking.openURL(formattedUrl).catch(() => {});
  };

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

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="small" color="#18181b" />
      </SafeAreaView>
    );
  }

  if (error || !brand) {
    return (
      <SafeAreaView style={styles.centered} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorIconCircle}>
          <AlertCircle size={24} color="#dc2626" strokeWidth={1.8} />
        </View>
        <Text style={styles.errorTitle}>
          {error ?? "Brand could not be found"}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={14} color="#ffffff" strokeWidth={2} />
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.brandCard}>
        {/* Brand Logo */}
        <View style={styles.logoContainer}>
          {brand.logoUrl ? (
            <Image
              source={{ uri: String(brand.logoUrl).trim() }}
              style={styles.logoImage}
              contentFit="contain"
              cachePolicy="disk"
              transition={150}
            />
          ) : (
            <Text style={styles.logoFallback}>
              {brand.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        {/* Brand Details */}
        <View style={styles.brandDetails}>
          <Text style={styles.brandName} numberOfLines={1}>
            {brand.name}
          </Text>

          {Boolean(brand.description) && (
            <Text style={styles.brandDescription} numberOfLines={3}>
              {brand.description}
            </Text>
          )}

          <View style={styles.tagsRow}>
            <View style={styles.productBadge}>
              <Text style={styles.productBadgeText}>
                {products.length} {products.length === 1 ? "product" : "products"}
              </Text>
            </View>

            {Boolean(brand.website) && (
              <Pressable
                style={({ pressed }) => [
                  styles.websiteButton,
                  pressed && styles.websiteButtonPressed,
                ]}
                hitSlop={6}
                onPress={() => handleOpenWebsite(brand.website!)}
              >
                <Globe size={13} color="#18181b" strokeWidth={1.8} />
                <Text style={styles.websiteText}>Website</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {brand.name}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <FlatList
        data={flattenedVariants}
        numColumns={2}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomInset + 20 },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#18181b"]}
            tintColor="#18181b"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Package size={22} color="#71717a" strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              There are no products listed under this brand yet. Please check back later.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard product={item.product} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    backgroundColor: "#ffffff",
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  iconButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  topBarSpacer: {
    width: 34,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
    gap: 12,
  },

  errorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18181b",
    textAlign: "center",
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 8,
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  listContent: {
    padding: 16,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
    gap: 12,
  },

  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    overflow: "hidden",
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  logoFallback: {
    fontSize: 22,
    fontWeight: "700",
    color: "#18181b",
  },

  brandDetails: {
    flex: 1,
    gap: 3,
  },

  brandName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  brandDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    lineHeight: 16,
  },

  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },

  productBadge: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  productBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52525b",
  },

  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  websiteButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  websiteText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#18181b",
  },

  emptyCard: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  emptySubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 17,
  },
});