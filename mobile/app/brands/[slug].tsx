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
     const {
      data: brand,
      error: brandError,
    } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .single<Brand>();

      if (brandError || !brand) {
        setError("Brand not found.");
        return;
      }

      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*, colors:product_colors(*)")
        .eq("brand_id", brand.id);

      if (productError) throw productError;

      setBrand(brand as Brand);
      setProducts((products as ProductWithDetails[]) ?? []);
    } catch (err) {
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
        >
          <ArrowLeft size={16} color="#ffffff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Brand Header Card */}
      <View style={styles.brandCard}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          {brand.logoUrl ? (
            <Image
              source={{ uri: brand.logoUrl }}
              style={styles.logoImage}
              contentFit="contain"
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
          headerTitleStyle: { fontWeight: "800", color: BRAND_DARK },
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
    backgroundColor: "#f4f4f4",
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
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
    fontSize: 28,
    fontWeight: "900",
    color: BRAND_COLOR,
  },
  brandDetails: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "900",
    color: BRAND_DARK,
  },
  brandDescription: {
    fontSize: 12,
    fontWeight: "500",
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  productBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4b5563",
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  websiteText: {
    fontSize: 11,
    fontWeight: "800",
    color: BRAND_COLOR,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
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
    borderRadius: 9999,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
});