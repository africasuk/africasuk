import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Search, X, ChevronRight, Layers } from "lucide-react-native";

import type { Category } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

const BRAND_COLOR = "#004d26";
const BRAND_DARK = "#111827";

// Standalone Header component to avoid TextInput losing focus on re-renders
function CategoriesHeader({
  count,
  searchQuery,
  onSearchChange,
}: {
  count: number;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.titleTextWrapper}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>
            Browse all product categories and explore our complete collections.
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count} {count === 1 ? "Category" : "Categories"}
          </Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function CategoriesScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

const fetchCategories = useCallback(async () => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    setCategories(
      (data ?? []).map((item: any) => ({
        ...item,
        imageUrl: item.image_url,
      })) as Category[]
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Categories",
          headerTitleStyle: { fontWeight: "800", color: BRAND_DARK },
        }}
      />

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <CategoriesHeader
            count={filteredCategories.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        }
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
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No matching categories" : "No Categories Found"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `We couldn't find any categories matching "${searchQuery}".`
                : "Categories will appear here once they are added."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/categories/${item.slug}` as never)}
          >
            {/* Big Prominent Image Section */}
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                  />
                ) : (
                <View style={styles.placeholderContainer}>
                  <Layers size={32} color={BRAND_COLOR} opacity={0.5} />
                </View>
              )}
            </View>

            {/* Clean White Bottom Info Panel */}
            <View style={styles.cardInfo}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {item.name}
                </Text>
                <ChevronRight size={14} color="#9ca3af" />
              </View>
              <Text style={styles.categoryCaption} numberOfLines={1}>
                Explore items
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
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
    backgroundColor: "#f4f4f4",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleTextWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: BRAND_DARK,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BRAND_DARK,
    paddingVertical: 0,
  },
  card: {
    flex: 1,
    height: 210, // Increased height for larger visual presence
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    overflow: "hidden", // Clips image cleanly to card borders
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    flex: 1, // Takes up ~70% of total card height
    width: "100%",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 77, 38, 0.05)",
  },
  cardInfo: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_DARK,
    flex: 1,
    marginRight: 4,
  },
  categoryCaption: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
});