import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import type { ProductWithDetails } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

// Components
import SearchProductList from "@/components/search/SearchProductList";
import SearchEmptyState from "@/components/search/SearchEmptyState";

import AppHeader from "@/components/layout/AppHeader";
import { SearchBar } from "react-native-screens";

const BRAND = "#004d26";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const query = params.q ?? "";

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          colors:product_colors(
            *,
            images:product_images(*),
            variants:product_variants(*)
          )
        `)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      if (error) throw error;

      setProducts((data as ProductWithDetails[]) ?? []);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(query);
  }, [query, fetchSearchResults]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <AppHeader
        showBack
        title="Search"
        showCart
      />

      <View style={styles.container}>
        {/* Search Bar Input Container */}
        <View style={styles.searchBarWrapper}>
          <SearchBar
            placeholder={query || "Search products, categories..."}
            autoFocus={false}
          />
        </View>

        {/* Header Title Meta */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {query ? `Search results for "${query}"` : "Search products"}
          </Text>

          <Text style={styles.subtitle}>
            Showing matching items across all colors and variants
          </Text>
        </View>

        {/* Content Section */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={BRAND} />
          </View>
        ) : products.length === 0 ? (
          <SearchEmptyState query={query} />
        ) : (
          <SearchProductList products={products} />
        )}
      </View>
    </SafeAreaView>
  );
}

type Styles = {
  safeArea: ViewStyle;
  container: ViewStyle;
  searchBarWrapper: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  centerContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBarWrapper: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "500", // Non-bold clean header weight
    color: "#111827",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});