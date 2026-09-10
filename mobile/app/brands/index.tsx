import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Stack } from "expo-router";

import type { Brand } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

const BRAND_COLOR = "#005c2e";

export default function BrandsScreen() {
  const router = useRouter();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      const mappedBrands: Brand[] = (
        (data ?? []) as (Brand & { logo_url?: string | null })[]
      ).map((brand) => ({
        ...brand,
        logoUrl: brand.logo_url ?? null,
      }));
      setBrands(mappedBrands);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBrands();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "All Brands",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#ffffff" },
        }}
      />

      <FlatList
        key="brands-grid-3-col"
        data={brands}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[BRAND_COLOR]}
            tintColor={BRAND_COLOR}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>All Brands</Text>
            <Text style={styles.subtitle}>
              Explore verified collections from our international partners.
            </Text>
          </View>
        }
        ListFooterComponent={
          brands.length > 0 ? (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.moreProductsBtn}
                activeOpacity={0.85}
                onPress={() => router.push("/products" as never)}
              >
                <Text style={styles.moreProductsBtnText}>
                  Explore More Products
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Brands Found</Text>
            <Text style={styles.emptyText}>
              Brands will appear here once they are added.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/brands/${item.slug}` as never)}
          >
            {/* Pinterest Rounded Card Container */}
            <View style={styles.imageContainer}>
              {item.logoUrl ? (
                <Image
                  source={{ uri: item.logoUrl }}
                  style={styles.logo}
                  contentFit="cover"
                  transition={250}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    {item.name.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Brand Name Underneath Only */}
            <Text numberOfLines={1} style={styles.brandName}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  /* 3-Column Card */
  card: {
    width: "31%",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b5563",
    letterSpacing: 0.5,
  },

  brandName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    width: "100%",
  },

  /* Bottom More Products Button */
  footerContainer: {
    marginTop: 18,
    paddingBottom: 20,
    width: "100%",
  },

  moreProductsBtn: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },

  moreProductsBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_COLOR,
    letterSpacing: -0.2,
  },

  empty: {
    padding: 40,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
});