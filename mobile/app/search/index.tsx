import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, X, ArrowLeft } from "lucide-react-native";

import type { ProductWithDetails } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

// Components
import SearchProductList from "@/components/search/SearchProductList";
import SearchEmptyState from "@/components/search/SearchEmptyState";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();

  const [inputQuery, setInputQuery] = useState(params.q ?? "");
  const [activeQuery, setActiveQuery] = useState(params.q ?? "");
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
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
        .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`);

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
    if (params.q !== undefined) {
      setInputQuery(params.q);
      setActiveQuery(params.q);
      fetchSearchResults(params.q);
    }
  }, [params.q, fetchSearchResults]);

  function handleSearchSubmit() {
    setActiveQuery(inputQuery);
    fetchSearchResults(inputQuery);
  }

  function handleClear() {
    setInputQuery("");
    setActiveQuery("");
    setProducts([]);
  }

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Search Bar Row */}
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

        <View style={styles.searchInputWrapper}>
          <Search size={16} color="#71717a" strokeWidth={1.8} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, or categories..."
            placeholderTextColor="#a1a1aa"
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {inputQuery.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={6}>
              <X size={14} color="#71717a" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        {/* Results Metadata Header */}
        {activeQuery.trim().length > 0 && (
          <View style={styles.metaHeader}>
            <View style={styles.metaLeft}>
              <Text style={styles.metaTitle} numberOfLines={1}>
                Results for &quot;{activeQuery}&quot;
              </Text>
              <Text style={styles.metaSubtitle}>
                Showing matching inventory across all options
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {products.length} {products.length === 1 ? "match" : "matches"}
              </Text>
            </View>
          </View>
        )}

        {/* Dynamic Content States */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color="#18181b" />
          </View>
        ) : products.length === 0 ? (
          <SearchEmptyState query={activeQuery} />
        ) : (
          <SearchProductList products={products} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    backgroundColor: "#ffffff",
  },

  iconButton: {
    width: 36,
    height: 36,
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

  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    fontWeight: "500",
    color: "#18181b",
    padding: 0,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  metaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  metaLeft: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },

  metaTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  metaSubtitle: {
    fontSize: 11,
    color: "#71717a",
  },

  countBadge: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  countBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#52525b",
    letterSpacing: 0.3,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});