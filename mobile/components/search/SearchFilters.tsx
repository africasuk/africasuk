
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SlidersHorizontal, X, Star, Check } from "lucide-react-native";
import type { ProductWithDetails } from "@africasuk/types";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useExchangeRate } from "@/providers/ExchangeRateProvider";
import { convertPrice } from "@/lib/currency";
import PriceRangeSlider from "@/components/search/PriceRangeSlider";
import {
  getSearchPriceRange,
  getSearchProductPrice,
} from "@/components/search/searchPriceUtils";

const GREEN = "#005c2e";
const GOLD = "#F4C542";

export type SearchFilterProduct = ProductWithDetails & {
  selectedColorId?: string;
  rating?: {
    averageRating: number;
    reviewCount: number;
  };
};

type SortOption =
  | "relevance"
  | "newest"
  | "price_low"
  | "price_high"
  | "top_rated";

type Props = {
  products: SearchFilterProduct[];
  onFilteredProductsChange: (
    products: SearchFilterProduct[],
  ) => void;
};

function getCategory(product: SearchFilterProduct): string {
  return product.category?.name ?? "Other";
}

function getDisplayedPrice(
  product: SearchFilterProduct,
  currency: Parameters<typeof convertPrice>[1],
  rate: Parameters<typeof convertPrice>[2],
): number {
  const usdPrice = getSearchProductPrice(product);

  if (usdPrice === null) {
    return Number.POSITIVE_INFINITY;
  }

  const converted = convertPrice(usdPrice, currency, rate);

  return Number.isFinite(converted)
    ? converted
    : Number.POSITIVE_INFINITY;
}

