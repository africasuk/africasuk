
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
  Animated,
  Easing,
  Image,
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


type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

type SearchFilterProduct = ProductWithDetails & {
  selectedColorId?: string;
  rating?: ProductRating;
};

type ColorProduct = SearchFilterProduct;

type ReviewRatingRow = {
  product_id: string;
  rating: number | string;
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createColorProducts(
  products: SearchFilterProduct[]
): ColorProduct[] {
  const groupedProducts = shuffleArray(products).map((product) =>
    (product.colors ?? [])
      .filter(
        (color) => color.variants && color.variants.length > 0
      )
      .map((color) => ({ product, color }))
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

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();

  const initialQuery =
    typeof params.q === "string" ? params.q : "";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const [products, setProducts] = useState<ColorProduct[]>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<ColorProduct[]>([]);

  const [loading, setLoading] = useState(false);

  // Search bar entrance animation
  const entrance = useRef(new Animated.Value(0)).current;

  // Search icon animation
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      friction: 8,
      tension: 55,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  useEffect(() => {
    if (!loading) {
      iconScale.stopAnimation();
      iconScale.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.18,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [loading, iconScale]);

  const handleFilteredProductsChange = useCallback(
    (filtered: SearchFilterProduct[]) => {
      setFilteredProducts(filtered);
    },
    []
  );

  const fetchSearchResults = useCallback(
    async (searchTerm: string) => {
      const trimmed = searchTerm.trim();

      if (!trimmed) {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        Keyboard.dismiss();

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
          .or(
            `name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`
          );

        if (error) throw error;

        const fetchedProducts =
          (data ?? []) as ProductWithDetails[];

        if (fetchedProducts.length === 0) {
          setProducts([]);
          setFilteredProducts([]);
          return;
        }

        const productIds = fetchedProducts.map((product) =>
          String(product.id)
        );

        const {
          data: reviewsData,
          error: reviewsError,
        } = await supabase
          .from("reviews")
          .select("product_id, rating")
          .in("product_id", productIds)
          .eq("status", "APPROVED");

        if (reviewsError) throw reviewsError;

        const reviews = (reviewsData ?? []) as ReviewRatingRow[];

        const ratingMap: Record<
          string,
          { total: number; count: number }
        > = {};

        for (const review of reviews) {
          const productId = String(review.product_id);
          const score = Number(review.rating);

          if (
            !Number.isFinite(score) ||
            score < 1 ||
            score > 5
          ) {
            continue;
          }

          if (!ratingMap[productId]) {
            ratingMap[productId] = {
              total: 0,
              count: 0,
            };
          }

          ratingMap[productId].total += score;
          ratingMap[productId].count += 1;
        }

        const ratedProducts: SearchFilterProduct[] =
          fetchedProducts.map((product) => {
            const stats = ratingMap[String(product.id)];

            return {
              ...product,
              rating: {
                averageRating: stats
                  ? Number(
                      (stats.total / stats.count).toFixed(1)
                    )
                  : 0,
                reviewCount: stats?.count ?? 0,
              },
            };
          });

        const formattedProducts =
          createColorProducts(ratedProducts);

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const query =
      typeof params.q === "string" ? params.q.trim() : "";

    setInputQuery(query);
    setActiveQuery(query);

    if (query) {
      fetchSearchResults(query);
    } else {
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
    }
  }, [params.q, fetchSearchResults]);

  const handleSearchSubmit = () => {
    const query = inputQuery.trim();

    if (!query) {
      setProducts([]);
      setFilteredProducts([]);
      setActiveQuery("");
      router.setParams({ q: undefined });
      return;
    }

    setActiveQuery(query);
    router.setParams({ q: query });
    fetchSearchResults(query);
  };

  const handleClear = () => {
    setInputQuery("");
    setActiveQuery("");
    setProducts([]);
    setFilteredProducts([]);
    router.setParams({ q: undefined });
  };

  const handleBack = () => {
    Keyboard.dismiss();
    router.back();
  };

  const animatedSearchStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [-15, 0],
        }),
      },
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom"]}
      >
        {/* Animated Search Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={10}
          >
            <ArrowLeft
              size={22}
              color="#111111"
              strokeWidth={2.2}
            />
          </Pressable>

          <Animated.View
            style={[
              styles.searchContainer,
              animatedSearchStyle,
            ]}
          >
            <TextInput
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder="Search products, brands..."
              placeholderTextColor="#888888"
              style={styles.searchInput}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSearchSubmit}
            />

            {inputQuery.length > 0 && (
              <Pressable
                onPress={handleClear}
                style={styles.clearButton}
                hitSlop={8}
              >
                <X size={17} color="#666666" />
              </Pressable>
            )}

            <Pressable
              onPress={handleSearchSubmit}
              style={styles.searchButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Search products"
            >
              <Animated.View
                style={{
                  transform: [{ scale: iconScale }],
                }}
              >
                <Search
                  size={27}
                  color="#111111"
                  strokeWidth={2.3}
                />
              </Animated.View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Results Header */}
        {activeQuery.length > 0 && !loading && (
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleGroup}>
              <Text style={styles.resultLabel}>
                Results for
              </Text>

              <Text
                style={styles.queryHighlight}
                numberOfLines={1}
              >
                “{activeQuery}”
              </Text>
            </View>

            {products.length > 0 && (
              <View style={styles.resultActions}>
                <SearchFilters
                  products={products}
                  onFilteredProductsChange={
                    handleFilteredProductsChange
                  }
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

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Image
              source={require("@/assets/search.png")}
              style={styles.searchAnimation}
              resizeMode="contain"
            />

            <Text style={styles.loadingText}>
              Searching catalog...
            </Text>
          </View>
        ) : activeQuery.trim() &&
          filteredProducts.length === 0 ? (
          <SearchEmptyState query={activeQuery} />
        ) : filteredProducts.length > 0 ? (
          <SearchProductList products={filteredProducts} />
        ) : (
          /* Initial Search State */
          <View style={styles.initialState}>
            <Image
              source={require("@/assets/search.png")}
              style={styles.searchAnimation}
              resizeMode="contain"
            />

            <Text style={styles.initialTitle}>
              What are you looking for?
            </Text>

            <Text style={styles.initialDescription}>
              Search for products across South Sudan, fashion,
              electronics, and daily essentials.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  backButton: {
    width: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    flex: 1,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#111111",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    fontSize: 15,
    color: "#111111",
    fontWeight: "400",
  },

  searchButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },

  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
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

  resultActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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

  searchAnimation: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },

  loadingText: {
    marginTop: 4,
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
});
