import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SearchX, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";

interface SearchEmptyStateProps {
  query?: string;
}

export default function SearchEmptyState({
  query,
}: SearchEmptyStateProps) {
  const router = useRouter();

  const handleViewAllProducts = () => {
    router.replace("/products" as any);
  };

  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <SearchX
          size={30}
          color="#111111"
          strokeWidth={1.8}
        />
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          No matching products found
        </Text>

        <Text style={styles.subtitle}>
          {query ? (
            <>
              We couldn&apos;t find anything for{" "}
              <Text style={styles.boldQuery}>
                &quot;{query}&quot;
              </Text>
              . Try a different search.
            </>
          ) : (
            "We couldn't find any products matching your search."
          )}
        </Text>

        {/* View All Products */}
        <View style={styles.actionContainer}>
          <Pressable
            onPress={handleViewAllProducts}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              View All Products
            </Text>

            <ArrowRight
              size={16}
              color="#ffffff"
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type Styles = {
  card: ViewStyle;
  iconWrapper: ViewStyle;
  textContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  boldQuery: TextStyle;
  actionContainer: ViewStyle;
  button: ViewStyle;
  buttonPressed: ViewStyle;
  buttonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  textContainer: {
    alignItems: "center",
    maxWidth: 290,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 19,
  },

  boldQuery: {
    fontWeight: "600",
    color: "#111111",
  },

  actionContainer: {
    marginTop: 20,
  },

  button: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  buttonPressed: {
    backgroundColor: "#333333",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});