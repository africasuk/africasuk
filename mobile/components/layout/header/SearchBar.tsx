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
} from "react-native";
import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
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
      <View style={styles.inputWrapper}>
        <Search size={18} color="#9ca3af" style={styles.searchIcon} />

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
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
          {loading && <ActivityIndicator size="small" color="#002b15" />}

          {query.length > 0 && !loading && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setSuggestions([]);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearButton}
            >
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSearchSubmit}
            activeOpacity={0.8}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectSuggestion(item)}
                style={({ pressed }) => [
                  styles.suggestionItem,
                  pressed && styles.suggestionItemPressed,
                ]}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.category && (
                    <Text style={styles.categoryName} numberOfLines={1}>
                      {item.category.name}
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  inputWrapper: ViewStyle;
  searchIcon: ViewStyle;
  input: TextStyle;
  actionsRight: ViewStyle;
  clearButton: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  dropdownContainer: ViewStyle;
  suggestionsList: ViewStyle;
  suggestionItem: ViewStyle;
  suggestionItemPressed: ViewStyle;
  textContainer: ViewStyle;
  productName: TextStyle;
  categoryName: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    zIndex: 50,
    width: "100%",
  },
  inputWrapper: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 4,
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
  clearButton: {
    padding: 4,
  },
  submitButton: {
    height: 32,
    backgroundColor: "#002b15",
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownContainer: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    maxHeight: 260,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  suggestionsList: {
    borderRadius: 16,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  suggestionItemPressed: {
    backgroundColor: "#f3f4f6",
  },
  textContainer: {
    flexDirection: "column",
    gap: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  categoryName: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "500",
  },
});