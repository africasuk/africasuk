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

const mappedBrands: Brand[] = ((data ?? []) as (Brand & { logo_url?: string | null })[]).map((brand) => ({
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
            color: "#002b15",
          },
        }}
      />

      <FlatList
        data={brands}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
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
              Explore products from our trusted brands.
            </Text>
          </View>
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
            activeOpacity={0.85}
            onPress={() => router.push(`/brands/${item.slug}` as never)}
          >
            {/* Brand Logo */}
            <View style={styles.logoContainer}>
              {item.logoUrl ? (
                <Image
                  source={{ uri: item.logoUrl }}
                  style={styles.logo}
                  contentFit="contain"
                  transition={200}
                />
              ) : (
                <Text style={styles.fallback}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>

            {/* Brand Name */}
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
    backgroundColor: "#f4f4f4",
    paddingTop: 50,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },

  list: {
    padding: 16,
    paddingBottom: 32,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  card: {
    width: "48.5%",
    minHeight: 150,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    width: 90,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  fallback: {
    fontSize: 30,
    fontWeight: "700",
    color: BRAND_COLOR,
  },

  brandName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  empty: {
    padding: 40,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});