import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SearchX, Sparkles } from "lucide-react-native";
import { useRouter, Href } from "expo-router";

const BRAND = "#004d26";

interface SearchEmptyStateProps {
  query?: string;
}

export default function SearchEmptyState({ query }: SearchEmptyStateProps) {
  const router = useRouter();

  const handleClear = () => {
    // Navigates to base search screen clearing active query params
    router.replace("/search" as Href);
  };

  return (
    <View style={styles.card}>
      {/* Decorative Brand Glow Circle */}
      <View style={styles.brandGlow} />

      {/* Floating Sticker Icon Badge */}
      <View style={styles.iconWrapper}>
        {/* Outer Rotated Ring */}
        <View style={styles.outerRing} />

        {/* Main Sticker Container */}
        <View style={styles.innerBadge}>
          <SearchX size={32} color={BRAND} />
          {/* Sparkle Accent */}
          <View style={styles.sparklePosition}>
            <Sparkles size={16} color="#f59e0b" />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>No matching products found</Text>

        <Text style={styles.subtitle}>
          {query ? (
            <Text>
              We couldn&apos;t find anything for{" "}
              <Text style={styles.boldQuery}>&quot;{query}&quot;</Text>. Try checking for
              typos or searching with broader terms.
            </Text>
          ) : (
            "We couldn't find any products matching your active filters."
          )}
        </Text>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Clear Search Filters</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type Styles = {
  card: ViewStyle;
  brandGlow: ViewStyle;
  iconWrapper: ViewStyle;
  outerRing: ViewStyle;
  innerBadge: ViewStyle;
  sparklePosition: ViewStyle;
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
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  brandGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 77, 38, 0.06)",
    top: "30%",
  },
  iconWrapper: {
    position: "relative",
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  outerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    backgroundColor: "rgba(0, 77, 38, 0.08)",
    transform: [{ rotate: "6deg" }],
  },
  innerBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sparklePosition: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  textContainer: {
    alignItems: "center",
    maxWidth: 280,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  boldQuery: {
    fontWeight: "700",
    color: "#111827",
  },
  actionContainer: {
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
});