import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, ArrowRight } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.card}>
          {/* Icon Frame */}
          <View style={styles.iconWrapper}>
            <AlertCircle size={28} color="#71717a" strokeWidth={1.8} />
          </View>

          {/* Status Code & Headings */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ERROR 404</Text>
          </View>

          <Text style={styles.title}>Page not found</Text>

          <Text style={styles.description}>
            The link you followed may be broken, or the page may have been removed.
          </Text>

          {/* Primary Action Button */}
          <Link href="/(tabs)" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Return Home</Text>
              <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 6,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  badge: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#52525b",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    maxWidth: 280,
  },

  button: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: -0.1,
  },
});