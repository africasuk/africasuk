import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Search, X, ChevronRight, Tag } from "lucide-react-native";
import type { Category, ProductWithDetails } from "@africasuk/types";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://172.20.10.3:3000";

interface SearchBarProps {
  categories?: Category[];
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder,
  autoFocus = true,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function fetchSuggestions(searchTerm: string) {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        setSuggestions([]);
        return;
      }

      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search fetch error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit() {
    const search = query.trim();
    if (!search) return;

    setSuggestions([]);
    inputRef.current?.blur();

    router.push({
      pathname: "/search" as any,
      params: { q: search },
    });
  }

  function handleSelectSuggestion(product: ProductWithDetails) {
    setSuggestions([]);
    setQuery("");
    inputRef.current?.blur();

    router.push({
      pathname: "/products/[slug]" as any,
      params: { slug: product.slug },
    });
  }

  if (placeholder === "") {
    return <Search size={20} color="#111827" />;
  }

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        <Search
          size={18}
          color={isFocused ? "#002b15" : "#9ca3af"}
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSearchSubmit}
          placeholder={placeholder ?? "Search products, categories..."}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
        />

        <View style={styles.actionsRight}>
          {loading && (
            <ActivityIndicator
              size="small"
              color="#002b15"
              style={styles.loader}
            />
          )}

          {query.length > 0 && !loading && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setSuggestions([]);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearButton}
            >
              <X size={14} color="#6b7280" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSearchSubmit}
            activeOpacity={0.85}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modern Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsList}
            contentContainerStyle={styles.suggestionsContent}
            renderItem={({ item }) => {
              // Safely extract category image property without TypeScript errors
              const categoryWithImage = item.category as
                | (Category & { imageUrl?: string; image_url?: string })
                | undefined;

              // Extract main product image if available
              const imageUrl =
                item.colors?.[0]?.images?.[0]?.imageUrl ??
                categoryWithImage?.imageUrl ??
                categoryWithImage?.image_url;

              // Extract minimum price option
              const price = item.colors?.[0]?.variants?.[0]?.price;

              return (
                <Pressable
                  onPress={() => handleSelectSuggestion(item)}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionItemPressed,
                  ]}
                >
                  {/* Thumbnail Preview */}
                  <View style={styles.imageWrapper}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.productThumb}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.placeholderThumb}>
                        <Tag size={16} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  {/* Content Meta */}
                  <View style={styles.textContainer}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <View style={styles.metaRow}>
                      {item.category && (
                        <Text style={styles.categoryName} numberOfLines={1}>
                          {item.category.name}
                        </Text>
                      )}
                      {price !== undefined && (
                        <Text style={styles.priceText}>
                          • ${price.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>

                  <ChevronRight size={16} color="#d1d5db" />
                </Pressable>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  inputWrapper: ViewStyle;
  inputWrapperFocused: ViewStyle;
  searchIcon: ViewStyle;
  input: TextStyle;
  actionsRight: ViewStyle;
  loader: ViewStyle;
  clearButton: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  dropdownContainer: ViewStyle;
  suggestionsList: ViewStyle;
  suggestionsContent: ViewStyle;
  suggestionItem: ViewStyle;
  suggestionItemPressed: ViewStyle;
  imageWrapper: ViewStyle;
  productThumb: ImageStyle;
  placeholderThumb: ViewStyle;
  textContainer: ViewStyle;
  productName: TextStyle;
  metaRow: ViewStyle;
  categoryName: TextStyle;
  priceText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    zIndex: 50,
    width: "100%",
  },
  inputWrapper: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 21,
    paddingLeft: 12,
    paddingRight: 4,
  },
  inputWrapperFocused: {
    borderColor: "#002b15",
    backgroundColor: "#ffffff",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  actionsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loader: {
    marginRight: 2,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    height: 34,
    backgroundColor: "#002b15",
    paddingHorizontal: 14,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  dropdownContainer: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    maxHeight: 280,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  suggestionsList: {
    backgroundColor: "#ffffff",
  },
  suggestionsContent: {
    paddingVertical: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  suggestionItemPressed: {
    backgroundColor: "#f3f4f6",
  },
  imageWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  productThumb: {
    width: "100%",
    height: "100%",
  },
  placeholderThumb: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryName: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 11,
    color: "#002b15",
    fontWeight: "700",
  },
});