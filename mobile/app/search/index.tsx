import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  X,
  ArrowLeft,
} from "lucide-react-native";

import type { ProductWithDetails } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import SearchProductList from "@/components/search/SearchProductList";
import SearchEmptyState from "@/components/search/SearchEmptyState";

import SearchFilters from "@/components/search/SearchFilters";

type SearchFilterProduct = ProductWithDetails & {
  selectedColorId?: string;
  rating?: {
    averageRating: number;
    reviewCount: number;
  };
};

const BRAND_COLOR = "#005c2e";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

type RatedProduct = ProductWithDetails & {
  rating?: ProductRating;
};

type ColorProduct = RatedProduct & {
  selectedColorId?: string;
};



function createColorProducts(
  products: ProductWithDetails[]
): ColorProduct[] {
  type ProductColor = ProductWithDetails["colors"][number];

  type GroupedColorProduct = {
    product: ProductWithDetails;
    color: ProductColor;
  };

  const shuffledProducts = shuffleArray(products);

  const groupedProducts: GroupedColorProduct[][] = shuffledProducts.map(
    (product) => {
      return (product.colors ?? [])
        .filter(
          (color) => color.variants && color.variants.length > 0
        )
        .map((color) => ({
          product,
          color,
        }));
    }
  );

  const result: ColorProduct[] = [];

  const maxColors = Math.max(
    0,
    ...groupedProducts.map((group) => group.length)
  );

  for (let index = 0; index < maxColors; index++) {
    for (const group of groupedProducts) {
      const item = group[index];
      if (!item) continue;

      result.push({
        ...item.product,
        id: `${item.product.id}-${item.color.id}`,
        name: `${item.product.name} - ${item.color.name}`,
        selectedColorId: item.color.id,
        colors: [item.color],
      });
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

export default function SearchScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    q?: string;
  }>();
  const [filteredProducts, setFilteredProducts] =
  useState<SearchFilterProduct[]>([]);

  const handleFilteredProductsChange = useCallback(
  (filtered: SearchFilterProduct[]) => {
    setFilteredProducts(filtered as ColorProduct[]);
  },
  []
);

  
  

  const initialQuery = params.q ?? "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [products, setProducts] = useState<ColorProduct[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Search Logic                                                             */
  /* ------------------------------------------------------------------------ */

  
const fetchSearchResults = useCallback(async (searchTerm: string) => {
  const trimmed = searchTerm.trim();

  if (!trimmed) {
    setProducts([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    Keyboard.dismiss();

    const supabase = createClient();

    // Fetch matching products and their related data.
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

    if (error) {
      throw error;
    }

    const fetchedProducts = (data ?? []) as ProductWithDetails[];

    if (fetchedProducts.length === 0) {
      setProducts([]);
      return;
    }

    // Fetch approved reviews for the matching products.
    const productIds = fetchedProducts.map((product) => product.id);

type ReviewRatingRow = {
  product_id: string;
  rating: number | string;
};

const { data: reviewsData, error: reviewsError } = await supabase
  .from("reviews")
  .select("product_id, rating")
  .in("product_id", productIds)
  .eq("status", "APPROVED");

if (reviewsError) {
  throw reviewsError;
}

const reviews = (reviewsData ?? []) as ReviewRatingRow[];

    if (reviewsError) {
      throw reviewsError;
    }

    // Calculate average rating and review count per product.
    const ratingMap: Record<
      string,
      { total: number; count: number }
    > = {};

    for (const review of reviews ?? []) {
      const productId = String(review.product_id);
      const score = Number(review.rating);

      if (!Number.isFinite(score) || score < 1 || score > 5) {
        continue;
      }

      if (!ratingMap[productId]) {
        ratingMap[productId] = { total: 0, count: 0 };
      }

      ratingMap[productId].total += score;
      ratingMap[productId].count += 1;
    }

    // Attach ratings before creating color-specific search results.
    const ratedProducts: RatedProduct[] = fetchedProducts.map((product) => {
      const stats = ratingMap[String(product.id)];

      return {
        ...product,
        rating: {
          averageRating: stats
            ? Number((stats.total / stats.count).toFixed(1))
            : 0,
          reviewCount: stats?.count ?? 0,
        },
      };
    });

    const formattedProducts = createColorProducts(ratedProducts);

    setProducts(formattedProducts);
  } catch (error) {
    console.error("Search error:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, []);

  /* ------------------------------------------------------------------------ */
  /* URL query watcher                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (params.q !== undefined) {
      const query = params.q.trim();
      setInputQuery(query);
      setActiveQuery(query);

      if (query) {
        fetchSearchResults(query);
      } else {
        setProducts([]);
      }
    }
  }, [params.q, fetchSearchResults]);

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleSearchSubmit = () => {
    const trimmed = inputQuery.trim();

    if (!trimmed) {
      setProducts([]);
      setActiveQuery("");
      router.setParams({ q: undefined });
      return;
    }

    setActiveQuery(trimmed);
    router.setParams({ q: trimmed });
    fetchSearchResults(trimmed);
  };

  const handleClear = () => {
    setInputQuery("");
    setActiveQuery("");
    setProducts([]);
    router.setParams({ q: undefined });
  };

  const handleBack = () => {
    Keyboard.dismiss();
    router.back();
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header Search Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#111827" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.searchContainer}>
            <Search size={18} color="#9ca3af" strokeWidth={2} />

            <TextInput
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder="Search products, brands..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              onSubmitEditing={handleSearchSubmit}
            />

            {inputQuery.length > 0 && (
              <Pressable
                onPress={handleClear}
                style={styles.clearButton}
                hitSlop={8}
              >
                <X size={16} color="#6b7280" strokeWidth={2.2} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Results Metadata Bar */}
       
        {/* Results Metadata Bar */}
        {activeQuery.length > 0 && !loading && (
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleGroup}>
              <Text style={styles.resultLabel}>Results for</Text>
              <Text
                style={styles.queryHighlight}
                numberOfLines={1}
              >
                &ldquo;{activeQuery}&rdquo;
              </Text>
            </View>

            {products.length > 0 && (
              <View style={styles.resultActions}>
               <SearchFilters
                  products={products}
                  onFilteredProductsChange={handleFilteredProductsChange}
                />

                <View style={styles.countBadge}>
                  <Text style={styles.resultCount}>
                    {filteredProducts.length} items
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}


        {/* Content States */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={BRAND_COLOR} />
            <Text style={styles.loadingText}>Searching catalog...</Text>
          </View>
        ) : activeQuery.trim() && filteredProducts.length === 0 ? (
          <SearchEmptyState query={activeQuery} />
        ) : filteredProducts.length > 0 ? (
          <SearchProductList products={filteredProducts} />
        ) : (
          <View style={styles.initialState}>
            <View style={styles.initialIcon}>
              <Search size={26} color={BRAND_COLOR} strokeWidth={2} />
            </View>

            <Text style={styles.initialTitle}>
              What are you looking for?
            </Text>

            <Text style={styles.initialDescription}>
              Search for products across South Sudan, fashion, electronics, and daily essentials.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  backButton: {
    width: 38,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },

  searchContainer: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    paddingVertical: 0,
    fontSize: 15,
    color: "#111827",
    fontWeight: "400",
  },

  clearButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },

  resultTitleGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    flex: 1,
    marginRight: 12,
  },

  resultLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
  },

  queryHighlight: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flexShrink: 1,
  },

  countBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  resultCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },

  initialState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    paddingBottom: 80,
  },

  initialIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5ed",
    marginBottom: 16,
  },

  initialTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  initialDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#6b7280",
    textAlign: "center",
  },
  resultActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
});