export default function SearchFilters({
  products,
  onFilteredProductsChange,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [sort, setSort] =
    useState<SortOption>("relevance");

  const { currency } = useCurrency();
  const { rate } = useExchangeRate();

  const priceRange = useMemo(
    () => getSearchPriceRange(products, currency, rate),
    [products, currency, rate],
  );

  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  useEffect(() => {
    setCategory("All");
    setRating(0);
    setSort("relevance");
    setVisible(false);
    onFilteredProductsChange(products);

    // Reset filters only when search results change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map(getCategory)),
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [products],
  );

  const fullPriceRange =
    minPrice <= priceRange.min &&
    maxPrice >= priceRange.max;

  const activeCount = [
    !fullPriceRange,
    category !== "All",
    rating > 0,
    sort !== "relevance",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setCategory("All");
    setRating(0);
    setSort("relevance");
    onFilteredProductsChange(products);
  };

  const applyFilters = () => {
    if (minPrice > maxPrice) return;

    const result = products.filter((product) => {
      const price = getDisplayedPrice(
        product,
        currency,
        rate,
      );

      const productRating =
        product.rating?.averageRating ?? 0;

      if (price < minPrice || price > maxPrice) {
        return false;
      }

      if (
        category !== "All" &&
        getCategory(product) !== category
      ) {
        return false;
      }

      if (rating > 0 && productRating < rating) {
        return false;
      }

      return true;
    });

    switch (sort) {
      case "price_low":
        result.sort(
          (a, b) =>
            getDisplayedPrice(a, currency, rate) -
            getDisplayedPrice(b, currency, rate),
        );
        break;

      case "price_high":
        result.sort(
          (a, b) =>
            getDisplayedPrice(b, currency, rate) -
            getDisplayedPrice(a, currency, rate),
        );
        break;

      case "top_rated":
        result.sort(
          (a, b) =>
            (b.rating?.averageRating ?? 0) -
            (a.rating?.averageRating ?? 0),
        );
        break;

      case "newest":
        result.sort((a, b) => {
          const aRecord = a as unknown as Record<
            string,
            unknown
          >;
          const bRecord = b as unknown as Record<
            string,
            unknown
          >;

          const dateA = new Date(
            String(aRecord.created_at ?? ""),
          ).getTime();

          const dateB = new Date(
            String(bRecord.created_at ?? ""),
          ).getTime();

          return (
            (Number.isFinite(dateB) ? dateB : 0) -
            (Number.isFinite(dateA) ? dateA : 0)
          );
        });
        break;

      default:
        break;
    }

    onFilteredProductsChange(result);
    setVisible(false);
  };

  const chip = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      key={label}
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.selectedText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <>
      <Pressable
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <SlidersHorizontal size={16} color={GREEN} />
        <Text style={styles.openText}>Filter</Text>

        {activeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {activeCount}
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setVisible(false)}
          />

          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>

              <Pressable
                onPress={() => setVisible(false)}
                hitSlop={10}
              >
                <X size={23} color="#111827" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <Text style={styles.sectionTitle}>
                Price range ({currency})
              </Text>

              <View style={styles.priceLabels}>
                <View style={styles.priceLabelBox}>
                  <Text style={styles.priceLabelTitle}>
                    Minimum
                  </Text>
                  <Text style={styles.priceLabelValue}>
                    {Math.round(minPrice).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.priceLabelBox}>
                  <Text style={styles.priceLabelTitle}>
                    Maximum
                  </Text>
                  <Text style={styles.priceLabelValue}>
                    {Math.round(maxPrice).toLocaleString()}
                  </Text>
                </View>
              </View>

              {priceRange.max > priceRange.min && (
                <PriceRangeSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  minValue={minPrice}
                  maxValue={maxPrice}
                  onValuesChange={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                />
              )}

              {priceRange.max === priceRange.min && (
                <Text style={styles.rangeHint}>
                  {priceRange.min.toLocaleString()} {currency}
                </Text>
              )}

              <Text style={styles.sectionTitle}>
                Category
              </Text>

              <View style={styles.chipContainer}>
                {categories.map((item) =>
                  chip(
                    item,
                    category === item,
                    () => setCategory(item),
                  ),
                )}
              </View>

              <Text style={styles.sectionTitle}>
                Customer rating
              </Text>

              {[4, 3, 2, 1].map((value) => (
                <Pressable
                  key={value}
                  style={styles.ratingRow}
                  onPress={() =>
                    setRating(
                      rating === value ? 0 : value,
                    )
                  }
                >
                  <View style={styles.stars}>
                    {Array.from({
                      length: value,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={17}
                        color={GOLD}
                        fill={GOLD}
                      />
                    ))}

                    <Text style={styles.ratingLabel}>
                      & up
                    </Text>
                  </View>

                  {rating === value && (
                    <Check size={20} color={GREEN} />
                  )}
                </Pressable>
              ))}

              <Text style={styles.sectionTitle}>
                Sort by
              </Text>

              {([
                ["relevance", "Relevance"],
                ["newest", "Newest"],
                ["price_low", "Price: Low to High"],
                ["price_high", "Price: High to Low"],
                ["top_rated", "Top Rated"],
              ] as const).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={styles.sortRow}
                  onPress={() => setSort(value)}
                >
                  <Text
                    style={
                      sort === value
                        ? styles.selectedText
                        : styles.sortText
                    }
                  >
                    {label}
                  </Text>

                  {sort === value && (
                    <Check size={19} color={GREEN} />
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearText}>
                  Clear All
                </Text>
              </Pressable>

              <Pressable
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyText}>
                  Show Products
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1e5d8",
  },
  openText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: GREEN,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    height: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  priceLabels: {
    flexDirection: "row",
    gap: 12,
  },
  priceLabelBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f3f7f4",
    borderRadius: 10,
  },
  priceLabelTitle: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 5,
  },
  priceLabelValue: {
    color: GREEN,
    fontSize: 16,
    fontWeight: "700",
  },
  rangeHint: {
    color: GREEN,
    fontSize: 13,
    marginTop: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  selectedChip: {
    borderColor: GREEN,
    backgroundColor: "#e8f5ed",
  },
  chipText: {
    fontSize: 13,
    color: "#374151",
  },
  selectedText: {
    color: GREEN,
    fontWeight: "700",
  },
  ratingRow: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingLabel: {
    color: "#4b5563",
    marginLeft: 5,
  },
  sortRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sortText: {
    color: "#374151",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  clearButton: {
    paddingHorizontal: 18,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    justifyContent: "center",
  },
  clearText: {
    color: "#374151",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
